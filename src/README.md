# 🏗️ WhatsApp Receipts Processing - Backend Source Code

This directory contains the Node.js backend source code for the WhatsApp receipts processing system.

## 📁 Directory Structure

```
src/
├── app.js              # Main Express application entry point
├── middleware/         # Express middleware components
├── routes/             # API route handlers
├── services/           # Business logic services
└── utils/             # Utility functions and helpers
```

## 🔧 Core Components

### **app.js**
Main Express application configuration with:
- Middleware setup (CORS, security, logging)
- Route registration
- Error handling
- Health check endpoints

### **middleware/**
Express middleware for:
- **Authentication**: WhatsApp webhook signature verification
- **Validation**: Request payload validation
- **Logging**: Structured request/response logging
- **Error Handling**: Centralized error processing
- **Rate Limiting**: API rate limiting and abuse prevention

### **routes/**
API endpoint handlers:
- **WhatsApp Webhooks**: `/webhook/whatsapp` - Receive messages and status updates
- **Health Checks**: `/health` - System health monitoring
- **Admin Endpoints**: Administrative functions and monitoring

### **services/**
Business logic services:
- **DocumentAI Service**: Google Cloud Document AI integration
- **WhatsApp Service**: WhatsApp Business API client
- **Receipt Service**: Receipt data processing and management
- **Storage Service**: Data persistence and retrieval

### **utils/**
Utility functions:
- **Logger**: Winston-based structured logging
- **Helpers**: Common utility functions
- **Validators**: Input validation schemas
- **Constants**: Application constants and configuration

## 🚀 Technology Stack

- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express 4.18+
- **Module System**: ES modules (`import`/`export`)
- **Logging**: Winston for structured logging
- **Validation**: Custom validation middleware
- **Security**: Helmet, CORS, rate limiting

## 🔐 Security Features

- **Webhook Verification**: Cryptographic signature validation
- **Input Sanitization**: All inputs validated and sanitized
- **Rate Limiting**: Per-endpoint rate limiting
- **Error Handling**: Secure error responses (no information leakage)
- **HTTPS Enforcement**: Production HTTPS requirement

## 📝 Code Standards

- **ES Modules**: Use `import`/`export` syntax
- **Async/Await**: Consistent async pattern usage
- **Error Handling**: Comprehensive try/catch with proper logging
- **JSDoc**: Document public APIs and complex functions
- **Testing**: 80%+ test coverage requirement

## 🔄 Development Workflow

```bash
# Start development server
npm run dev

# Run tests
npm test

# Check code quality
npm run lint

# Security audit
npm audit
```

## 📊 Monitoring & Observability

- **Health Checks**: `/health` endpoint with detailed system status
- **Structured Logging**: JSON logs with correlation IDs
- **Error Tracking**: Comprehensive error logging and alerting
- **Performance Metrics**: Request timing and throughput monitoring

## 🌐 Cloud Integration

- **Google Cloud Document AI**: Receipt OCR processing
- **WhatsApp Business API**: Message handling via Graph API
- **Cloud Run**: Containerized deployment target
- **Cloud Build**: CI/CD pipeline integration

---

**For detailed API documentation, see [../docs/API.md](../docs/API.md)**