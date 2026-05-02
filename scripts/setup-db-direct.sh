#!/usr/bin/env bash
# scripts/setup-db-direct.sh
#
# Prompts for the Neon UNPOOLED connection URL and writes it to
# .env.local as DATABASE_URL_DIRECT. The URL is read silently (like a
# password) so it never echoes to your terminal or shell history.
#
# Run from the repo root:
#   bash scripts/setup-db-direct.sh

set -euo pipefail

# Make sure we're in the repo root (where .env.local lives).
if [[ ! -f package.json ]]; then
  echo "✗ Run this from the perks repo root (where package.json lives)."
  exit 1
fi

ENV_FILE=".env.local"

echo ""
echo "Setting DATABASE_URL_DIRECT in $ENV_FILE"
echo ""
echo "From Neon dashboard → Connection Details:"
echo "  • Toggle 'Pooled connection' OFF"
echo "  • Toggle 'Show password' ON"
echo "  • Copy the full URL (host should NOT contain -pooler)"
echo ""

# -s = silent (no echo), -r = raw (don't process backslashes)
read -rs -p "Paste Neon UNPOOLED URL: " url
echo ""
echo ""

# Trim leading/trailing whitespace (including any pasted newlines).
url="${url#"${url%%[![:space:]]*}"}"
url="${url%"${url##*[![:space:]]}"}"

if [[ -z "$url" ]]; then
  echo "✗ No URL entered. Aborting."
  exit 1
fi

if [[ "$url" != postgres* ]]; then
  echo "✗ URL doesn't start with 'postgres' / 'postgresql'. Aborting."
  echo "   (Got something starting with: ${url:0:20}…)"
  exit 1
fi

if [[ "$url" == *"-pooler"* ]]; then
  echo "✗ URL contains '-pooler' — that's the POOLED URL."
  echo "   You need the UNPOOLED URL. Toggle 'Pooled connection' OFF in Neon and re-run."
  exit 1
fi

if [[ "$url" != *"neon.tech"* ]]; then
  echo "⚠  URL doesn't contain 'neon.tech'. Continuing anyway, but verify it's correct."
fi

# Make sure .env.local exists (touch creates it if missing).
touch "$ENV_FILE"

# Strip any existing DATABASE_URL_DIRECT line, then append the new one.
# Use a temp file so we don't truncate mid-write.
TMP="$(mktemp)"
grep -v '^DATABASE_URL_DIRECT=' "$ENV_FILE" > "$TMP" || true
echo "DATABASE_URL_DIRECT=\"$url\"" >> "$TMP"
mv "$TMP" "$ENV_FILE"
chmod 600 "$ENV_FILE"

# Quick safety check — re-read what we wrote.
if ! grep -q '^DATABASE_URL_DIRECT=' "$ENV_FILE"; then
  echo "✗ Failed to write DATABASE_URL_DIRECT to $ENV_FILE."
  exit 1
fi

# Show length only — never echo the URL itself.
url_len=${#url}
echo "✓ DATABASE_URL_DIRECT written to $ENV_FILE (${url_len} chars)."
echo "✓ File permissions set to 600 (owner read/write only)."
echo ""
echo "Next:"
echo "  npm run db:migrate-cards:dry-run"
