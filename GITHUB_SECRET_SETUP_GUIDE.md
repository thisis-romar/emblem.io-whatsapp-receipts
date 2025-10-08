# 🔑 PowerShell Gallery API Key Configuration Guide
## GitHub Repository Secret Setup for Automated Publishing

**Repository**: `thisis-romar/emblem.io-whatsapp-receipts`  
**Date**: October 7, 2025  
**Purpose**: Enable automated PowerShell module publishing via GitHub Actions

---

## ⚡ QUICK SETUP CHECKLIST

### ☐ **Step 1: Get PowerShell Gallery API Key**
1. Visit: https://www.powershellgallery.com
2. Sign in with Microsoft account
3. Click username → "Manage My API Keys"
4. Create new key:
   - **Name**: `GitHub Actions Automation`
   - **Scope**: `Push new packages and package versions`
   - **Duration**: 1 year (recommended)
5. **Copy key immediately** (shown only once!)

### ☐ **Step 2: Configure GitHub Repository Secret**
1. Navigate to: https://github.com/thisis-romar/emblem.io-whatsapp-receipts/settings/secrets/actions
2. Click: **"New repository secret"**
3. Configure:
   ```
   Name: POWERSHELL_GALLERY_API_KEY
   Value: [Paste your PowerShell Gallery API key]
   ```
4. Click: **"Add secret"**

### ☐ **Step 3: Test Configuration (Safe Mode)**
1. Go to: https://github.com/thisis-romar/emblem.io-whatsapp-receipts/actions
2. Find: **"PowerShell Modules Publisher"** workflow
3. Click: **"Run workflow"**
4. Select:
   - **Branch**: `main`
   - **Environment**: `test` ⚠️ **IMPORTANT: Use 'test' first!**
5. Click: **"Run workflow"**
6. Monitor execution for success ✅

### ☐ **Step 4: Production Publishing**
1. After test succeeds, return to Actions
2. Run workflow again with:
   - **Branch**: `main`
   - **Environment**: `production` 🎯 **Publishes to PowerShell Gallery**
3. Monitor execution and verify modules appear on PowerShell Gallery

---

## 🎯 **MODULES TO BE PUBLISHED**

| Module | Status | Purpose |
|--------|--------|---------|
| **AIAttributionTools** | ✅ Published v1.1.0 | AI commit attribution analysis |
| **ChatAnalysisTools** | ❌ Failed manual (404) | VS Code chat history analysis |
| **DeveloperEnvironmentTools** | ❓ Unknown status | Development environment automation |

**Goal**: Resolve failed publications via automated GitHub Actions workflow

---

## 🔧 **TROUBLESHOOTING**

### **Secret Configuration Issues:**
- ❌ **Wrong Name**: Must be exactly `POWERSHELL_GALLERY_API_KEY` (case-sensitive)
- ❌ **Invalid Key**: Copy API key without spaces or line breaks
- ❌ **Wrong Scope**: API key must have "Push" permissions
- ❌ **Expired Key**: Check expiration date in PowerShell Gallery

### **Workflow Execution Issues:**
- 🔍 **Check Logs**: Click on failed workflow run for detailed errors
- 🔍 **Validate Modules**: Ensure all modules pass Test-ModuleManifest
- 🔍 **Network Issues**: Temporary PowerShell Gallery connectivity problems

### **Publication Verification:**
- ✅ **Search**: https://www.powershellgallery.com/packages
- ✅ **Test Install**: `Install-Module ChatAnalysisTools`
- ✅ **Version Check**: Verify version numbers match expectations

---

## 📋 **DIRECT LINKS**

### **GitHub Repository:**
- **Settings**: https://github.com/thisis-romar/emblem.io-whatsapp-receipts/settings
- **Secrets**: https://github.com/thisis-romar/emblem.io-whatsapp-receipts/settings/secrets/actions
- **Actions**: https://github.com/thisis-romar/emblem.io-whatsapp-receipts/actions

### **PowerShell Gallery:**
- **Homepage**: https://www.powershellgallery.com
- **API Keys**: https://www.powershellgallery.com/account/apikeys
- **Your Modules**: https://www.powershellgallery.com/profiles/romar-j

---

## 🔒 **SECURITY BEST PRACTICES**

### **API Key Security:**
- ✅ Never commit API keys to version control
- ✅ Use GitHub Secrets for secure storage
- ✅ Set appropriate expiration dates
- ✅ Rotate keys periodically
- ✅ Monitor usage in PowerShell Gallery dashboard

### **Workflow Security:**
- ✅ Test environment prevents accidental publishing
- ✅ Production environment requires manual approval
- ✅ Matrix strategy isolates module processing
- ✅ Comprehensive logging for audit trail

---

## 🎉 **SUCCESS CONFIRMATION**

### **Completed Setup Indicators:**
1. ✅ Secret `POWERSHELL_GALLERY_API_KEY` visible in repository settings
2. ✅ Test workflow run completes successfully
3. ✅ Production workflow publishes modules without errors
4. ✅ ChatAnalysisTools appears on PowerShell Gallery
5. ✅ DeveloperEnvironmentTools appears on PowerShell Gallery
6. ✅ Install commands work: `Install-Module ChatAnalysisTools`

### **Maintenance:**
- 🔄 **Regular**: Monitor API key expiration
- 🔄 **As Needed**: Update workflow for new modules
- 🔄 **Monthly**: Review publication logs and success rates

---

**Status**: 🟢 **READY FOR CONFIGURATION**  
**Next Action**: Configure `POWERSHELL_GALLERY_API_KEY` secret in GitHub repository