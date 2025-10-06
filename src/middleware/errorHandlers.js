/**
 * Error Handling Middleware for WhatsApp Receipt Processing
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle WhatsApp API errors
 */
const handleWhatsAppError = (err) => {
  let message = 'WhatsApp API error occurred';
  let statusCode = 500;

  if (err.response && err.response.data) {
    const { error } = err.response.data;
    if (error) {
      message = error.message || error.error_user_msg || 'WhatsApp API error';
      
      // Map WhatsApp error codes to HTTP status codes
      switch (error.code) {
        case 100: // Invalid parameter
        case 131009: // Parameter format error
          statusCode = 400;
          break;
        case 131005: // Access token invalid
        case 190: // Invalid access token
          statusCode = 401;
          break;
        case 131026: // Message undeliverable
        case 131031: // User phone number not valid
          statusCode = 400;
          message = 'Phone number is invalid or user cannot receive messages';
          break;
        case 131047: // Re-engagement message
          statusCode = 403;
          message = 'Cannot send message - user needs to re-engage first';
          break;
        case 131051: // Unsupported message type
          statusCode = 400;
          message = 'Message type not supported';
          break;
        case 80007: // Rate limit exceeded
          statusCode = 429;
          message = 'Rate limit exceeded - please try again later';
          break;
        default:
          statusCode = 500;
      }
    }
  }

  return new AppError(message, statusCode);
};

/**
 * Handle Google Cloud Document AI errors
 */
const handleDocumentAIError = (err) => {
  let message = 'Document processing error occurred';
  let statusCode = 500;

  if (err.code) {
    switch (err.code) {
      case 3: // INVALID_ARGUMENT
        statusCode = 400;
        message = 'Invalid document format or parameters';
        break;
      case 5: // NOT_FOUND
        statusCode = 404;
        message = 'Document processor not found';
        break;
      case 7: // PERMISSION_DENIED
        statusCode = 403;
        message = 'Permission denied for document processing';
        break;
      case 8: // RESOURCE_EXHAUSTED
        statusCode = 429;
        message = 'Document processing quota exceeded';
        break;
      case 11: // OUT_OF_RANGE
        statusCode = 400;
        message = 'Document too large or invalid format';
        break;
      case 14: // UNAVAILABLE
        statusCode = 503;
        message = 'Document AI service temporarily unavailable';
        break;
      default:
        statusCode = 500;
    }
  }

  return new AppError(message, statusCode);
};

/**
 * Handle file system errors
 */
const handleFileSystemError = (err) => {
  let message = 'File system error occurred';
  let statusCode = 500;

  switch (err.code) {
    case 'ENOENT':
      statusCode = 404;
      message = 'File or directory not found';
      break;
    case 'EACCES':
    case 'EPERM':
      statusCode = 403;
      message = 'Permission denied accessing file';
      break;
    case 'ENOSPC':
      statusCode = 507;
      message = 'Insufficient storage space';
      break;
    case 'EMFILE':
    case 'ENFILE':
      statusCode = 503;
      message = 'Too many open files';
      break;
    case 'EISDIR':
      statusCode = 400;
      message = 'Expected file but found directory';
      break;
    case 'ENOTDIR':
      statusCode = 400;
      message = 'Expected directory but found file';
      break;
    default:
      statusCode = 500;
  }

  return new AppError(message, statusCode);
};

/**
 * Handle validation errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors || {}).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

/**
 * Handle JWT expired errors
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

/**
 * Handle duplicate database fields
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'unknown';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle cast errors
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, req, res) => {
  console.error('💥 ERROR DETAILS:', {
    error: err,
    stack: err.stack,
    request: {
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query
    }
  });

  // API Error
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/webhook')) {
    return res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      error: err,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      request: {
        url: req.originalUrl,
        method: req.method
      }
    });
  }

  // Rendered website error
  res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, req, res) => {
  // Log error for monitoring
  console.error('💥 PRODUCTION ERROR:', {
    message: err.message,
    status: err.statusCode,
    stack: process.env.LOG_STACK_TRACE === 'true' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    request: {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  // API Error
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/webhook')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        timestamp: new Date().toISOString(),
        error_id: generateErrorId()
      });
    }

    // Programming or other unknown error: don't leak error details
    console.error('💥 UNKNOWN ERROR:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString(),
      error_id: generateErrorId()
    });
  }

  // Rendered website error
  if (err.isOperational) {
    return res.status(err.statusCode || 500).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }

  // Programming or other unknown error
  console.error('💥 UNKNOWN ERROR:', err);
  res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

/**
 * Generate unique error ID for tracking
 */
const generateErrorId = () => {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Handle uncaught exceptions
 */
const handleUncaughtException = (err) => {
  console.error('💥💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error('Stack:', err.stack);
  
  // Close server gracefully
  process.exit(1);
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = (err) => {
  console.error('💥💥 UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error('Stack:', err.stack);
  
  // Give ongoing requests time to finish
  server.close(() => {
    process.exit(1);
  });
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    
    // Handle WhatsApp API errors
    if (error.isAxiosError && error.response && error.response.status >= 400) {
      error = handleWhatsAppError(error);
    }
    
    // Handle Google Cloud errors
    if (error.code && typeof error.code === 'number' && error.details) {
      error = handleDocumentAIError(error);
    }
    
    // Handle file system errors
    if (error.code && typeof error.code === 'string' && error.errno) {
      error = handleFileSystemError(error);
    }

    sendErrorProd(error, req, res);
  }
};

/**
 * Middleware to handle async errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware for handling 404 errors
 */
const handleNotFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = (server) => {
  return (signal) => {
    console.log(`\n🛑 Received ${signal}. Graceful shutdown starting...`);
    
    server.close(() => {
      console.log('✅ HTTP server closed.');
      
      // Close database connections, cleanup resources, etc.
      console.log('🧹 Cleaning up resources...');
      
      // Exit process
      process.exit(0);
    });

    // Force close server after 30 seconds
    setTimeout(() => {
      console.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  };
};

/**
 * Setup process error handlers
 */
const setupProcessHandlers = (server) => {
  // Handle uncaught exceptions
  process.on('uncaughtException', handleUncaughtException);
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => handleUnhandledRejection(err, server));
  
  // Handle graceful shutdown
  process.on('SIGTERM', gracefulShutdown(server));
  process.on('SIGINT', gracefulShutdown(server));
};

/**
 * Request timeout handler
 */
const handleTimeout = (timeout = 30000) => {
  return (req, res, next) => {
    // Set timeout for request
    req.setTimeout(timeout, () => {
      const err = new AppError('Request timeout', 408);
      next(err);
    });
    
    // Set timeout for response
    res.setTimeout(timeout, () => {
      if (!res.headersSent) {
        res.status(408).json({
          status: 'error',
          message: 'Request timeout',
          timestamp: new Date().toISOString()
        });
      }
    });
    
    next();
  };
};

module.exports = {
  AppError,
  globalErrorHandler,
  handleNotFound,
  catchAsync,
  setupProcessHandlers,
  gracefulShutdown,
  handleTimeout,
  handleWhatsAppError,
  handleDocumentAIError,
  handleFileSystemError
};