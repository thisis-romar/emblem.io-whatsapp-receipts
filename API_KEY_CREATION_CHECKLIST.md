# 🔑 API Key Creation Checklist
## PowerShell Gallery New Key Setup

**Date**: October 7, 2025  
**Purpose**: Create new API key for GitHub Actions automated publishing

---

## ✅ **STEP-BY-STEP CHECKLIST**

### **✅ Step 1: Clean Up Existing Keys** ✅ **COMPLETED**
- [x] Go to PowerShell Gallery API Keys page (opened in browser)
- [x] Delete BOTH existing "AIAttributionTools-Publishing-Key" keys  
- [x] Clean slate achieved - ready for new key creation

### **🔄 Step 2: Create New API Key** ⚡ **IN PROGRESS**
- [ ] Fill in the **EXACT** form values:
  ```
  Key Name: GitHub-Actions-PowerShell-2025 ✅ (already entered)
  Expires In: 365 days ✅ (already selected)
  Scopes: ✅ Push new packages and package versions (already selected)
  ```
- [ ] **CRITICAL**: In "Glob Pattern" field, enter: **\***
  - ⚠️ **IMPORTANT**: Do NOT check "AIAttributionTools" in Available Packages
  - ⚠️ **REASON**: Available Packages only shows published modules (missing ChatAnalysisTools & DeveloperEnvironmentTools)
  - ✅ **SOLUTION**: Glob pattern "\*" covers ALL packages (current + future)
- [ ] Click **"Create"** button
- [ ] 🚨 **IMMEDIATELY** copy the key value (shown only once!)

### **☐ Step 3: IMMEDIATELY Copy Key Value**
⚠️ **CRITICAL**: Key shown only once!
- [ ] Copy the entire key value (long string of letters/numbers)
- [ ] Save in secure location (password manager recommended)
- [ ] Do NOT close the page until key is safely stored

### **✅ Step 4: Configure GitHub Secret** ✅ **COMPLETED**
- [x] Go to: <https://github.com/thisis-romar/emblem.io-whatsapp-receipts/settings/secrets/actions>
- [x] Click **"New repository secret"**
- [x] Enter details:
  ```
  Name: POWERSHELL_GALLERY_API_KEY ✅ (configured 2 minutes ago)
  Value: [API key successfully stored]
  ```
- [x] Click **"Add secret"**

### **🔄 Step 5: Test Configuration** ⚡ **CURRENT PHASE**
- [ ] Go to GitHub Actions tab
- [ ] Run "PowerShell Modules Publisher" workflow
- [ ] Environment: **test** (safe testing)
- [ ] Verify workflow completes successfully

---

## 🎯 **SUCCESS INDICATORS**

### **PowerShell Gallery:**
- ✅ One clean API key named "GitHub-Actions-Publishing-Primary"
- ✅ Key has "Push new packages and package versions" scope
- ✅ Key value safely stored

### **GitHub Repository:**
- ✅ Secret "POWERSHELL_GALLERY_API_KEY" appears in settings
- ✅ Test workflow run completes without authentication errors
- ✅ Ready for production publishing

---

## 🚨 **IMPORTANT REMINDERS**

1. **Security**: Never share or commit API key values
2. **One-Time Display**: Key value shown only during creation
3. **Backup**: Keep key value in secure password manager
4. **Testing**: Always test with "test" environment first
5. **Expiration**: Set calendar reminder for key renewal (1 year)

---

**Status**: � **READY FOR WORKFLOW TESTING**  
**Next**: Test automated publishing workflow in GitHub Actions  
**Progress**: 80% Complete - Final testing phase!
