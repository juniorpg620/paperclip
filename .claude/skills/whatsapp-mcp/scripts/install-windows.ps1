# Installs prerequisites for lharries/whatsapp-mcp on Windows, clones it,
# registers it with Claude Code (if present), and starts the bridge for QR login.
param(
  [string]$InstallDir = "$HOME\whatsapp-mcp"
)
$ErrorActionPreference = "Stop"

function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [Environment]::GetEnvironmentVariable("Path", "User")
}

Write-Host "==> Installing prerequisites via winget"
foreach ($id in @("GoLang.Go", "astral-sh.uv", "MSYS2.MSYS2", "Git.Git")) {
  winget install --id $id -e --accept-source-agreements --accept-package-agreements
}
Refresh-Path

Write-Host "==> Installing GCC (MSYS2 UCRT64)"
$msysBash = "C:\msys64\usr\bin\bash.exe"
if (-not (Test-Path $msysBash)) { throw "MSYS2 not found at C:\msys64" }
& $msysBash -lc "pacman -S --noconfirm --needed mingw-w64-ucrt-x86_64-gcc"

$gccDir = "C:\msys64\ucrt64\bin"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$gccDir*") {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$gccDir", "User")
}
Refresh-Path

Write-Host "==> Cloning whatsapp-mcp to $InstallDir"
if (-not (Test-Path $InstallDir)) {
  git clone https://github.com/lharries/whatsapp-mcp.git $InstallDir
} else {
  git -C $InstallDir pull
}

go env -w CGO_ENABLED=1

$serverDir = Join-Path $InstallDir "whatsapp-mcp-server"
$uv = (Get-Command uv).Source
if (Get-Command claude -ErrorAction SilentlyContinue) {
  Write-Host "==> Registering MCP server with Claude Code"
  claude mcp add whatsapp --scope user -- $uv --directory $serverDir run main.py
}

Write-Host ""
Write-Host "Claude Desktop / Cursor config entry:"
@{ mcpServers = @{ whatsapp = @{ command = $uv; args = @("--directory", $serverDir, "run", "main.py") } } } |
  ConvertTo-Json -Depth 5 | Write-Host

Write-Host ""
Write-Host "==> Starting bridge. Scan the QR code: WhatsApp > Settings > Linked devices. Keep this window open."
Set-Location (Join-Path $InstallDir "whatsapp-bridge")
go run main.go
