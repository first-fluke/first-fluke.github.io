/**
 * Rate-limit wrapper for the firstfluke contact Worker.
 *
 * Two tiers:
 *  1. BURST  — native Cloudflare RateLimit binding (5 req / 60 s).
 *  2. DAILY  — KV-counter workaround (30 req / 24 h).
 *
 * Why KV for daily?  wrangler `[[ratelimits]]` only accepts period = 10 or 60
 * (Wrangler >= 4.36 / "simple" config). A native 86400 s window is not
 * supported, so the true 30-req/day cap is enforced here with a read-then-write
 * counter in DEAD_LETTER KV under the `rl:` prefix.  Using DEAD_LETTER avoids
 * declaring a third KV namespace; the `rl:daily:` prefix is distinct from all
 * other DEAD_LETTER keys (which use the `dl:` prefix by convention).
 *
 * Race condition note: read-then-write is NOT atomic.  Under concurrent
 * bursty traffic 1–2 over-count requests may slip through.  This is acceptable
 * for spam mitigation (strong consistency is not required — see plan D7).
 *
 * No PII is stored or logged: `ip` is used only as part of the KV key and is
 * never written to a log sink.
 */

import type { Env } from "./env";

export interface RateLimitResult {
  ok: boolean;
  reason?: "burst" | "daily";
}

/**
 * Check both rate-limit tiers for a given ip + product combination.
 *
 * Burst is checked first (cheap, native binding).
 * Daily is checked second (one KV read + one KV write on the happy path).
 * Short-circuits on the first failure — no retries are performed.
 */
export async function checkRateLimit(
  env: Env,
  key: { ip: string; product: string },
): Promise<RateLimitResult> {
  const { ip, product } = key;

  // ── Tier 1: burst guard (native RateLimit binding) ───────────────────────
  const burstKey = `${ip}:${product}`;
  const burstResult = await env.RATE_LIMIT_BURST.limit({ key: burstKey });
  if (!burstResult.success) {
    return { ok: false, reason: "burst" };
  }

  // ── Tier 2: daily cap via KV counter ─────────────────────────────────────
  // Key format: rl:daily:<ip>:<product>:<YYYY-MM-DD> (UTC date)
  // TTL of 90 000 s (~25 h) ensures the counter is cleaned up slightly after
  // midnight UTC so no stale accumulation carries over to the next day.
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const dailyKey = `rl:daily:${ip}:${product}:${today}`;

  const current = await env.DEAD_LETTER.get(dailyKey);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= 30) {
    return { ok: false, reason: "daily" };
  }

  await env.DEAD_LETTER.put(dailyKey, String(count + 1), {
    expirationTtl: 90000, // ~25 h — auto-cleanup after midnight UTC
  });

  return { ok: true };
}
