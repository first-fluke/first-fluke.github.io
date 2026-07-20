// KVNamespace, RateLimit available as ambient globals via tsconfig "types": ["@cloudflare/workers-types"]

export interface Env {
  // [vars]
  ALLOWED_ORIGINS: string;
  RESEND_FROM: string;
  OPS_ALERT_TO: string;
  // dahaejo platform ingest endpoint (design 013 Phase 4). Sink for contact
  // inquiries — the API owns the authoritative row + best-effort GitHub issue.
  INGEST_API_URL: string;

  // secrets
  // Dedicated secret for the API's X-Internal-Secret gate (design 013 Phase 4).
  SUPPORT_INGEST_SECRET: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY?: string;

  // KV namespaces
  TOKEN_CACHE: KVNamespace;
  DEAD_LETTER: KVNamespace;

  // Rate limit bindings
  RATE_LIMIT_BURST: RateLimit;
  RATE_LIMIT_DAILY: RateLimit;
}
