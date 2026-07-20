// Post a contact inquiry to the dahaejo platform API (design 013 Phase 4).
//
// Replaces the GitHub App issue-creation sink: the API owns the authoritative
// row (public.support_inquiries) and best-effort creates the GitHub issue
// itself. This Worker keeps only edge defense (CORS / honeypot / Turnstile /
// rate limit) + the dead-letter retry net around this call.

import type { Env } from "./env";

export type PostInquiryResult =
  | { ok: true; issueNumber: number | null }
  | { ok: false; status: number; error: string };

export interface PostInquiryInput {
  productSlug: string;
  email: string;
  message: string;
  receivedAt: string; // ISO 8601
  ipHash: string;
  sourceRef: string; // requestId — API dedups on this (retry-safe)
}

export async function postInquiry(
  env: Env,
  input: PostInquiryInput,
): Promise<PostInquiryResult> {
  let res: Response;
  try {
    res = await fetch(env.INGEST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Dedicated support-ingest secret (NOT the internal api↔worker one).
        "X-Internal-Secret": env.SUPPORT_INGEST_SECRET,
        // Explicit UA so the API's bot-block never second-guesses us (the
        // X-Internal-Secret header already whitelists the request there).
        "User-Agent": "firstfluke-contact-worker",
      },
      body: JSON.stringify({
        product_slug: input.productSlug,
        email: input.email,
        message: input.message,
        received_at: input.receivedAt,
        ip_hash: input.ipHash,
        source_ref: input.sourceRef,
      }),
    });
  } catch (err) {
    // Network / DNS / timeout — status 0 signals "retryable transport error".
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  if (res.status >= 200 && res.status < 300) {
    let issueNumber: number | null = null;
    try {
      const body = (await res.json()) as {
        github_issue_number?: number | null;
      };
      issueNumber = body.github_issue_number ?? null;
    } catch {
      // A 2xx with an unparseable body still means the row was accepted.
    }
    return { ok: true, issueNumber };
  }

  let errBody = "";
  try {
    errBody = (await res.text()).slice(0, 200);
  } catch {
    // ignore
  }
  return { ok: false, status: res.status, error: errBody };
}
