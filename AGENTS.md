# Agent-Specific Instructions for WhatsApp Receipts Processing System

This file contains AI agent-specific guidance for working with this WhatsApp receipts processing system. It provides context, patterns, and decision-making frameworks for AI assistants helping developers build and maintain this project.

## Project Context & Architecture

### System Overview
The WhatsApp receipts processing system is a cloud-native microservice that:
1. Receives WhatsApp webhook messages containing receipt images
2. Downloads images from WhatsApp's media API
3. Processes images using Google Cloud Document AI to extract receipt data
4. Sends structured receipt information back to the user via WhatsApp

### Technology Decision Rationale

**Node.js 18+ with ES Modules**
- Modern async/await patterns for handling webhook processing
- Native support for Google Cloud Client Libraries
- ES modules provide better tree-shaking and cleaner imports
- LTS version ensures stability for production workloads

**Google Cloud Document AI**
- Pre-trained receipt processing models
- Structured data extraction (merchant, total, line items, date)
- Handles various receipt formats and layouts
- Scalable processing without custom ML model training

**WhatsApp Business Cloud API**
- Direct integration with Meta's infrastructure
- Webhook-based real-time message processing
- Media download capabilities for image processing
- Global reach and reliability

### Code Generation Guidelines

When generating code for this project, always:

1. **Use ES Module Syntax**
   ```javascript
   // ✅ Correct
   import express from 'express';
   export const processReceipt = async () => {};
   
   // ❌ Avoid
   const express = require('express');
   module.exports = { processReceipt };
   ```

2. **Implement Comprehensive Error Handling**
   ```javascript
   // ✅ Always include specific error types and logging
   try {
     const result = await documentAI.processDocument(buffer);
     return result;
   } catch (error) {
     logger.error('Document processing failed', {
       error: error.message,
       correlationId: req.correlationId,
       context: 'receipt-processing'
     });
     
     if (error.code === 3) { // INVALID_ARGUMENT
       throw new ValidationError('Invalid document format');
     }
     throw new ProcessingError('Document processing failed');
   }
   ```

3. **Security-First Approach**
   ```javascript
   // ✅ Always verify webhook signatures
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
   ```

## AI Assistant Decision Framework

### When Users Ask for New Features

1. **Assess Cloud Integration Impact**
   - Will this require new Google Cloud services?
   - Does it affect WhatsApp API rate limits?
   - Is additional authentication/authorization needed?

2. **Consider Scalability**
   - How will this perform under high message volume?
   - Does it require state management or can remain stateless?
   - Will it impact cold start performance on Cloud Run?

3. **Security Implications**
   - Does it handle user data? Implement proper sanitization
   - New endpoints need authentication middleware
   - Consider GDPR/privacy implications for receipt data

### Common Request Patterns & Responses

**"Add support for multiple receipt formats"**
- Suggest updating Document AI processor configuration
- Implement format detection logic
- Add validation for different MIME types
- Update error handling for unsupported formats

**"Add receipt data validation"**
- Implement structured validation schemas
- Add business rule validation (e.g., reasonable totals)
- Suggest data quality scoring
- Consider machine learning for anomaly detection

**"Improve error messages to users"**
- Create user-friendly message templates
- Implement progressive error disclosure
- Add retry mechanisms for transient failures
- Consider multilingual support

**"Add receipt storage/history"**
- Evaluate Google Cloud Storage vs. Firestore
- Implement data retention policies
- Add user consent mechanisms
- Design privacy-compliant data models

### Code Review Checklist for AI Assistants

When reviewing or generating code, ensure:

#### ✅ Security Checklist
- [ ] Webhook signature verification implemented
- [ ] Input validation on all endpoints
- [ ] No secrets in code (use environment variables)
- [ ] Rate limiting on public endpoints
- [ ] Proper error message sanitization
- [ ] HTTPS enforcement middleware

#### ✅ Performance Checklist
- [ ] Async/await used consistently
- [ ] External API calls have timeouts
- [ ] Proper connection pooling for databases
- [ ] Memory-efficient image processing
- [ ] Appropriate Cloud Run resource allocation

#### ✅ Maintainability Checklist
- [ ] Clear separation of concerns (controllers/services/middleware)
- [ ] Comprehensive error logging with correlation IDs
- [ ] Unit tests for business logic
- [ ] Integration tests for external APIs
- [ ] Documentation for complex business rules

#### ✅ Cloud-Native Checklist
- [ ] Stateless design (no in-memory session storage)
- [ ] Health check endpoints implemented
- [ ] Graceful shutdown handling
- [ ] Environment-based configuration
- [ ] Structured logging for Cloud Logging

### API Integration Patterns

#### Google Cloud Document AI
```javascript
// ✅ Standard pattern for Document AI integration
class DocumentAIService {
  constructor() {
    this.client = new DocumentProcessorServiceClient();
    this.processorPath = this.client.processorPath(
      config.projectId,
      config.location, // us-central1 for optimal performance
      config.processorId
    );
  }

  async processDocument(imageBuffer, mimeType = 'image/jpeg') {
    // Validate input size (Document AI has limits)
    if (imageBuffer.length > 20 * 1024 * 1024) { // 20MB limit
      throw new ValidationError('Image too large for processing');
    }

    const request = {
      name: this.processorPath,
      rawDocument: {
        content: imageBuffer.toString('base64'),
        mimeType
      }
    };

    try {
      const [result] = await this.client.processDocument(request);
      return this.parseReceiptData(result.document);
    } catch (error) {
      // Handle specific Google Cloud error codes
      this.handleDocumentAIError(error);
    }
  }

  handleDocumentAIError(error) {
    switch (error.code) {
      case 3: // INVALID_ARGUMENT
        throw new ValidationError('Invalid document format or content');
      case 7: // PERMISSION_DENIED
        throw new AuthenticationError('Document AI access denied');
      case 8: // RESOURCE_EXHAUSTED
        throw new RateLimitError('Document AI quota exceeded');
      case 14: // UNAVAILABLE
        throw new ServiceUnavailableError('Document AI temporarily unavailable');
      default:
        throw new ProcessingError(`Document AI error: ${error.message}`);
    }
  }
}
```

#### WhatsApp Business API
```javascript
// ✅ Standard pattern for WhatsApp API integration
class WhatsAppService {
  constructor() {
    this.baseUrl = `https://graph.facebook.com/v19.0/${config.phoneNumberId}`;
    this.headers = {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  async downloadMedia(mediaId) {
    try {
      // Step 1: Get media URL
      const mediaInfoResponse = await this.makeRequest(`/${mediaId}`);
      const mediaInfo = await mediaInfoResponse.json();

      // Step 2: Download actual media
      const mediaResponse = await this.makeRequest(mediaInfo.url, {
        headers: { 'Authorization': this.headers.Authorization }
      });

      if (!mediaResponse.ok) {
        throw new Error(`Failed to download media: ${mediaResponse.status}`);
      }

      return await mediaResponse.buffer();
    } catch (error) {
      logger.error('Media download failed', {
        mediaId,
        error: error.message
      });
      throw new MediaDownloadError(`Failed to download media: ${error.message}`);
    }
  }

  async sendMessage(to, text) {
    // Validate message length (WhatsApp limits)
    if (text.length > 4096) {
      throw new ValidationError('Message too long for WhatsApp');
    }

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    };

    try {
      const response = await this.makeRequest('/messages', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return await response.json();
    } catch (error) {
      this.handleWhatsAppError(error, to);
    }
  }
}
```

### Testing Strategy Guidelines

#### Unit Test Priorities
1. **Business Logic Validation**
   - Receipt data parsing accuracy
   - Data validation rules
   - Error handling edge cases

2. **External API Mocking**
   - Document AI response parsing
   - WhatsApp API error scenarios
   - Network failure simulation

3. **Security Validation**
   - Webhook signature verification
   - Input sanitization
   - Authorization checks

#### Integration Test Focus
1. **End-to-End Webhook Processing**
   - Real WhatsApp webhook payload processing
   - Image download and processing flow
   - Response message delivery

2. **External Service Health**
   - Google Cloud service availability
   - WhatsApp API connectivity
   - Fallback mechanism validation

### Deployment & Operations Guidance

#### Cloud Run Configuration
```yaml
# ✅ Recommended Cloud Run service configuration
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: whatsapp-receipts
  annotations:
    run.googleapis.com/cpu-throttling: "false"  # For consistent performance
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"    # Reduce cold starts
        autoscaling.knative.dev/maxScale: "100"  # Handle traffic spikes
        run.googleapis.com/memory: "512Mi"       # Sufficient for image processing
        run.googleapis.com/cpu: "1000m"          # Full CPU allocation
    spec:
      containerConcurrency: 10  # Balance latency vs. throughput
      timeoutSeconds: 300       # Allow time for large image processing
```

#### Monitoring & Alerting
```javascript
// ✅ Custom metrics for monitoring
export const recordProcessingMetrics = (duration, success, receiptType) => {
  // Record processing time
  processingDurationHistogram
    .labels({ success: success.toString(), type: receiptType })
    .observe(duration);

  // Count processed receipts
  processedReceiptsCounter
    .labels({ success: success.toString() })
    .inc();

  // Track API health
  if (!success) {
    apiErrorCounter
      .labels({ service: 'document-ai' })
      .inc();
  }
};
```

### Common Anti-Patterns to Avoid

#### ❌ Don't Store Secrets in Code
```javascript
// ❌ Never do this
const whatsAppToken = 'EAAxxxxxxxxxxxx';

// ✅ Use environment variables
const whatsAppToken = process.env.WHATSAPP_ACCESS_TOKEN;
```

#### ❌ Don't Ignore Error Details
```javascript
// ❌ Generic error handling
try {
  await processDocument(buffer);
} catch (error) {
  res.status(500).send('Error');
}

// ✅ Specific error handling
try {
  await processDocument(buffer);
} catch (error) {
  logger.error('Document processing failed', { error: error.message });
  
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ 
    error: 'Processing failed',
    correlationId: req.correlationId 
  });
}
```

#### ❌ Don't Block the Event Loop
```javascript
// ❌ Synchronous operations
const processedData = heavyProcessingSync(data);

// ✅ Use async patterns
const processedData = await heavyProcessingAsync(data);
```

#### ❌ Don't Skip Input Validation
```javascript
// ❌ Trust user input
app.post('/webhook', (req, res) => {
  const message = req.body.entry[0].changes[0].value.messages[0];
  // Process without validation
});

// ✅ Validate all inputs
app.post('/webhook', validateWebhookPayload, (req, res) => {
  // Safe to process validated data
});
```

### Performance Optimization Guidelines

#### Image Processing Optimization
- Validate image size before processing (reject >20MB)
- Use streaming for large file operations
- Implement caching for duplicate image processing
- Consider image compression for storage

#### API Rate Limit Management
- Implement exponential backoff for retries
- Monitor API quotas and usage
- Cache responses when appropriate
- Use batch operations where available

#### Memory Management
- Process images in streams when possible
- Clear buffers after processing
- Monitor memory usage in production
- Set appropriate garbage collection flags

This guidance helps AI assistants make informed decisions when helping developers build, debug, and extend the WhatsApp receipts processing system. Always prioritize security, reliability, and maintainability in recommendations.