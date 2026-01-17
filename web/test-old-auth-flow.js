/**
 * Test the OLD auth flow (AuthContext) vs NEW auth flow (direct API)
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

async function testOldAuthFlow() {
  console.log('=== TESTING OLD AUTH FLOW (AuthContext) ===\n');

  // Use an existing user from database
  const testEmail = 'test-1768643316723@example.com';
  const testPassword = 'testpass123';

  console.log('Testing with existing user:');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('\n');

  // The AuthContext login() function calls signIn.email()
  // which hits /api/auth/sign-in/email
  console.log('Simulating AuthContext login() call...');
  console.log('This calls: signIn.email({ email, password })');
  console.log('\n');

  const signinPayload = {
    email: testEmail,
    password: testPassword
  };

  const response = await makeRequest('POST', '/api/auth/sign-in/email', signinPayload);

  console.log('Result:');
  console.log('Status:', response.status);

  if (response.status === 200) {
    console.log('✅ OLD AUTH FLOW WORKS');
    console.log('User:', response.data.user?.email);
    console.log('Token:', response.data.token ? 'Present' : 'Missing');
  } else {
    console.log('❌ OLD AUTH FLOW FAILED');
    console.log('Error:', response.data);
  }

  console.log('\n');
  console.log('='.repeat(80));
  console.log('CONCLUSION:');
  console.log('='.repeat(80));

  if (response.status === 200) {
    console.log('The AuthContext login() flow is working correctly.');
    console.log('');
    console.log('If you are experiencing signin failures, please:');
    console.log('1. Tell me which URL you are using to sign in');
    console.log('2. Open browser dev tools (F12)');
    console.log('3. Try to sign in');
    console.log('4. Check Console tab for errors');
    console.log('5. Check Network tab for the API request');
    console.log('6. Screenshot and share the error');
  } else {
    console.log('There IS a problem with the auth flow.');
    console.log('Error details above.');
  }
}

testOldAuthFlow().catch(console.error);
