# 🚀 Manual PowerShell Gallery Module Publisher
# Secure manual publishing script for ChatAnalysisTools and DeveloperEnvironmentTools

param(
    [string[]]$ModulesToPublish = @("ChatAnalysisTools", "DeveloperEnvironmentTools"),
    [switch]$WhatIf = $false
)

Write-Host "🔐 Manual PowerShell Gallery Publisher" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if modules exist
$ModulesPath = ".\modules"
if (-not (Test-Path $ModulesPath)) {
    Write-Error "Modules directory not found: $ModulesPath"
    exit 1
}

foreach ($ModuleName in $ModulesToPublish) {
    $ModulePath = Join-Path $ModulesPath $ModuleName
    if (-not (Test-Path $ModulePath)) {
        Write-Warning "Module not found: $ModulePath"
        continue
    }
    
    $ManifestPath = Join-Path $ModulePath "$ModuleName.psd1"
    if (-not (Test-Path $ManifestPath)) {
        Write-Warning "Module manifest not found: $ManifestPath"
        continue
    }
    
    Write-Host "✅ Found module: $ModuleName" -ForegroundColor Green
}

# Prompt for API key securely
Write-Host "`n🔑 Please enter your PowerShell Gallery API Key:" -ForegroundColor Yellow
Write-Host "   (Key will be hidden for security)" -ForegroundColor Gray
$ApiKey = Read-Host -AsSecureString

# Convert secure string for use
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($ApiKey)
$PlainApiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

if ([string]::IsNullOrWhiteSpace($PlainApiKey)) {
    Write-Error "No API key provided. Publishing cancelled."
    exit 1
}

Write-Host "`n🚀 Starting publication process..." -ForegroundColor Cyan

foreach ($ModuleName in $ModulesToPublish) {
    $ModulePath = Join-Path $ModulesPath $ModuleName
    if (-not (Test-Path $ModulePath)) {
        continue
    }
    
    Write-Host "`n📦 Publishing $ModuleName..." -ForegroundColor Yellow
    
    try {
        if ($WhatIf) {
            Write-Host "   [WHAT-IF] Would publish: $ModulePath" -ForegroundColor Magenta
        } else {
            Publish-Module -Path $ModulePath -NuGetApiKey $PlainApiKey -Verbose -Force
            Write-Host "✅ Successfully published $ModuleName" -ForegroundColor Green
        }
    }
    catch {
        Write-Error "❌ Failed to publish ${ModuleName}: $($_.Exception.Message)"
    }
}

# Clear the API key from memory
$PlainApiKey = $null
[System.GC]::Collect()

Write-Host "`n🎉 Publication process completed!" -ForegroundColor Green
Write-Host "Check your modules at: https://www.powershellgallery.com/profiles/romar-j" -ForegroundColor Cyan

# Verify publications
Write-Host "`n🔍 Verifying publications..." -ForegroundColor Cyan
foreach ($ModuleName in $ModulesToPublish) {
    $Url = "https://www.powershellgallery.com/packages/$ModuleName"
    Write-Host "   ${ModuleName}: $Url" -ForegroundColor Gray
}