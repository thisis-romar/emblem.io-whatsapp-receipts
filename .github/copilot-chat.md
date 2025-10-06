# GitHub Copilot Chat Instructions for WhatsApp Receipts Processing

This file provides specific guidance for GitHub Copilot Chat interactions when working on the WhatsApp receipts processing system.

## Effective Chat Prompts for This Project

### Getting Started Prompts

**Project Setup**
```
/help Set up a new WhatsApp receipts processing endpoint that receives webhook messages, downloads images, processes them with Google Cloud Document AI, and sends structured receipt data back to users.
```

**Environment Configuration**
```
/explain How do I configure Google Cloud Document AI credentials and WhatsApp Business API tokens for this Node.js application?
```

**Docker Setup**
```
/help Create a multi-stage Dockerfile for a Node.js 18 application that will be deployed to Google Cloud Run with proper security and optimization.
```

### Development Workflow Prompts

**API Integration**
```
@workspace /help Implement a robust WhatsApp media download service that handles retries, validates image formats, and processes images with Google Cloud Document AI.
```

**Error Handling**
```
/help Create comprehensive error handling for a webhook processor that handles Google Cloud API errors, WhatsApp API failures, and validation errors with proper user feedback.
```

**Security Implementation**
```
@workspace /help Add WhatsApp webhook signature verification middleware using crypto.timingSafeEqual for secure signature comparison.
```

**Testing Strategy**
```
/help Generate unit tests for a Document AI service that mocks Google Cloud client responses and tests receipt data parsing logic.
```

### Debugging and Troubleshooting Prompts

**Webhook Issues**
```
/explain My WhatsApp webhook is returning 401 errors. Help me debug the signature verification process and ensure proper HMAC validation.
```

**Document AI Problems**
```
@workspace /help Troubleshoot Google Cloud Document AI errors. The processor is returning code 3 (INVALID_ARGUMENT) for some receipt images.
```

**Performance Optimization**
```
/help Optimize this receipt processing function to reduce cold start times and improve memory usage for Google Cloud Run deployment.
```

**Cloud Run Deployment**
```
/explain My Cloud Run service is timing out during image processing. Help me configure proper timeout settings and resource allocation.
```

### Code Generation Prompts

**Service Implementation**
```
/help Generate a WhatsApp service class that handles message sending, media downloading, and implements exponential backoff retry logic for API calls.
```

**Middleware Creation**
```
@workspace /help Create validation middleware for WhatsApp webhook payloads that validates message structure, phone numbers, and image metadata.
```

**Configuration Management**
```
/help Create a configuration module that validates required environment variables and provides typed configuration objects for Google Cloud and WhatsApp settings.
```

**Health Check Implementation**
```
/help Implement comprehensive health checks that test Google Cloud Document AI connectivity and WhatsApp API availability with proper status reporting.
```

### Architecture and Design Prompts

**Microservice Structure**
```
/explain How should I structure this Node.js application following microservice patterns with proper separation between controllers, services, and middleware?
```

**Error Handling Strategy**
```
@workspace /help Design a centralized error handling system that provides appropriate error messages to users while logging detailed technical information for debugging.
```

**Scalability Planning**
```
/help What are the best practices for scaling this WhatsApp webhook processor on Google Cloud Run to handle high message volumes?
```

## Context-Aware Chat Guidelines

### When Working on Controllers
```
Focus on HTTP request/response handling, input validation, and error propagation. Keep controllers thin and delegate business logic to services.

Example chat: "@workspace help me create a webhook controller that validates WhatsApp signatures, processes image messages, and returns proper HTTP responses"
```

### When Working on Services
```
Emphasize business logic, external API integration, and comprehensive error handling. Services should be testable and reusable.

Example chat: "help me implement a Document AI service with proper error handling for quota limits, invalid documents, and network failures"
```

### When Working on Middleware
```
Focus on cross-cutting concerns like authentication, validation, logging, and rate limiting.

Example chat: "create middleware that adds correlation IDs to requests, validates webhook signatures, and implements rate limiting for the webhook endpoint"
```

### When Working on Tests
```
Prioritize comprehensive test coverage including unit tests, integration tests, and error scenarios.

Example chat: "@workspace generate integration tests for the complete webhook processing flow including WhatsApp message validation, image download, Document AI processing, and response sending"
```

## Project-Specific Context Keywords

Use these keywords in your chat prompts to get more relevant responses:

- **WhatsApp Business API**: For messaging and webhook functionality
- **Google Cloud Document AI**: For receipt processing and OCR
- **Cloud Run**: For deployment and scaling questions
- **ES modules**: For JavaScript module questions
- **Receipt processing**: For business logic questions
- **Webhook security**: For signature verification questions
- **Image processing**: For media handling questions
- **Error handling**: For robust error management
- **Rate limiting**: For API protection questions
- **Health checks**: For monitoring questions

## Conversation Patterns

### Progressive Enhancement Pattern
```
1. Start with basic implementation: "/help create a basic WhatsApp webhook handler"
2. Add security: "/help add signature verification to this webhook"
3. Add error handling: "/help add comprehensive error handling with proper logging"
4. Add performance optimization: "/help optimize this for Cloud Run deployment"
5. Add monitoring: "/help add health checks and metrics collection"
```

### Problem-Solution Pattern
```
1. Describe the specific issue: "My webhook is failing signature verification"
2. Provide context: "@workspace show the current signature verification code"
3. Request specific help: "/help fix the HMAC signature comparison to use timing-safe comparison"
4. Ask for improvements: "/help add better error messages for signature validation failures"
```

### Feature Development Pattern
```
1. Define requirements: "/help I need to add receipt data validation"
2. Get architecture guidance: "/explain how to structure receipt validation in this microservice architecture"
3. Request implementation: "/help create validation schemas for receipt data with proper error handling"
4. Add tests: "/help generate tests for the receipt validation logic"
```

## Advanced Chat Techniques

### Multi-File Context
```
@workspace /help Review the entire webhook processing flow from controller to service and suggest improvements for error handling and performance
```

### Specific File Focus
```
@src/services/documentAI.js /help Optimize this Document AI service for better error handling and retry logic
```

### Comparison and Analysis
```
@workspace /explain Compare my current WhatsApp service implementation with best practices for Node.js API clients and suggest improvements
```

### Documentation Generation
```
@workspace /help Generate comprehensive JSDoc comments for all public methods in the WhatsApp and Document AI services
```

## Best Practices for Chat Interactions

1. **Be Specific**: Include relevant file paths, function names, and error messages
2. **Provide Context**: Use @workspace or @filename to give Copilot relevant context
3. **Ask for Explanations**: Use /explain to understand existing code before making changes
4. **Request Complete Solutions**: Ask for implementation, tests, and documentation together
5. **Iterate and Refine**: Start with basic requests and progressively add complexity
6. **Focus on Security**: Always ask about security implications for webhook and API integrations
7. **Consider Performance**: Include performance considerations in your requests
8. **Think Production-Ready**: Ask for error handling, logging, and monitoring in all implementations

## Common Anti-Patterns to Avoid in Chat

- ❌ "Fix this code" without providing context or explaining the problem
- ❌ Asking for complete applications instead of specific components
- ❌ Ignoring security implications in webhook and API implementations
- ❌ Not asking about error handling and edge cases
- ❌ Forgetting to request tests for new functionality
- ❌ Not considering cloud deployment requirements
- ❌ Asking for synchronous implementations of async operations

## Example Chat Session

```
Developer: "@workspace /help I need to implement WhatsApp media download with proper error handling"

Copilot: [Provides implementation with try/catch, specific error types, retry logic]

Developer: "/help add exponential backoff retry logic to this media download function"

Copilot: [Enhances with retry mechanism]

Developer: "@workspace /help generate unit tests for this media download service"

Copilot: [Creates comprehensive tests with mocking]

Developer: "/explain how should I handle rate limiting from WhatsApp API in this implementation?"

Copilot: [Provides rate limiting strategy and implementation]
```

This structured approach to Copilot Chat interactions will help developers get more accurate, contextual, and useful assistance when building and maintaining the WhatsApp receipts processing system.