# Quick AI Attribution Status Check
param([switch]$Fix)

$currentName = git config user.name
$currentEmail = git config user.email
$expectedName = "anthropic_Claude (copilot/claude-sonnet-4)"
$expectedEmail = "admin+copilot.claude-sonnet-4@emblemprojects.com"

Write-Host "=== AI Attribution Status ===" -ForegroundColor Green
Write-Host "Current Name:  $currentName" -ForegroundColor Cyan
Write-Host "Current Email: $currentEmail" -ForegroundColor Cyan
Write-Host "Expected Name:  $expectedName" -ForegroundColor Yellow  
Write-Host "Expected Email: $expectedEmail" -ForegroundColor Yellow

if ($currentName -eq $expectedName -and $currentEmail -eq $expectedEmail) {
    Write-Host "✅ AI Attribution CORRECTLY configured!" -ForegroundColor Green
} else {
    Write-Host "❌ AI Attribution INCORRECT!" -ForegroundColor Red
    if ($Fix) {
        Write-Host "🔧 Fixing attribution..." -ForegroundColor Yellow
        git config user.name $expectedName
        git config user.email $expectedEmail
        Write-Host "✅ Attribution fixed!" -ForegroundColor Green
    } else {
        Write-Host "💡 Run with -Fix to correct automatically" -ForegroundColor Cyan
    }
}
