# Path-Specific GitHub Copilot Instructions

This file contains specific guidance for different components of the WhatsApp receipts processing system.

## src/controllers/

Controllers handle HTTP requests and coordinate with services. Keep them thin and focused on request/response handling.

### Patterns:
```javascript
// ✅ Controller structure
export const webhookController = async (req, res, next) => {
  try {
    const { body } = req;
    const result = await whatsAppService.processWebhook(body);
    
    res.status(200).json({ 
      status: 'success',
      processedMessages: result.length 
    });
  } catch (error) {
    next(error); // Let error middleware handle it
  }
};

// ✅ Webhook verification (GET request)
export const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
};
```

### Key Requirements:
- Always use try-catch with `next(error)` for error propagation
- Validate request structure before processing
- Return consistent response formats
- Log important events with correlation IDs
- Handle both GET (verification) and POST (webhook) for WhatsApp endpoints

## src/services/

Services contain business logic and external API integrations. Make them testable and reusable.

### documentAI.js Service:
```javascript
// ✅ Document AI service with proper error handling
export class DocumentAIService {
  constructor() {
    this.client = new DocumentProcessorServiceClient();
    this.processorPath = this.client.processorPath(
      config.projectId,
      config.location,
      config.processorId
    );
  }

  async processDocument(imageBuffer, mimeType = 'image/jpeg') {
    const request = {
      name: this.processorPath,
      rawDocument: {
        content: imageBuffer.toString('base64'),
        mimeType
      }
    };

    const [result] = await this.client.processDocument(request);
    return this.parseReceiptData(result.document);
  }

  parseReceiptData(document) {
    // Extract structured data from Document AI response
    return {
      merchant: this.extractMerchant(document),
      total: this.extractTotal(document),
      items: this.extractLineItems(document),
      date: this.extractDate(document)
    };
  }
}
```

### whatsApp.js Service:
```javascript
// ✅ WhatsApp service with retry logic
export class WhatsAppService {
  constructor() {
    this.baseUrl = `https://graph.facebook.com/v19.0/${config.phoneNumberId}`;
    this.headers = {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  async downloadMedia(mediaId) {
    const response = await fetch(`${this.baseUrl}/${mediaId}`, {
      headers: { 'Authorization': this.headers.Authorization }
    });
    
    const mediaInfo = await response.json();
    const imageResponse = await fetch(mediaInfo.url, {
      headers: { 'Authorization': this.headers.Authorization }
    });
    
    return await imageResponse.buffer();
  }

  async sendMessage(to, text) {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    };

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`);
    }

    return await response.json();
  }
}
```

### Key Requirements:
- Use dependency injection for testability
- Implement proper error handling with specific error types
- Include retry logic for external API calls
- Log all external API interactions
- Return structured, consistent data formats

## src/middleware/

Middleware handles cross-cutting concerns like authentication, validation, and logging.

### validation.js:
```javascript
// ✅ WhatsApp webhook validation
export const validateWhatsAppSignature = (req, res, next) => {
  const signature = req.get('X-Hub-Signature-256');
  const payload = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', config.whatsAppAppSecret)
    .update(payload)
    .digest('hex');
  
  const signatureBuffer = Buffer.from(signature || '', 'utf8');
  const expectedBuffer = Buffer.from(`sha256=${expectedSignature}`, 'utf8');
  
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
};

// ✅ Request validation
export const validateWebhookPayload = (req, res, next) => {
  const { entry } = req.body;
  
  if (!entry || !Array.isArray(entry) || entry.length === 0) {
    return res.status(400).json({ 
      error: 'Invalid payload structure' 
    });
  }
  
  next();
};
```

### errorHandlers.js:
```javascript
// ✅ Centralized error handling
export const errorHandler = (error, req, res, next) => {
  const correlationId = req.correlationId || crypto.randomUUID();
  
  logger.error('Request failed', {
    correlationId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.message,
      correlationId
    });
  }

  if (error instanceof AuthenticationError) {
    return res.status(401).json({
      error: 'Authentication failed',
      correlationId
    });
  }

  // Generic server error
  res.status(500).json({
    error: config.nodeEnv === 'production' 
      ? 'Internal server error' 
      : error.message,
    correlationId
  });
};

// ✅ 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
};
```

### Key Requirements:
- Always include correlation IDs for request tracking
- Validate all inputs before processing
- Use timing-safe comparison for security-sensitive operations
- Provide clear, actionable error messages
- Never expose sensitive information in error responses

## tests/

Tests should mirror the src/ structure and provide comprehensive coverage.

### Unit Test Structure:
```javascript
// ✅ Service test example
describe('DocumentAIService', () => {
  let service;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      processDocument: jest.fn(),
      processorPath: jest.fn().mockReturnValue('mock-processor-path')
    };
    
    service = new DocumentAIService();
    service.client = mockClient;
  });

  describe('processDocument', () => {
    it('should process receipt image successfully', async () => {
      const mockDocument = {
        text: 'Receipt text',
        entities: [
          { type: 'total_amount', mentionText: '$25.99' }
        ]
      };
      
      mockClient.processDocument.mockResolvedValue([{ document: mockDocument }]);
      
      const result = await service.processDocument(Buffer.from('image'));
      
      expect(result).toHaveProperty('total');
      expect(mockClient.processDocument).toHaveBeenCalledWith({
        name: 'mock-processor-path',
        rawDocument: {
          content: expect.any(String),
          mimeType: 'image/jpeg'
        }
      });
    });

    it('should handle API errors gracefully', async () => {
      const apiError = new Error('Processing failed');
      mockClient.processDocument.mockRejectedValue(apiError);
      
      await expect(service.processDocument(Buffer.from('image')))
        .rejects.toThrow('Processing failed');
    });
  });
});
```

### Integration Test Structure:
```javascript
// ✅ Webhook integration test
describe('WhatsApp Webhook Integration', () => {
  let app;
  
  beforeAll(async () => {
    app = await createTestApp();
  });

  it('should process image message webhook', async () => {
    const webhookPayload = {
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg-123',
              from: '1234567890',
              type: 'image',
              image: { id: 'image-123' }
            }]
          }
        }]
      }]
    };

    const signature = createWebhookSignature(webhookPayload);
    
    const response = await request(app)
      .post('/webhook')
      .set('X-Hub-Signature-256', signature)
      .send(webhookPayload)
      .expect(200);

    expect(response.body).toEqual({
      status: 'success',
      processedMessages: 1
    });
  });
});
```

### Key Requirements:
- Mock all external dependencies (Google Cloud, WhatsApp API)
- Test both success and failure scenarios
- Include performance tests for critical paths
- Test security validations (signature verification, input sanitization)
- Maintain 80%+ code coverage
- Use descriptive test names that explain the scenario

## Docker & Deployment

### Dockerfile Optimization:
```dockerfile
# ✅ Multi-stage build for smaller images
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runtime
WORKDIR /app

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies and source
COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

EXPOSE 8080

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

CMD ["node", "src/app.js"]
```

### Cloud Build Configuration:
```yaml
# ✅ cloudbuild.yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['ci']
    
  # Run tests
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['test']
    env:
      - 'NODE_ENV=test'
    
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/whatsapp-receipts:$COMMIT_SHA', '.']
    
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'whatsapp-receipts'
      - '--image=gcr.io/$PROJECT_ID/whatsapp-receipts:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'

options:
  logging: CLOUD_LOGGING_ONLY
```

### Key Requirements:
- Use multi-stage builds to minimize image size
- Run containers as non-root user for security
- Include health checks for container orchestration
- Set appropriate resource limits
- Configure proper logging and monitoring
- Use environment-specific configuration

## Security Best Practices

### Authentication & Authorization:
```javascript
// ✅ API key validation middleware
export const validateApiKey = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  
  if (!apiKey || apiKey !== config.apiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// ✅ Rate limiting
import rateLimit from 'express-rate-limit';

export const webhookRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many webhook requests',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false
});
```

### Input Sanitization:
```javascript
// ✅ Sanitize user inputs
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeMessage = (message) => {
  if (typeof message !== 'string') {
    throw new ValidationError('Message must be a string');
  }
  
  // Remove potential XSS attempts
  const cleaned = DOMPurify.sanitize(message);
  
  // Validate length
  if (cleaned.length > 4096) {
    throw new ValidationError('Message too long');
  }
  
  return cleaned;
};
```

### Key Requirements:
- Validate all inputs at API boundaries
- Implement rate limiting on all public endpoints
- Use HTTPS everywhere (enforce with middleware)
- Sanitize data before logging or storage
- Implement proper CORS policies
- Never log sensitive information (tokens, secrets)
- Use security headers (Helmet.js)
- Implement request size limits