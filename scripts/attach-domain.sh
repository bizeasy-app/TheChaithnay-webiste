#!/usr/bin/env bash
# After Hostinger nameservers point at Cloudflare, run:
#   npm run build && ./scripts/attach-domain.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

need_ns=(cash.ns.cloudflare.com liv.ns.cloudflare.com)
echo "Checking nameservers for thechaithanya.com…"
current="$(dig +short NS thechaithanya.com | sed 's/\.$//' | tr '[:upper:]' '[:lower:]' | sort -u)"
echo "$current"

for ns in "${need_ns[@]}"; do
  if ! echo "$current" | grep -qx "$ns"; then
    echo ""
    echo "Nameservers are not on Cloudflare yet."
    echo "In Hostinger → Domains → thechaithanya.com → DNS / Nameservers, replace with:"
    echo "  cash.ns.cloudflare.com"
    echo "  liv.ns.cloudflare.com"
    echo "Wait until dig NS shows those (often 5–30 min), then run this again."
    exit 1
  fi
done

echo "Nameservers look good. Writing custom domain routes and deploying…"
python3 - <<'PY'
from pathlib import Path
Path("wrangler.jsonc").write_text("""{
  \"$schema\": \"node_modules/wrangler/config-schema.json\",
  \"name\": \"thechaithanya\",
  \"main\": \"workers/api/index.ts\",
  \"compatibility_date\": \"2026-11-01\",
  \"workers_dev\": true,
  \"assets\": {
    \"directory\": \"./out\",
    \"not_found_handling\": \"404-page\",
    \"html_handling\": \"auto-trailing-slash\",
    \"run_worker_first\": [\"/api/*\"]
  },
  \"routes\": [
    { \"pattern\": \"thechaithanya.com\", \"custom_domain\": true },
    { \"pattern\": \"www.thechaithanya.com\", \"custom_domain\": true }
  ]
}
""")
print("wrangler.jsonc updated with custom domains")
PY

npx wrangler deploy

echo ""
echo "Done. Open:"
echo "  https://thechaithanya.com"
echo "  https://www.thechaithanya.com"
