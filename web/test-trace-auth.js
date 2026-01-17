/**
 * Test auth with comprehensive server-side logging
 */

const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:3000');
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testWithTrace() {
  console.log('=== AUTH TRACE TEST ===');
  console.log('This will trigger comprehensive server-side logging.\n');
  console.log('CHECK YOUR SERVER TERMINAL for detailed trace logs.\n');

  const timestamp = Date.now();
  const testEmail = `trace-test-${timestamp}@example.com`;
  const testPassword = 'TraceTest123!';

  console.log('Test credentials:');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('\n');

  // SIGNUP
  console.log('1. SIGNUP');
  console.log('=========');
  const signupPayload = {
    name: 'Trace Test User',
    email: testEmail,
    password: testPassword
  };

  const signupResponse = await makeRequest('POST', '/api/auth/sign-up/email', signupPayload);
  console.log('Status:', signupResponse.status);
  console.log('Result:', signupResponse.status === 200 ? '✅ SUCCESS' : '❌ FAILED');
  console.log('\n');

  // Wait for database write
  await new Promise(resolve => setTimeout(resolve, 500));

  // SIGNIN
  console.log('2. SIGNIN (with same credentials)');
  console.log('==================================');
  const signinPayload = {
    email: testEmail,
    password: testPassword
  };

  const signinResponse = await makeRequest('POST', '/api/auth/sign-in/email', signinPayload);
  console.log('Status:', signinResponse.status);
  console.log('Result:', signinResponse.status === 200 ? '✅ SUCCESS' : '❌ FAILED');

  if (signinResponse.status !== 200) {
    console.log('Error:', signinResponse.data);
  }

  console.log('\n');
  console.log('='.repeat(80));
  console.log('CHECK YOUR SERVER TERMINAL FOR DETAILED TRACE LOGS');
  console.log('='.repeat(80));
}

testWithTrace().catch(console.error);
