const Joi = require('joi');

/**
 * Middleware to validate webhook verification token
 */
const validateWebhook = (req, res, next) => {
  // Skip validation for non-webhook routes
  if (!req.path.includes('/webhook/')) {
    return next();
  }

  // For GET requests (webhook verification), validate the verify token
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (!mode || !token || !challenge) {
      console.log('❌ Invalid webhook verification parameters');
      return res.status(400).json({ error: 'Invalid webhook verification parameters' });
    }

    // This validation is also done in the route, but this provides early validation
    return next();
  }

  // For POST requests, validate the webhook secret if configured
  if (req.method === 'POST' && process.env.WHATSAPP_WEBHOOK_SECRET) {
    const signature = req.headers['x-hub-signature-256'];
    
    if (!signature) {
      console.log('❌ Missing webhook signature');
      return res.status(401).json({ error: 'Missing webhook signature' });
    }

    // The actual signature validation is done in the WhatsApp service
    // This just checks that the header exists
  }

  next();
};

/**
 * Middleware to validate WhatsApp webhook payload
 */
const validateWhatsAppWebhook = (req, res, next) => {
  try {
    const schema = Joi.object({
      object: Joi.string().required(),
      entry: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          changes: Joi.array().items(
            Joi.object({
              field: Joi.string().required(),
              value: Joi.object().required()
            })
          ).required()
        })
      ).required()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
      console.log('❌ Invalid WhatsApp webhook payload:', error.details[0].message);
      return res.status(400).json({ 
        error: 'Invalid webhook payload', 
        details: error.details[0].message 
      });
    }

    next();
  } catch (err) {
    console.error('❌ Error validating webhook:', err);
    res.status(500).json({ error: 'Webhook validation error' });
  }
};

/**
 * Middleware to validate receipt processing request
 */
const validateReceiptRequest = (req, res, next) => {
  try {
    const schema = Joi.object({
      media_id: Joi.string().required(),
      phone_number: Joi.string().pattern(/^\d{10,15}$/).required(),
      contact_name: Joi.string().max(100).optional(),
      caption: Joi.string().max(500).optional()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: error.details[0].message 
      });
    }

    next();
  } catch (err) {
    console.error('❌ Error validating receipt request:', err);
    res.status(500).json({ error: 'Request validation error' });
  }
};

/**
 * Middleware to validate phone number format
 */
const validatePhoneNumber = (req, res, next) => {
  const phoneNumber = req.params.phoneNumber || req.body.phone_number;
  
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Basic phone number validation (10-15 digits)
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ 
      error: 'Invalid phone number format. Must be 10-15 digits without country code prefix.' 
    });
  }

  next();
};

/**
 * Middleware to validate receipt ID format
 */
const validateReceiptId = (req, res, next) => {
  const receiptId = req.params.receiptId || req.body.receipt_id;
  
  if (!receiptId) {
    return res.status(400).json({ error: 'Receipt ID is required' });
  }

  // UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(receiptId)) {
    return res.status(400).json({ 
      error: 'Invalid receipt ID format. Must be a valid UUID.' 
    });
  }

  next();
};

/**
 * Middleware to validate query parameters for receipt listing
 */
const validateReceiptQuery = (req, res, next) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(1000).default(50),
      offset: Joi.number().integer().min(0).default(0),
      status: Joi.string().valid('pending_approval', 'approved', 'rejected', 'corrected').optional(),
      start_date: Joi.date().iso().optional(),
      end_date: Joi.date().iso().min(Joi.ref('start_date')).optional(),
      phone_number: Joi.string().pattern(/^\d{10,15}$/).optional()
    });

    const { error, value } = schema.validate(req.query);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Invalid query parameters', 
        details: error.details[0].message 
      });
    }

    // Add validated values to request
    req.validatedQuery = value;
    next();
  } catch (err) {
    console.error('❌ Error validating query parameters:', err);
    res.status(500).json({ error: 'Query validation error' });
  }
};

/**
 * Middleware to validate file upload
 */
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Check file type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, PDF' 
    });
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxSize) {
    return res.status(400).json({ 
      error: 'File too large. Maximum size is 10MB' 
    });
  }

  next();
};

/**
 * Middleware to validate environment configuration
 */
const validateEnvironment = (req, res, next) => {
  const requiredEnvVars = [
    'WHATSAPP_ACCESS_TOKEN',
    'WEBHOOK_VERIFY_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'Missing required environment variables'
    });
  }

  next();
};

/**
 * Middleware to validate API key (for protected endpoints)
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const validApiKey = process.env.API_KEY;

  // Skip validation if no API key is configured
  if (!validApiKey) {
    console.warn('⚠️ API_KEY not configured, skipping authentication');
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  if (apiKey !== validApiKey) {
    console.log('❌ Invalid API key provided');
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};

/**
 * Middleware to validate request rate limiting (basic implementation)
 */
const validateRateLimit = (() => {
  const requests = new Map();
  const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '60');
  const WINDOW_MS = 60 * 1000; // 1 minute

  return (req, res, next) => {
    // Skip rate limiting in development
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // Clean old requests
    const userRequests = requests.get(identifier) || [];
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= RATE_LIMIT) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        details: `Rate limit: ${RATE_LIMIT} requests per minute` 
      });
    }

    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': RATE_LIMIT,
      'X-RateLimit-Remaining': RATE_LIMIT - recentRequests.length,
      'X-RateLimit-Reset': new Date(now + WINDOW_MS).toISOString()
    });

    next();
  };
})();

module.exports = {
  validateWebhook,
  validateWhatsAppWebhook,
  validateReceiptRequest,
  validatePhoneNumber,
  validateReceiptId,
  validateReceiptQuery,
  validateFileUpload,
  validateEnvironment,
  validateApiKey,
  validateRateLimit
};