#!/usr/bin/env bash
# Launches the Google Analytics MCP server (see .mcp.json).
# If GA_ADC_JSON holds the contents of an ADC / service-account JSON
# (e.g. set as an environment secret in cloud sessions), it is written to a
# private file and used as GOOGLE_APPLICATION_CREDENTIALS.
set -euo pipefail
if [[ -n "${GA_ADC_JSON:-}" && -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]]; then
  creds="${HOME}/.config/gcloud/ga_adc.json"
  mkdir -p "$(dirname "$creds")"
  (umask 077; printf '%s' "$GA_ADC_JSON" > "$creds")
  export GOOGLE_APPLICATION_CREDENTIALS="$creds"
fi
exec uvx analytics-mcp "$@"
