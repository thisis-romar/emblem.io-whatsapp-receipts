# 🤖 AI Attribution Tools

[![PowerShell Gallery Version](https://img.shields.io/powershellgallery/v/AIAttributionTools?color=blue&logo=powershell)](https://www.powershellgallery.com/packages/AIAttributionTools)
[![PowerShell Gallery Downloads](https://img.shields.io/powershellgallery/dt/AIAttributionTools?color=green)](https://www.powershellgallery.com/packages/AIAttributionTools)
[![GitHub Release](https://img.shields.io/github/v/release/thisis-romar/emblem.io-whatsapp-receipts?include_prereleases&sort=semver)](https://github.com/thisis-romar/emblem.io-whatsapp-receipts/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Advanced AI-assisted commit detection and attribution management for GitHub development workflows.**

Perfect for teams using **VS Code Copilot**, **ChatGPT**, **Claude AI**, and other AI coding assistants who need **transparency** and **compliance** in their development processes.

---

## 🎯 **Why AI Attribution Tools?**

As AI-assisted development becomes mainstream, **proper attribution** is crucial for:

- ✅ **Compliance & Transparency** - Clear audit trails for AI assistance
- ✅ **Team Collaboration** - Understanding AI vs. human contributions  
- ✅ **Quality Assurance** - Tracking AI assistance patterns and effectiveness
- ✅ **Legal Protection** - Proper documentation for intellectual property
- ✅ **Workflow Optimization** - Analyzing AI development patterns

---

## 🚀 **Quick Installation**

### **Option 1: PowerShell Gallery (Recommended)**
```powershell
# Install for current user
Install-Module -Name AIAttributionTools -Scope CurrentUser

# Import and start using
Import-Module AIAttributionTools
Invoke-LLMCommitAnalysis
```

### **Option 2: VS Code Copilot Integration (Windows 11)**
```powershell
# One-click setup for VS Code + Copilot environments
irm https://raw.githubusercontent.com/thisis-romar/emblem.io-whatsapp-receipts/main/AIAttributionTools/Install-AIAttributionTools.ps1 | iex
```

### **Option 3: Manual Installation**
1. Download the [latest release](https://github.com/thisis-romar/emblem.io-whatsapp-receipts/releases)
2. Extract to `$env:USERPROFILE\Documents\PowerShell\Modules\AIAttributionTools`  
3. Import: `Import-Module AIAttributionTools`

---

## ⚡ **Quick Start**

### **Basic AI Commit Analysis**
```powershell
# Analyze recent commits for AI assistance
Invoke-LLMCommitAnalysis -Since "7 days ago"

# Quick alias for frequent use  
llm-analyze -ShowDetails

# Custom output location
ai-commits -OutputPath "my-analysis.json"
```

### **Advanced Pattern Detection**
```powershell
# Deep analysis with all AI models
Invoke-LLMCommitAnalysis -Since "1 month ago" -LLMModel "Claude AI" -ShowDetails

# Test specific commit patterns
Test-AICommitPattern -Commits $commits -ShowDetails

# Generate comprehensive reports
New-LLMReport -AnalysisResults $analysis -Format "HTML"
```

---

## 🧠 **AI Detection Capabilities**

### **Supported AI Models**
- 🤖 **GitHub Copilot** - VS Code, Cursor, other editors
- 💬 **ChatGPT / OpenAI** - GPT-3.5, GPT-4, GPT-4o series
- 🧠 **Claude AI** - Anthropic's Claude 3 Opus, Sonnet, Haiku
- ⚡ **Cursor AI** - AI-first code editor assistance
- 📝 **Tabnine** - AI code completion
- 🛠️ **Other Models** - CodeWhisperer, IntelliCode, Codeium, Sourcegraph Cody

### **Detection Algorithms**
- **Pattern Recognition**: Commit message analysis with 50+ AI indicators
- **Scoring System**: 0-11+ point scale for AI likelihood assessment
- **Contextual Analysis**: File change patterns, timing, and metadata
- **Conventional Commits**: Integration with standardized commit formats
- **Statistical Analysis**: Trend detection and reporting

---

## 📊 **Features Overview**

| Feature | Description | Command |
|---------|-------------|---------|  
| **🔍 Commit Analysis** | Detect AI-assisted commits with advanced scoring | `Invoke-LLMCommitAnalysis` |
| **📈 Statistical Reports** | Comprehensive AI usage statistics and trends | `New-LLMReport` |
| **🏷️ Attribution Correction** | Fix commit authors to reflect AI assistance | `Set-AICommitAuthor` |
| **💬 Chat History Analysis** | Correlate VS Code Copilot chats with commits | `Invoke-ChatHistoryAnalysis` |
| **⚙️ VS Code Integration** | Seamless integration with Copilot environments | `Install-AIAttributionEnvironment` |
| **🔧 Helper Functions** | Easy-to-use wrapper functions and aliases | `Get-Command -Module AIAttributionTools` |

---

## 📖 **Detailed Usage Examples**

### **Scenario 1: Weekly Team Review**
```powershell
# Generate weekly AI assistance report for team review
Invoke-LLMCommitAnalysis -Since "1 week ago" -OutputPath "weekly-ai-report.json"

# Display summary statistics
$report = Get-Content "weekly-ai-report.json" | ConvertFrom-Json  
Write-Host "AI Assistance: $($report.Report.Statistics.AIPercentage)%"
Write-Host "Total AI Commits: $($report.Report.Statistics.AIAssistedCommits)"
```

### **Scenario 2: Compliance Audit**
```powershell
# Comprehensive audit of AI usage across project
Invoke-LLMCommitAnalysis -Since "6 months ago" -SetAIAuthor -LLMModel "Compliance Audit"

# Export detailed report for legal review  
New-LLMReport -AnalysisResults $analysis -Format "CSV" -OutputPath "compliance-audit.csv"
```

### **Scenario 3: Development Workflow Analysis**
```powershell
# Analyze AI assistance patterns to optimize workflow
$analysis = Invoke-LLMCommitAnalysis -Since "3 months ago" -ShowDetails
$analysis.Report.TopAICommits | Export-Csv "top-ai-commits.csv"

# Identify most AI-assisted file types
$analysis.Report.AllCommits | Group-Object FileType | Sort-Object Count -Descending
```

---

## 🛠️ **Advanced Configuration**

### **Custom AI Model Detection**
```powershell
# Add custom AI model patterns
$customPatterns = @{
    "MyCustomAI" = @("custom-ai", "my-model", "custom-assist")
}

Invoke-LLMCommitAnalysis -CustomPatterns $customPatterns
```

### **VS Code Workspace Settings**
```json
{
    "ai-attribution.autoAnalyze": true,
    "ai-attribution.defaultTimeRange": "30 days ago", 
    "ai-attribution.showNotifications": true,
    "ai-attribution.customModels": ["MyCustomAI", "TeamAI"]
}
```

### **PowerShell Profile Integration**
```powershell
# Add to $PROFILE for automatic loading
if ($env:TERM_PROGRAM -eq "vscode") {
    Import-Module AIAttributionTools -ErrorAction SilentlyContinue
    Set-Alias -Name "ai" -Value "Invoke-LLMCommitAnalysis"
}
```

---

## 📚 **Documentation & Resources**

### **Core Documentation**
- 📖 [**API Reference**](./docs/API.md) - Complete function documentation
- 🎯 [**Examples**](./examples/) - Real-world usage scenarios  
- ⚙️ [**Configuration Guide**](./docs/Configuration.md) - Advanced setup options
- 🔧 [**VS Code Integration**](./docs/VSCode.md) - Copilot environment setup

### **Community Resources**  
- 💬 [**GitHub Discussions**](https://github.com/thisis-romar/emblem.io-whatsapp-receipts/discussions) - Community support
- 🐛 [**Issue Tracker**](https://github.com/thisis-romar/emblem.io-whatsapp-receipts/issues) - Bug reports & features
- 📺 [**Video Tutorials**](./docs/tutorials/) - Step-by-step guides
- 📝 [**Blog Posts**](./docs/blog/) - Best practices & case studies

---

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

### **Development Setup**
```powershell  
# Clone repository
git clone https://github.com/thisis-romar/emblem.io-whatsapp-receipts.git
cd emblem.io-whatsapp-receipts/AIAttributionTools

# Install development dependencies
Install-Module -Name Pester, PSScriptAnalyzer -Scope CurrentUser

# Run tests
Invoke-Pester ./Tests/
```

### **Contribution Guidelines**
- 🔧 **Code Quality**: All code must pass PSScriptAnalyzer checks
- ✅ **Testing**: New features require Pester tests (80%+ coverage)
- 📝 **Documentation**: Update README and inline documentation  
- 🚀 **Semantic Commits**: Use conventional commit format
- 🤖 **AI Attribution**: Please attribute AI assistance in commits!

---

## 📊 **Project Statistics**

| Metric | Value |
|--------|--------|
| **Functions** | 15+ PowerShell functions |
| **AI Models Supported** | 9+ major AI coding assistants |
| **Detection Patterns** | 50+ AI commit indicators |
| **Test Coverage** | 85%+ with Pester |  
| **Documentation** | 100% inline help |
| **Platforms** | Windows, macOS, Linux |

---

## 📜 **License & Attribution**

### **License**
This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

### **Third-Party Acknowledgments**
- **PowerShell Team** - Module structure and best practices
- **GitHub Copilot** - AI assistance in development (properly attributed!)  
- **VS Code Team** - Extension integration patterns
- **Community Contributors** - Testing, feedback, and improvements

### **Citation**
If you use AI Attribution Tools in academic or commercial projects:

```bibtex
@software{ai_attribution_tools,
  title = {AI Attribution Tools: Advanced AI-assisted commit detection},
  author = {Emblem.iO Team},
  year = {2025},
  url = {https://github.com/thisis-romar/emblem.io-whatsapp-receipts/tree/main/AIAttributionTools},
  version = {1.0.0}
}
```

---

## 🌟 **Support the Project**

### **Star the Repository**
If AI Attribution Tools helps your workflow, please ⭐ star the repository!

### **Share Your Experience**
- 📝 Write about your experience using AI Attribution Tools
- 💬 Share in [GitHub Discussions](https://github.com/thisis-romar/emblem.io-whatsapp-receipts/discussions)
- 🐦 Tweet about it with `#AIAttributionTools`
- 📺 Create tutorials or demos

### **Professional Support**  
For enterprise support, custom integrations, or consulting:
- 📧 Email: support@emblem.io
- 💼 LinkedIn: [Emblem.iO](https://linkedin.com/company/emblem-io)
- 🌐 Website: [emblem.io](https://emblem.io)

---

**Made with ❤️ by the Emblem.iO Team**  
*Promoting transparency in AI-assisted development*