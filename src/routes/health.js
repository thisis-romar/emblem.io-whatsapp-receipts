const express = require('express');
const router = express.Router();
const os = require('os');
const pkg = require('../../package.json');

/**
 * GET /health - Basic health check endpoint
 */
router.get('/', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      human: formatUptime(uptime)
    },
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
      unit: 'MB'
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      loadAverage: os.loadavg()
    },
    application: {
      name: pkg.name,
      version: pkg.version,
      environment: process.env.NODE_ENV || 'development'
    }
  };

  res.status(200).json(healthData);
});

/**
 * GET /health/ready - Kubernetes readiness probe
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if all critical services are available
    const checks = await performReadinessChecks();
    
    if (checks.every(check => check.status === 'ok')) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        checks
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * GET /health/live - Kubernetes liveness probe
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

/**
 * Perform readiness checks for critical services
 */
async function performReadinessChecks() {
  const checks = [];

  // Check environment variables
  checks.push({
    name: 'environment_variables',
    status: checkEnvironmentVariables() ? 'ok' : 'error',
    message: checkEnvironmentVariables() ? 'All required environment variables present' : 'Missing required environment variables'
  });

  // Check Google Cloud credentials (if in production)
  if (process.env.NODE_ENV === 'production') {
    checks.push({
      name: 'google_cloud_credentials',
      status: process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'ok' : 'error',
      message: process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'Google Cloud credentials configured' : 'Google Cloud credentials missing'
    });
  }

  // Check disk space (basic check)
  try {
    const stats = require('fs').statSync('./');
    checks.push({
      name: 'disk_space',
      status: 'ok',
      message: 'Disk accessible'
    });
  } catch (error) {
    checks.push({
      name: 'disk_space',
      status: 'error',
      message: 'Disk access error'
    });
  }

  return checks;
}

/**
 * Check if required environment variables are present
 */
function checkEnvironmentVariables() {
  const required = [
    'WHATSAPP_ACCESS_TOKEN',
    'WEBHOOK_VERIFY_TOKEN'
  ];

  return required.every(env => process.env[env]);
}

/**
 * Format uptime in human readable format
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

module.exports = router;