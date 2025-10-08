# Daily AI Attribution Audit
# Monitors AI attribution compliance for commits and provides alerts

Write-Host "=== Daily AI Attribution Audit ===" -ForegroundColor Green
Write-Host ""

# Check recent commits
$recentCommits = git log --since="24 hours ago" --pretty=format:"%h | %an | %ae | %s"

if ($recentCommits) {
    Write-Host "Recent commits (24h):" -ForegroundColor Yellow
    $recentCommits | ForEach-Object {
        if ($_ -match "anthropic_Claude.*copilot.*claude-sonnet-4") {
            Write-Host "✅ $_" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No commits in last 24 hours" -ForegroundColor Cyan
}

Write-Host ""

# Run AI attribution analysis if available
if (Get-Module -ListAvailable -Name AIAttributionTools) {
    Write-Host "📊 Running AI Attribution Analysis..." -ForegroundColor Yellow
    Import-Module AIAttributionTools
    Invoke-LLMCommitAnalysis -ShowDetails
} else {
    Write-Host "⚠️ AIAttributionTools not installed. Install with: Install-Module AIAttributionTools" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Daily AI Attribution Audit Complete!" -ForegroundColor Green