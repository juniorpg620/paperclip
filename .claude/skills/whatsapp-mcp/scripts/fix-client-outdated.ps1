# Fixes "Client outdated (405) connect failure": upgrades whatsmeow to the latest
# version and patches main.go for the new context-aware whatsmeow API.
param(
  [string]$BridgeDir = "$HOME\whatsapp-mcp\whatsapp-bridge"
)
$ErrorActionPreference = "Stop"
Set-Location $BridgeDir

go get go.mau.fi/whatsmeow@latest
go mod tidy

$file = Join-Path $BridgeDir "main.go"
$src = Get-Content $file -Raw
$ctx = "context.Background(), "
$replacements = [ordered]@{
  "client.Download(downloader)"              = "client.Download(${ctx}downloader)"
  'sqlstore.New("sqlite3"'                   = "sqlstore.New(${ctx}`"sqlite3`""
  "container.GetFirstDevice()"               = "container.GetFirstDevice(context.Background())"
  "client.GetGroupInfo(jid)"                 = "client.GetGroupInfo(${ctx}jid)"
  "client.Store.Contacts.GetContact(jid)"    = "client.Store.Contacts.GetContact(${ctx}jid)"
}
foreach ($k in $replacements.Keys) { $src = $src.Replace($k, $replacements[$k]) }
Set-Content -Path $file -Value $src -NoNewline

go env -w CGO_ENABLED=1
go build -o whatsapp-bridge.exe .
Write-Host "Build OK. Starting bridge - scan the QR code."
.\whatsapp-bridge.exe
