#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Fix October 6th commits to have correct AI attribution

.DESCRIPTION
    This script corrects the attribution for October 6th commits that were AI-assisted
    but incorrectly attributed to "thisis-romar". Uses git filter-branch to rewrite
    commit history with proper AI attribution.

.NOTES
    Based on sequential thinking analysis of October 6th AI-assisted commits.
    Preserves the one commit (c4d9495) that already has correct attribution.
#>

# Set strict error handling
$ErrorActionPreference = "Stop"

# Define target commits from October 6th that need correction
$targetCommits = @(
    "fb9a94cee04fa94349c18054bfa1ce804ba4c8c8",  # Initial commit
    "7276a47fd3d6b7b1b7d33422e6a3aa36e21d2604",  # AI attribution test (Score: 9.5)
    "8bd7c26c81316f952793ad3888bf3e770d1624a0",  # AI attribution automation (Score: 10.5)
    "7c28cf3c5ae1d6ee89baa17685cdc6a259533a2f",  # Automation deployment (Score: 2.5)
    "e28681d8e029004e45e91edb9674965b311fd367",  # AIAttributionTools (Score: 8)
    "25a2eb763d549be942fb0b83ed08a1eddf866f3b",  # Copilot instructions update (Score: 10)
    "e0bbe214ce0a50150c18c95ec1ba5013a0525cb7",  # API documentation (Score: 9)
    "6fb51944413288d6acd11bfa5ec9495153470f11",  # Architectural separation (Score: 8)
    "4cf1117f4b42325cba402c1082c631edd1357034",  # AI Attribution migration (Score: 8)
    "0c4ba41f6400bb3fb2e889e14d8013fc9f8ad49f"   # Copilot instructions refactor (Score: 8)
)

# Note: c4d949530529f711b2b340a0f0ecf06569f253a6 already has correct attribution (excluded from target list)

Write-Host "🔧 Starting October 6th AI Attribution Correction" -ForegroundColor Cyan
Write-Host "📊 Targeting $($targetCommits.Count) commits for correction" -ForegroundColor Yellow
Write-Host "✅ Preserving 1 commit that already has correct attribution" -ForegroundColor Green

# Create backup branch
Write-Host "`n📦 Creating backup branch..." -ForegroundColor Blue
$backupBranch = "backup-oct6-before-attribution-fix-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backupBranch
if ($LASTEXITCODE -ne 0) {
    throw "Failed to create backup branch"
}
Write-Host "✅ Backup branch created: $backupBranch" -ForegroundColor Green

# Confirm current branch and commits to be fixed
Write-Host "`n🔍 Verifying October 6th commits..." -ForegroundColor Blue
$oct6Commits = git log --since="2025-10-06 00:00" --until="2025-10-06 23:59" --format="%H %an %s" 2>$null
Write-Host "Found October 6th commits:" -ForegroundColor Yellow
$oct6Commits | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

# Build the filter-branch command
Write-Host "`n🔧 Building filter-branch correction..." -ForegroundColor Blue

# Convert target commits array to space-separated string for grep
$targetCommitsString = $targetCommits -join " "

Write-Host "Target commits for correction:" -ForegroundColor Yellow
$targetCommits | ForEach-Object { 
    $shortHash = $_.Substring(0,7)
    Write-Host "  $shortHash" -ForegroundColor Gray
}

# Execute the filter-branch operation
Write-Host "`n⚡ Executing git filter-branch correction..." -ForegroundColor Magenta
Write-Host "⚠️  This will rewrite October 6th commit history..." -ForegroundColor Yellow

try {
    # Use git filter-branch with environment variable script
    $env:TARGET_COMMITS = $targetCommitsString
    
    git filter-branch -f --env-filter @"
if echo `$TARGET_COMMITS | grep -q `$GIT_COMMIT; then
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
fi
"@ -- --all
    
    if ($LASTEXITCODE -ne 0) {
        throw "Git filter-branch failed"
    }
    
    Write-Host "✅ Filter-branch completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error during filter-branch: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔄 You can restore from backup branch: git checkout $backupBranch" -ForegroundColor Yellow
    throw $_
}

# Verify the corrections
Write-Host "`n🔍 Verifying October 6th attribution corrections..." -ForegroundColor Blue
$correctedCommits = git log --since="2025-10-06 00:00" --until="2025-10-06 23:59" --format="%H %an %s" 2>$null

Write-Host "October 6th commits after correction:" -ForegroundColor Green
$correctedCommits | ForEach-Object { 
    if ($_ -match "anthropic_Claude") {
        Write-Host "  ✅ $_" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $_" -ForegroundColor Red
    }
}

# Count corrections
$correctedCount = ($correctedCommits | Where-Object { $_ -match "anthropic_Claude" }).Count
$totalCount = ($correctedCommits).Count

Write-Host "`n📊 Correction Summary:" -ForegroundColor Cyan
Write-Host "  Total October 6th commits: $totalCount" -ForegroundColor White
Write-Host "  Corrected to AI attribution: $correctedCount" -ForegroundColor Green
Write-Host "  Success rate: $(($correctedCount/$totalCount*100).ToString('F1'))%" -ForegroundColor Green

if ($correctedCount -eq $totalCount) {
    Write-Host "`n🎉 SUCCESS: All October 6th commits now have proper AI attribution!" -ForegroundColor Green
    Write-Host "✅ Ready to push corrected history to GitHub" -ForegroundColor Green
    Write-Host "   Command: git push --force-with-lease origin main" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Some commits may still need manual review" -ForegroundColor Yellow
}

Write-Host "`n🔄 Backup branch available: $backupBranch" -ForegroundColor Blue
Write-Host "💡 Run AI Attribution Analysis to verify: Import-Module AIAttributionTools; Invoke-LLMCommitAnalysis -ShowDetails" -ForegroundColor Blue

# Clean up environment variable
Remove-Item Env:TARGET_COMMITS -ErrorAction SilentlyContinue