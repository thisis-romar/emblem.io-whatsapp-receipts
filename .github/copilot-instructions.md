# WhatsApp Receipts Processing System - Copilot Instructions

## Project Overview

This is a comprehensive business project with two main components:

### 1. Core Product: Cloud-Native WhatsApp Receipts Processing System
A production-ready system that automatically extracts and processes receipt data from images sent via WhatsApp messages. The system integrates Google Cloud Document AI for OCR/document processing with WhatsApp Business API for messaging, built on Node.js and deployed to Google Cloud Run.

### 2. Investor Presentation Platform: Professional Pitch Deck System
A sophisticated investor presentation platform featuring:
- **315 Professional Images**: Sourced from Pexels with quality assessment (80.6% avg quality)
- **Enhanced Slide Deck**: Beautiful gradients, animations, and responsive design (Grade A: 92.1/100)
- **Automated Testing**: Playwright cross-browser validation and screenshot generation
- **Design Quality Assessment**: Firecrawl layout evaluation and professional standards compliance
- **Industry-Leading Visual Quality**: Investor-focused design with competitive differentiation

**Current Status**: Backend system architecture complete, investor presentation partially implemented (4/20 slides)

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
whatsapp-receipts-comprehensive/
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

## Code Quality Standards

### Modern JavaScript/Node.js Patterns

**ES Modules (Required)**
```javascript
// ✅ Use ES module imports/exports
import express from 'express';
import { DocumentProcessorServiceClient } from '@google-cloud/document-ai';

export const processDocument = async (imageBuffer) => {
  // Implementation
};

// ❌ Don't use CommonJS
const express = require('express');
module.exports = { processDocument };
```

**Async/Await Error Handling**
```javascript
// ✅ Comprehensive async error handling
export const processReceipt = async (imageBuffer) => {
  try {
    const result = await documentAI.processDocument(imageBuffer);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Document processing failed', { 
      error: error.message, 
      stack: error.stack,
      context: 'receipt-processing' 
    });
    
    // Handle specific Google Cloud errors
    if (error.code === 3) { // INVALID_ARGUMENT
      throw new ValidationError('Invalid document format');
    }
    if (error.code === 7) { // PERMISSION_DENIED
      throw new AuthenticationError('Document AI access denied');
    }
    
    throw new ProcessingError('Document processing failed');
  }
};
```

**Environment Configuration**
```javascript
// ✅ Proper environment variable handling
import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Google Cloud
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  processorId: process.env.GOOGLE_CLOUD_PROCESSOR_ID,
  
  // WhatsApp
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
  
  // Validate required environment variables
  validate() {
    const required = ['GOOGLE_CLOUD_PROJECT_ID', 'WHATSAPP_ACCESS_TOKEN'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};

export default config;
```

## Security Requirements

### WhatsApp Webhook Security
```javascript
// ✅ Always verify webhook signatures
import crypto from 'crypto';

export const verifyWhatsAppSignature = (req, res, next) => {
  const signature = req.get('X-Hub-Signature-256');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
    .update(req.body)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  )) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
};
```

### Input Validation
```javascript
// ✅ Validate all inputs with proper error messages
export const validateWhatsAppMessage = (req, res, next) => {
  const { entry } = req.body;
  
  if (!entry || !Array.isArray(entry)) {
    return res.status(400).json({ 
      error: 'Invalid webhook payload',
      details: 'Missing or invalid entry array'
    });
  }
  
  // Validate message structure
  for (const item of entry) {
    if (!item.changes || !Array.isArray(item.changes)) {
      return res.status(400).json({
        error: 'Invalid message structure',
        details: 'Missing changes array in entry'
      });
    }
  }
  
  next();
};
```

## Build and Development Process

### Setup Commands (Run in Order)
```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Configure Google Cloud authentication
export GOOGLE_APPLICATION_CREDENTIALS="./key.json"

# 4. Verify API connections
npm run test:integration

# 5. Start development server
npm run dev
```

### Development Workflow
1. **Feature Branches**: Create from `main` branch
2. **Commit Format**: Use Conventional Commits (feat:, fix:, docs:, etc.)
3. **Pre-commit Checks**: Linting, type checking, unit tests must pass
4. **Integration Tests**: Must pass for WhatsApp and Document AI endpoints
5. **Security Scans**: Automated SAST scanning in CI/CD pipeline

### Testing Requirements

**Unit Tests (80%+ coverage required)**
```javascript
// ✅ Comprehensive test structure
describe('DocumentAI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processDocument', () => {
    it('should process valid receipt image', async () => {
      const mockResult = { text: 'Receipt data', entities: [] };
      documentAI.processDocument.mockResolvedValue(mockResult);
      
      const result = await processDocument(Buffer.from('fake-image'));
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
    });

    it('should handle Document AI API errors gracefully', async () => {
      const apiError = new Error('API rate limit exceeded');
      apiError.code = 8; // RESOURCE_EXHAUSTED
      
      documentAI.processDocument.mockRejectedValue(apiError);
      
      await expect(processDocument(Buffer.from('fake-image')))
        .rejects.toThrow('Document processing temporarily unavailable');
    });
  });
});
```

**Integration Tests**
```javascript
// ✅ Test real API integrations with proper mocking
describe('WhatsApp Webhook Integration', () => {
  it('should process image message and respond', async () => {
    const webhookPayload = {
      entry: [{
        changes: [{
          value: {
            messages: [{
              type: 'image',
              image: { id: 'test-image-id' }
            }]
          }
        }]
      }]
    };

    const response = await request(app)
      .post('/webhook')
      .send(webhookPayload)
      .expect(200);

    expect(mockDocumentAI.processDocument).toHaveBeenCalled();
    expect(mockWhatsApp.sendMessage).toHaveBeenCalled();
  });
});
```

## Google Cloud Integration Patterns

### Document AI Service Implementation
```javascript
// ✅ Proper Document AI client setup with error handling
import { DocumentProcessorServiceClient } from '@google-cloud/document-ai';

class DocumentAIService {
  constructor() {
    this.client = new DocumentProcessorServiceClient();
    this.processorPath = this.client.processorPath(
      config.projectId,
      'us-central1', // Processor location
      config.processorId
    );
  }

  async processDocument(imageBuffer) {
    const request = {
      name: this.processorPath,
      rawDocument: {
        content: imageBuffer.toString('base64'),
        mimeType: 'image/jpeg'
      }
    };

    try {
      const [result] = await this.client.processDocument(request);
      return this.extractReceiptData(result.document);
    } catch (error) {
      // Log with correlation ID for debugging
      const correlationId = crypto.randomUUID();
      logger.error('Document AI processing failed', {
        correlationId,
        error: error.message,
        processorId: config.processorId,
        requestSize: imageBuffer.length
      });
      
      throw new ProcessingError(`Document processing failed: ${correlationId}`);
    }
  }
}
```

### WhatsApp API Integration
```javascript
// ✅ WhatsApp message sending with retry logic
export class WhatsAppService {
  async sendMessage(to, text) {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    };

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error('WhatsApp message send failed', {
        status: response.status,
        error: error.error,
        recipient: to
      });
      throw new Error(`WhatsApp send failed: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }
}
```

## Docker and Cloud Run Configuration

### Dockerfile Best Practices
```dockerfile
# ✅ Multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Set ownership
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE 8080

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["npm", "start"]
```

## Environment Variables

### Required Configuration
```bash
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PROCESSOR_ID=your-processor-id
GOOGLE_APPLICATION_CREDENTIALS=./key.json

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_APP_SECRET=your-app-secret
WEBHOOK_VERIFY_TOKEN=your-verify-token

# Application
NODE_ENV=production
PORT=8080
LOG_LEVEL=info
```

## Common Commands Reference

### Development
```bash
npm run dev              # Start development server with hot reload
npm run test             # Run all tests
npm run test:unit        # Unit tests only  
npm run test:integration # Integration tests with external APIs
npm run lint             # ESLint with automatic fixes
npm run security:audit   # Security vulnerability scan
```

### Deployment
```bash
npm run build            # Prepare production build
npm run start            # Start production server
docker build -t whatsapp-receipts .  # Build container
gcloud run deploy        # Deploy to Cloud Run
```

### Troubleshooting
```bash
npm run logs:production  # View Cloud Run logs
npm run health:check     # Test all health endpoints
npm run debug:webhooks   # Debug webhook connectivity
```

## Error Handling Patterns

### Standardized Error Response Format
```javascript
// ✅ Consistent error response structure
export const errorHandler = (error, req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  
  logger.error('Request failed', {
    correlationId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userAgent: req.get('User-Agent')
  });

  // Don't expose internal errors in production
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(error.statusCode || 500).json({
    error: {
      message,
      correlationId,
      timestamp: new Date().toISOString()
    }
  });
};
```

## Performance Considerations

- **Cold Start Optimization**: Keep dependencies minimal, use Alpine Linux base image
- **Memory Management**: Set appropriate Cloud Run memory limits (512Mi recommended)
- **Timeout Handling**: All external API calls must have timeouts (30s max)
- **Rate Limiting**: Implement rate limiting for webhook endpoints
- **Caching**: Cache Document AI results for duplicate images (if applicable)

## Monitoring and Observability

### Health Check Implementation
```javascript
// ✅ Comprehensive health check
export const healthCheck = async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
    services: {}
  };

  // Check external service health
  try {
    await documentAI.healthCheck();
    health.services.documentAI = 'healthy';
  } catch (error) {
    health.services.documentAI = 'unhealthy';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
};
```

## Investor Presentation System Standards

### Current Achievement Status
- **Design Quality**: Grade A (92.1/100) - Industry leading standard
- **Image Assets**: 315 professional Pexels images assessed and integrated
- **Visual Sophistication**: 96/100 - Commands investor attention  
- **Brand Strength**: 95/100 - Memorable professional impression
- **Technical Foundation**: Complete testing and evaluation infrastructure

### Presentation Requirements
- **Total Slides Needed**: 20 comprehensive slides for complete investor pitch
- **Current Implementation**: 4/20 slides completed (significant gap)
- **Missing Content**: 16 slides including technical architecture, pricing, competitive analysis, go-to-market strategy
- **Design Standards**: Maintain Grade A quality with beautiful gradients, animations, and professional typography

### Next Priority Actions
1. **URGENT**: Complete remaining 16 slides for investor presentation
2. Integrate detailed business content provided by stakeholders
3. Maintain established visual design patterns and quality standards
4. Ensure cross-browser compatibility and responsive design
5. Implement comprehensive slide content with proper image integration

---

## Current Project Status & Next Steps

**COMPLETED COMPONENTS:**
✅ Backend WhatsApp receipts processing architecture  
✅ Professional image sourcing and assessment system (315 images)  
✅ Design quality evaluation infrastructure (Firecrawl + Playwright)  
✅ Enhanced slide deck foundation with beautiful animations  
✅ Industry-leading design quality achievement (Grade A: 92.1/100)  

**CRITICAL MISSING COMPONENT:**
❌ **Complete 20-slide investor presentation** (only 4/20 slides implemented)

**IMMEDIATE NEXT STEP:**
Build remaining 16 slides with comprehensive business content while maintaining established design excellence. This will complete the investor-ready presentation platform.

---

**Trust these instructions** - they reflect the current project architecture and requirements. The project now spans both technical implementation AND professional investor presentation development.

When implementing new features:
1. **Backend Development**: Follow established patterns for error handling, logging, testing
2. **Presentation Development**: Maintain Grade A design quality and professional standards
3. **Content Integration**: Use detailed business content provided by stakeholders
4. **Design Consistency**: Preserve beautiful gradients, animations, and visual hierarchy
5. **Quality Assurance**: Ensure cross-browser compatibility and responsive design
6. **Professional Standards**: Target investor-grade presentation quality throughout