$ErrorActionPreference = 'Stop'

Write-Host ""
Write-Host "SBUWeb - Supabase setup" -ForegroundColor Cyan
Write-Host "This creates backend/.env locally and does not upload your key to GitHub."
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is not installed or is not on PATH. Install the LTS version from https://nodejs.org/ and rerun this script." -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}

$projectUrl = "https://rwvziiwpitsupexrijxv.supabase.co"
$key = Read-Host "Paste your Supabase PUBLISHABLE key (sb_publishable_...)"

if ([string]::IsNullOrWhiteSpace($key) -or -not $key.StartsWith("sb_publishable_")) {
  Write-Host "That does not look like a Supabase publishable key. Nothing was saved." -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}

$envPath = Join-Path $PSScriptRoot ".env"
@(
  "PORT=5000"
  "SUPABASE_URL=$projectUrl"
  "SUPABASE_KEY=$key"
) | Set-Content -Path $envPath -Encoding ascii

Write-Host ""
Write-Host "Local .env created. It is ignored by Git." -ForegroundColor Green
Write-Host "Installing backend dependencies..."
Push-Location $PSScriptRoot
try {
  npm install
  if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

  Write-Host "Building backend..."
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }

  Write-Host ""
  Write-Host "Starting backend. Leave this window open." -ForegroundColor Green
  Write-Host "When it starts, open http://localhost:5000/api/v1/health in your browser."
  npm run dev
}
catch {
  Write-Host $_ -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}
finally {
  Pop-Location
}
