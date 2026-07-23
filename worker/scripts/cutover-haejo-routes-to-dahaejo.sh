#!/usr/bin/env bash
# Cutover: firstfluke-contact PRODUCT_ROUTES for archived *-haejo repos → dahaejo.
#
# Prerequisites:
#   1. firstfluke-contact-bot (install id 131094718) has Issues:Write on first-fluke/dahaejo
#      → https://github.com/apps/firstfluke-contact-bot/installations/131094718
#   2. Labels on first-fluke/dahaejo: contact, place-haejo, contents-haejo, legalize-kr, answered
#   3. CLOUDFLARE_API_TOKEN with Workers Scripts:Edit (or `wrangler login`)
#   4. Deploy this worker tree so DLQ re-resolves live PRODUCT_ROUTES (src/index.ts)
#
# Usage (from worker/):
#   ./scripts/cutover-haejo-routes-to-dahaejo.sh
#   ./scripts/cutover-haejo-routes-to-dahaejo.sh --deploy
set -euo pipefail

cd "$(dirname "$0")/.."

INSTALLATION_ID="${INSTALLATION_ID:-131094718}"
# Full map for the three archived haejo products + known live routes from
# .dev.vars.example / SECRETS.md. Merge any extra product keys (oma, curate-ai, …)
# manually if production already has them.
PRODUCT_ROUTES_JSON=$(cat <<EOF
{
  "place-haejo": {"repo": "first-fluke/dahaejo", "installationId": "${INSTALLATION_ID}"},
  "contents-haejo": {"repo": "first-fluke/dahaejo", "installationId": "${INSTALLATION_ID}"},
  "legalize-kr": {"repo": "first-fluke/dahaejo", "installationId": "${INSTALLATION_ID}"},
  "shopzy": {"repo": "first-fluke/shopzy", "installationId": "${INSTALLATION_ID}"},
  "etc": {"repo": "first-fluke/first-fluke.github.io", "installationId": "${INSTALLATION_ID}"}
}
EOF
)

# Compact single line for wrangler secret
PRODUCT_ROUTES_LINE=$(printf '%s' "$PRODUCT_ROUTES_JSON" | tr -d '\n' | sed 's/  */ /g')

echo "==> Putting PRODUCT_ROUTES secret on Worker firstfluke-contact"
printf '%s' "$PRODUCT_ROUTES_LINE" | npx wrangler secret put PRODUCT_ROUTES

if [[ "${1:-}" == "--deploy" ]]; then
  echo "==> Deploying Worker (picks up DLQ re-resolve code)"
  npx wrangler deploy
fi

echo "==> Done. New place/contents/legalize contacts → first-fluke/dahaejo"
echo "    Stuck DLQ entries re-resolve on next cron (*/5) after deploy."
echo "    Smoke: submit https://firstfluke.com/#contact product=place-haejo"
echo "    Admin:  https://haejo-admin.firstfluke.com/admin/inquiries?service=place"
