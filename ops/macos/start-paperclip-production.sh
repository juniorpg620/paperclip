#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="${PAPERCLIP_RUNTIME_ENV_FILE:-$HOME/paperclip-production/env/paperclip.env}"

export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

export PAPERCLIP_HOME="${PAPERCLIP_HOME:-$HOME/paperclip-production/home}"
export PAPERCLIP_UI_DEV_MIDDLEWARE="${PAPERCLIP_UI_DEV_MIDDLEWARE:-false}"

mkdir -p "$PAPERCLIP_HOME"
cd "$REPO_ROOT"

exec pnpm paperclipai run
