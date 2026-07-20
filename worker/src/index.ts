/**
 * firstfluke-contact Worker — T-12 Integration Tier
 *
 * Pipeline (in order):
 *   1. CORS preflight
 *   2. Method guard (POST only)
 *   3. JSON parse
 *   4. Zod schema validation
 *   5. Honeypot drop
 *   6. Turnstile verification
 *   7. Rate-limit check
 *   8. PRODUCT_ROUTES parse
 *   9. Route resolution
 *  10. GitHub Issue creation (3 attempts, exp backoff) + KV dead-letter fallback
 *
 * PII policy (D9): logs contain ONLY sha256-12 of email and message length.
 * Issue body sanitisation (D8): user message wrapped in ```text fence;
 *   backtick sequences escaped with ZWSP.
 */

import type { Env } from "./env";
import { ContactFormSchema } from "./schema";
import { verifyTurnstile } from "./turnstile";
import { checkRateLimit } from "./ratelimit";
import { postInquiry } from "./api-sink";
import { PRODUCT_LABELS } from "../../lib/contact/products";
import type { ProductId } from "../../lib/contact/products";

// ─── CORS ─────────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null, allowList: string[]): HeadersInit {
  // ALLOWED_ORIGINS 미설정 시 wildcard로 떨어지지 않게 — Origin 헤더 미설정으로 브라우저가 차단
  if (allowList.length === 0) {
    return { Vary: "Origin" };
  }
  const allowed =
    origin && allowList.includes(origin) ? origin : allowList[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// ─── JSON response helper ─────────────────────────────────────────────────────

function json(data: unknown, status: number, cors: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

// ─── SHA-256 hex helper (Workers WebCrypto — native, no import needed) ────────

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Issue body builder (D8) ──────────────────────────────────────────────────

/**
 * Escape sequences of 3+ backticks in user input by inserting a ZWSP between
 * every consecutive backtick so they cannot break out of the code fence.
 */
export function escapeBackticks(s: string): string {
  // Replace runs of ≥3 backticks: insert ZWSP between each pair
  return s.replace(/`{3,}/g, (match) => match.split("").join("\u200B"));
}

// ``escapeBackticks`` (above) stays: still exported + unit-tested, and the
// API-side body builder mirrors the same fence-escaping. The issue-body /
// title builders moved to the API (design 013 Phase 4).

// ─── Dead-letter entry type ──────────────────────────────────────────────────

interface DlqEntry {
  id: string;
  payload: {
    email: string;
    message: string;
    agree: boolean;
    product: string;
  };
  // Added in design 013 Phase 4 for the API retry; optional so pre-Phase-4
  // entries still parse.
  ipHash?: string;
  receivedAt?: string;
  // Retained (optional) for backward-compat with pre-Phase-4 entries; the
  // API resolves routing itself now, so new entries omit it.
  route?: {
    repo: string;
    installationId: string;
  };
  attempts: number;
  firstFailedAt: string;
  lastError: string;
  lastTriedAt?: string;
  alertedAt?: string;
}

// ─── Ops alert via Resend ─────────────────────────────────────────────────────

async function sendOpsAlert(env: Env, entry: DlqEntry): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    console.error("[cron] ops-alert wanted but RESEND_API_KEY missing", {
      entryId: entry.id,
    });
    return false;
  }

  const productLabel = PRODUCT_LABELS[entry.payload.product as ProductId] ?? entry.payload.product;
  const subject = `[firstfluke contact] dead-letter ${entry.id} — ${productLabel} stuck for 24h+`;

  // D9: email → hash only, message → length only
  const emailHash = await sha256Hex(entry.payload.email).then((h) => h.slice(0, 12));
  const text = [
    `Dead-letter alert — entry has been stuck for 24h+`,
    ``,
    `ID:           ${entry.id}`,
    `Product:      ${entry.payload.product} (${productLabel})`,
    `Sink:         ${entry.route?.repo ?? "dahaejo ingest API"}`,
    `Attempts:     ${entry.attempts}`,
    `First failed: ${entry.firstFailedAt}`,
    `Last error:   ${entry.lastError}`,
    ``,
    `PII (D9): email hash = ${emailHash}, message length = ${entry.payload.message.length}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: [env.OPS_ALERT_TO],
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[cron] ops-alert Resend API error", {
        entryId: entry.id,
        status: res.status,
        body: body.slice(0, 200),
      });
      return false;
    }

    console.info("[cron] ops-alert sent", { entryId: entry.id });
    return true;
  } catch (err) {
    console.error("[cron] ops-alert fetch threw", {
      entryId: entry.id,
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

// ─── Scheduled handler (T-13): dead-letter polling + 24h ops alert ───────────

const DLQ_PROCESS_CAP = 50; // 틱당 최대 처리 건수 (CPU/시간 예산 초과 방지)
const ALERT_INTERVAL_MS = 86_400_000; // 24h (ms)

async function processDeadLetters(
  env: Env,
): Promise<void> {
  // dead-letter 키 목록 조회 (prefix = "dlq:")
  const listResult = await env.DEAD_LETTER.list({
    prefix: "dlq:",
    limit: DLQ_PROCESS_CAP,
  });

  if (listResult.keys.length === 0) {
    console.info("[cron] dead-letter queue empty, nothing to process");
    return;
  }

  console.info("[cron] processing dead-letter entries", {
    count: listResult.keys.length,
    truncated: listResult.list_complete === false,
  });

  for (const kvKey of listResult.keys) {
    const key = kvKey.name;
    let raw: string | null;
    try {
      raw = await env.DEAD_LETTER.get(key);
    } catch (err) {
      console.error("[cron] KV get failed", {
        key,
        error: err instanceof Error ? err.message : String(err),
      });
      continue;
    }

    if (!raw) {
      // 이미 다른 틱에서 처리됐거나 만료된 엔트리 — 건너뜀
      continue;
    }

    let entry: DlqEntry;
    try {
      entry = JSON.parse(raw) as DlqEntry;
    } catch (err) {
      console.error("[cron] DLQ entry JSON parse failed", {
        key,
        error: err instanceof Error ? err.message : String(err),
      });
      continue;
    }

    const now = new Date().toISOString();

    // ── 재시도: dahaejo ingest API POST (design 013 Phase 4) ──────────────────
    // entry.id 를 source_ref 로 재사용 → API 가 멱등 처리(중복 삽입 없음).
    // 제품 라우팅은 API 가 support_products 로 해결하므로 PRODUCT_ROUTES 불요.
    let retrySucceeded = false;
    let retryError = "";

    const result = await postInquiry(env, {
      productSlug: entry.payload.product,
      email: entry.payload.email,
      message: entry.payload.message,
      // Older DLQ entries (pre-Phase-4) lack these — fall back gracefully.
      receivedAt: entry.receivedAt ?? entry.firstFailedAt,
      ipHash: entry.ipHash ?? "dlq-retry",
      sourceRef: entry.id,
    });

    if (result.ok) {
      await env.DEAD_LETTER.delete(key);
      console.info("[cron] dead-letter retry succeeded, entry deleted", {
        entryId: entry.id,
        issueNumber: result.issueNumber,
      });
      continue; // 다음 엔트리로
    }

    // Permanent client error (e.g. 422 unknown product) — drop instead of
    // retrying forever; transient/5xx/429/network keep re-queueing.
    if (result.status >= 400 && result.status < 500 && result.status !== 429) {
      await env.DEAD_LETTER.delete(key);
      console.error("[cron] dead-letter entry dropped (permanent error)", {
        entryId: entry.id,
        status: result.status,
        error: result.error,
      });
      continue;
    }

    retryError = `HTTP ${result.status}: ${result.error.slice(0, 120)}`;

    // ── 재시도 실패 → 엔트리 업데이트 ──────────────────────────────────────
    entry.attempts += 1;
    entry.lastTriedAt = now;
    entry.lastError = retryError || entry.lastError;

    console.warn("[cron] dead-letter retry failed", {
      entryId: entry.id,
      attempts: entry.attempts,
      lastError: entry.lastError,
    });

    // ── 24h 운영 알람 평가 ────────────────────────────────────────────────────
    const nowMs = Date.parse(now);
    const firstFailedMs = Date.parse(entry.firstFailedAt);
    const stuckDurationMs = nowMs - firstFailedMs;
    const lastAlertedMs = entry.alertedAt ? Date.parse(entry.alertedAt) : 0;
    const timeSinceLastAlertMs = nowMs - lastAlertedMs;

    const shouldAlert =
      stuckDurationMs >= ALERT_INTERVAL_MS &&
      (entry.alertedAt === undefined || timeSinceLastAlertMs >= ALERT_INTERVAL_MS);

    if (shouldAlert) {
      const alertSent = await sendOpsAlert(env, entry);
      if (alertSent) {
        entry.alertedAt = now;
      }
    }

    // 업데이트된 엔트리를 KV에 저장
    try {
      await env.DEAD_LETTER.put(key, JSON.stringify(entry));
    } catch (putErr) {
      console.error("[cron] KV put (entry update) failed", {
        entryId: entry.id,
        error: putErr instanceof Error ? putErr.message : String(putErr),
      });
    }
  }
}

// ─── Retry + exponential backoff (D6) ────────────────────────────────────────

const RETRY_DELAYS_MS = [200, 1000, 5000] as const;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowList = (env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const cors = corsHeaders(origin, allowList);

    // ── 1. CORS preflight ───────────────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── 2. Method guard ─────────────────────────────────────────────────────
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, cors);
    }

    // ── 3. JSON parse ───────────────────────────────────────────────────────
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return json({ ok: false, error: "validation", fields: {} }, 400, cors);
    }

    // ── 4. Zod schema validation ────────────────────────────────────────────
    const parsed = ContactFormSchema.safeParse(raw);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          error: "validation",
          fields: parsed.error.flatten().fieldErrors,
        },
        400,
        cors,
      );
    }

    const { email, message, product, turnstileToken, _hp } = parsed.data;

    // ── 5. Honeypot drop ────────────────────────────────────────────────────
    if (_hp && _hp.length > 0) {
      return json({ ok: true }, 200, cors);
    }

    // Generate request ID and pre-compute hashes (needed for logs + issue body)
    const requestId = crypto.randomUUID();
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";

    const [emailHash, ipHash] = await Promise.all([
      sha256Hex(email).then((h) => h.slice(0, 12)),
      sha256Hex(ip).then((h) => h.slice(0, 12)),
    ]);

    // PII-safe structured log (D9) — no plaintext email, no plaintext ip
    console.info("[contact] request received", {
      requestId,
      product,
      emailHash,
      messageLength: message.length,
      ip: "masked",
    });

    // ── 6. Turnstile verification ───────────────────────────────────────────
    const tsResult = await verifyTurnstile(env, turnstileToken, ip);
    if (!tsResult.ok && !tsResult.skipped) {
      return json({ ok: false, error: "turnstile_failed" }, 401, cors);
    }

    // ── 7. Rate-limit check ─────────────────────────────────────────────────
    const rlResult = await checkRateLimit(env, { ip, product });
    if (!rlResult.ok) {
      return json({ ok: false, error: "rate_limit" }, 429, cors);
    }

    // ── 7.5. Ingest env guard (fail-fast on operator misconfig) ────────────
    if (!env.INGEST_API_URL || !env.SUPPORT_INGEST_SECRET) {
      console.error("[contact] required ingest env missing", {
        requestId,
        hasUrl: Boolean(env.INGEST_API_URL),
        hasSecret: Boolean(env.SUPPORT_INGEST_SECRET),
      });
      return json({ ok: false, error: "queue_unavailable" }, 502, cors);
    }

    // ── 8-10. POST to the dahaejo ingest API with retry (exp backoff) ───────
    // The API owns the authoritative row + best-effort GitHub issue; product
    // validity (422) is enforced there. requestId is the idempotency key, so a
    // retry after a transient failure never double-inserts.
    const receivedAt = new Date().toISOString();
    let lastError = "unknown";
    let accepted = false;

    for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
      if (attempt > 0) {
        await sleep(RETRY_DELAYS_MS[attempt - 1]); // 200ms / 1s / 5s
      }

      const result = await postInquiry(env, {
        productSlug: product,
        email,
        message,
        receivedAt,
        ipHash,
        sourceRef: requestId,
      });

      if (result.ok) {
        console.info("[contact] inquiry accepted", {
          requestId,
          product,
          issueNumber: result.issueNumber,
        });
        accepted = true;
        break;
      }

      // 4xx (except 429) is a permanent client error — retrying won't help.
      if (result.status >= 400 && result.status < 500 && result.status !== 429) {
        console.error("[contact] ingest rejected (permanent)", {
          requestId,
          product,
          status: result.status,
          error: result.error,
        });
        // A malformed/unknown product is the caller's fault, not ours.
        if (result.status === 422) {
          return json({ ok: false, error: "unknown_product" }, 422, cors);
        }
        lastError = `HTTP ${result.status}: ${result.error.slice(0, 120)}`;
        break;
      }

      lastError = `HTTP ${result.status}: ${result.error.slice(0, 120)}`;
      console.warn("[contact] ingest attempt failed", {
        requestId,
        attempt: attempt + 1,
        status: result.status,
      });
    }

    if (accepted) {
      return json({ ok: true }, 200, cors);
    }

    // ── 10b. All retries exhausted → KV dead-letter ─────────────────────────
    const dlqKey = `dlq:${requestId}`;
    const dlqValue = JSON.stringify({
      id: requestId,
      payload: { email, message, agree: parsed.data.agree, product },
      ipHash,
      receivedAt,
      attempts: RETRY_DELAYS_MS.length,
      firstFailedAt: new Date().toISOString(),
      lastError,
    });

    try {
      await env.DEAD_LETTER.put(dlqKey, dlqValue);
      console.error("[contact] issue creation failed; queued to dead-letter", {
        requestId,
        product,
        lastError,
      });
      // User-facing response is still OK — Cron T-13 will retry
      return json({ ok: true }, 200, cors);
    } catch (kvErr) {
      console.error(
        "[contact] DEAD_LETTER KV write failed — queue unavailable",
        {
          requestId,
          error: kvErr instanceof Error ? kvErr.message : String(kvErr),
        },
      );
      return json({ ok: false, error: "queue_unavailable" }, 502, cors);
    }
  },

  // ─── Cron: 5분마다 dead-letter 폴링 + 재시도 + 24h 운영 알람 (T-13) ──────
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    try {
      await processDeadLetters(env);
    } catch (err) {
      // scheduled 핸들러는 절대 상위로 throw 하지 않음
      console.error("[cron] unhandled error in processDeadLetters", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },
} satisfies ExportedHandler<Env>;
