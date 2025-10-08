# 🔄 AI Attribution Tools - MIGRATED

## ⚠️ Important Notice: Module Migrated

**AI Attribution Tools** has been **migrated to its own dedicated repository** and is now published on PowerShell Gallery for community use across all VS Code workspaces.

[![PowerShell Gallery Version](https://img.shields.io/powershellgallery/v/AIAttributionTools?color=blue&logo=powershell)](https://www.powershellgallery.com/packages/AIAttributionTools)
[![PowerShell Gallery Downloads](https://img.shields.io/powershellgallery/dt/AIAttributionTools?color=green)](https://www.powershellgallery.com/packages/AIAttributionTools)
[![GitHub Release](https://img.shields.io/github/v/release/thisis-romar/ai-attribution-tools?include_prereleases&sort=semver)](https://github.com/thisis-romar/ai-attribution-tools/releases)

---

## 🚀 **Current Installation (Use This)**

### **PowerShell Gallery (Recommended)**
```powershell
# Install from PowerShell Gallery
Install-Module -Name AIAttributionTools -Scope CurrentUser

# Use across ALL your VS Code workspaces
Invoke-LLMCommitAnalysis -ShowDetails
```

### **Dedicated Repository**
- **GitHub**: [AI Attribution Tools](https://github.com/thisis-romar/ai-attribution-tools)
- **PowerShell Gallery**: [AIAttributionTools](https://www.powershellgallery.com/packages/AIAttributionTools)
- **Documentation**: Complete usage guides in the dedicated repository

---

## 📋 **Migration Benefits**

- ✅ **Universal Tool**: Works across ALL your VS Code Copilot workspaces
- ✅ **Community Access**: Available to developers across multiple projects
- ✅ **Professional Distribution**: Published on PowerShell Gallery
- ✅ **Dedicated Support**: Focused repository with comprehensive documentation
- ✅ **Independent Versioning**: Proper semantic versioning and releases

---

## � **This WhatsApp Project**

This directory contains **legacy development files** from when AI Attribution Tools was part of the WhatsApp receipts processing project. 

**For current usage**, use the PowerShell Gallery installation above which works across all your development projects.
irm https://raw.githubusercontent.com/thisis-romar/ai-attribution-tools/main/Install-AIAttributionTools.ps1 | iex
```

### **Option 3: Manual Installation**
1. Download the [latest release](https://github.com/thisis-romar/ai-attribution-tools/releases)
2. Extract to `$env:USERPROFILE\Documents\PowerShell\Modules\AIAttributionTools`  
3. Import: `Import-Module AIAttributionTools`

---

## 📊 **Key Features**

### **🔍 AI Detection Engine**
- **Advanced Scoring**: 0-11+ point scale for AI likelihood assessment
- **Pattern Recognition**: 50+ AI commit indicators
- **Multi-AI Support**: GitHub Copilot, ChatGPT, Claude, Cursor, Tabnine, CodeWhisperer
- **Statistical Analysis**: Comprehensive reporting and trend detection

### **⚙️ Development Integration**
- **Zero API Costs**: All analysis runs locally
- **Privacy First**: No data transmission or cloud dependencies  
- **Conventional Commits**: Integration with standardized commit formats
- **Git Integration**: Automated commit author correction and attribution

### **🎯 Enterprise Ready**
- **CI/CD Integration**: GitHub Actions, Azure DevOps, Jenkins support
- **Team Analytics**: Multi-repository analysis capabilities
- **Compliance Reporting**: Audit trails and documentation generation
- **Custom Configuration**: Flexible scoring thresholds and patterns

---

## �� **Basic Usage**

### **Analyze Repository Commits**
```powershell
# Basic analysis of last 30 days
Invoke-LLMCommitAnalysis

# Detailed analysis with individual commit breakdown
Invoke-LLMCommitAnalysis -ShowDetails -Since "7 days ago"

# Focus on specific repository
Invoke-LLMCommitAnalysis -Repository "C:\MyProject" -ShowDetails
```

### **Example Output**
```
=== AI Attribution Analysis Results ===
Total Commits Analyzed: 47
AI-Likely Commits: 12
AI Usage Percentage: 25.5%
Average AI Score: 3.2
Highest Score Found: 9

Top AI-Likely Commits:
- a1b2c3d: "Implement comprehensive error handling" (Score: 9)
- e4f5g6h: "Add advanced logging capabilities" (Score: 8)  
- i7j8k9l: "Refactor data processing pipeline" (Score: 7)
```

---

## 📚 **Documentation**

- **[API Reference](docs/API.md)** - Complete function documentation
- **[Configuration Guide](docs/Configuration.md)** - Advanced setup and customization
- **[Usage Examples](examples/)** - Real-world integration scenarios
- **[GitHub Actions Integration](examples/ci-cd-integration.ps1)** - CI/CD pipeline examples

---

## 🚀 **Advanced Examples**

### **GitHub Actions Integration**
```yaml
name: AI Attribution Analysis
on: [push, pull_request]
jobs:
  ai-analysis:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v3
    - name: Analyze AI Usage
      shell: pwsh
      run: |
        Install-Module AIAttributionTools -Force -Scope CurrentUser
        $analysis = Invoke-LLMCommitAnalysis -Since "1 day ago"
        Write-Host "AI Usage: $($analysis.AIPercentage)%"
```

### **Team Dashboard Script**
```powershell
# Weekly team analysis
$repos = @("ProjectA", "ProjectB", "ProjectC")
$teamReport = @()

foreach ($repo in $repos) {
    $analysis = Invoke-LLMCommitAnalysis -Repository $repo -Since "7 days ago"
    $teamReport += [PSCustomObject]@{
        Repository = $repo
        AIPercentage = $analysis.AIPercentage
        TotalCommits = $analysis.TotalCommits
    }
}

$teamReport | Format-Table -AutoSize
```

---

## 🛠️ **System Requirements**

- **PowerShell**: 5.1+ (Windows PowerShell) or 7+ (PowerShell Core)
- **Git**: Any recent version for repository analysis
- **Platform**: Windows 10/11, macOS, Linux (PowerShell Core)
- **Memory**: Minimal footprint, suitable for large repositories

---

## 🤝 **Community & Support**

### **Contributing**
We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **Issues & Feature Requests**
Report bugs and request features on our [GitHub Issues](https://github.com/thisis-romar/ai-attribution-tools/issues) page.

### **Discussions**
Join community discussions in [GitHub Discussions](https://github.com/thisis-romar/ai-attribution-tools/discussions).

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏢 **Enterprise & Commercial Use**

AI Attribution Tools is **completely free** for commercial and enterprise use under the MIT License. Perfect for:

- **Individual Developers** - Personal project transparency
- **Development Teams** - Team collaboration and compliance  
- **Enterprise Organizations** - Large-scale AI development governance
- **Open Source Projects** - Community contribution transparency

---

## 🔗 **Related Projects**

This tool was originally developed as part of a larger WhatsApp receipts processing system but has been separated into its own dedicated repository for broader community use and better focus.

**Happy coding with AI attribution transparency! 🤖✨**
