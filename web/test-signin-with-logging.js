/**
 * Test signin to verify comprehensive logging is working
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

async function testSigninWithLogging() {
  console.log('=== TESTING SIGNIN WITH COMPREHENSIVE LOGGING ===\n');

  const testEmail = 'test-1768643316723@example.com';
  const testPassword = 'testpass123';

  console.log('Test credentials:');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('\n');

  console.log('Sending signin request...');
  console.log('CHECK YOUR SERVER TERMINAL for detailed trace logs.');
  console.log('\n');

  const response = await makeRequest('POST', '/api/auth/sign-in/email', {
    email: testEmail,
    password: testPassword
  });

  console.log('Response status:', response.status);

  if (response.status === 200) {
    console.log('✅ SIGNIN SUCCESSFUL');
    console.log('User:', response.data.user?.email);
    console.log('Token:', response.data.token ? 'Present' : 'Missing');
  } else {
    console.log('❌ SIGNIN FAILED');
    console.log('Error:', response.data);
  }

  console.log('\n');
  console.log('='.repeat(80));
  console.log('The comprehensive logging should have appeared in your server terminal.');
  console.log('Look for lines starting with 🔐, 📊, 📤, etc.');
  console.log('='.repeat(80));
}

testSigninWithLogging().catch(console.error);
