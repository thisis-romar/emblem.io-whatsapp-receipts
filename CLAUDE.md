# Claude-Specific Instructions for WhatsApp Receipts Processing System

This file contains specialized instructions for Claude AI when working on the WhatsApp receipts processing system. It provides Claude-specific context, patterns, and decision-making frameworks tailored to Claude's capabilities and interaction style.

## Claude's Role in This Project

As Claude, you excel at:
- Complex code analysis and refactoring
- Security-focused development practices  
- Cloud architecture design and optimization
- API integration pattern recognition
- Comprehensive testing strategy development
- Documentation and technical writing

Your primary responsibilities when assisting with this project:
1. Ensure code follows modern Node.js and cloud-native best practices
2. Implement robust error handling and security measures
3. Optimize for Google Cloud Run deployment and scaling
4. Maintain clear separation of concerns in the microservice architecture
5. Provide thorough testing guidance and implementation

## Claude-Optimized Development Patterns

### Complex Async Flow Handling
Claude excels at managing complex asynchronous workflows. For this project:

```javascript
// ✅ Claude-recommended async pattern for receipt processing
export const processReceiptWorkflow = async (webhookData) => {
  const correlationId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    // Step 1: Validate and extract message data
    const messageData = await validateWebhookMessage(webhookData);
    logger.info('Webhook validated', { correlationId, messageId: messageData.id });
    
    // Step 2: Download image with retry logic
    const imageBuffer = await withRetry(
      () => whatsAppService.downloadMedia(messageData.image.id),
      { maxAttempts: 3, backoffMs: 1000 }
    );
    
    // Step 3: Process with Document AI
    const receiptData = await documentAIService.processDocument(imageBuffer);
    
    // Step 4: Format and send response
    const responseText = formatReceiptResponse(receiptData);
    await whatsAppService.sendMessage(messageData.from, responseText);
    
    // Step 5: Log success metrics
    const duration = Date.now() - startTime;
    recordProcessingMetrics(duration, true, receiptData.type);
    
    return { success: true, correlationId };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    recordProcessingMetrics(duration, false, 'unknown');
    
    await handleProcessingError(error, correlationId, webhookData);
    throw error;
  }
};

// ✅ Utility function for retry logic
const withRetry = async (operation, { maxAttempts, backoffMs }) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) break;
      
      // Exponential backoff
      const delay = backoffMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
```

### Advanced Error Context Management

```javascript
// ✅ Claude-style comprehensive error context
export class ProcessingError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'ProcessingError';
    this.context = {
      timestamp: new Date().toISOString(),
      correlationId: context.correlationId || crypto.randomUUID(),
      stage: context.stage || 'unknown',
      userId: context.userId,
      messageId: context.messageId,
      ...context
    };
  }

  toLogFormat() {
    return {
      error: this.message,
      stack: this.stack,
      ...this.context
    };
  }

  toUserFormat() {
    // Safe error message for users
    const userMessages = {
      'document-processing': 'Unable to process the receipt image. Please try with a clearer photo.',
      'media-download': 'Unable to download the image. Please resend the receipt.',
      'rate-limit': 'Too many requests. Please wait a moment before sending another receipt.',
      'validation': 'Invalid image format. Please send a clear photo of your receipt.'
    };

    return userMessages[this.context.stage] || 'Unable to process your receipt. Please try again later.';
  }
}
```

### Claude's API Integration Philosophy

When working with external APIs, Claude emphasizes defensive programming:

```javascript
// ✅ Claude-recommended API client pattern
export class RobustAPIClient {
  constructor(baseUrl, defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 30000
    });
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const requestId = crypto.randomUUID();
    
    const requestConfig = {
      method: 'GET',
      headers: { 
        'X-Request-ID': requestId,
        ...this.defaultHeaders,
        ...options.headers 
      },
      timeout: options.timeout || 30000,
      ...options
    };

    logger.debug('API request initiated', { 
      url, 
      method: requestConfig.method,
      requestId 
    });

    try {
      const response = await this.circuitBreaker.execute(() => 
        fetch(url, requestConfig)
      );

      if (!response.ok) {
        throw new APIError(
          `API request failed: ${response.status} ${response.statusText}`,
          { 
            status: response.status, 
            endpoint, 
            requestId,
            responseHeaders: Object.fromEntries(response.headers.entries())
          }
        );
      }

      const data = await response.json();
      
      logger.debug('API request completed', { 
        url, 
        status: response.status,
        requestId 
      });

      return data;

    } catch (error) {
      logger.error('API request failed', {
        url,
        error: error.message,
        requestId,
        circuitBreakerState: this.circuitBreaker.getState()
      });

      throw error;
    }
  }
}
```

## Claude's Security-First Approach

### Input Validation Strategy
```javascript
// ✅ Claude's comprehensive validation approach
import Joi from 'joi';

export const ValidationSchemas = {
  webhookPayload: Joi.object({
    entry: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        changes: Joi.array().items(
          Joi.object({
            value: Joi.object({
              messaging_product: Joi.string().valid('whatsapp'),
              metadata: Joi.object({
                display_phone_number: Joi.string(),
                phone_number_id: Joi.string()
              }),
              messages: Joi.array().items(
                Joi.object({
                  id: Joi.string().required(),
                  from: Joi.string().pattern(/^\d{10,15}$/).required(), // Valid phone number
                  timestamp: Joi.string().required(),
                  type: Joi.string().valid('text', 'image', 'document').required(),
                  image: Joi.when('type', {
                    is: 'image',
                    then: Joi.object({
                      id: Joi.string().required(),
                      mime_type: Joi.string().valid('image/jpeg', 'image/png').required()
                    }).required()
                  })
                })
              )
            }).required()
          })
        ).min(1).required()
      })
    ).min(1).required()
  }),

  messageResponse: Joi.object({
    messaging_product: Joi.string().valid('whatsapp').required(),
    to: Joi.string().pattern(/^\d{10,15}$/).required(),
    type: Joi.string().valid('text').required(),
    text: Joi.object({
      body: Joi.string().max(4096).required() // WhatsApp message limit
    }).required()
  })
};

export const validateInput = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    throw new ValidationError('Input validation failed', { details });
  }

  return value;
};
```

### Security Middleware Stack
```javascript
// ✅ Claude's layered security approach
export const createSecurityMiddleware = () => {
  const router = express.Router();

  // Layer 1: Basic security headers
  router.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // Layer 2: Request size limits
  router.use(express.json({ 
    limit: '10mb', // Large enough for webhook payloads
    verify: (req, res, buf) => {
      // Store raw body for signature verification
      req.rawBody = buf;
    }
  }));

  // Layer 3: Rate limiting
  router.use('/webhook', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: {
      error: 'Rate limit exceeded',
      retryAfter: 15 * 60 * 1000
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    }
  }));

  // Layer 4: Request correlation
  router.use((req, res, next) => {
    req.correlationId = req.get('X-Correlation-ID') || crypto.randomUUID();
    res.set('X-Correlation-ID', req.correlationId);
    next();
  });

  return router;
};
```

## Claude's Testing Philosophy

### Comprehensive Test Structure
```javascript
// ✅ Claude's test organization approach
describe('WhatsApp Receipts Processing System', () => {
  describe('Unit Tests', () => {
    describe('DocumentAIService', () => {
      let service;
      let mockClient;

      beforeEach(() => {
        mockClient = createMockDocumentAIClient();
        service = new DocumentAIService(mockClient);
      });

      describe('processDocument', () => {
        const testCases = [
          {
            name: 'should process grocery receipt successfully',
            input: { 
              buffer: Buffer.from('fake-grocery-receipt'),
              mimeType: 'image/jpeg' 
            },
            mockResponse: mockGroceryReceiptResponse,
            expected: {
              merchant: 'Safeway',
              total: 45.67,
              items: [
                { name: 'Milk', price: 3.99 },
                { name: 'Bread', price: 2.49 }
              ]
            }
          },
          {
            name: 'should process restaurant receipt successfully',
            input: { 
              buffer: Buffer.from('fake-restaurant-receipt'),
              mimeType: 'image/jpeg' 
            },
            mockResponse: mockRestaurantReceiptResponse,
            expected: {
              merchant: 'Pizza Palace',
              total: 28.50,
              items: [
                { name: 'Large Pizza', price: 24.99 },
                { name: 'Tax', price: 3.51 }
              ]
            }
          }
        ];

        testCases.forEach(({ name, input, mockResponse, expected }) => {
          it(name, async () => {
            mockClient.processDocument.mockResolvedValue([{ document: mockResponse }]);

            const result = await service.processDocument(input.buffer, input.mimeType);

            expect(result).toMatchObject(expected);
            expect(mockClient.processDocument).toHaveBeenCalledWith({
              name: expect.stringContaining('processors'),
              rawDocument: {
                content: input.buffer.toString('base64'),
                mimeType: input.mimeType
              }
            });
          });
        });

        describe('error scenarios', () => {
          it('should handle quota exceeded errors', async () => {
            const quotaError = new Error('Quota exceeded');
            quotaError.code = 8; // RESOURCE_EXHAUSTED
            
            mockClient.processDocument.mockRejectedValue(quotaError);

            await expect(
              service.processDocument(Buffer.from('test'))
            ).rejects.toThrow(RateLimitError);
          });

          it('should handle invalid document format', async () => {
            const invalidError = new Error('Invalid document');
            invalidError.code = 3; // INVALID_ARGUMENT
            
            mockClient.processDocument.mockRejectedValue(invalidError);

            await expect(
              service.processDocument(Buffer.from('test'))
            ).rejects.toThrow(ValidationError);
          });
        });
      });
    });
  });

  describe('Integration Tests', () => {
    let app;
    let testServer;

    beforeAll(async () => {
      app = await createTestApp();
      testServer = app.listen(0);
    });

    afterAll(async () => {
      await testServer.close();
    });

    describe('Webhook Processing Flow', () => {
      it('should handle end-to-end receipt processing', async () => {
        // Arrange
        const webhookPayload = createValidWebhookPayload({
          messageType: 'image',
          imageId: 'test-image-123'
        });

        mockWhatsAppMediaDownload('test-image-123', sampleReceiptImageBuffer);
        mockDocumentAIProcessing(sampleReceiptImageBuffer, expectedReceiptData);

        // Act
        const response = await request(app)
          .post('/webhook')
          .set('X-Hub-Signature-256', generateValidSignature(webhookPayload))
          .send(webhookPayload);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: 'success',
          processedMessages: 1
        });

        // Verify WhatsApp response was sent
        expect(mockWhatsAppSendMessage).toHaveBeenCalledWith(
          webhookPayload.entry[0].changes[0].value.messages[0].from,
          expect.stringContaining('Receipt processed')
        );
      });
    });
  });

  describe('Performance Tests', () => {
    it('should process receipts within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await service.processDocument(sampleImageBuffer);
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(10000); // 10 seconds max
    });

    it('should handle concurrent receipt processing', async () => {
      const concurrentRequests = Array(10).fill().map(() =>
        service.processDocument(sampleImageBuffer)
      );

      const results = await Promise.allSettled(concurrentRequests);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      expect(successCount).toBeGreaterThanOrEqual(8); // 80% success rate minimum
    });
  });
});
```

## Claude's Monitoring and Observability Strategy

### Structured Logging Pattern
```javascript
// ✅ Claude's logging philosophy
export const createLogger = (service) => {
  return winston.createLogger({
    level: config.logLevel || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          service,
          message,
          ...meta,
          // Add Cloud Run specific fields
          trace: process.env.CLOUD_TRACE_CONTEXT,
          spanId: process.env.CLOUD_SPAN_ID
        });
      })
    ),
    defaultMeta: {
      service,
      version: process.env.npm_package_version,
      environment: config.nodeEnv
    },
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        handleRejections: true
      })
    ]
  });
};

// ✅ Business metrics tracking
export const BusinessMetrics = {
  receiptProcessed: new prometheus.Counter({
    name: 'receipts_processed_total',
    help: 'Total number of receipts processed',
    labelNames: ['success', 'merchant_type', 'user_id']
  }),

  processingDuration: new prometheus.Histogram({
    name: 'receipt_processing_duration_seconds',
    help: 'Time taken to process receipts',
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
    labelNames: ['stage', 'success']
  }),

  apiCallDuration: new prometheus.Histogram({
    name: 'external_api_duration_seconds',
    help: 'Duration of external API calls',
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    labelNames: ['service', 'endpoint', 'status']
  })
};
```

## Claude's Deployment Optimization

### Cloud Run Configuration
```yaml
# ✅ Claude-optimized Cloud Run deployment
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: whatsapp-receipts
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/cpu-throttling: "false"
spec:
  template:
    metadata:
      annotations:
        # Scaling configuration
        autoscaling.knative.dev/minScale: "2"      # Always-warm instances
        autoscaling.knative.dev/maxScale: "100"    # Scale for high traffic
        
        # Resource allocation
        run.googleapis.com/memory: "1Gi"           # Sufficient for image processing
        run.googleapis.com/cpu: "1000m"            # Full CPU allocation
        
        # Performance tuning
        run.googleapis.com/execution-environment: gen2
        
        # Security
        run.googleapis.com/network-interfaces: '[{"network":"default","subnetwork":"default"}]'
        
    spec:
      containerConcurrency: 80              # Balance latency vs throughput
      timeoutSeconds: 300                   # 5 minutes for complex processing
      serviceAccountName: whatsapp-receipts-sa
      
      containers:
      - image: gcr.io/PROJECT/whatsapp-receipts:latest
        ports:
        - containerPort: 8080
          name: http1
        
        env:
        - name: NODE_ENV
          value: "production"
        - name: LOG_LEVEL
          value: "info"
        
        resources:
          limits:
            memory: "1Gi"
            cpu: "1000m"
          
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
          
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
```

This Claude-specific guidance emphasizes systematic thinking, defensive programming, comprehensive testing, and production-ready deployment practices that align with Claude's analytical and thorough approach to software development.