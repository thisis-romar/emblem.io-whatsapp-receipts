# GitHub Copilot Instructions: Comprehensive Guide to All Levels and Configurations

*Last Updated: October 2025*  
*Researched and Compiled using Sequential Thinking Methodology*

## Table of Contents

1. [Introduction](#introduction)
2. [Instruction Hierarchy and Priority System](#instruction-hierarchy-and-priority-system)
3. [Individual Level Instructions](#individual-level-instructions)
4. [Repository Level Instructions](#repository-level-instructions)
5. [Organization Level Instructions](#organization-level-instructions)
6. [IDE-Specific Configurations](#ide-specific-configurations)
7. [CLI and Terminal Instructions](#cli-and-terminal-instructions)
8. [Advanced Features and Enterprise Settings](#advanced-features-and-enterprise-settings)
9. [Best Practices and Guidelines](#best-practices-and-guidelines)
10. [Troubleshooting and Common Issues](#troubleshooting-and-common-issues)
11. [Resources and References](#resources-and-references)

---

## Introduction

GitHub Copilot operates with a sophisticated multi-level instruction system that allows for fine-grained control and customization across different scopes. This comprehensive guide covers all levels of GitHub Copilot instructions, from personal preferences to enterprise-wide policies, based on the latest 2025 documentation and features.

### Key Concepts

**Instructions vs. Configurations**: Instructions are natural language guidance for Copilot's behavior, while configurations are technical settings that control how Copilot operates.

**Inheritance Model**: Instructions follow a priority system where more specific instructions override more general ones, but all relevant instructions are typically combined rather than completely replaced.

**Cross-Platform Support**: Different instruction types have varying support across IDEs and platforms.

---

## Instruction Hierarchy and Priority System

GitHub Copilot uses a hierarchical instruction system with the following priority order (highest to lowest):

1. **Personal Instructions** (highest priority)
2. **Repository Instructions** 
3. **Organization Instructions** (lowest priority)

> **Important**: Multiple instruction types can apply simultaneously. All relevant instructions are combined and provided to Copilot, with higher priority instructions taking precedence in case of conflicts.

### Instruction Flow Diagram

```
User Request → Personal Instructions → Repository Instructions → Organization Instructions → Copilot Response
```

---

## Individual Level Instructions

### Personal GitHub Copilot Settings

Individual users can configure their personal Copilot preferences through GitHub.com settings.

#### Accessing Personal Settings

1. Navigate to [github.com/settings/copilot](https://github.com/settings/copilot)
2. Configure preferences for:
   - Code completion suggestions matching public code
   - Data collection and retention preferences
   - Telemetry settings

#### Personal vs. Plan-Based Controls

**Copilot Pro Features:**
- Block/allow suggestions matching public code
- Control prompt and suggestion data retention
- Advanced model selection options

**Enterprise Plan Features:**
- Additional governance controls
- Organization policy inheritance
- Enterprise-specific model access

---

## Repository Level Instructions

Repository-level instructions provide the most flexible and commonly used instruction system for GitHub Copilot.

### Repository-Wide Instructions

#### `.github/copilot-instructions.md`

The primary repository instruction file that applies to all requests within the repository context.

**File Location:** `.github/copilot-instructions.md`

**Support Matrix:**
| Feature | Eclipse | JetBrains | Visual Studio | VS Code | GitHub.com | Xcode |
|---------|---------|-----------|---------------|---------|-------------|-------|
| Copilot Chat | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Copilot Coding Agent | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Copilot Code Review | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |

**Example:**
```markdown
# Project Overview

This project is a web application that allows users to manage their tasks and to-do lists. It is built using React and Node.js, and uses MongoDB for data storage.

## Folder Structure

- `/src`: Contains the source code for the frontend.
- `/server`: Contains the source code for the Node.js backend.
- `/docs`: Contains documentation for the project, including API specifications and user guides.

## Libraries and Frameworks

- React and Tailwind CSS for the frontend.
- Node.js and Express for the backend.
- MongoDB for data storage.

## Coding Standards

- Use semicolons at the end of each statement.
- Use single quotes for strings.
- Use function based components in React.
- Use arrow functions for callbacks.

## UI Guidelines

- A toggle is provided to switch between light and dark mode.
- Application should have a modern and clean design.
```

#### Creating Repository Instructions with Copilot Coding Agent

You can ask Copilot to generate a repository instructions file:

1. Navigate to [github.com/copilot/agents](https://github.com/copilot/agents)
2. Select your repository
3. Use this prompt:

```markdown
Your task is to "onboard" this repository to Copilot coding agent by adding a .github/copilot-instructions.md file in the repository that contains information describing how a coding agent seeing it for the first time can work most efficiently.

You will do this task only one time per repository and doing a good job can SIGNIFICANTLY improve the quality of the agent's work, so take your time, think carefully, and search thoroughly before writing the instructions.

<Goals>
- Reduce the likelihood of a coding agent pull request getting rejected by the user due to
generating code that fails the continuous integration build, fails a validation pipeline, or
having misbehavior.
- Minimize bash command and build failures.
- Allow the agent to complete its task more quickly by minimizing the need for exploration using grep, find, str_replace_editor, and code search tools.
</Goals>

<Limitations>
- Instructions must be no longer than 2 pages.
- Instructions must not be task specific.
</Limitations>

<WhatToAdd>

Add the following high level details about the codebase to reduce the amount of searching the agent has to do to understand the codebase each time:
<HighLevelDetails>

- A summary of what the repository does.
- High level repository information, such as the size of the repo, the type of the project, the languages, frameworks, or target runtimes in use.
</HighLevelDetails>

Add information about how to build and validate changes so the agent does not need to search and find it each time.
<BuildInstructions>

- For each of bootstrap, build, test, run, lint, and any other scripted step, document the sequence of steps to take to run it successfully as well as the versions of any runtime or build tools used.
- Each command should be validated by running it to ensure that it works correctly as well as any preconditions and postconditions.
- Try cleaning the repo and environment and running commands in different orders and document errors and and misbehavior observed as well as any steps used to mitigate the problem.
- Run the tests and document the order of steps required to run the tests.
- Make a change to the codebase. Document any unexpected build issues as well as the workarounds.
- Document environment setup steps that seem optional but that you have validated are actually required.
- Document the time required for commands that failed due to timing out.
- When you find a sequence of commands that work for a particular purpose, document them in detail.
- Use language to indicate when something should always be done. For example: "always run npm install before building".
- Record any validation steps from documentation.
</BuildInstructions>

List key facts about the layout and architecture of the codebase to help the agent find where to make changes with minimal searching.
<ProjectLayout>

- A description of the major architectural elements of the project, including the relative paths to the main project files, the location
of configuration files for linting, compilation, testing, and preferences.
- A description of the checks run prior to check in, including any GitHub workflows, continuous integration builds, or other validation pipelines.
- Document the steps so that the agent can replicate these itself.
- Any explicit validation steps that the agent can consider to have further confidence in its changes.
- Dependencies that aren't obvious from the layout or file structure.
- Finally, fill in any remaining space with detailed lists of the following, in order of priority: the list of files in the repo root, the
contents of the README, the contents of any key source files, the list of files in the next level down of directories, giving priority to the more structurally important and snippets of code from key source files, such as the one containing the main method.
</ProjectLayout>
</WhatToAdd>

<StepsToFollow>
- Perform a comprehensive inventory of the codebase. Search for and view:
- README.md, CONTRIBUTING.md, and all other documentation files.
- Search the codebase for build steps and indications of workarounds like 'HACK', 'TODO', etc.
- All scripts, particularly those pertaining to build and repo or environment setup.
- All build and actions pipelines.
- All project files.
- All configuration and linting files.
- For each file:
- think: are the contents or the existence of the file information that the coding agent will need to implement, build, test, validate, or demo a code change?
- If yes:
   - Document the command or information in detail.
   - Explicitly indicate which commands work and which do not and the order in which commands should be run.
   - Document any errors encountered as well as the steps taken to workaround them.
- Document any other steps or information that the agent can use to reduce time spent exploring or trying and failing to run bash commands.
- Finally, explicitly instruct the agent to trust the instructions and only perform a search if the information in the instructions is incomplete or found to be in error.
</StepsToFollow>
   - Document any errors encountered as well as the steps taken to work-around them.
```

### Path-Specific Instructions

Path-specific instructions apply to files matching specific glob patterns.

#### `.github/instructions/**/*.instructions.md`

**Support:** VS Code (Copilot Coding Agent and Code Review), GitHub.com

**File Structure:**
```
.github/
└── instructions/
    ├── frontend.instructions.md
    ├── backend.instructions.md
    └── testing.instructions.md
```

**Example: `frontend.instructions.md`**
```markdown
---
applyTo: "src/components/**/*.tsx,src/pages/**/*.tsx"
---

# Frontend Component Instructions

## React Best Practices
- Use TypeScript for all React components
- Implement proper error boundaries
- Use React hooks instead of class components
- Follow the component naming convention: PascalCase

## Styling Guidelines
- Use Tailwind CSS utility classes
- Maintain responsive design principles
- Follow the existing color scheme defined in tailwind.config.js
```

**Multiple Patterns Example:**
```markdown
---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Instructions
- Always use strict TypeScript configuration
- Prefer interfaces over types for object definitions
- Use proper JSDoc comments for public APIs
```

### Agent Instructions

Agent instructions are specialized files for AI agents, including GitHub Copilot CLI and Copilot Coding Agent.

#### `AGENTS.md` Files

**Key Features:**
- Can be placed anywhere in the repository
- Nearest `AGENTS.md` file in directory tree takes precedence
- Supports nested hierarchy
- Based on OpenAI's agents.md specification

**Example: Root `AGENTS.md`**
```markdown
# Agent Instructions

You are a senior software engineer working on a TypeScript/React web application. You have deep expertise in modern web development practices.

## Project Context
This is an e-commerce platform built with:
- Frontend: React 18, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Testing: Jest, React Testing Library, Playwright

## Code Quality Standards
- Write comprehensive tests for new features
- Follow existing architectural patterns
- Ensure accessibility compliance (WCAG 2.1)
- Optimize for performance and SEO

## Development Workflow
1. Create feature branches from `main`
2. Write tests before implementation (TDD)
3. Ensure all tests pass before creating PR
4. Follow conventional commit messages
```

#### Model-Specific Instructions

**`CLAUDE.md`** and **`GEMINI.md`** files provide model-specific guidance.

**Example: `CLAUDE.md`**
```markdown
# Claude-Specific Instructions

## Reasoning Style
- Break down complex problems step by step
- Explain your thought process clearly
- Consider edge cases and potential issues
- Suggest alternative approaches when relevant

## Code Generation Preferences
- Prioritize code clarity over cleverness
- Include comprehensive error handling
- Add detailed comments for complex logic
- Suggest relevant tests for new code
```

### Prompt Files (VS Code)

Reusable prompt files for common development tasks.

#### `.github/prompts/**/*.prompt.md`

**Configuration:** Add to VS Code `settings.json`:
```json
{
  "chat.promptFiles": true
}
```

**Example: `.github/prompts/code-review.prompt.md`**
```markdown
# Code Review Prompt

Please review the selected code for:

1. **Code Quality**
   - Readability and maintainability
   - Performance considerations
   - Security vulnerabilities

2. **Best Practices**
   - Language-specific conventions
   - Project-specific patterns
   - Testing coverage

3. **Documentation**
   - Code comments adequacy
   - API documentation needs
   - README updates required

Please provide specific suggestions for improvement with code examples where helpful.

Reference files:
- [Coding Standards](../../docs/coding-standards.md)
- [Security Guidelines](../../docs/security.md)
```

---

## Organization Level Instructions

Organization-level instructions provide centralized governance and policy enforcement across all repositories.

### Enterprise and Business Plans

#### Organization Settings Configuration

1. **Access Control:**
   - Navigate to organization settings
   - Go to "Copilot" > "Policies"
   - Configure feature access for members

2. **Policy Management:**
   - Enable/disable custom instructions
   - Control preview feature access
   - Manage data retention policies

#### Content Exclusions

Organizations can configure content exclusions to prevent Copilot from processing certain files or repositories.

**Configuration Path:** Organization Settings > Copilot > Content Exclusion

**Supported Patterns:**
- File paths (e.g., `**/secrets/**`)
- File extensions (e.g., `*.key`, `*.pem`)
- Repository exclusions

### Enterprise GitHub Advanced Security Integration

For enterprise customers, Copilot instructions integrate with GitHub Advanced Security features:

- Secret scanning integration
- Code scanning policy enforcement
- Dependency review requirements
- Security-focused instruction templates

---

## IDE-Specific Configurations

Different IDEs have varying levels of support for GitHub Copilot instructions and unique configuration methods.

### Visual Studio Code

VS Code offers the most comprehensive Copilot configuration options.

#### Settings.json Configuration

**File Location:**
- **User Settings:** `%APPDATA%\Code\User\settings.json` (Windows)
- **Workspace Settings:** `.vscode/settings.json`

**Comprehensive Configuration Example:**
```json
{
  // General Copilot Settings
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": false,
    "markdown": true,
    "javascript": true,
    "typescript": true,
    "python": true
  },
  
  // Chat and Agent Settings
  "github.copilot.chat.localeOverride": "en",
  "github.copilot.chat.useProjectTemplates": true,
  "github.copilot.chat.scopeSelection": true,
  "github.copilot.chat.terminalChatLocation": "chatView",
  
  // Agent Mode Configuration
  "chat.agent.enabled": true,
  "chat.agent.maxRequests": 25,
  "github.copilot.chat.agent.autoFix": true,
  "github.copilot.chat.agent.runTasks": true,
  
  // Custom Instructions
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  
  // Prompt Files
  "chat.promptFiles": true,
  "chat.promptFilesLocations": {
    ".github/prompts": true
  },
  
  // Model Context Protocol (MCP)
  "chat.mcp.access": true,
  "chat.mcp.discovery.enabled": false,
  "chat.mcp.autoStart": "never",
  
  // Code Editing Features
  "github.copilot.editor.enableCodeActions": true,
  "github.copilot.renameSuggestions.triggerAutomatically": true,
  "github.copilot.nextEditSuggestions.enabled": true,
  "editor.inlineSuggest.edits.allowCodeShifting": "always",
  "editor.inlineSuggest.edits.renderSideBySide": "auto",
  
  // Testing and Debugging
  "github.copilot.chat.generateTests.codeLens": false,
  "github.copilot.chat.setupTests.enabled": true,
  "github.copilot.chat.startDebugging.enabled": true,
  
  // Security and Auto-Approval
  "chat.tools.terminal.autoApprove": {
    "rm": false,
    "rmdir": false,
    "del": false,
    "kill": false,
    "curl": false,
    "wget": false,
    "eval": false,
    "chmod": false,
    "chown": false,
    "/^Remove-Item\\b/i": false
  },
  "chat.tools.global.autoApprove": false,
  
  // Accessibility and UI
  "inlineChat.accessibleDiffView": "auto",
  "accessibility.signals.chatRequestSent": {
    "sound": "auto",
    "announcement": "auto"
  },
  "accessibility.signals.nextEditSuggestion": {
    "sound": "auto",
    "announcement": "auto"
  },
  
  // Experimental Features
  "chat.useAgentsMdFile": true,
  "github.copilot.chat.edits.suggestRelatedFilesFromGitHistory": true,
  "github.copilot.chat.virtualTools.threshold": 128
}
```

#### Key VS Code Settings Explained

**Language Configuration:**
```json
"github.copilot.enable": {
  "*": true,              // Enable for all languages
  "yaml": false,          // Disable for YAML
  "plaintext": false,     // Disable for plain text
  "markdown": true,       // Enable for Markdown
  "javascript": true,     // Enable for JavaScript
  "typescript": true      // Enable for TypeScript
}
```

**Agent Mode Security:**
```json
"chat.tools.terminal.autoApprove": {
  "ls": true,           // Auto-approve safe commands
  "cat": true,
  "echo": true,
  "rm": false,          // Require approval for dangerous commands
  "sudo": false,
  "/^git\\s+/": true    // Auto-approve git commands (regex)
}
```

### JetBrains IDEs

#### github-copilot.xml Configuration

**File Location:**
- **macOS:** `~/Library/Application Support/JetBrains/<product><version>/options/github-copilot.xml`
- **Windows:** `%APPDATA%\JetBrains\<product><version>\options\github-copilot.xml`
- **Linux:** `~/.config/JetBrains/<product><version>/options/github-copilot.xml`

**Default Configuration:**
```xml
<application>
  <component name="github-copilot">
    <languageAllowList>
      <map>
        <entry key="*" value="true" />
      </map>
    </languageAllowList>
  </component>
</application>
```

**Language-Specific Configuration:**
```xml
<application>
  <component name="github-copilot">
    <option name="languageAllowListReadOnly" value="false" />
    <languageAllowList>
      <map>
        <entry key="*" value="false" />
        <entry key="Java" value="true" />
        <entry key="Kotlin" value="true" />
        <entry key="Python" value="true" />
        <entry key="JavaScript" value="true" />
        <entry key="TypeScript" value="true" />
      </map>
    </languageAllowList>
  </component>
</application>
```

**Read-Only Configuration (Enterprise):**
```xml
<application>
  <component name="github-copilot">
    <option name="languageAllowListReadOnly" value="true" />
    <languageAllowList>
      <map>
        <entry key="*" value="true" />
      </map>
    </languageAllowList>
  </component>
</application>
```

#### Global Custom Instructions (JetBrains)

**File Location:**
- **macOS:** `/Users/YOUR-USERNAME/.config/github-copilot/intellij/global-copilot-instructions.md`
- **Windows:** `C:\Users\YOUR-USERNAME\AppData\Local\github-copilot\intellij\global-copilot-instructions.md`

**Example:**
```markdown
# Global JetBrains Copilot Instructions

## Code Style Preferences
- Use 4 spaces for indentation
- Always include Javadoc comments for public methods
- Follow Google Java Style Guide conventions
- Use meaningful variable and method names

## Architecture Patterns
- Prefer dependency injection with Spring
- Use Builder pattern for complex object construction
- Implement proper exception handling with custom exceptions
- Follow SOLID principles in class design
```

### Visual Studio

Visual Studio configurations are managed through the IDE's Options dialog.

#### Key Settings

1. **Tools > Options > GitHub > Copilot > Copilot Completions**
2. **Enable next edit suggestions**
3. **Custom instructions toggle**

#### ReSharper Integration

For optimal performance with ReSharper:

1. **Extensions > ReSharper > Options**
2. **Environment > IntelliSense > General**
3. **Select "Visual Studio"**

### Xcode

#### Configuration through Copilot for Xcode App

1. **Open GitHub Copilot for Xcode application**
2. **Settings > Advanced > Custom Instructions**
3. **Choose "Current Workspace" or "Global"**

#### Key Bindings

- Default: `Tab` for accepting suggestions
- Custom: Use Xcode > Settings > Key Bindings
- Search for "Copilot" commands to customize

### Eclipse

#### Workspace vs. Project Instructions

**Workspace Instructions:**
1. **Copilot Chat panel > Edit preferences**
2. **GitHub Copilot > Custom Instructions**
3. **Enable workspace instructions**

**Project Instructions:**
Create `.github/copilot-instructions.md` in project root.

### Vim/Neovim

#### Configuration Access

```vim
:help copilot
```

#### Key Remapping Example

```vim
" Custom Copilot key mappings
imap <silent><script><expr> <C-J> copilot#Accept()
imap <C-L> <Plug>(copilot-accept-word)
imap <C-K> <Plug>(copilot-next)
imap <C-P> <Plug>(copilot-previous)
```

---

## CLI and Terminal Instructions

GitHub Copilot CLI provides a powerful terminal-native interface with its own instruction system.

### Installation and Setup

```bash
# Install Copilot CLI
npm install -g @github/copilot

# Launch Copilot CLI
copilot

# Authenticate (if needed)
/login
```

### CLI Configuration Files

#### config.json

**Location:** `~/.config/config.json` (default, configurable via `XDG_CONFIG_HOME`)

**Example Configuration:**
```json
{
  "model": "claude-sonnet-4.5",
  "maxRequests": 50,
  "autoApprove": {
    "tools": {
      "shell": {
        "ls": true,
        "cat": true,
        "echo": true,
        "git": true,
        "npm": false,
        "rm": false
      }
    }
  },
  "trustedDirectories": [
    "/home/user/projects",
    "/home/user/workspace"
  ],
  "logging": {
    "level": "info",
    "file": "~/.config/copilot-cli.log"
  }
}
```

#### mcp-config.json

**Location:** `~/.config/mcp-config.json`

Model Context Protocol server configurations for extending CLI capabilities.

**Example:**
```json
{
  "servers": {
    "github": {
      "command": "github-mcp-server",
      "args": ["--token", "$GITHUB_TOKEN"],
      "capabilities": ["resources", "tools"]
    },
    "filesystem": {
      "command": "mcp-filesystem",
      "args": ["--root", "/home/user/projects"],
      "capabilities": ["resources"]
    }
  }
}
```

### CLI Instruction Files

#### Repository Instructions for CLI

Copilot CLI supports the same repository instruction files as other Copilot features:

- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`
- `AGENTS.md`

#### CLI-Specific Commands

```bash
# Add trusted directory
/add-dir /path/to/directory

# Change working directory
/cwd /path/to/directory

# Add MCP server
/mcp add

# Check usage statistics
/usage

# Switch AI model
/model

# Resume previous session
copilot --resume

# Continue last session
copilot --continue

# Execute shell command directly
!git status
```

### Permission Management

#### Tool Permissions

```bash
# Allow specific tools with patterns
copilot --allow-tool "shell(npm run test:*)"
copilot --allow-tool "shell(git *)"

# Deny dangerous operations
copilot --deny-tool "shell(rm *)"
copilot --deny-tool "shell(sudo *)"
```

#### Global Permission Configuration

```json
{
  "permissions": {
    "shell": {
      "allow": [
        "ls",
        "cat",
        "echo",
        "git *",
        "npm run test:*"
      ],
      "deny": [
        "rm *",
        "sudo *",
        "kill *"
      ]
    },
    "filesystem": {
      "readOnly": false,
      "allowedPaths": [
        "/home/user/projects/**"
      ],
      "deniedPaths": [
        "/etc/**",
        "/var/**"
      ]
    }
  }
}
```

### Latest CLI Features (October 2025)

#### Enhanced Model Selection

```bash
# List available models
/model

# Switch to specific model
/model claude-sonnet-4.5
/model gpt-5
```

#### Image Recognition

```bash
# Include image in prompt
@path/to/image.png "Explain what's in this diagram"
```

#### Direct Shell Execution

```bash
# Execute without model call
!ls -la
!git clone https://github.com/user/repo
```

#### Session Management

```bash
# List and resume sessions
copilot --resume

# Continue from last session
copilot --continue

# Session with custom name
copilot --session "feature-development"
```

---

## Advanced Features and Enterprise Settings

### Enterprise Configuration Management

#### Organization-Level Policy Enforcement

**Content Exclusion Patterns:**
```yaml
# .github/copilot-exclusions.yml
exclusions:
  paths:
    - "**/secrets/**"
    - "**/keys/**"
    - "**/*.key"
    - "**/*.pem"
    - "**/node_modules/**"
  
  repositories:
    - "org/private-configs"
    - "org/security-policies"
  
  file_types:
    - ".env"
    - ".secret"
    - ".credentials"
```

#### Network Access Management

For enterprise environments with restricted network access:

```json
{
  "apiEndpoints": {
    "copilot": "https://api.github.com/copilot",
    "models": "https://models.github.com",
    "telemetry": "https://telemetry.github.com"
  },
  "proxySettings": {
    "enabled": true,
    "url": "http://corporate-proxy:8080",
    "auth": {
      "username": "$PROXY_USER",
      "password": "$PROXY_PASS"
    }
  }
}
```

### Model Context Protocol (MCP) Integration

#### Custom MCP Server Development

**Example: Project-Specific MCP Server**

```typescript
// mcp-project-server.ts
import { McpServer, Tool, Resource } from '@modelcontextprotocol/sdk';

class ProjectMcpServer extends McpServer {
  
  @Tool({
    name: 'get_project_standards',
    description: 'Get coding standards for current project'
  })
  async getProjectStandards(): Promise<string> {
    return `
    Current Project Standards:
    - Language: TypeScript 5.0+
    - Framework: React 18
    - Testing: Jest + React Testing Library
    - Linting: ESLint + Prettier
    - Git: Conventional Commits
    `;
  }
  
  @Resource({
    uri: 'project://architecture',
    name: 'Project Architecture',
    description: 'Current project architecture documentation'
  })
  async getArchitecture(): Promise<string> {
    // Return architecture documentation
    return await this.loadArchitectureDoc();
  }
}
```

#### MCP Configuration for Teams

```json
{
  "mcpServers": {
    "team-standards": {
      "command": "node",
      "args": ["dist/team-standards-server.js"],
      "env": {
        "TEAM_CONFIG": "/path/to/team-config.json"
      }
    },
    "project-context": {
      "command": "python",
      "args": ["scripts/project-mcp-server.py"],
      "capabilities": ["resources", "tools", "prompts"]
    }
  }
}
```

### Advanced IDE Integrations

#### VS Code Extension Configuration

**Custom Copilot Extension Settings:**
```json
{
  "copilot.advanced": {
    "modelOverrides": {
      "chat": "claude-sonnet-4.5",
      "completion": "gpt-4o",
      "editing": "claude-sonnet-4"
    },
    "contextWindowSize": 32768,
    "temperature": 0.1,
    "topP": 0.9
  },
  
  "copilot.customPrompts": {
    "codeReview": {
      "system": "You are a senior code reviewer with expertise in security and performance",
      "template": "Review this code for security vulnerabilities, performance issues, and adherence to best practices:\n\n{code}"
    }
  }
}
```

#### Workspace-Specific Configurations

**.vscode/copilot-workspace.json**
```json
{
  "workspaceInstructions": [
    {
      "scope": "src/components/**",
      "instructions": "Use TypeScript strict mode and React hooks",
      "priority": "high"
    },
    {
      "scope": "src/api/**",
      "instructions": "Include comprehensive error handling and input validation",
      "priority": "high"
    },
    {
      "scope": "tests/**",
      "instructions": "Write comprehensive test cases with edge case coverage",
      "priority": "medium"
    }
  ],
  
  "modelPreferences": {
    "testing": "claude-sonnet-4.5",
    "refactoring": "gpt-4o",
    "documentation": "claude-3.5-sonnet"
  }
}
```

### Security and Compliance Features

#### Data Residency Controls

```json
{
  "dataResidency": {
    "region": "eu-west-1",
    "encryptionAtRest": true,
    "encryptionInTransit": true,
    "dataRetention": "30-days",
    "auditLogging": true
  },
  
  "compliance": {
    "gdpr": true,
    "sox": true,
    "hipaa": false,
    "customPolicies": [
      "no-pii-in-prompts",
      "code-review-required"
    ]
  }
}
```

#### Audit and Monitoring

```json
{
  "auditSettings": {
    "logAllInteractions": true,
    "includePrompts": false,
    "includeSuggestions": true,
    "logDestination": "enterprise-siem",
    "alerting": {
      "suspiciousActivity": true,
      "policyViolations": true,
      "unusualUsage": true
    }
  }
}
```

---

## Best Practices and Guidelines

### Writing Effective Instructions

#### Structure and Organization

**Good Instruction Structure:**
```markdown
# [Project/Component] Instructions

## Overview
Brief description of the project/component purpose and context.

## Technical Stack
- Language/Framework versions
- Key dependencies
- Architecture patterns used

## Code Standards
- Formatting and style rules
- Naming conventions
- Documentation requirements

## Testing Requirements
- Test coverage expectations
- Testing patterns to follow
- Mock/fixture usage guidelines

## Common Patterns
- Frequently used code patterns
- Error handling approaches
- Performance considerations

## Specific Guidelines
- Security requirements
- Accessibility standards
- Integration patterns
```

#### Do's and Don'ts

**✅ Effective Instructions:**
- Be specific and actionable
- Include concrete examples
- Reference existing patterns in codebase
- Specify version requirements
- Include build/test procedures

**❌ Avoid These Patterns:**
- Vague or subjective guidance
- Instructions that conflict with project reality
- Overly long instruction files (>2 pages)
- Task-specific instructions (use prompts instead)
- References to external resources without context

#### Example: Comprehensive Repository Instructions

```markdown
# E-Commerce Platform - Copilot Instructions

## Project Overview
Full-stack e-commerce platform with React frontend, Node.js backend, and PostgreSQL database. Supports multi-tenant architecture with role-based access control.

## Technology Stack
- **Frontend**: React 18.2+, TypeScript 5.0+, Tailwind CSS 3.3+
- **Backend**: Node.js 18+, Express 4.18+, Prisma 5.0+
- **Database**: PostgreSQL 15+
- **Testing**: Jest 29+, React Testing Library, Supertest
- **Build**: Vite 4.0+, esbuild
- **Deployment**: Docker, Kubernetes, GitHub Actions

## Architecture Principles
- **Microservices**: Separate services for auth, products, orders, payments
- **Event-Driven**: Use Redis for event streaming between services
- **API-First**: RESTful APIs with OpenAPI specifications
- **Database**: One database per microservice pattern

## Code Quality Standards

### TypeScript Configuration
- Use strict mode: `"strict": true`
- No implicit any: `"noImplicitAny": true`
- Prefer interfaces over types for object definitions
- Use proper JSDoc for public APIs

### React Components
```tsx
// ✅ Good: Functional component with proper typing
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  // Component implementation
};
```

### Error Handling
```typescript
// ✅ Good: Comprehensive error handling
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (error) {
  logger.error('API call failed', { error, context: 'user-action' });
  
  if (error instanceof ValidationError) {
    return { success: false, error: 'Invalid input data' };
  }
  
  if (error instanceof NetworkError) {
    return { success: false, error: 'Network connection failed' };
  }
  
  return { success: false, error: 'An unexpected error occurred' };
}
```

## Build and Development Process

### Setup Commands
```bash
# Always run in this order:
npm install          # Install dependencies
npm run db:migrate   # Apply database migrations  
npm run db:seed      # Seed development data
npm run build        # Build all packages
npm test             # Run test suite (must pass)
```

### Development Workflow
1. **Branch Strategy**: Feature branches from `main`
2. **Commits**: Use Conventional Commits format
3. **Pre-commit**: Husky runs lint, type-check, and tests
4. **CI/CD**: GitHub Actions runs full test suite and security scans

### Testing Requirements
- **Unit Tests**: 80%+ coverage required
- **Integration Tests**: All API endpoints must have tests
- **E2E Tests**: Critical user journeys covered

```typescript
// ✅ Good: Comprehensive test structure
describe('ProductService', () => {
  beforeEach(() => {
    // Setup test database
    setupTestDb();
  });

  describe('createProduct', () => {
    it('should create product with valid data', async () => {
      // Test implementation
    });

    it('should throw validation error for invalid data', async () => {
      // Test implementation  
    });

    it('should handle database connection errors', async () => {
      // Test implementation
    });
  });
});
```

## File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components (Next.js style routing)
├── hooks/              # Custom React hooks
├── services/           # API service layers
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── __tests__/          # Test files (mirror src structure)

backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── services/       # Business logic
│   ├── models/         # Database models (Prisma)
│   ├── middleware/     # Express middleware
│   ├── utils/          # Backend utilities
│   └── __tests__/      # Backend tests
├── prisma/             # Database schema and migrations
└── docker/             # Docker configuration
```

## Security Guidelines
- **Authentication**: JWT tokens with 15-minute expiry
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection**: Prisma ORM prevents this automatically
- **XSS Protection**: Sanitize all user inputs
- **CORS**: Restrictive CORS policy in production

## Performance Requirements
- **Frontend**: Lighthouse score 90+ on all metrics
- **Backend**: API responses under 200ms average
- **Database**: All queries must use proper indexes
- **Caching**: Redis for frequently accessed data

## Integration Patterns
- **Payment Processing**: Stripe webhooks for payment events
- **Email Service**: SendGrid with template management
- **File Upload**: AWS S3 with signed URLs
- **Monitoring**: Sentry for error tracking, DataDog for metrics

## Environment Configuration
```env
# Required environment variables:
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
REDIS_URL=redis://...
SENTRY_DSN=https://...
```

## Common Commands
```bash
# Development
npm run dev              # Start development servers
npm run dev:db          # Start local PostgreSQL in Docker
npm run studio          # Open Prisma Studio (database GUI)

# Testing  
npm test                # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Generate coverage report

# Database
npm run db:reset        # Reset database (destructive!)
npm run db:generate     # Generate Prisma client
npm run db:deploy       # Deploy migrations to production

# Build and Deploy
npm run build           # Production build
npm run start           # Start production server
npm run docker:build    # Build Docker images
npm run k8s:deploy      # Deploy to Kubernetes
```

## Troubleshooting
- **Build Failures**: Clear `node_modules` and `npm install` first
- **Database Issues**: Check migrations with `npm run db:status`
- **Test Failures**: Run tests in isolation with `--testNamePattern`
- **Memory Issues**: Increase Node.js heap size: `--max-old-space-size=4096`

---

**Trust these instructions** - they are kept up-to-date with the current project state. Only search for additional information if these instructions are incomplete or incorrect.
```

### Instruction File Management

#### Version Control Best Practices

```gitignore
# Include in version control
.github/copilot-instructions.md
.github/instructions/**/*.instructions.md
.github/prompts/**/*.prompt.md
AGENTS.md
CLAUDE.md
GEMINI.md

# IDE-specific (consider gitignoring)
.vscode/settings.json      # May contain personal preferences
github-copilot.xml         # JetBrains personal settings
```

#### Team Collaboration

**Review Process for Instruction Changes:**
1. Create pull request for instruction file changes
2. Team review for accuracy and completeness
3. Test with Copilot to ensure effectiveness
4. Document changes in commit messages
5. Update team documentation

**Instruction File Ownership:**
- Repository instructions: Team/project owners
- Path-specific instructions: Component owners
- Organization instructions: DevOps/Platform teams

### Performance Optimization

#### Instruction File Size Guidelines

- **Repository instructions**: 1-2 pages maximum
- **Path-specific instructions**: 0.5-1 page maximum
- **Agent instructions**: 1 page maximum
- **Prompt files**: Task-specific, no size limit

#### Content Optimization

**Effective Instruction Content:**
```markdown
✅ "Use TypeScript strict mode for all React components"
✅ "API endpoints must include comprehensive error handling"
✅ "Follow conventional commit format: type(scope): description"

❌ "Write good code"
❌ "Follow best practices"
❌ "Make it secure"
```

**Specific Technical Details:**
```markdown
✅ "Use Prisma ORM with PostgreSQL 15+ for all database operations"
✅ "React components must use function syntax with hooks, not classes"
✅ "Test files should be located in __tests__ directories mirroring src structure"

❌ "Use appropriate database"
❌ "Write modern React"
❌ "Add tests"
```

---

## Troubleshooting and Common Issues

### Instruction File Issues

#### Instructions Not Being Applied

**Diagnostic Steps:**
1. **Check File Location**: Verify correct path (`.github/copilot-instructions.md`)
2. **Verify Syntax**: Ensure valid Markdown format
3. **IDE Support**: Confirm instruction type is supported in your IDE
4. **Cache Issues**: Restart IDE or clear Copilot cache
5. **Check References**: Look for instruction file in Copilot response references

**VS Code Debugging:**
```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  }
}
```

**Check if Instructions Are Used:**
1. Submit chat query in VS Code
2. Expand "References" in response
3. Look for `.github/copilot-instructions.md` in list

#### Path-Specific Instructions Not Working

**Common Issues:**
- Incorrect glob patterns in frontmatter
- File not in `.github/instructions/` directory
- Filename doesn't end with `.instructions.md`
- IDE doesn't support path-specific instructions

**Debugging Glob Patterns:**
```markdown
---
# ✅ Correct patterns
applyTo: "src/**/*.ts"                    # All TypeScript files in src
applyTo: "**/*.tsx,**/*.ts"              # All TypeScript files
applyTo: "src/components/**/*.tsx"        # Components only

# ❌ Incorrect patterns  
applyTo: "/src/**/*.ts"                  # Leading slash not needed
applyTo: "src/**.ts"                     # Missing directory separator
applyTo: "*.ts"                          # Too restrictive (root only)
---
```

### IDE-Specific Issues

#### VS Code Configuration Problems

**Settings Not Applied:**
1. Check workspace vs user settings precedence
2. Verify JSON syntax with VS Code's JSON schema validation
3. Restart VS Code after major configuration changes
4. Check VS Code developer tools (Help > Toggle Developer Tools)

**Extension Issues:**
```bash
# Reinstall GitHub Copilot extension
code --uninstall-extension GitHub.copilot
code --install-extension GitHub.copilot
```

#### JetBrains IDE Issues

**github-copilot.xml Not Found:**
1. Make language setting change in IDE first
2. Check correct product/version directory
3. Create file manually if needed
4. Restart IDE after file changes

**Language Settings Not Working:**
```xml
<!-- Verify XML structure -->
<application>
  <component name="github-copilot">
    <languageAllowList>
      <map>
        <entry key="Java" value="true" />
        <!-- Ensure proper key names for languages -->
      </map>
    </languageAllowList>
  </component>
</application>
```

### CLI Issues

#### Authentication Problems

```bash
# Clear existing authentication
rm -rf ~/.config/gh/
rm -rf ~/.config/copilot-cli/

# Re-authenticate
copilot
/login
```

#### Permission Denied Errors

**Trusted Directory Issues:**
```bash
# Add current directory as trusted
/add-dir $(pwd)

# Or start with --trust flag
copilot --trust-workspace
```

**Tool Permission Issues:**
```bash
# Check current permissions
copilot help permissions

# Allow specific tools
copilot --allow-tool "shell(git *)"
copilot --allow-tool "shell(npm run *)"
```

#### MCP Server Connection Issues

**Debug MCP Configuration:**
```json
{
  "mcpServers": {
    "debug-server": {
      "command": "echo",
      "args": ["MCP server working"],
      "debug": true,
      "timeout": 30000
    }
  }
}
```

**Common MCP Problems:**
- Server binary not in PATH
- Incorrect environment variables
- Port conflicts
- Permission issues with server executable

### Organization-Level Issues

#### Policy Conflicts

**Symptom**: Instructions work locally but not in organization context

**Resolution**:
1. Check organization Copilot policies
2. Verify feature flags are enabled for your organization
3. Contact organization admins for policy adjustments
4. Review content exclusion patterns

#### Content Exclusion Issues

**Debugging Exclusions:**
1. Check organization settings > Copilot > Content Exclusion
2. Test with simple file outside excluded patterns
3. Verify glob patterns are correct
4. Check repository-level exclusions

### Performance Issues

#### Slow Response Times

**Potential Causes:**
- Large instruction files (>2 pages)
- Too many concurrent requests
- Network connectivity issues
- Model overload

**Solutions:**
- Optimize instruction file length
- Use more specific path patterns
- Consider local caching strategies
- Monitor token usage with `/usage` command (CLI)

#### Token Limit Exceeded

**Symptoms:**
- Truncated responses
- Missing context in suggestions
- Warning messages about context limits

**Solutions:**
```json
{
  "contextOptimization": {
    "maxInstructionLength": 2000,
    "priorityOrder": ["personal", "repository", "organization"],
    "truncationStrategy": "oldest-first"
  }
}
```

---

## Resources and References

### Official Documentation

#### Primary Sources
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Adding Repository Custom Instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [VS Code Copilot Settings Reference](https://code.visualstudio.com/docs/copilot/reference/copilot-settings)
- [GitHub Copilot CLI Documentation](https://docs.github.com/copilot/concepts/agents/about-copilot-cli)

#### IDE-Specific Documentation
- **VS Code**: [GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/overview)
- **JetBrains**: [GitHub Copilot Plugin Documentation](https://www.jetbrains.com/help/idea/github-copilot.html)
- **Visual Studio**: [GitHub Copilot in Visual Studio](https://docs.microsoft.com/visualstudio/ide/visual-studio-github-copilot)

### Community Resources

#### GitHub Repositories
- [Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot)
- [OpenAI Agents.md Specification](https://github.com/openai/agents.md)
- [GitHub Copilot CLI Repository](https://github.com/github/copilot-cli)

#### Example Configurations
- [VS Code Settings Examples](https://github.com/search?q=github.copilot+settings.json)
- [Repository Instruction Examples](https://github.com/search?q=copilot-instructions.md)

### Model Context Protocol (MCP)

#### Official MCP Resources
- [MCP Specification](https://modelcontextprotocol.io)
- [MCP Server Registry](https://github.com/mcp)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

#### Community MCP Servers
- [Filesystem MCP Server](https://github.com/mcp/filesystem-server)
- [Git MCP Server](https://github.com/mcp/git-server)
- [Database MCP Server](https://github.com/mcp/database-server)

### Latest Updates and Changelog

#### Recent Features (October 2025)
- **CLI Enhancements**: Claude Sonnet 4.5 support, image recognition, direct shell execution
- **VS Code Updates**: Enhanced agent mode, virtual tools, improved MCP integration
- **Enterprise Features**: Advanced policy management, audit logging, data residency controls

#### Feature Roadmap
- Multi-agent workflows (CLI)
- Direct VS Code integration (CLI)
- Enhanced enterprise governance
- Improved model selection across all platforms

### Support and Community

#### Getting Help
- [GitHub Community Discussions](https://github.com/community/community/discussions)
- [VS Code GitHub Issues](https://github.com/microsoft/vscode/issues)
- [GitHub Copilot Feedback](https://github.com/github-community/community/discussions/categories/copilot)

#### Enterprise Support
- GitHub Enterprise Support Portal
- Organization admin configuration assistance
- Custom MCP server development guidance

---

## Conclusion

This comprehensive guide covers all levels of GitHub Copilot instructions and configurations as of October 2025. The instruction system provides powerful customization capabilities across individual, repository, organization, and IDE-specific levels.

Key takeaways:

1. **Hierarchical System**: Personal > Repository > Organization priority with instruction combination
2. **Multi-Platform Support**: Different instruction types work across various IDEs with varying support levels
3. **Enterprise Integration**: Comprehensive governance and policy management for organizations
4. **CLI Advancement**: GitHub Copilot CLI provides terminal-native AI assistance with full instruction support
5. **Extensibility**: MCP integration allows for custom tooling and context enhancement

### Best Practices Summary

- Keep instruction files concise (1-2 pages maximum)
- Use specific, actionable guidance rather than vague suggestions
- Leverage path-specific instructions for targeted code guidance
- Implement proper version control for instruction files
- Test instruction effectiveness with your team's workflows
- Monitor and optimize performance based on usage patterns

### Future Considerations

As GitHub Copilot continues to evolve, stay informed about:
- New instruction types and formats
- Enhanced enterprise governance features
- Expanded IDE support and integrations
- Advanced AI model capabilities
- Improved developer productivity metrics

This guide serves as a comprehensive reference for implementing and managing GitHub Copilot instructions across all supported platforms and use cases. Regular updates ensure alignment with the latest features and best practices in AI-assisted development.

---

*This guide was compiled using sequential thinking methodology and comprehensive research of official GitHub documentation, community resources, and the latest 2025 feature releases. For the most current information, always refer to the official GitHub Copilot documentation.*