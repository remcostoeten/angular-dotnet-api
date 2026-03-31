#!/usr/bin/env bash

set -euo pipefail

api_base_url="${1:-http://localhost:5145}"

post_book() {
  local title="$1"
  local author_name="$2"
  local price="$3"

  curl --fail --silent --show-error \
    -X POST "${api_base_url}/Books" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"${title}\",
      \"authorName\": \"${author_name}\",
      \"price\": ${price}
    }"
}

post_book "Uien" "Farmer" 42.5
post_book "Onion" "Tor" 31.99
post_book "Gesnipperd uitje" "Michelin kok" 999.99

printf 'Seeded books to %s/Books\n' "${api_base_url}"
