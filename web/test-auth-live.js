/**
 * Live Authentication API Test
 *
 * This script tests the Better Auth endpoints directly to verify
 * the authentication system is working correctly.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
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
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
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

async function testAuthSystem() {
  console.log('=== Live Authentication System Test ===\n');

  // Test 1: Check if Better Auth endpoint is accessible
  console.log('Test 1: Better Auth Endpoint Accessibility');
  console.log('------------------------------------------');
  try {
    const response = await makeRequest('GET', '/api/auth');
    console.log(`✅ Better Auth endpoint accessible`);
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    console.log(`❌ Better Auth endpoint not accessible: ${error.message}`);
  }
  console.log('\n');

  // Test 2: Test signup with valid data
  console.log('Test 2: Signup with Valid Data');
  console.log('-------------------------------');
  const testEmail = `test-${Date.now()}@example.com`;
  const signupPayload = {
    name: 'Test User',
    email: testEmail,
    password: 'testpass123'
  };

  console.log('Payload:', JSON.stringify(signupPayload, null, 2));

  try {
    const response = await makeRequest('POST', '/api/auth/sign-up/email', signupPayload);
    console.log(`Status: ${response.status}`);

    if (response.status === 200 || response.status === 201) {
      console.log('✅ Signup successful');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Signup failed');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log(`❌ Signup request failed: ${error.message}`);
  }
  console.log('\n');

  // Test 3: Test signup with missing name (should fail)
  console.log('Test 3: Signup with Missing Name (Should Fail)');
  console.log('-----------------------------------------------');
  const invalidPayload = {
    email: `test-invalid-${Date.now()}@example.com`,
    password: 'testpass123'
    // name is missing
  };

  console.log('Payload:', JSON.stringify(invalidPayload, null, 2));

  try {
    const response = await makeRequest('POST', '/api/auth/sign-up/email', invalidPayload);
    console.log(`Status: ${response.status}`);

    if (response.status === 400 || response.status === 422) {
      console.log('✅ Validation correctly rejected missing name');
      console.log('Error:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('⚠️  Unexpected response (should have failed)');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
  console.log('\n');

  // Test 4: Test signin with valid credentials
  console.log('Test 4: Signin with Valid Credentials');
  console.log('--------------------------------------');
  const signinPayload = {
    email: testEmail,
    password: 'testpass123'
  };

  console.log('Payload:', JSON.stringify(signinPayload, null, 2));

  try {
    const response = await makeRequest('POST', '/api/auth/sign-in/email', signinPayload);
    console.log(`Status: ${response.status}`);

    if (response.status === 200) {
      console.log('✅ Signin successful');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Signin failed');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log(`❌ Signin request failed: ${error.message}`);
  }
  console.log('\n');

  // Summary
  console.log('=== Test Summary ===');
  console.log('All API tests completed.');
  console.log('\nFor full UI testing:');
  console.log('1. Open http://localhost:3000/signup in your browser');
  console.log('2. Fill in the signup form');
  console.log('3. Check browser console and server logs');
  console.log('4. Verify user is created in database: node test-auth.js');
}

// Run tests
testAuthSystem().catch(console.error);
