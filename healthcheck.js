/**
 * Simple health check script for Docker HEALTHCHECK
 */

const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 5000
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Health check passed');
    process.exit(0);
  } else {
    console.error(`❌ Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('❌ Health check error:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('❌ Health check timeout');
  request.destroy();
  process.exit(1);
});

request.end();