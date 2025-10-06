# WhatsApp Receipt Processing System

A comprehensive Node.js application that processes receipt images sent via WhatsApp using Google Document AI for OCR and expense extraction.

## 🚀 Features

- **WhatsApp Integration**: Receive receipt images via WhatsApp Business API
- **OCR Processing**: Extract expense data using Google Document AI
- **Receipt Management**: Store, approve, and export receipt data
- **Interactive Responses**: Send confirmation messages with receipt details
- **Data Export**: Export approved receipts to CSV format
- **Health Monitoring**: Built-in health checks and monitoring endpoints
- **Error Handling**: Comprehensive error handling and logging
- **Rate Limiting**: Built-in rate limiting and security features

## 📋 Prerequisites

Before you begin, ensure you have the following:

### 1. Node.js Environment
- Node.js 18+ installed
- npm or yarn package manager

### 2. WhatsApp Business API Setup
- Meta Developer Account
- WhatsApp Business App created
- Phone number verified and added to the app
- Access token generated

### 3. Google Cloud Setup
- Google Cloud Project with billing enabled
- Document AI API enabled
- Document AI processor created (Expense Processor)
- Service account with Document AI permissions
- Service account key downloaded as JSON

### 4. Development Tools (Optional)
- Ngrok for local webhook testing
- Postman or similar for API testing

## 🛠️ Installation

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd whatsapp-receipts

# Install dependencies
npm install

# Copy environment template
cp .env.template .env
```

### 2. Environment Configuration

Edit `.env` file with your credentials:

```env
# WhatsApp Configuration
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WEBHOOK_VERIFY_TOKEN=your_secure_token

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_REGION=us-central1
DOCUMENT_AI_PROCESSOR_ID=your_processor_id
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-service-account.json

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Google Cloud Service Account

1. Download your service account key from Google Cloud Console
2. Save it as `config/gcp-service-account.json`
3. Ensure the service account has Document AI permissions

### 4. WhatsApp Webhook Setup

For local development with ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Start your application
npm run dev

# In another terminal, expose your local server
ngrok http 3000

# Use the ngrok URL for webhook setup in Meta Developer Console
# Webhook URL: https://your-ngrok-url.com/webhook/whatsapp
```

## 🚀 Quick Start

### 1. Development Mode
```bash
npm run dev
```

### 2. Production Mode
```bash
npm start
```

### 3. Test the Webhook
```bash
# Test webhook verification
curl "http://localhost:3000/webhook/whatsapp?hub.mode=subscribe&hub.challenge=test&hub.verify_token=your_token"

# Should return: test
```

## 📱 Usage

### Sending Receipts via WhatsApp

1. Add your WhatsApp Business number to your contacts
2. Send a receipt image with optional caption
3. The bot will:
   - Process the image using OCR
   - Extract expense details
   - Send confirmation message with extracted data
   - Provide approval/correction options

### Example WhatsApp Flow

```
User: [Sends receipt image with caption "Lunch meeting"]

Bot: 📄 Receipt processed successfully!

🏪 Merchant: Starbucks Coffee
💰 Total: $12.45
📅 Date: 2024-01-15
📝 Category: Food & Dining

Please review and confirm:
[✅ Approve] [❌ Reject] [✏️ Edit]

User: [Taps ✅ Approve]

Bot: ✅ Receipt approved! Added to your expense report.
```

## 🔧 API Endpoints

### Webhook Endpoints
- `GET /webhook/whatsapp` - Webhook verification
- `POST /webhook/whatsapp` - Process WhatsApp messages

### Health Check Endpoints
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Receipt Management (Protected)
- `GET /api/receipts` - List receipts
- `GET /api/receipts/:id` - Get specific receipt
- `PUT /api/receipts/:id` - Update receipt
- `DELETE /api/receipts/:id` - Delete receipt
- `GET /api/receipts/export` - Export to CSV

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t whatsapp-receipts .
```

### Run with Docker
```bash
docker run -p 3000:3000 --env-file .env whatsapp-receipts
```

### Docker Compose
```bash
docker-compose up -d
```

## ☁️ Google Cloud Run Deployment

### 1. Build and Push Image
```bash
# Configure gcloud
gcloud auth configure-docker

# Build and tag image
docker build -t gcr.io/your-project/whatsapp-receipts .

# Push to Container Registry
docker push gcr.io/your-project/whatsapp-receipts
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy whatsapp-receipts \
  --image gcr.io/your-project/whatsapp-receipts \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

### 3. Update Webhook URL
Update your WhatsApp webhook URL to the Cloud Run service URL.

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Manual Testing

1. **Webhook Verification**:
   ```bash
   curl "http://localhost:3000/webhook/whatsapp?hub.mode=subscribe&hub.challenge=test&hub.verify_token=your_token"
   ```

2. **Health Checks**:
   ```bash
   curl http://localhost:3000/health
   ```

3. **Receipt Processing** (with ngrok for WhatsApp):
   - Send receipt image to your WhatsApp Business number
   - Check logs for processing details

## 📊 Monitoring

### Health Endpoints
- **Basic Health**: `/health`
- **Readiness**: `/health/ready` (for K8s/Cloud Run)
- **Liveness**: `/health/live` (for K8s/Cloud Run)

### Logging
The application uses structured logging with different levels:
- `ERROR`: Critical errors that need immediate attention
- `WARN`: Warning conditions that should be monitored
- `INFO`: General operational messages
- `DEBUG`: Detailed information for debugging

### Metrics
Built-in metrics tracking:
- Receipt processing success/failure rates
- Response times
- Error counts by type
- Active users and message volume

## 🔒 Security

### Authentication
- WhatsApp webhook signature verification
- Optional API key authentication for management endpoints
- Environment-based configuration

### Rate Limiting
- Built-in rate limiting (60 requests/minute by default)
- Configurable per-IP limits
- Webhook-specific rate limiting

### Data Security
- Receipt images processed in memory (not stored permanently)
- Extracted data stored locally with cleanup policies
- CORS protection for web interfaces

## 🚨 Troubleshooting

### Common Issues

1. **Webhook Verification Failed**
   ```
   Error: Invalid verify token
   Solution: Check WEBHOOK_VERIFY_TOKEN matches Meta configuration
   ```

2. **Document AI Permission Denied**
   ```
   Error: Permission denied for Document AI
   Solution: Verify service account has documentai.documents.process permission
   ```

3. **WhatsApp Message Not Received**
   ```
   Issue: Bot not responding to messages
   Check: Webhook URL is accessible and using HTTPS in production
   ```

4. **Rate Limit Exceeded**
   ```
   Error: Too many requests
   Solution: Implement proper rate limiting and retry logic
   ```

### Debug Mode

Enable debug mode by setting:
```env
LOG_LEVEL=debug
DEBUG_WHATSAPP=true
```

### Health Check Failures

Check the health endpoint for detailed system status:
```bash
curl http://localhost:3000/health
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Stateless application design allows multiple instances
- Use load balancer for webhook distribution
- Consider Redis for session storage if needed

### Performance Optimization
- Implement caching for frequently accessed data
- Use CDN for static assets
- Optimize image processing pipeline

### Cost Management
- Monitor Document AI usage (pricing per page)
- Implement usage quotas per user
- Use appropriate Cloud Run CPU/memory allocation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed
- Follow semantic versioning

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Meta WhatsApp Business API** for messaging platform
- **Google Document AI** for OCR capabilities
- **Node.js Community** for excellent ecosystem
- **Express.js** for robust web framework

## 📞 Support

For questions, issues, or feature requests:

1. Check existing [GitHub Issues](https://github.com/your-repo/issues)
2. Create a new issue with detailed description
3. Contact support team at support@yourcompany.com

---

## 🔗 Additional Resources

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Google Document AI Documentation](https://cloud.google.com/document-ai/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Built with ❤️ for automated expense management**