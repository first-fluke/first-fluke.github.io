// KVNamespace, RateLimit available as ambient globals via tsconfig "types": ["@cloudflare/workers-types"]

export interface Env {
  // [vars]
  ALLOWED_ORIGINS: string;
  RESEND_FROM: string;
  OPS_ALERT_TO: string;
  GH_APP_ID: string;
  PRODUCT_ROUTES: string;

  // secrets
  GH_APP_PRIVATE_KEY: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY?: string;

  // KV namespaces
  TOKEN_CACHE: KVNamespace;
  DEAD_LETTER: KVNamespace;

  // Rate limit bindings
  RATE_LIMIT_BURST: RateLimit;
  RATE_LIMIT_DAILY: RateLimit;
}
