# PowerShell Module to NuGet Package Converter
# Creates .nupkg files for manual upload to PowerShell Gallery

param(
    [string[]]$ModuleNames = @("ChatAnalysisTools", "DeveloperEnvironmentTools", "AIAttributionTools")
)

Write-Host "🚀 Creating NuGet Packages for Manual Upload" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$OutputDir = ".\manual-upload-packages"
$NuGetExe = "${env:LOCALAPPDATA}\Microsoft\Windows\PowerShell\PowerShellGet\NuGet.exe"

# Ensure output directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

foreach ($ModuleName in $ModuleNames) {
    Write-Host "`n📦 Processing $ModuleName..." -ForegroundColor Cyan
    
    $ModulePath = ".\modules\$ModuleName"
    $ManifestPath = "$ModulePath\$ModuleName.psd1"
    
    if (-not (Test-Path $ManifestPath)) {
        Write-Host "❌ Manifest not found: $ManifestPath" -ForegroundColor Red
        continue
    }
    
    try {
        # Test manifest
        $Manifest = Test-ModuleManifest -Path $ManifestPath
        Write-Host "✅ $ModuleName v$($Manifest.Version) - Manifest valid" -ForegroundColor Green
        
        # Create a working directory for this module
        $WorkDir = Join-Path $OutputDir "$ModuleName-temp"
        if (Test-Path $WorkDir) {
            Remove-Item $WorkDir -Recurse -Force
        }
        New-Item -ItemType Directory -Path $WorkDir -Force | Out-Null
        
        # Copy module files to working directory
        Copy-Item "$ModulePath\*" -Destination $WorkDir -Recurse -Force
        
        # Create .nuspec file
        $NuspecContent = @"
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2013/05/nuspec.xsd">
  <metadata>
    <id>$($Manifest.Name)</id>
    <version>$($Manifest.Version)</version>
    <authors>$($Manifest.Author)</authors>
    <description>$($Manifest.Description)</description>
    <projectUrl>https://github.com/thisis-romar/emblem.io-whatsapp-receipts</projectUrl>
    <tags>PowerShell Module $($Manifest.Tags -join ' ')</tags>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
  </metadata>
  <files>
    <file src="**" target="." />
  </files>
</package>
"@
        
        $NuspecPath = Join-Path $WorkDir "$ModuleName.nuspec"
        $NuspecContent | Out-File -FilePath $NuspecPath -Encoding UTF8
        
        # Create package using NuGet.exe
        $PackageArgs = @(
            "pack"
            "`"$NuspecPath`""
            "-OutputDirectory"
            "`"$OutputDir`""
            "-NonInteractive"
        )
        
        Write-Host "🔧 Creating NuGet package..." -ForegroundColor Yellow
        & $NuGetExe $PackageArgs
        
        # Clean up temp directory
        Remove-Item $WorkDir -Recurse -Force
        
        $ExpectedPackage = Join-Path $OutputDir "$ModuleName.$($Manifest.Version).nupkg"
        if (Test-Path $ExpectedPackage) {
            Write-Host "✅ Package created: $ModuleName.$($Manifest.Version).nupkg" -ForegroundColor Green
        } else {
            Write-Host "❌ Package creation failed for $ModuleName" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "❌ Error processing $ModuleName`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Package creation complete!" -ForegroundColor Green
Write-Host "📁 Check the manual-upload-packages folder for .nupkg files" -ForegroundColor Cyan
Get-ChildItem -Path $OutputDir -Filter "*.nupkg" | Select-Object Name, Length