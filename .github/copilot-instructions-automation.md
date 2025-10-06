# GitHub Copilot Instructions for AI Attribution Automation

## Project Overview
This WhatsApp receipts processing system has automated AI attribution tools that ensure proper credit for AI-assisted commits. The automation runs at multiple stages of development to maintain accurate commit authorship.

## AI Attribution Workflow

### Automatic Execution Points
- **Pre-commit**: Quick AI detection before commits
- **Post-commit**: Comprehensive analysis and correction  
- **GitHub Actions**: Cloud-based validation and correction
- **Weekly Audit**: Comprehensive attribution review

### Tools Integration
The following PowerShell tools run automatically:
- `LLMCommitIdentifier.ps1`: Detects AI assistance in commits (0-11+ scoring)
- `ChatHistoryParser.ps1`: Correlates VS Code chat with git commits  
- `CommitAttributionCorrector.ps1`: Applies proper AI attribution
- `ChatAnalysisHelpers.ps1`: Provides convenient wrapper functions

## Developer Guidelines

### Working with AI Attribution
When GitHub Copilot assists with your code:
1. **Commit normally** - automation handles attribution detection
2. **Review suggestions** from pre-commit hooks about AI assistance levels
3. **Trust the process** - post-commit hooks will correct attribution automatically
4. **Check GitHub Actions** for cloud-based validation and corrections

### Commit Message Best Practices
- Use clear, descriptive commit messages
- Include context about significant AI assistance when known
- Follow conventional commit format: `type(scope): description`
- Add `[ai-assisted]` tag for major AI contributions (optional - automation will detect)

### AI Assistance Levels
The automation recognizes different levels of AI involvement:
- **Score 0-3**: Minimal/no AI assistance  
- **Score 4-6**: Moderate AI assistance (documentation, simple fixes)
- **Score 7-10**: Significant AI assistance (major code generation)
- **Score 11+**: Extensive AI assistance (major features, complex logic)

## Automation Configuration

### Pre-commit Hooks
Configured in `.pre-commit-config.yaml`:
- Quick AI analysis (< 30 seconds)
- Code quality checks
- PowerShell syntax validation
- Large file detection

### GitHub Actions Workflows  
Located in `.github/workflows/ai-attribution.yml`:
- Runs on push and pull requests
- Comprehensive AI analysis
- Automatic attribution correction
- Weekly audit reports
- Security validation

### Git Hooks
- `pre-commit.ps1`: Fast local validation
- `post-commit.ps1`: Detailed analysis and correction
- Integrated with VS Code workflow

## Installation and Setup

### Automatic Setup
Run the setup script to configure automation:
```powershell
./setup-automation.ps1
```

### Manual Installation
1. Install pre-commit: `pip install pre-commit`
2. Install hooks: `pre-commit install`
3. Configure PowerShell execution policy
4. Set up GitHub Actions secrets

### VS Code Integration
The workspace is configured for:
- Automatic hook installation
- PowerShell script execution  
- GitHub Copilot integration
- Seamless development workflow

## Troubleshooting

### Common Issues
- **Hook failures**: Use `git commit --no-verify` to bypass temporarily
- **PowerShell execution**: Ensure execution policy allows script running
- **GitHub Actions**: Check workflow logs for detailed error information
- **Attribution errors**: Run `./tools/CommitAttributionCorrector.ps1 -DryRun` to preview

### Manual Commands
- Analyze commits: `./tools/LLMCommitIdentifier.ps1 -ShowDetails`
- Correct attribution: `./tools/CommitAttributionCorrector.ps1 -AutoApply`  
- Parse chat history: `./tools/ChatHistoryParser.ps1 -ShowDetails`
- Generate report: `./tools/ChatAnalysisHelpers.ps1 -GenerateReport`

### Performance Tips
- Pre-commit hooks are optimized for speed (< 30 seconds)
- Heavy analysis runs in background via GitHub Actions
- Use `--no-verify` flag sparingly to maintain attribution accuracy
- Weekly audits ensure comprehensive coverage

## Security Considerations

### Safe Practices
- All scripts validate inputs and avoid code injection
- GitHub secrets protect sensitive tokens
- Minimal permissions for automation workflows  
- Audit logs track all attribution changes

### Privacy Protection
- No sensitive code is transmitted to external services
- Chat history analysis stays local
- Attribution corrections maintain original commit content
- Full transparency in automation actions

## Monitoring and Maintenance

### Automated Monitoring
- GitHub Actions provide detailed logs
- Weekly audit reports track attribution accuracy
- Failed automations generate alerts
- Performance metrics monitor hook execution time

### Regular Maintenance
- Review weekly audit reports
- Update attribution patterns as needed
- Monitor GitHub Actions quota usage
- Validate PowerShell script security

This automation ensures accurate attribution of AI-assisted code while maintaining a smooth development experience. The system is designed to be transparent, reliable, and secure.