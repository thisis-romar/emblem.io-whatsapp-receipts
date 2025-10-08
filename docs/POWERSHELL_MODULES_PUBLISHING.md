# 🚀 PowerShell Modules Automated Publishing System

This repository contains an automated publishing system for PowerShell modules to the PowerShell Gallery using GitHub Actions.

## 📦 Published Modules

### 1. AIAttributionTools
- **Description**: AI commit attribution analysis for VS Code/GitHub Copilot environments
- **PowerShell Gallery**: https://www.powershellgallery.com/packages/AIAttributionTools
- **Installation**: `Install-Module AIAttributionTools`

### 2. ChatAnalysisTools  
- **Description**: VS Code chat history analysis and developer workflow correlation
- **PowerShell Gallery**: https://www.powershellgallery.com/packages/ChatAnalysisTools
- **Installation**: `Install-Module ChatAnalysisTools`

### 3. DeveloperEnvironmentTools
- **Description**: Development environment automation and git workflow configuration
- **PowerShell Gallery**: https://www.powershellgallery.com/packages/DeveloperEnvironmentTools
- **Installation**: `Install-Module DeveloperEnvironmentTools`

## 🛠️ Repository Structure

```
emblem.io-whatsapp-receipts/
├── .github/
│   └── workflows/
│       └── powershell-modules-publisher.yml   # Main publishing workflow
├── modules/
│   ├── AIAttributionTools/
│   │   ├── AIAttributionTools.psd1            # Module manifest
│   │   ├── AIAttributionTools.psm1            # Module script
│   │   └── ...                                # Additional module files
│   ├── ChatAnalysisTools/
│   │   ├── ChatAnalysisTools.psd1
│   │   ├── ChatAnalysisTools.psm1
│   │   └── ...
│   └── DeveloperEnvironmentTools/
│       ├── DeveloperEnvironmentTools.psd1
│       ├── DeveloperEnvironmentTools.psm1
│       └── ...
└── docs/
    └── POWERSHELL_MODULES_PUBLISHING.md       # This file
```

## 🚀 Publishing Methods

### 1. Manual Publishing (Recommended for Testing)

1. **Go to GitHub Actions**: Navigate to the "Actions" tab in your repository
2. **Select Workflow**: Click on "📦 PowerShell Modules Publisher"
3. **Run Workflow**: Click "Run workflow" button
4. **Configure Options**:
   - **Modules to publish**: Choose specific modules or "all"
   - **Force publish**: Override existing versions if needed  
   - **Environment**: Select "production" for actual publishing or "test" for validation

### 2. Automatic Publishing (Production)

The workflow automatically triggers on:

- **Push to main branch**: Publishes only modules that changed
- **Release creation**: Publishes all modules with release version
- **Pull requests**: Validates modules without publishing

### 3. Module-Specific Publishing

To publish only specific modules:
- Set `modules_to_publish` to comma-separated list: `AIAttributionTools,ChatAnalysisTools`
- Or modify files only in the target module's directory

## 🔧 Setup Requirements

### 1. PowerShell Gallery API Key

**Required Secret**: `POWERSHELL_GALLERY_API_KEY`

**Setup Steps**:
1. Go to [PowerShell Gallery API Keys](https://www.powershellgallery.com/account/apikeys)
2. Create new API key with "Push new packages and package versions" permission
3. Set glob pattern to `*` (allows all modules)
4. Copy the API key value
5. In GitHub: Repository Settings → Secrets and Variables → Actions → New Repository Secret
6. Name: `POWERSHELL_GALLERY_API_KEY`, Value: [your API key]

### 2. Module Requirements

Each module must have:
- **Valid `.psd1` manifest** with correct metadata
- **Proper version numbering** (semantic versioning recommended)
- **Correct author and company information**:
  - Author: `romar-j`
  - CompanyName: `emblem-projects-inc`
- **All required files** referenced in the manifest

## 📋 Workflow Features

### ✅ Validation Pipeline
- Module manifest validation
- Import testing  
- Function export verification
- Dependency checking

### 🔍 Smart Publishing
- **Version conflict detection**: Prevents accidental overwrites
- **Change detection**: Only publishes modified modules
- **Force publish option**: Override version conflicts when needed
- **Comprehensive logging**: Detailed output for troubleshooting

### 🎯 Matrix Strategy
- **Parallel processing**: All modules processed simultaneously
- **Individual status**: Each module succeeds/fails independently
- **Scalable architecture**: Easy to add new modules

### 📊 Reporting
- **Publication summary**: Overview of all operations
- **Individual module reports**: Detailed status for each module
- **PowerShell Gallery links**: Direct links to published modules
- **Installation commands**: Ready-to-use `Install-Module` commands

## 🔄 Version Management

### Automatic Versioning
The workflow uses the version specified in each module's `.psd1` manifest file.

### Version Updates
To release a new version:
1. Update the `ModuleVersion` in the module's `.psd1` file
2. Commit and push changes
3. The workflow will automatically detect and publish the new version

### Manual Version Override
Use the "Force publish" option to republish the same version (useful for metadata fixes).

## 🧪 Testing Workflow

### Local Testing
Before pushing changes:
```powershell
# Test module manifest
Test-ModuleManifest "modules/YourModule/YourModule.psd1"

# Test module import
Import-Module "modules/YourModule/YourModule.psd1" -Force

# List exported functions
Get-Command -Module YourModule
```

### GitHub Actions Testing
1. Create a pull request with your changes
2. The workflow will automatically validate modules without publishing
3. Check the Actions tab for validation results

### Manual Workflow Testing
1. Use "Run workflow" with environment set to "test"
2. This validates modules without actually publishing to PowerShell Gallery

## 📈 Monitoring and Troubleshooting

### GitHub Actions Logs
- Navigate to Actions → PowerShell Modules Publisher → [Latest Run]
- Check individual job logs for detailed output
- Look for validation errors, publishing failures, or network issues

### Common Issues

**1. API Key Issues**
- Error: "PowerShell Gallery API Key not found"
- Solution: Verify `POWERSHELL_GALLERY_API_KEY` secret is set correctly

**2. Version Conflicts**
- Error: "Version X.Y.Z already exists"
- Solution: Update module version or use force publish option

**3. Manifest Validation Failures**
- Error: Module manifest validation failed
- Solution: Run `Test-ModuleManifest` locally to identify issues

**4. Import Failures**
- Error: Module import failed  
- Solution: Check for syntax errors, missing dependencies, or incorrect file paths

## 🔗 Useful Links

- **PowerShell Gallery Profile**: https://www.powershellgallery.com/profiles/romar-j
- **GitHub Repository**: https://github.com/thisis-romar/emblem.io-whatsapp-receipts
- **GitHub Actions**: https://github.com/thisis-romar/emblem.io-whatsapp-receipts/actions
- **PowerShell Gallery API Keys**: https://www.powershellgallery.com/account/apikeys

## 📞 Support

For issues with:
- **Module functionality**: Create an issue in this repository
- **Publishing workflow**: Check GitHub Actions logs and this documentation
- **PowerShell Gallery**: Contact PowerShell Gallery support

---

**Last Updated**: October 7, 2025  
**System Status**: ✅ Fully Operational