#!/usr/bin/env bash
set -euo pipefail

URL="${1:-https://api-prod.bdsmlr.com/openapi.json}"
OUT="${2:-src/lib/api/openapi.json}"

mkdir -p "$(dirname "$OUT")"

echo "Fetching OpenAPI spec from $URL ..."
if command -v curl &>/dev/null; then
  curl -sfSL "$URL" -o "$OUT"
elif command -v wget &>/dev/null; then
  wget -q "$URL" -O "$OUT"
else
  echo "error: need curl or wget" >&2
  exit 1
fi

echo "Saved to $OUT ($(wc -c < "$OUT") bytes)"
