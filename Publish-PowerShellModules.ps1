# =============================================================================
# PowerShell Gallery Publication Script
# Generated: 10/07/2025 14:25:48
# =============================================================================

# STEP 1: Set your PowerShell Gallery API Key
# Get your API key from: https://www.powershellgallery.com/account/apikeys
# $env:NUGET_API_KEY = 'your-api-key-here'

# STEP 2: Verify API Key is set
if (-not $env:NUGET_API_KEY) {
    Write-Error "Please set your NuGet API key: $env:NUGET_API_KEY = 'your-key'"
    exit 1
}

Write-Host "🚀 Publishing PowerShell Modules to Gallery..." -ForegroundColor Cyan

# =============================================================================
# MODULE 1: VSCode_GitHub_Copilot-Agent-LLMCommitAttribution-Tool v1.1.0
# Purpose: Replaces incorrect v1.0.0 with corrected metadata
# =============================================================================
Write-Host "
📦 Publishing VSCode_GitHub_Copilot-Agent-LLMCommitAttribution-Tool v1.1.0..." -ForegroundColor Yellow
try {
    Publish-Module -Path "h:\- emblem.iO -\VSCode_GitHub_Copilot-Agent-LLMCommitAttribution-Tool\VSCode_GitHub_Copilot-Agent-LLMCommitAttribution-Tool.psd1" -NuGetApiKey $env:NUGET_API_KEY -Repository PSGallery -Verbose
    Write-Host "✅ VSCode_GitHub_Copilot-Agent-LLMCommitAttribution-Tool published successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to publish VSCode_GitHub_Copilot-Agent-LLMCommitAttribution-Tool: $($_.Exception.Message)" -ForegroundColor Red
}

# =============================================================================  
# MODULE 2: ChatAnalysisTools v1.0.0
# Purpose: New module for VS Code chat history analysis
# =============================================================================
Write-Host "
📦 Publishing ChatAnalysisTools v1.0.0..." -ForegroundColor Yellow
try {
    Publish-Module -Path "h:\- emblem.iO -\chat-analysis-tools\ChatAnalysisTools.psd1" -NuGetApiKey $env:NUGET_API_KEY -Repository PSGallery -Verbose
    Write-Host "✅ ChatAnalysisTools published successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to publish ChatAnalysisTools: $($_.Exception.Message)" -ForegroundColor Red
}

# =============================================================================
# MODULE 3: DeveloperEnvironmentTools v1.0.0  
# Purpose: New module for development environment automation
# =============================================================================
Write-Host "
📦 Publishing DeveloperEnvironmentTools v1.0.0..." -ForegroundColor Yellow
try {
    Publish-Module -Path "h:\- emblem.iO -\developer-environment-tools\DeveloperEnvironmentTools.psd1" -NuGetApiKey $env:NUGET_API_KEY -Repository PSGallery -Verbose
    Write-Host "✅ DeveloperEnvironmentTools published successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to publish DeveloperEnvironmentTools: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "
🎉 Publication process completed!" -ForegroundColor Cyan
Write-Host "Check your modules at: https://www.powershellgallery.com/profiles/romar-j" -ForegroundColor Green
