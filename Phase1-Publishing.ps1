# Phase 1: Emergency PowerShell Module Publishing
# Enhanced script with comprehensive error handling

Write-Host "🚀 Phase 1: Emergency PowerShell Module Publishing" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Step 1: Validate modules
Write-Host "
📋 Step 1: Validating Module Manifests..." -ForegroundColor Yellow

$modules = @("ChatAnalysisTools", "DeveloperEnvironmentTools", "AIAttributionTools")
foreach ($module in $modules) {
    $manifestPath = ".\modules\$module\$module.psd1"
    if (Test-Path $manifestPath) {
        try {
            $manifest = Test-ModuleManifest -Path $manifestPath
            Write-Host "✅ $module v$($manifest.Version) - Valid" -ForegroundColor Green
        } catch {
            Write-Host "❌ $module - Invalid manifest: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ $module - Manifest not found" -ForegroundColor Red
    }
}

Write-Host "
🔑 Step 2: API Key Required" -ForegroundColor Yellow
Write-Host "Please ensure you have a valid PowerShell Gallery API key with 'Push' permissions."
Write-Host "Visit: https://www.powershellgallery.com/account/apikeys"
Write-Host ""
Write-Host "Ready to proceed with publishing? (Y/N): " -NoNewline -ForegroundColor Cyan

