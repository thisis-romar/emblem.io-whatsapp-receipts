# WhatsApp Receipts Processing System - Copilot Instructions

## Project Overview

This is a **cloud-native WhatsApp receipts processing system** that automatically extracts and processes receipt data from images sent via WhatsApp messages. The system integrates Google Cloud Document AI for OCR/document processing with WhatsApp Business API for messaging, built on Node.js and deployed to Google Cloud Run.

### Current Focus Areas
1. **Core Product**: WhatsApp Receipts Processing System (production-ready backend)
2. **Investor Presentation Platform**: Professional pitch deck system (4/20 slides complete)

**Note**: AI Attribution Tools has moved to its own repository: https://github.com/thisis-romar/ai-attribution-tools

## Technology Stack (Required Versions)

- **Backend**: Node.js 18+ (LTS), Express 4.18+
- **Module System**: ES modules (not CommonJS) - use `import/export`
- **Cloud Services**: 
  - Google Cloud Document AI API
  - WhatsApp Business Cloud API (Graph API v19.0+)
  - Google Cloud Run for deployment
  - Google Cloud Build for CI/CD
- **Security**: Helmet 7+, CORS 2.8+, dotenv 16+
- **Testing**: Jest 29+, Supertest 6+, Nock 13+ for API mocking
- **Logging**: Winston for structured logging
- **Containerization**: Docker with Node.js 18-alpine base image

## Architecture Principles

### Microservices Pattern
- **Separation of Concerns**: Controllers handle HTTP, Services handle business logic, Middleware handles cross-cutting concerns
- **Cloud-Native Design**: Stateless services, externalized configuration, health checks
- **API-First Approach**: RESTful webhooks with proper error responses
- **Event-Driven**: WhatsApp webhooks trigger document processing workflows

### Project Structure
```
emblem-io-whatsapp-receipts/
├── src/                                    # Backend WhatsApp system
│   ├── app.js                             # Main Express application
│   ├── controllers/                       # Request handlers (webhook, document)
│   ├── services/                          # Business logic (documentAI, whatsapp, storage)
│   ├── middleware/                        # Cross-cutting (auth, validation, logging)
│   └── utils/                            # Utilities (logger, helpers)
├── tests/                                 # Backend tests
├── enhanced-pitch-deck.html              # Main investor presentation (4/20 slides complete)
├── pitch-deck-image-retriever.js         # Pexels image sourcing system (315 images)
├── image-quality-assessment.js           # Professional image analysis tool
├── firecrawl-layout-evaluator.js        # Design quality assessment (Grade A achieved)
├── playwright-deck-tester.js            # Cross-browser testing and validation
├── slide-deck-orchestrator.js           # Master presentation system controller
├── image-assessment-results/             # Quality reports and analysis data
├── firecrawl-evaluation/                 # Design assessment reports
├── pitch-deck-images/                    # 315 professional Pexels images
├── Dockerfile                            # Container configuration
├── cloudbuild.yaml                       # CI/CD pipeline
└── .env.example                          # Environment template
```

## Development Dependencies

### AI Attribution Tools (External Dependency)
For development workflow attribution analysis:
```powershell
# Install AI Attribution Tools from its dedicated repository
Install-Module -Name AIAttributionTools -Scope CurrentUser

# Use in development workflow
Invoke-LLMCommitAnalysis -ShowDetails
```

**Repository**: https://github.com/thisis-romar/ai-attribution-tools
**Documentation**: See AI Attribution Tools repository for complete usage guide

## Current Project Status & Next Steps

**COMPLETED COMPONENTS:**
✅ Backend WhatsApp receipts processing architecture  
✅ Professional image sourcing and assessment system (315 images)  
✅ Design quality evaluation infrastructure (Firecrawl + Playwright)  
✅ Enhanced slide deck foundation with beautiful animations  
✅ Industry-leading design quality achievement (Grade A: 92.1/100)  

**CRITICAL MISSING COMPONENT:**
❌ **Complete 20-slide investor presentation** (only 4/20 slides implemented)

**IMMEDIATE PRIORITIES:**
1. **🚨 URGENT**: Complete remaining 16 slides for investor presentation
2. **📊 Business Content**: Integrate detailed business content provided by stakeholders
3. **🎨 Visual Consistency**: Maintain Grade A quality with beautiful gradients and animations
4. **📱 Responsive Design**: Ensure cross-browser compatibility and responsive layout

**NEXT STEPS:**
1. **Investor Presentation**: Build remaining 16 slides with comprehensive business content
2. **Backend Enhancement**: Improve WhatsApp receipts processing capabilities
3. **Production Deployment**: Finalize Google Cloud Run deployment pipeline
4. **User Testing**: Implement beta testing program for receipt processing

---

**Focus**: This project is dedicated to WhatsApp receipts processing and investor presentation. For AI attribution needs, use the dedicated AI Attribution Tools repository and module.