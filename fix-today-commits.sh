#!/bin/bash
# Git filter-branch script to correct TODAY'S AI commit attribution
# Generated for today's commits that show "thisis-romar" instead of proper AI attribution

echo "=== Correcting TODAY'S AI Commit Attribution ==="
echo "AI Author: anthropic_Claude (copilot/claude-sonnet-4)"
echo "AI Email: admin+copilot.claude-sonnet-4@emblemprojects.com"
echo ""
echo "Correcting 7 commits from today (2025-10-07) with AI assistance scores ≥3.0"
echo ""

# Backup current branch
git branch backup-before-attribution-fix

git filter-branch --env-filter '
# Today's AI-assisted commits that need correction
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
' --tag-name-filter cat -- --branches --tags

echo ""
echo "✅ Attribution correction complete for today's commits!"
echo "📋 Corrected 7 AI-assisted commits from 2025-10-07"
echo "🔄 Git history has been rewritten to reflect proper AI attribution"
echo ""
echo "⚠️  WARNING: This has rewritten git history!"
echo "📌 A backup branch 'backup-before-attribution-fix' has been created"
echo "🚀 Use 'git push --force' to update remote repository"
echo ""
echo "📊 To verify corrections:"
echo "   git log --since=\"today\" --pretty=format:\"%h | %an | %s\""