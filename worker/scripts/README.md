# Worker Provisioning Scripts

Run `provision.sh` once from any directory to create the `DEAD_LETTER` KV namespace, substitute its ID into `wrangler.toml`, and print exact instructions for the remaining manual steps. Full environment variable and binding specifications live in `../SECRETS.md`.

Before deploying, the operator must register four secrets interactively (`wrangler secret put SUPPORT_INGEST_SECRET`, `OPS_ALERT_TO`, `RESEND_API_KEY`, and optionally `TURNSTILE_SECRET_KEY`) and set three vars directly in `wrangler.toml` (`ALLOWED_ORIGINS`, `RESEND_FROM`, `INGEST_API_URL`). `SUPPORT_INGEST_SECRET` must match the value configured on the dahaejo API — a mismatch means every submission is rejected with 403 and queued to the dead-letter KV.

Once all placeholders are replaced and secrets are registered, a single `wrangler deploy` activates the Worker, the Cron trigger, the KV binding, and both Rate Limiting bindings.
