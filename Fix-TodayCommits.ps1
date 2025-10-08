# PowerShell script to correct TODAY'S AI commit attribution
# Equivalent to fix-today-commits.sh for Windows PowerShell environment

Write-Host "=== Correcting TODAY'S AI Commit Attribution ===" -ForegroundColor Green
Write-Host "AI Author: anthropic_Claude (copilot/claude-sonnet-4)" -ForegroundColor Cyan
Write-Host "AI Email: admin+copilot.claude-sonnet-4@emblemprojects.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Correcting 7 commits from today (2025-10-07) with AI assistance scores ≥3.0" -ForegroundColor Yellow
Write-Host ""

# Create backup branch first
Write-Host "Creating backup branch..." -ForegroundColor Yellow
git branch backup-before-attribution-fix

# Define the commits to correct (today's AI-assisted commits)
$commitsToCorrect = @(
    @{ Hash = "65715e265b25d3cc077d8b20dfbc9e76769694cc"; Score = 3; Message = "fix: Correct PowerShell module repository URLs" },
    @{ Hash = "6a04de6c655de9101257e76d27cb7d47f680b570"; Score = 3; Message = "fix: Resolve git repository structure" },
    @{ Hash = "f0096d63828624b506a59228e3d4e256f3836853"; Score = 4; Message = "feat: Add PowerShell modules documentation" },
    @{ Hash = "f213536f78f492acc51f2b29774fc354c0aa788f"; Score = 3; Message = "feat: Add PowerShell modules for publishing" },
    @{ Hash = "e5a99ee0411ad7401acd9c5dd588af3c1f8bb431"; Score = 3; Message = "fix: Resolve PowerShell Gallery publishing workflow errors" },
    @{ Hash = "03bdb01fa4bceba9ba10c37c69f05f51d57f65ae"; Score = 6; Message = "feat: Add comprehensive PowerShell Modules Publisher workflow" },
    @{ Hash = "8cb9ef763ee2f5a7b7859e4ccefc7f7ccc8bce41"; Score = 7; Message = "docs: Add comprehensive PowerShell Gallery publication action plan" }
)

# Create filter-branch script content
$filterScript = @'
if [ $GIT_COMMIT = "65715e265b25d3cc077d8b20dfbc9e76769694cc" ]; then
    echo "Correcting commit 65715e2: fix: Correct PowerShell module repository URLs (AI Score: 3)"
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)" 
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
elif [ $GIT_COMMIT = "6a04de6c655de9101257e76d27cb7d47f680b570" ]; then
    echo "Correcting commit 6a04de6: fix: Resolve git repository structure (AI Score: 3)"
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)" 
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
elif [ $GIT_COMMIT = "f0096d63828624b506a59228e3d4e256f3836853" ]; then
    echo "Correcting commit f0096d6: feat: Add PowerShell modules documentation (AI Score: 4)"
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)" 
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
elif [ $GIT_COMMIT = "f213536f78f492acc51f2b29774fc354c0aa788f" ]; then
    echo "Correcting commit f213536: feat: Add PowerShell modules for publishing (AI Score: 3)"
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)" 
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
elif [ $GIT_COMMIT = "e5a99ee0411ad7401acd9c5dd588af3c1f8bb431" ]; then
    echo "Correcting commit e5a99ee: fix: Resolve PowerShell Gallery publishing workflow errors (AI Score: 3)"
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)" 
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
elif [ $GIT_COMMIT = "03bdb01fa4bceba9ba10c37c69f05f51d57f65ae" ]; then
    echo "Correcting commit 03bdb01: feat: Add comprehensive PowerShell Modules Publisher workflow (AI Score: 6)"
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)" 
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
elif [ $GIT_COMMIT = "8cb9ef763ee2f5a7b7859e4ccefc7f7ccc8bce41" ]; then
    echo "Correcting commit 8cb9ef7: docs: Add comprehensive PowerShell Gallery publication action plan (AI Score: 7)"
    export GIT_AUTHOR_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
    export GIT_AUTHOR_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
    export GIT_COMMITTER_NAME="anthropic_Claude (copilot/claude-sonnet-4)" 
    export GIT_COMMITTER_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"
fi
'@

# Execute git filter-branch to rewrite history
Write-Host "Executing git filter-branch to correct AI attribution..." -ForegroundColor Yellow
Write-Host "This will rewrite git history for the specified commits." -ForegroundColor Red

try {
    # Use git filter-branch with the correction script
    $filterBranchArgs = @(
        "filter-branch", 
        "--env-filter", 
        $filterScript,
        "--tag-name-filter", "cat",
        "--", "--branches", "--tags"
    )
    
    & git @filterBranchArgs
    
    Write-Host ""
    Write-Host "✅ Attribution correction completed successfully!" -ForegroundColor Green
    Write-Host "📋 Corrected 7 AI-assisted commits from 2025-10-07" -ForegroundColor Cyan
    Write-Host "🔄 Git history has been rewritten to reflect proper AI attribution" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📌 Backup branch 'backup-before-attribution-fix' has been created" -ForegroundColor Yellow
    Write-Host "🚀 Use 'git push --force' to update remote repository" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📊 To verify corrections:" -ForegroundColor Cyan
    Write-Host '   git log --since="today" --pretty=format:"%h | %an | %s"' -ForegroundColor White
    
} catch {
    Write-Error "Failed to execute git filter-branch: $_"
    Write-Host "You may need to clean up and try again with:" -ForegroundColor Yellow
    Write-Host "   git filter-branch -f ..." -ForegroundColor White
}