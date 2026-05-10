#!/usr/bin/env bash
# provision.sh — Idempotent provisioning for firstfluke-contact Cloudflare Worker
#
# Run once from the project root or apps/web/worker/ directory.
# Prerequisites: wrangler >= 4.36.0, authenticated via `wrangler login`.
# After this script succeeds, set the required vars in wrangler.toml and run
# `wrangler deploy` to activate the Worker.
#
# Full env reference: ../SECRETS.md
# GitHub App setup:  docs/ops/github-app-setup.md

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
echo "==> [1/5] Checking wrangler version..."

if ! command -v wrangler &>/dev/null; then
  echo "ERROR: wrangler not found in PATH. Install with: npm install -g wrangler" >&2
  exit 1
fi

WRANGLER_VERSION="$(wrangler --version 2>&1 | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"
echo "    wrangler version: ${WRANGLER_VERSION}"

MAJOR="$(echo "${WRANGLER_VERSION}" | cut -d. -f1)"
MINOR="$(echo "${WRANGLER_VERSION}" | cut -d. -f2)"
PATCH="$(echo "${WRANGLER_VERSION}" | cut -d. -f3)"

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
  # wrangler kv:namespace list outputs JSON array; parse with grep/sed (no jq dependency)
  wrangler kv:namespace list 2>/dev/null \
    | grep -A1 "\"title\": \"${title}\"" \
    | grep '"id"' \
    | sed 's/.*"id": "\([^"]*\)".*/\1/' \
    | head -1 || true
}

# ---------------------------------------------------------------------------
# 2. Create (or reuse) TOKEN_CACHE KV namespace
# ---------------------------------------------------------------------------
echo ""
echo "==> [2/5] Provisioning KV namespace: TOKEN_CACHE"

TOKEN_CACHE_ID="$(get_kv_id "TOKEN_CACHE")"

if [ -n "${TOKEN_CACHE_ID}" ]; then
  echo "    Already exists — reusing id: ${TOKEN_CACHE_ID}"
else
  echo "    Creating new namespace..."
  CREATE_OUTPUT="$(wrangler kv:namespace create TOKEN_CACHE 2>&1)"
  echo "${CREATE_OUTPUT}"
  TOKEN_CACHE_ID="$(echo "${CREATE_OUTPUT}" | grep -Eo '"id": "[^"]*"' | head -1 | sed 's/"id": "\([^"]*\)"/\1/')"
  if [ -z "${TOKEN_CACHE_ID}" ]; then
    echo "ERROR: Failed to parse KV namespace id from wrangler output." >&2
    echo "       Output was: ${CREATE_OUTPUT}" >&2
    exit 1
  fi
  echo "    Created id: ${TOKEN_CACHE_ID}"
fi

# Substitute placeholder in wrangler.toml (idempotent — only acts on placeholder)
if grep -q '<TOKEN_CACHE_KV_ID>' "${WRANGLER_TOML}"; then
  sed -i.bak "s|<TOKEN_CACHE_KV_ID>|${TOKEN_CACHE_ID}|g" "${WRANGLER_TOML}"
  rm -f "${WRANGLER_TOML}.bak"
  echo "    Replaced <TOKEN_CACHE_KV_ID> in wrangler.toml"
else
  echo "    Placeholder already replaced — skipping sed"
fi

# ---------------------------------------------------------------------------
# 3. Create (or reuse) DEAD_LETTER KV namespace
# ---------------------------------------------------------------------------
echo ""
echo "==> [3/5] Provisioning KV namespace: DEAD_LETTER"

DEAD_LETTER_ID="$(get_kv_id "DEAD_LETTER")"

if [ -n "${DEAD_LETTER_ID}" ]; then
  echo "    Already exists — reusing id: ${DEAD_LETTER_ID}"
else
  echo "    Creating new namespace..."
  CREATE_OUTPUT="$(wrangler kv:namespace create DEAD_LETTER 2>&1)"
  echo "${CREATE_OUTPUT}"
  DEAD_LETTER_ID="$(echo "${CREATE_OUTPUT}" | grep -Eo '"id": "[^"]*"' | head -1 | sed 's/"id": "\([^"]*\)"/\1/')"
  if [ -z "${DEAD_LETTER_ID}" ]; then
    echo "ERROR: Failed to parse KV namespace id from wrangler output." >&2
    echo "       Output was: ${CREATE_OUTPUT}" >&2
    exit 1
  fi
  echo "    Created id: ${DEAD_LETTER_ID}"
fi

if grep -q '<DEAD_LETTER_KV_ID>' "${WRANGLER_TOML}"; then
  sed -i.bak "s|<DEAD_LETTER_KV_ID>|${DEAD_LETTER_ID}|g" "${WRANGLER_TOML}"
  rm -f "${WRANGLER_TOML}.bak"
  echo "    Replaced <DEAD_LETTER_KV_ID> in wrangler.toml"
else
  echo "    Placeholder already replaced — skipping sed"
fi

# ---------------------------------------------------------------------------
# 4. Secrets — operator must run these interactively (stdin required)
# ---------------------------------------------------------------------------
echo ""
echo "==> [4/5] Secrets registration (manual — requires interactive terminal)"
echo ""
echo "    Run the following commands one by one. Each will prompt for the value."
echo "    Press Ctrl+D (EOF) after pasting multi-line values (e.g. PEM keys)."
echo ""
echo "    --- REQUIRED ---"
echo ""
echo "    # GitHub App private key (PKCS#8 PEM — convert first!):"
echo "    #   openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt \\"
echo "    #     -in app.pem -out app.pkcs8.pem"
echo "    wrangler secret put GH_APP_PRIVATE_KEY"
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
# 5. Vars that require operator input — remind operator to edit wrangler.toml
# ---------------------------------------------------------------------------
echo "==> [5/5] Vars requiring operator configuration in wrangler.toml"
echo ""
echo "    Open ${WRANGLER_TOML} and set the following [vars] values:"
echo ""
echo "    GH_APP_ID      — GitHub App ID (numeric string, e.g. \"123456\")"
echo "                     Found at: https://github.com/settings/apps/<app-name>"
echo ""
echo "    PRODUCT_ROUTES — JSON map of product slugs to repo + installationId."
echo "                     Example (single line, no newlines):"
echo '                     {"oma":{"repo":"owner/oma-repo","installationId":"12345678"}}'
echo "                     See SECRETS.md §8 for the full 7-product template."
echo ""
echo "    NOTE: RATE_LIMIT_NAMESPACE_ID in wrangler.toml must be replaced with"
echo "    the namespace ID from your Cloudflare dashboard:"
echo "    Dashboard > Workers & Pages > firstfluke-contact > Rate Limiting"
echo "    Replace both occurrences of <RATE_LIMIT_NAMESPACE_ID> in wrangler.toml."
echo "    (wrangler >= 4.36 uses 'name' in [[ratelimits]]; simple.period = 10|60 only."
echo "     The 30-req/day daily cap is enforced in Worker code via KV counter — T-12.)"
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
  echo "      If errors mention placeholder IDs (<TOKEN_CACHE_KV_ID> etc.) or"
  echo "      missing secrets, that is expected until all values are filled in."
  echo "      If errors mention TOML syntax, fix wrangler.toml and re-run."
}

echo ""
echo "==> Provisioning complete."
echo "    Next steps:"
echo "    1. Replace <RATE_LIMIT_NAMESPACE_ID> in wrangler.toml (see above)"
echo "    2. Set GH_APP_ID and PRODUCT_ROUTES in wrangler.toml [vars]"
echo "    3. Run the 3 'wrangler secret put' commands shown above"
echo "    4. Run: wrangler deploy"
