#!/bin/zsh
set -euo pipefail

ENV_FILE="${PAPERCLIP_RUNTIME_ENV_FILE:-$HOME/paperclip-production/env/paperclip.env}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

HOST="${HEALTHCHECK_HOST:-127.0.0.1}"
PORT="${PORT:-3100}"
URL="http://${HOST}:${PORT}/api/health"

curl --fail --silent --show-error "$URL"
