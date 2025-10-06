# WhatsApp Receipts Processing - Quick Reference Guide

## Essential Commands

### Setup & Development
```bash
npm install                    # Install dependencies
cp .env.example .env          # Copy environment template
npm run dev                   # Start development server
npm test                      # Run all tests
npm run test:watch            # Run tests in watch mode
npm run lint                  # Run linting
```

### Docker & Deployment
```bash
docker build -t whatsapp-receipts .     # Build container
docker run -p 8080:8080 whatsapp-receipts # Run locally
gcloud builds submit                     # Build in Cloud Build
gcloud run deploy                        # Deploy to Cloud Run
```

### Testing & Debugging
```bash
npm run test:unit             # Unit tests only
npm run test:integration     # Integration tests
npm run test:coverage        # Test coverage report
npm run debug:webhooks       # Debug webhook connectivity
npm run logs:production      # View production logs
```

## Code Patterns Quick Reference

### ES Module Imports (Always Use)
```javascript
import express from 'express';
import { DocumentProcessorServiceClient } from '@google-cloud/document-ai';
import crypto from 'crypto';

export const myFunction = async () => {};
export default myClass;
```

### Error Handling Pattern
```javascript
try {
  const result = await externalAPI.call();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', {
    error: error.message,
    correlationId: req.correlationId,
    context: 'operation-name'
  });
  
  if (error.code === 3) { // INVALID_ARGUMENT
    throw new ValidationError('Invalid input');
  }
  throw new ProcessingError('Operation failed');
}
```

### Webhook Security Validation
```javascript
const signature = req.get('X-Hub-Signature-256');
const expectedSignature = crypto
  .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
  .update(req.rawBody)
  .digest('hex');

if (!crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(`sha256=${expectedSignature}`)
)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Service Class Template
```javascript
export class MyService {
  constructor(config) {
    this.config = config;
    this.client = new ExternalClient();
  }

  async performOperation(data) {
    try {
      const result = await this.client.operation(data);
      return this.processResult(result);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    switch (error.code) {
      case 3: throw new ValidationError('Invalid input');
      case 7: throw new AuthenticationError('Access denied');
      case 8: throw new RateLimitError('Rate limit exceeded');
      default: throw new ProcessingError('Operation failed');
    }
  }
}
```

### Controller Pattern
```javascript
export const myController = async (req, res, next) => {
  try {
    const { body } = req;
    const result = await myService.process(body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error); // Let error middleware handle it
  }
};
```

### Middleware Pattern
```javascript
export const myMiddleware = (req, res, next) => {
  // Add correlation ID
  req.correlationId = crypto.randomUUID();
  res.set('X-Correlation-ID', req.correlationId);
  
  // Validate input
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  
  next();
};
```

## Google Cloud Integration Snippets

### Document AI Setup
```javascript
import { DocumentProcessorServiceClient } from '@google-cloud/document-ai';

const client = new DocumentProcessorServiceClient();
const processorPath = client.processorPath(
  process.env.GOOGLE_CLOUD_PROJECT_ID,
  'us-central1',
  process.env.GOOGLE_CLOUD_PROCESSOR_ID
);

const request = {
  name: processorPath,
  rawDocument: {
    content: imageBuffer.toString('base64'),
    mimeType: 'image/jpeg'
  }
};

const [result] = await client.processDocument(request);
```

### WhatsApp API Integration
```javascript
const whatsAppAPI = {
  baseUrl: `https://graph.facebook.com/v19.0/${phoneNumberId}`,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
};

// Download media
const mediaResponse = await fetch(`${whatsAppAPI.baseUrl}/${mediaId}`, {
  headers: { 'Authorization': whatsAppAPI.headers.Authorization }
});

// Send message
await fetch(`${whatsAppAPI.baseUrl}/messages`, {
  method: 'POST',
  headers: whatsAppAPI.headers,
  body: JSON.stringify({
    messaging_product: 'whatsapp',
    to: phoneNumber,
    type: 'text',
    text: { body: message }
  })
});
```

## Testing Templates

### Unit Test Template
```javascript
describe('MyService', () => {
  let service;
  let mockClient;

  beforeEach(() => {
    mockClient = { operation: jest.fn() };
    service = new MyService({ client: mockClient });
  });

  it('should process data successfully', async () => {
    mockClient.operation.mockResolvedValue({ result: 'success' });
    
    const result = await service.performOperation({ input: 'test' });
    
    expect(result).toEqual({ result: 'success' });
    expect(mockClient.operation).toHaveBeenCalledWith({ input: 'test' });
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('API Error');
    error.code = 3;
    mockClient.operation.mockRejectedValue(error);
    
    await expect(service.performOperation({ input: 'test' }))
      .rejects.toThrow(ValidationError);
  });
});
```

### Integration Test Template
```javascript
describe('Webhook Integration', () => {
  let app;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it('should process webhook successfully', async () => {
    const webhookPayload = { /* valid payload */ };
    const signature = generateTestSignature(webhookPayload);

    const response = await request(app)
      .post('/webhook')
      .set('X-Hub-Signature-256', signature)
      .send(webhookPayload)
      .expect(200);

    expect(response.body).toEqual({ success: true });
  });
});
```

## Environment Variables Quick Setup

### Required Variables
```bash
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PROCESSOR_ID=your-processor-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# WhatsApp
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_APP_SECRET=your-app-secret
WEBHOOK_VERIFY_TOKEN=your-verify-token

# Application
NODE_ENV=development
PORT=8080
LOG_LEVEL=debug
```

### Configuration Validation
```javascript
const requiredEnvVars = [
  'GOOGLE_CLOUD_PROJECT_ID',
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_APP_SECRET'
];

const missing = requiredEnvVars.filter(key => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}
```

## Debugging Checklist

### Webhook Issues
- [ ] Verify webhook URL is publicly accessible
- [ ] Check X-Hub-Signature-256 header format
- [ ] Confirm WHATSAPP_APP_SECRET matches Facebook app settings
- [ ] Validate webhook payload structure
- [ ] Check for proper JSON parsing middleware

### Document AI Issues
- [ ] Verify GOOGLE_APPLICATION_CREDENTIALS path
- [ ] Check processor ID and location match
- [ ] Confirm image format is supported (JPEG/PNG)
- [ ] Validate image size (max 20MB)
- [ ] Check Google Cloud project billing

### WhatsApp API Issues
- [ ] Verify access token is valid and not expired
- [ ] Check phone number ID matches WhatsApp Business account
- [ ] Confirm message format follows API specification
- [ ] Validate recipient phone number format
- [ ] Check API rate limits

### Cloud Run Issues
- [ ] Verify container memory allocation (min 512Mi)
- [ ] Check timeout settings (max 300s for processing)
- [ ] Confirm environment variables are set
- [ ] Validate service account permissions
- [ ] Check container port configuration (8080)

## Performance Optimization Tips

### Image Processing
```javascript
// Validate image size before processing
if (imageBuffer.length > 20 * 1024 * 1024) { // 20MB
  throw new ValidationError('Image too large');
}

// Use streaming for large operations
const stream = fs.createReadStream(imagePath);
```

### API Rate Limiting
```javascript
// Implement exponential backoff
const delay = baseDelay * Math.pow(2, attempt - 1);
await new Promise(resolve => setTimeout(resolve, delay));
```

### Memory Management
```javascript
// Clear large buffers after use
processImageBuffer(buffer);
buffer = null; // Help garbage collection
```

### Cloud Run Optimization
```dockerfile
# Use multi-stage builds
FROM node:18-alpine AS dependencies
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
COPY --from=dependencies /app/node_modules ./node_modules
```

## Security Checklist

- [ ] All webhook signatures verified with timing-safe comparison
- [ ] Input validation on all endpoints
- [ ] No secrets in code (use environment variables)
- [ ] Rate limiting implemented on public endpoints
- [ ] HTTPS enforced in production
- [ ] Security headers configured (Helmet.js)
- [ ] Request size limits set
- [ ] Error messages don't expose sensitive information

## Common Anti-Patterns to Avoid

- ❌ Using CommonJS (`require`/`module.exports`)
- ❌ Storing secrets in code
- ❌ Synchronous operations in async context
- ❌ Missing error handling in async functions
- ❌ Not validating webhook signatures
- ❌ Exposing internal errors to users
- ❌ Missing input validation
- ❌ Not implementing retries for external APIs

## Quick Links & Resources

- **WhatsApp Business API**: https://developers.facebook.com/docs/whatsapp
- **Google Cloud Document AI**: https://cloud.google.com/document-ai/docs
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices
- **Google Cloud Run**: https://cloud.google.com/run/docs
- **Express.js Security**: https://expressjs.com/en/advanced/best-practice-security.html

This quick reference guide provides immediate access to the most commonly used patterns, commands, and configurations for the WhatsApp receipts processing system.