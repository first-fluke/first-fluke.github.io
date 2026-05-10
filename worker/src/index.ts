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
import { parseProductRoutes, resolveRoute } from "./routes";
import { verifyTurnstile } from "./turnstile";
import { checkRateLimit } from "./ratelimit";
import { createIssue } from "./github-app";
import { PRODUCT_LABELS } from "../../lib/contact/products";
import type { ProductId } from "../../lib/contact/products";

// ─── CORS ─────────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null, allowList: string[]): HeadersInit {
  const allowed =
    origin && allowList.includes(origin) ? origin : (allowList[0] ?? "*");
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
function escapeBackticks(s: string): string {
  // Replace runs of ≥3 backticks: insert ZWSP between each pair
  return s.replace(/`{3,}/g, (match) => match.split("").join("\u200B"));
}

function buildIssueTitle(productId: ProductId, message: string): string {
  const label = PRODUCT_LABELS[productId];
  const oneLine = message.replace(/\s+/g, " ").trim();
  const snippet = oneLine.length > 60 ? `${oneLine.slice(0, 60)}…` : oneLine;
  return `[${label}] ${snippet}`;
}

function buildIssueBody(
  productId: ProductId,
  email: string,
  message: string,
  ipHash: string,
): string {
  const label = PRODUCT_LABELS[productId];
  const receivedAt = new Date().toISOString();
  const sanitised = escapeBackticks(message);

  return [
    "## 문의 정보",
    "",
    `- **Product:** \`${productId}\` (\`${label}\`)`,
    `- **Email:** \`${email}\``,
    `- **Received:** \`${receivedAt}\``,
    `- **IP hash:** \`${ipHash}\``,
    "",
    "## 메시지",
    "",
    "```text",
    sanitised,
    "```",
  ].join("\n");
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

    // ── 8. Parse PRODUCT_ROUTES ─────────────────────────────────────────────
    let routes: ReturnType<typeof parseProductRoutes>;
    try {
      routes = parseProductRoutes(env.PRODUCT_ROUTES ?? "");
    } catch (err) {
      console.error("[contact] PRODUCT_ROUTES malformed", {
        requestId,
        error: err instanceof Error ? err.message : String(err),
      });
      return json({ ok: false, error: "queue_unavailable" }, 502, cors);
    }

    // ── 9. Resolve route ────────────────────────────────────────────────────
    const route = resolveRoute(routes, product as ProductId);
    if (route === null) {
      console.warn("[contact] no route for product", { requestId, product });
      return json({ ok: false, error: "unknown_product" }, 422, cors);
    }

    // ── 10. Create GitHub Issue with retry (exp backoff) ────────────────────
    const issueTitle = buildIssueTitle(product as ProductId, message);
    const issueBody = buildIssueBody(
      product as ProductId,
      email,
      message,
      ipHash,
    );
    const issueLabels = ["contact", product];

    let lastError = "unknown";
    let issueCreated = false;

    for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
      if (attempt > 0) {
        await sleep(RETRY_DELAYS_MS[attempt - 1]); // 200ms / 1s / 5s
      }

      const result = await createIssue(env, {
        installationId: route.installationId,
        repo: route.repo,
        title: issueTitle,
        body: issueBody,
        labels: issueLabels,
      });

      if (result.ok) {
        console.info("[contact] issue created", {
          requestId,
          product,
          url: result.url,
        });
        issueCreated = true;
        break;
      }

      lastError = `HTTP ${result.status}: ${result.error.slice(0, 120)}`;
      console.warn("[contact] createIssue attempt failed", {
        requestId,
        attempt: attempt + 1,
        status: result.status,
      });
    }

    if (issueCreated) {
      return json({ ok: true }, 200, cors);
    }

    // ── 10b. All retries exhausted → KV dead-letter ─────────────────────────
    const dlqKey = `dlq:${requestId}`;
    const dlqValue = JSON.stringify({
      id: requestId,
      payload: { email, message, agree: parsed.data.agree, product },
      route: { repo: route.repo, installationId: route.installationId },
      attempts: 3,
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
} satisfies ExportedHandler<Env>;
