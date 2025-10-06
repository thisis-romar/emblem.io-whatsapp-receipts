# GitHub Copilot Instructions for WhatsApp Receipt Processing System

## 📋 Project Overview

This is a **WhatsApp Receipt Processing System** built with **Node.js/Express** that automatically processes receipt images sent via WhatsApp Business API using **Google Document AI** for OCR and expense extraction.

**Core Purpose**: Automate expense reporting by allowing users to send receipt photos via WhatsApp, extract expense data using OCR, and manage approvals through interactive messaging.

## 🏗️ Architecture & Stack

### **Technology Stack**
- **Backend**: Node.js 18+, Express.js
- **OCR Engine**: Google Document AI (Expense Processor)
- **Messaging**: WhatsApp Business Cloud API
- **Storage**: JSON file-based (upgradeable to cloud storage)
- **Deployment**: Google Cloud Run, Docker containers
- **Security**: Helmet.js, CORS, rate limiting, webhook signature validation

### **Project Structure**
```
├── src/
│   ├── app.js                 # Main Express application
│   ├── routes/
│   │   ├── whatsapp.js       # WhatsApp webhook handlers
│   │   └── health.js         # Health check endpoints
│   ├── services/
│   │   ├── whatsapp.js       # WhatsApp API integration
│   │   ├── receiptProcessor.js # OCR and data extraction
│   │   └── storage.js        # Data persistence layer
│   ├── middleware/
│   │   ├── validation.js     # Request validation
│   │   └── errorHandlers.js  # Error handling
│   └── utils/              # Utility functions
├── config/                 # Configuration files
├── storage/               # Local data storage
├── tests/                 # Test files
└── docs/                  # Documentation
```

## 🎯 Key Components & Responsibilities

### **1. WhatsApp Integration (`src/services/whatsapp.js`)**
- **Purpose**: Handle all WhatsApp Business API communications
- **Key Methods**:
  - `sendMessage()`: Send text messages to users
  - `sendInteractiveMessage()`: Send buttons/quick replies
  - `getMediaUrl()`: Retrieve media URLs from WhatsApp
  - `downloadMedia()`: Download receipt images
  - `verifyWebhook()`: Validate webhook signatures

**Copilot Context**: This service handles WhatsApp-specific operations. Rate limits apply (1000 messages/day free tier). Always use proper error handling for API calls.

### **2. Receipt Processing (`src/services/receiptProcessor.js`)**
- **Purpose**: OCR processing and expense data extraction
- **Key Methods**:
  - `processReceipt()`: Main processing pipeline
  - `processWithDocumentAI()`: Google Document AI integration
  - `parseReceiptData()`: Extract structured expense data
  - `extractMerchant()`, `extractTotal()`, `extractDate()`: Field-specific extraction

**Copilot Context**: Document AI costs $10/1000 pages. Includes mock OCR fallback for development. Always validate extracted data and handle OCR failures gracefully.

### **3. Data Storage (`src/services/storage.js`)**
- **Purpose**: Receipt data persistence and management
- **Key Methods**:
  - `saveReceipt()`: Store receipt data
  - `loadReceipt()`: Retrieve receipt data
  - `exportToCSV()`: Generate expense reports
  - `getStats()`: Usage statistics
  - `cleanup()`: Remove old files

**Copilot Context**: Uses JSON file storage with upgrade path to cloud databases. Implements proper file locking and error recovery.

### **4. Route Handlers (`src/routes/whatsapp.js`)**
- **Purpose**: Process WhatsApp webhook events
- **Key Endpoints**:
  - `GET /webhook/whatsapp`: Webhook verification
  - `POST /webhook/whatsapp`: Message processing
- **Message Types Handled**: text, image, interactive (button responses)

**Copilot Context**: Webhook responses must be within 20 seconds. Use async processing for time-consuming operations.

## 🔧 Development Guidelines

### **Code Style & Patterns**
```javascript
// ✅ GOOD: Proper async/await with error handling
async function processReceipt(mediaId, phoneNumber) {
  try {
    const mediaUrl = await whatsappService.getMediaUrl(mediaId);
    const imageBuffer = await whatsappService.downloadMedia(mediaUrl);
    const ocrResult = await processWithDocumentAI(imageBuffer);
    return ocrResult;
  } catch (error) {
    console.error('❌ Receipt processing failed:', error);
    throw new AppError('Failed to process receipt', 500);
  }
}

// ❌ BAD: Missing error handling and logging
async function processReceipt(mediaId, phoneNumber) {
  const mediaUrl = await whatsappService.getMediaUrl(mediaId);
  const imageBuffer = await whatsappService.downloadMedia(mediaUrl);
  return await processWithDocumentAI(imageBuffer);
}
```

### **Error Handling Standards**
- Use `AppError` class for operational errors
- Always log errors with context
- Return appropriate HTTP status codes
- Handle WhatsApp API rate limits gracefully
- Implement fallback mechanisms for OCR failures

### **Logging Standards**
```javascript
// ✅ GOOD: Structured logging with context
console.log('📱 Processing WhatsApp message:', {
  phoneNumber,
  messageType,
  timestamp: new Date().toISOString()
});

// ❌ BAD: Plain text logging
console.log('Processing message');
```

### **Security Best Practices**
- Always verify WhatsApp webhook signatures
- Validate all input parameters using Joi schemas
- Implement rate limiting (60 requests/minute default)
- Use HTTPS in production (required for WhatsApp)
- Sanitize file names and paths
- Never log sensitive data (tokens, personal info)

## 📱 WhatsApp Business API Integration

### **Message Flow**
1. User sends receipt image to WhatsApp Business number
2. Webhook delivers message to `/webhook/whatsapp`
3. System downloads and processes image with OCR
4. Extracted data sent back as interactive message
5. User approves/rejects/edits through button responses

### **Supported Message Types**
- **Image Messages**: Receipt photos (JPEG, PNG, WebP)
- **Text Messages**: Commands and descriptions
- **Interactive Messages**: Approval buttons, quick replies

### **Rate Limits & Quotas**
- **Free Tier**: 1,000 business-initiated messages/month
- **User-initiated**: Unlimited responses (24-hour window)
- **Media Downloads**: 100MB/day limit
- **Webhook Response**: Must respond within 20 seconds

### **Error Handling Scenarios**
```javascript
// Handle common WhatsApp API errors
if (error.response?.data?.error?.code === 131047) {
  // User needs to re-engage - send template message
  await sendReEngagementMessage(phoneNumber);
} else if (error.response?.status === 429) {
  // Rate limit - queue message for retry
  await queueMessageForRetry(message);
}
```

## 🤖 Google Document AI Integration

### **Processor Configuration**
- **Type**: `EXPENSE_PROCESSOR`
- **Region**: `us-central1` (default)
- **Input**: Images (JPEG, PNG, PDF up to 10MB)
- **Output**: Structured expense data

### **Expected OCR Fields**
```javascript
const expectedFields = {
  merchant_name: 'string',      // Business name
  total_amount: 'number',       // Final amount
  transaction_date: 'date',     // Receipt date
  tax_amount: 'number',         // Tax portion
  currency: 'string',           // Currency code
  line_items: 'array',          // Individual items
  payment_method: 'string'      // Payment type
};
```

### **Cost Optimization**
- Process images at optimal resolution (1024px max width)
- Use mock OCR in development (`ENABLE_MOCK_OCR=true`)
- Implement caching for repeated processing
- Monitor usage through GCP Console

## 🔄 Development Workflow

### **Local Development Setup**
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.template .env
# Edit .env with your credentials

# 3. Start development server
npm run dev

# 4. Test webhook with ngrok
ngrok http 3000
# Use ngrok URL for WhatsApp webhook configuration
```

### **Testing Strategy**
- **Unit Tests**: Individual service methods
- **Integration Tests**: WhatsApp webhook flow
- **Manual Testing**: Send actual WhatsApp messages
- **Mock Testing**: Use `ENABLE_MOCK_OCR=true` for OCR testing

### **Debugging Tips**
```javascript
// Enable debug mode
process.env.LOG_LEVEL = 'debug';
process.env.DEBUG_WHATSAPP = 'true';

// Test webhook verification
curl "http://localhost:3000/webhook/whatsapp?hub.mode=subscribe&hub.challenge=test&hub.verify_token=your_token"

// Monitor logs for message processing
tail -f logs/app.log
```

## 🚀 Deployment & Production

### **Environment Variables**
**Required for Production**:
```env
WHATSAPP_ACCESS_TOKEN=EAA...          # From Meta Developer Console
WHATSAPP_PHONE_NUMBER_ID=123...       # Phone number ID
WEBHOOK_VERIFY_TOKEN=secure_token     # Webhook verification
GOOGLE_CLOUD_PROJECT_ID=project-id    # GCP project
DOCUMENT_AI_PROCESSOR_ID=processor    # Document AI processor
```

### **Google Cloud Run Deployment**
```bash
# Build and deploy
gcloud run deploy whatsapp-receipts \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

### **Production Checklist**
- [ ] HTTPS enabled (required for WhatsApp webhooks)
- [ ] Environment variables configured
- [ ] Service account permissions verified
- [ ] Webhook URL updated in Meta Developer Console
- [ ] Health checks configured
- [ ] Monitoring and alerting set up
- [ ] Error tracking enabled
- [ ] Backup strategy implemented

## 🐛 Common Issues & Solutions

### **Issue: Webhook Verification Failed**
```javascript
// Problem: WEBHOOK_VERIFY_TOKEN mismatch
// Solution: Ensure token matches Meta Developer Console
if (req.query['hub.verify_token'] !== process.env.WEBHOOK_VERIFY_TOKEN) {
  return res.status(403).send('Invalid verify token');
}
```

### **Issue: Document AI Permission Denied**
```bash
# Problem: Service account lacks permissions
# Solution: Add Document AI roles
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/documentai.apiUser"
```

### **Issue: WhatsApp Message Not Delivered**
```javascript
// Problem: Rate limits or invalid phone number
// Check rate limits and phone number format
const phoneRegex = /^\d{10,15}$/;
if (!phoneRegex.test(phoneNumber)) {
  throw new AppError('Invalid phone number format', 400);
}
```

## 📊 Monitoring & Observability

### **Health Check Endpoints**
- `/health` - Basic application health
- `/health/ready` - Kubernetes readiness probe
- `/health/live` - Kubernetes liveness probe

### **Key Metrics to Monitor**
- Receipt processing success rate
- WhatsApp API response times
- Document AI processing costs
- Error rates by type
- Active user count

### **Logging Strategy**
```javascript
// Structured logging for monitoring
console.log('📊 Receipt processed:', {
  receiptId,
  phoneNumber,
  merchant: extractedData.merchant,
  amount: extractedData.total,
  processingTime: Date.now() - startTime,
  success: true
});
```

## 💡 Feature Extension Guidelines

### **Adding New Message Types**
```javascript
// Extend message handler in whatsapp.js route
const messageHandlers = {
  text: handleTextMessage,
  image: handleImageMessage,
  document: handleDocumentMessage,  // NEW
  location: handleLocationMessage   // NEW
};
```

### **Adding New OCR Processors**
```javascript
// Extend receiptProcessor.js
const processors = {
  expense: processExpenseReceipt,
  invoice: processInvoiceDocument,    // NEW
  identity: processIdentityDocument   // NEW
};
```

### **Adding Database Support**
```javascript
// Replace storage.js with database service
// Maintain same interface for backward compatibility
class DatabaseStorage {
  async saveReceipt(receipt) {
    // PostgreSQL/MongoDB implementation
  }
}
```

## 🔐 Security Considerations

### **Data Protection**
- Receipt images processed in memory only
- Extracted data stored with encryption at rest
- Personal data anonymization options
- GDPR compliance for EU users

### **API Security**
- Webhook signature validation mandatory
- API key authentication for management endpoints
- Rate limiting per IP and per user
- Input validation using Joi schemas

### **Production Security Hardening**
```javascript
// Security middleware configuration
app.use(helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
}));
```

## 🎨 UI/UX Guidelines for WhatsApp Interactions

### **Message Design Patterns**
```javascript
// ✅ GOOD: Clear, actionable messages
const confirmationMessage = {
  text: "📄 Receipt processed!\n\n" +
        "🏪 Merchant: Starbucks\n" +
        "💰 Total: $12.45\n" +
        "📅 Date: 2024-01-15\n\n" +
        "Please review:",
  buttons: [
    { id: 'approve', title: '✅ Approve' },
    { id: 'reject', title: '❌ Reject' },
    { id: 'edit', title: '✏️ Edit' }
  ]
};

// ❌ BAD: Unclear, verbose messages
const badMessage = {
  text: "Your receipt has been processed by our system using optical character recognition technology..."
};
```

### **Error Message Guidelines**
- Use friendly, non-technical language
- Provide clear next steps
- Include helpful emojis for visual clarity
- Offer alternatives when possible

## 📚 Additional Resources

- **WhatsApp Business API**: https://developers.facebook.com/docs/whatsapp
- **Google Document AI**: https://cloud.google.com/document-ai/docs
- **Express.js Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **Node.js Production Guide**: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

---

## 🎯 Copilot Prompt Templates

### **For New Features**
"I need to add [feature] to the WhatsApp receipt system. This should integrate with [component] and handle [specific use case]. Please follow the existing patterns in [relevant file] and include proper error handling and logging."

### **For Bug Fixes**
"There's an issue with [component] where [problem description]. The error occurs in [context]. Please investigate the [relevant service/route] and provide a solution that maintains backward compatibility."

### **For Optimization**
"I want to optimize [specific functionality] for better performance. Currently it [current behavior], but it should [desired behavior]. Please suggest improvements while maintaining the existing API contract."

---

**Remember**: This system processes personal financial data. Always prioritize security, privacy, and reliability in all code changes. Test thoroughly before deployment, especially webhook integrations and OCR processing.