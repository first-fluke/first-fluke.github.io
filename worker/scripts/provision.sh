#!/usr/bin/env bash
# provision.sh — Idempotent provisioning for firstfluke-contact Cloudflare Worker
#
# Run once from the project root or worker/ directory.
# Prerequisites: wrangler >= 4.36.0, authenticated via `wrangler login`.
# After this script succeeds, set the required vars in wrangler.toml and run
# `wrangler deploy` to activate the Worker.
#
# Full env reference: ../SECRETS.md

set -euo pipefail

# ---------------------------------------------------------------------------
# Resolve script and worker directories (idempotent regardless of cwd)
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKER_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WRANGLER_TOML="${WORKER_DIR}/wrangler.toml"

echo "==> Worker directory : ${WORKER_DIR}"
echo "==> wrangler.toml    : ${WRANGLER_TOML}"

# ---------------------------------------------------------------------------
# 1. Verify wrangler version >= 4.36
# ---------------------------------------------------------------------------
echo ""
echo "==> [1/4] Checking wrangler version..."

if ! command -v wrangler &>/dev/null; then
  echo "ERROR: wrangler not found in PATH. Install with: npm install -g wrangler" >&2
  exit 1
fi

WRANGLER_VERSION="$(wrangler --version 2>&1 | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"
echo "    wrangler version: ${WRANGLER_VERSION}"

MAJOR="$(echo "${WRANGLER_VERSION}" | cut -d. -f1)"
MINOR="$(echo "${WRANGLER_VERSION}" | cut -d. -f2)"

# Require >= 4.36.0
if [ "${MAJOR}" -lt 4 ] || { [ "${MAJOR}" -eq 4 ] && [ "${MINOR}" -lt 36 ]; }; then
  echo "ERROR: wrangler >= 4.36.0 required (found ${WRANGLER_VERSION})." >&2
  echo "       [[ratelimits]] block GA requires >= 4.36.0." >&2
  echo "       Upgrade: npm install -g wrangler@latest" >&2
  exit 1
fi

echo "    OK (${WRANGLER_VERSION} >= 4.36.0)"

# ---------------------------------------------------------------------------
# Helper: get existing KV namespace id by title, or empty string
# ---------------------------------------------------------------------------
get_kv_id() {
  local title="$1"
  # wrangler kv namespace list outputs a JSON array; parse with grep/sed (no jq dependency)
  wrangler kv namespace list 2>/dev/null \
    | grep -A1 "\"title\": \"${title}\"" \
    | grep '"id"' \
    | sed 's/.*"id": "\([^"]*\)".*/\1/' \
    | head -1 || true
}

# ---------------------------------------------------------------------------
# 2. Create (or reuse) DEAD_LETTER KV namespace
# ---------------------------------------------------------------------------
echo ""
echo "==> [2/4] Provisioning KV namespace: DEAD_LETTER"

DEAD_LETTER_ID="$(get_kv_id "DEAD_LETTER")"

if [ -n "${DEAD_LETTER_ID}" ]; then
  echo "    Already exists — reusing id: ${DEAD_LETTER_ID}"
else
  echo "    Creating new namespace..."
  CREATE_OUTPUT="$(wrangler kv namespace create DEAD_LETTER 2>&1)"
  echo "${CREATE_OUTPUT}"
  DEAD_LETTER_ID="$(echo "${CREATE_OUTPUT}" | grep -Eo '"id": "[^"]*"' | head -1 | sed 's/"id": "\([^"]*\)"/\1/')"
  if [ -z "${DEAD_LETTER_ID}" ]; then
    echo "ERROR: Failed to parse KV namespace id from wrangler output." >&2
    echo "       Output was: ${CREATE_OUTPUT}" >&2
    exit 1
  fi
  echo "    Created id: ${DEAD_LETTER_ID}"
fi

# Substitute placeholder in wrangler.toml (idempotent — only acts on placeholder)
if grep -q '<DEAD_LETTER_KV_ID>' "${WRANGLER_TOML}"; then
  sed -i.bak "s|<DEAD_LETTER_KV_ID>|${DEAD_LETTER_ID}|g" "${WRANGLER_TOML}"
  rm -f "${WRANGLER_TOML}.bak"
  echo "    Replaced <DEAD_LETTER_KV_ID> in wrangler.toml"
else
  echo "    Placeholder already replaced — skipping sed"
fi

# ---------------------------------------------------------------------------
# 3. Secrets — operator must run these interactively (stdin required)
# ---------------------------------------------------------------------------
echo ""
echo "==> [3/4] Secrets registration (manual — requires interactive terminal)"
echo ""
echo "    Run the following commands one by one. Each will prompt for the value."
echo ""
echo "    --- REQUIRED ---"
echo ""
echo "    # X-Internal-Secret for the dahaejo ingest API. MUST match the API's"
echo "    # SUPPORT_INGEST_SECRET exactly — a mismatch means every submission is"
echo "    # rejected with 403 and piles up in the dead-letter queue."
echo "    wrangler secret put SUPPORT_INGEST_SECRET"
echo ""
echo "    # Operator inbox for the 24h dead-letter alert (PII — secret, not a var):"
echo "    wrangler secret put OPS_ALERT_TO"
echo ""
echo "    # Resend API key (re_...) — ops-alert sending access only:"
echo "    wrangler secret put RESEND_API_KEY"
echo ""
echo "    --- OPTIONAL ---"
echo ""
echo "    # Cloudflare Turnstile site secret (skip to enable grace-skip in dev):"
echo "    wrangler secret put TURNSTILE_SECRET_KEY"
echo ""

# ---------------------------------------------------------------------------
# 4. Vars that require operator input — remind operator to edit wrangler.toml
# ---------------------------------------------------------------------------
echo "==> [4/4] Vars requiring operator configuration in wrangler.toml"
echo ""
echo "    Open ${WRANGLER_TOML} and confirm the following [vars] values:"
echo ""
echo "    ALLOWED_ORIGINS — comma-separated CORS allowlist. Leaving it empty does"
echo "                      NOT fall back to a wildcard; the browser blocks instead."
echo ""
echo "    RESEND_FROM     — verified Resend sender for the ops alert."
echo ""
echo "    INGEST_API_URL  — dahaejo ingest endpoint, e.g."
echo "                      https://haejo-api.firstfluke.com/v1/support/inquiries"
echo ""
echo "    NOTE: [[ratelimits]] namespace_id values are arbitrary account-scoped"
echo "    integers (not secrets). wrangler >= 4.36 uses 'name' (not 'binding') and"
echo "    simple.period accepts 10 or 60 only — the true 30-req/day cap is enforced"
echo "    in Worker code via a KV counter (T-12)."
echo ""

# ---------------------------------------------------------------------------
# Final: dry-run deploy to validate TOML syntax and binding declarations
# ---------------------------------------------------------------------------
echo "==> Running wrangler deploy --dry-run to validate configuration..."
echo ""

cd "${WORKER_DIR}"
wrangler deploy --dry-run --outdir=/tmp/firstfluke-contact-dry 2>&1 || {
  EXIT_CODE=$?
  echo ""
  echo "NOTE: dry-run exited with code ${EXIT_CODE}."
  echo "      If errors mention placeholder IDs (<DEAD_LETTER_KV_ID>) or missing"
  echo "      secrets, that is expected until all values are filled in."
  echo "      If errors mention TOML syntax, fix wrangler.toml and re-run."
}

echo ""
echo "==> Provisioning complete."
echo "    Next steps:"
echo "    1. Confirm ALLOWED_ORIGINS / RESEND_FROM / INGEST_API_URL in wrangler.toml"
echo "    2. Run the 'wrangler secret put' commands shown above"
echo "    3. Run: wrangler deploy"
echo "    4. Point the site's NEXT_PUBLIC_CONTACT_API_URL at the deployed URL"
