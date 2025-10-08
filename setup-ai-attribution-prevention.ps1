# AI Attribution Prevention & Automation System
# Comprehensive solution to prevent AI attribution errors

Write-Host "=== Setting Up AI Attribution Prevention System ===" -ForegroundColor Green

# 1. Configure Git for AI Attribution (Primary Prevention)
Write-Host "1. Configuring Git for AI Attribution..." -ForegroundColor Yellow
git config user.name "anthropic_Claude (copilot/claude-sonnet-4)"
git config user.email "admin+copilot.claude-sonnet-4@emblemprojects.com"

# 2. Create Git Pre-Commit Hook to Verify Attribution
$hookPath = ".git/hooks/pre-commit"
$hookContent = @'
#!/bin/bash
# Pre-commit hook to ensure proper AI attribution

# Check if git is configured with AI attribution
CURRENT_NAME=$(git config user.name)
CURRENT_EMAIL=$(git config user.email)

AI_NAME="anthropic_Claude (copilot/claude-sonnet-4)"
AI_EMAIL="admin+copilot.claude-sonnet-4@emblemprojects.com"

if [ "$CURRENT_NAME" != "$AI_NAME" ] || [ "$CURRENT_EMAIL" != "$AI_EMAIL" ]; then
    echo "❌ ERROR: Git not configured for AI attribution!"
    echo "Current: $CURRENT_NAME <$CURRENT_EMAIL>"
    echo "Expected: $AI_NAME <$AI_EMAIL>"
    echo ""
    echo "🔧 Fix with:"
    echo "git config user.name \"$AI_NAME\""
    echo "git config user.email \"$AI_EMAIL\""
    echo ""
    echo "Or override for human commits:"
    echo "git commit --author=\"Your Name <your.email@example.com>\""
    exit 1
fi

echo "✅ AI Attribution configured correctly"
exit 0
'@

Write-Host "2. Creating pre-commit hook..." -ForegroundColor Yellow
New-Item -Path $hookPath -ItemType File -Value $hookContent -Force
# Make hook executable (Git Bash/WSL style)
& git update-index --chmod=+x .git/hooks/pre-commit

# 3. Create AI Attribution Verification Command
$verifyScript = @'
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
'@

Write-Host "3. Creating attribution verification script..." -ForegroundColor Yellow
Set-Content -Path "verify-ai-attribution.ps1" -Value $verifyScript

# 4. Create Daily Attribution Audit Script
$auditScript = @'
# Daily AI Attribution Audit
Write-Host "=== Daily AI Attribution Audit ===" -ForegroundColor Green

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

# Run AI attribution analysis if available
if (Get-Module -ListAvailable -Name AIAttributionTools) {
    Write-Host "`n📊 Running AI Attribution Analysis..." -ForegroundColor Yellow
    Import-Module AIAttributionTools
    Invoke-LLMCommitAnalysis -ShowDetails
} else {
    Write-Host "⚠️  AIAttributionTools not installed. Install with: Install-Module AIAttributionTools" -ForegroundColor Yellow
}
'@

Write-Host "4. Creating daily audit script..." -ForegroundColor Yellow
Set-Content -Path "daily-attribution-audit.ps1" -Value $auditScript

# 5. Create Commit Template for AI Attribution
$commitTemplate = @'
# AI-Assisted Commit Template
# Attribution: anthropic_Claude (copilot/claude-sonnet-4)
# 
# Conventional Commit Format:
# <type>(<scope>): <description>
#
# Types: feat, fix, docs, style, refactor, test, chore
# 
# Examples:
# feat(ai): Add comprehensive AI attribution system
# fix(docs): Correct PowerShell module documentation  
# docs(readme): Update installation instructions
#
# AI Attribution Guidelines:
# - All AI-assisted work should be properly attributed
# - Use conventional commit format for consistency
# - Include relevant scope when applicable
# - Keep descriptions clear and actionable
'@

Write-Host "5. Creating commit template..." -ForegroundColor Yellow
Set-Content -Path ".gitmessage" -Value $commitTemplate
git config commit.template .gitmessage

# 6. Create VS Code Task for Attribution Check
$taskJson = @'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Check AI Attribution",
            "type": "shell", 
            "command": "powershell",
            "args": ["-ExecutionPolicy", "Bypass", "-File", "./verify-ai-attribution.ps1"],
            "group": "test",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": []
        },
        {
            "label": "Fix AI Attribution",
            "type": "shell",
            "command": "powershell", 
            "args": ["-ExecutionPolicy", "Bypass", "-File", "./verify-ai-attribution.ps1", "-Fix"],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": []
        },
        {
            "label": "Daily Attribution Audit",
            "type": "shell",
            "command": "powershell",
            "args": ["-ExecutionPolicy", "Bypass", "-File", "./daily-attribution-audit.ps1"],
            "group": "test",
            "presentation": {
                "echo": true,
                "reveal": "always", 
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": []
        }
    ]
}
'@

Write-Host "6. Creating VS Code tasks..." -ForegroundColor Yellow
if (-not (Test-Path ".vscode")) { New-Item -Type Directory ".vscode" }
Set-Content -Path ".vscode/tasks.json" -Value $taskJson

Write-Host "`n=== AI Attribution Prevention System Setup Complete! ===" -ForegroundColor Green
Write-Host "🔧 Automated Prevention Measures:" -ForegroundColor Yellow
Write-Host "   • Git configured for AI attribution" -ForegroundColor Cyan
Write-Host "   • Pre-commit hook to verify attribution" -ForegroundColor Cyan
Write-Host "   • Daily audit script for compliance" -ForegroundColor Cyan
Write-Host "   • VS Code tasks for quick checks" -ForegroundColor Cyan
Write-Host "   • Commit template with AI guidelines" -ForegroundColor Cyan
Write-Host "`n📋 Available Commands:" -ForegroundColor Yellow
Write-Host "   ./verify-ai-attribution.ps1      - Check current status" -ForegroundColor Cyan
Write-Host "   ./verify-ai-attribution.ps1 -Fix - Auto-fix attribution" -ForegroundColor Cyan
Write-Host "   ./daily-attribution-audit.ps1    - Run comprehensive audit" -ForegroundColor Cyan
Write-Host "`n🚀 VS Code Tasks:" -ForegroundColor Yellow
Write-Host "   • Check AI Attribution" -ForegroundColor Cyan
Write-Host "   • Fix AI Attribution" -ForegroundColor Cyan
Write-Host "   • Daily Attribution Audit" -ForegroundColor Cyan