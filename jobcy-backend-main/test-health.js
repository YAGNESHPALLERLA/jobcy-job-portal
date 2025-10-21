#!/usr/bin/env node

// Simple health check test script
const http = require('http');

const testHealthCheck = () => {
  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 3001,
    path: '/health',
    method: 'GET',
    timeout: 5000
  };

  console.log('🔍 Testing health check endpoint...');
  console.log(`📍 URL: http://${options.hostname}:${options.port}${options.path}`);

  const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`📊 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response:', data);
      if (res.statusCode === 200) {
        console.log('✅ Health check passed!');
        process.exit(0);
      } else {
        console.log('❌ Health check failed!');
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error('❌ Request timeout');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

// Wait a bit for server to start, then test
setTimeout(testHealthCheck, 2000);
