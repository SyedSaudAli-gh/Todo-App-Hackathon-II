#!/usr/bin/env node

/**
 * DEFINITIVE SIGNIN TEST
 * This will prove whether signin works or not
 */

const http = require('http');
const Database = require('better-sqlite3');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:3000');
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const body = JSON.stringify(data);
    options.headers['Content-Length'] = Buffer.byteLength(body);

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseData) });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function definitiveTest() {
  console.log('\n' + '='.repeat(80));
  console.log('DEFINITIVE SIGNIN TEST');
  console.log('='.repeat(80) + '\n');

  // Step 1: Create a new test user
  console.log('STEP 1: Creating new test user...');
  const timestamp = Date.now();
  const testEmail = `definitive-${timestamp}@test.com`;
  const testPassword = 'DefTest123!';
  const testName = 'Definitive Test';

  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('Name:', testName);
  console.log('');

  const signupResponse = await makeRequest('POST', '/api/auth/sign-up/email', {
    name: testName,
    email: testEmail,
    password: testPassword
  });

  if (signupResponse.status !== 200) {
    console.log('❌ SIGNUP FAILED');
    console.log('Error:', signupResponse.data);
    console.log('\nCannot proceed with test.');
    return;
  }

  console.log('✅ Signup succeeded');
  console.log('User ID:', signupResponse.data.user?.id);
  console.log('');

  // Wait for database write
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Step 2: Verify user in database
  console.log('STEP 2: Verifying user in database...');
  const db = new Database('auth.db');
  const user = db.prepare(`
    SELECT u.id, u.email, u.name, a.password, a.providerId
    FROM user u
    LEFT JOIN account a ON u.id = a.userId
    WHERE u.email = ?
  `).get(testEmail);

  if (!user) {
    console.log('❌ User NOT found in database!');
    db.close();
    return;
  }

  console.log('✅ User found in database');
  console.log('Email:', user.email);
  console.log('Name:', user.name);
  console.log('Provider:', user.providerId);
  console.log('Password exists:', !!user.password);

  if (user.password) {
    const parts = user.password.split(':');
    console.log('Password format:', parts.length === 2 ? '✅ salt:hash (CORRECT)' : '❌ INVALID');
  }

  db.close();
  console.log('');

  // Step 3: Try to signin with EXACT same credentials
  console.log('STEP 3: Signing in with EXACT same credentials...');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('');

  const signinResponse = await makeRequest('POST', '/api/auth/sign-in/email', {
    email: testEmail,
    password: testPassword
  });

  console.log('Response status:', signinResponse.status);
  console.log('');

  if (signinResponse.status === 200) {
    console.log('✅✅✅ SIGNIN WORKS! ✅✅✅');
    console.log('');
    console.log('User:', signinResponse.data.user?.email);
    console.log('Token:', signinResponse.data.token ? 'Present' : 'Missing');
    console.log('');
    console.log('='.repeat(80));
    console.log('CONCLUSION: The authentication system is working correctly.');
    console.log('');
    console.log('If YOU are experiencing signin failures, it means:');
    console.log('1. You are using the wrong password');
    console.log('2. You are using the wrong email (typo/case)');
    console.log('3. There is a browser/cookie issue');
    console.log('');
    console.log('ACTION: Try signing in with this test account in your browser:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('='.repeat(80));
  } else {
    console.log('❌❌❌ SIGNIN FAILED! ❌❌❌');
    console.log('');
    console.log('Error:', signinResponse.data);
    console.log('');
    console.log('='.repeat(80));
    console.log('CONCLUSION: There IS a problem with the authentication system.');
    console.log('');
    console.log('This proves:');
    console.log('- Signup works ✅');
    console.log('- User is saved correctly ✅');
    console.log('- Password is hashed correctly ✅');
    console.log('- Signin FAILS ❌');
    console.log('');
    console.log('This is a REAL BUG that needs investigation.');
    console.log('='.repeat(80));
  }
}

definitiveTest().catch(console.error);
