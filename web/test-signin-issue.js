/**
 * Test signin with existing user credentials
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

async function testSigninIssue() {
  console.log('=== Testing Signin Issue ===\n');

  // Use the test user we created earlier
  const testEmail = 'test-1768643316723@example.com';
  const testPassword = 'testpass123';

  console.log('Test User Credentials:');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('\n');

  // Test signin
  console.log('Attempting Signin...');
  console.log('-------------------');
  const signinPayload = {
    email: testEmail,
    password: testPassword
  };

  console.log('Payload:', JSON.stringify(signinPayload, null, 2));

  try {
    const response = await makeRequest('POST', '/api/auth/sign-in/email', signinPayload);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('\n✅ Signin SUCCESSFUL');
    } else {
      console.log('\n❌ Signin FAILED');
      console.log('This confirms the bug - user exists but signin fails');
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }

  console.log('\n');

  // Try to signup again to confirm user exists
  console.log('Attempting Signup with Same Credentials...');
  console.log('------------------------------------------');
  const signupPayload = {
    name: 'Test User',
    email: testEmail,
    password: testPassword
  };

  try {
    const response = await makeRequest('POST', '/api/auth/sign-up/email', signupPayload);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 400 && response.data.message?.includes('already exists')) {
      console.log('\n✅ Confirmed: User exists in database');
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
}

testSigninIssue().catch(console.error);
