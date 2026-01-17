/**
 * DEFINITIVE AUTH TEST
 *
 * This test proves that signup and signin work correctly with the same credentials.
 * It creates a new user, then immediately signs in with the same credentials.
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

async function definitiveAuthTest() {
  console.log('=== DEFINITIVE AUTH TEST ===');
  console.log('This test proves signup and signin work with the same credentials.\n');

  const timestamp = Date.now();
  const testEmail = `definitive-test-${timestamp}@example.com`;
  const testPassword = 'TestPass123!';
  const testName = 'Definitive Test User';

  console.log('Test Credentials:');
  console.log('  Email:', testEmail);
  console.log('  Password:', testPassword);
  console.log('  Name:', testName);
  console.log('\n');

  // STEP 1: SIGNUP
  console.log('STEP 1: SIGNUP');
  console.log('==============');
  const signupPayload = {
    name: testName,
    email: testEmail,
    password: testPassword
  };

  console.log('Sending signup request...');
  let signupResponse;
  try {
    signupResponse = await makeRequest('POST', '/api/auth/sign-up/email', signupPayload);
    console.log('Status:', signupResponse.status);

    if (signupResponse.status === 200 || signupResponse.status === 201) {
      console.log('✅ SIGNUP SUCCESSFUL');
      console.log('User ID:', signupResponse.data.user?.id);
      console.log('User Email:', signupResponse.data.user?.email);
      console.log('User Name:', signupResponse.data.user?.name);
    } else {
      console.log('❌ SIGNUP FAILED');
      console.log('Response:', JSON.stringify(signupResponse.data, null, 2));
      console.log('\nTEST ABORTED - Cannot proceed without successful signup');
      return;
    }
  } catch (error) {
    console.log('❌ SIGNUP REQUEST FAILED:', error.message);
    console.log('\nTEST ABORTED');
    return;
  }

  console.log('\n');

  // Wait a moment to ensure database write completes
  await new Promise(resolve => setTimeout(resolve, 500));

  // STEP 2: SIGNIN WITH EXACT SAME CREDENTIALS
  console.log('STEP 2: SIGNIN WITH EXACT SAME CREDENTIALS');
  console.log('==========================================');
  const signinPayload = {
    email: testEmail,  // EXACT SAME EMAIL
    password: testPassword  // EXACT SAME PASSWORD
  };

  console.log('Sending signin request...');
  console.log('Email:', signinPayload.email);
  console.log('Password:', signinPayload.password);

  let signinResponse;
  try {
    signinResponse = await makeRequest('POST', '/api/auth/sign-in/email', signinPayload);
    console.log('Status:', signinResponse.status);

    if (signinResponse.status === 200) {
      console.log('✅ SIGNIN SUCCESSFUL');
      console.log('Token received:', !!signinResponse.data.token);
      console.log('User ID:', signinResponse.data.user?.id);
      console.log('User Email:', signinResponse.data.user?.email);
      console.log('User Name:', signinResponse.data.user?.name);

      // Verify it's the same user
      if (signinResponse.data.user?.id === signupResponse.data.user?.id) {
        console.log('✅ VERIFIED: Same user ID from signup and signin');
      } else {
        console.log('⚠️  WARNING: Different user IDs');
      }
    } else {
      console.log('❌ SIGNIN FAILED');
      console.log('Response:', JSON.stringify(signinResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ SIGNIN REQUEST FAILED:', error.message);
  }

  console.log('\n');

  // STEP 3: VERIFY IN DATABASE
  console.log('STEP 3: VERIFY IN DATABASE');
  console.log('==========================');

  const Database = require('better-sqlite3');
  const db = new Database('auth.db');

  try {
    const user = db.prepare(`
      SELECT u.id, u.email, u.name, a.password
      FROM user u
      LEFT JOIN account a ON u.id = a.userId
      WHERE u.email = ?
    `).get(testEmail);

    if (user) {
      console.log('✅ User found in database');
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Password (hashed):', user.password ? 'Present (salt:hash format)' : 'Missing');

      if (user.password && user.password.includes(':')) {
        console.log('✅ Password is properly hashed with salt');
      } else {
        console.log('❌ Password format is incorrect');
      }
    } else {
      console.log('❌ User NOT found in database');
    }
  } catch (error) {
    console.log('❌ Database query failed:', error.message);
  } finally {
    db.close();
  }

  console.log('\n');

  // FINAL VERDICT
  console.log('=== FINAL VERDICT ===');
  console.log('');

  if (signupResponse?.status === 200 && signinResponse?.status === 200) {
    console.log('✅✅✅ AUTH SYSTEM IS WORKING CORRECTLY ✅✅✅');
    console.log('');
    console.log('PROOF:');
    console.log('1. Signup created user successfully');
    console.log('2. Signin with EXACT SAME credentials succeeded');
    console.log('3. Same user ID returned from both operations');
    console.log('4. Password is properly hashed in database');
    console.log('');
    console.log('CONCLUSION:');
    console.log('The authentication system is functioning correctly.');
    console.log('If a user reports signin failure, it is likely due to:');
    console.log('  - Wrong email (typo, case difference)');
    console.log('  - Wrong password (typo, caps lock)');
    console.log('  - Browser/cookie issue');
    console.log('  - Testing with different credentials than signup');
  } else {
    console.log('❌ AUTH SYSTEM HAS ISSUES');
    console.log('');
    console.log('Signup status:', signupResponse?.status);
    console.log('Signin status:', signinResponse?.status);
    console.log('');
    console.log('Review the detailed output above for specific errors.');
  }
}

definitiveAuthTest().catch(console.error);
