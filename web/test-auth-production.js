#!/usr/bin/env node

/**
 * Production Auth Diagnostic Script
 * Run this to test your deployed authentication
 */

const BASE_URL = 'https://todo-app-hackathon-ii.vercel.app';

async function testAuthEndpoints() {
  console.log('🔍 Testing Authentication Endpoints\n');
  console.log('Base URL:', BASE_URL);
  console.log('=' .repeat(60));

  // Test 1: Session endpoint
  console.log('\n1. Testing session endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session`);
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Session endpoint working');
      console.log('Response:', data);
    } else {
      console.log('❌ Session endpoint failed');
      const text = await response.text();
      console.log('Response text:', text.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Session endpoint error:', error.message);
  }

  // Test 2: Test signup endpoint structure
  console.log('\n2. Testing signup endpoint availability...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123'
      })
    });

    console.log('Status:', response.status);
    
    if (response.status !== 404) {
      console.log('✅ Signup endpoint is accessible');
      const text = await response.text();
      if (text.includes('already exists') || text.includes('user') || response.ok) {
        console.log('✅ Signup endpoint responding correctly');
      }
    } else {
      console.log('❌ Signup endpoint not found');
    }
  } catch (error) {
    console.log('❌ Signup endpoint error:', error.message);
  }

  // Test 3: OAuth providers
  console.log('\n3. Testing OAuth provider endpoints...');
  
  const providers = ['google', 'facebook'];
  
  for (const provider of providers) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/${provider}`, {
        method: 'GET',
        redirect: 'manual'
      });
      
      console.log(`${provider.toUpperCase()}:`, response.status);
      
      if (response.status === 302 || response.status === 301) {
        console.log(`✅ ${provider} OAuth redirect working`);
        const location = response.headers.get('location');
        if (location && location.includes(provider)) {
          console.log(`✅ ${provider} redirects to correct provider`);
        }
      } else if (response.status === 404) {
        console.log(`❌ ${provider} OAuth endpoint not found`);
      } else {
        console.log(`⚠️  ${provider} OAuth status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${provider} OAuth error:`, error.message);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Diagnostic complete');
  console.log('\n📋 Next steps:');
  console.log('1. If session endpoint works → Authentication is properly configured');
  console.log('2. If OAuth redirects work → OAuth providers are configured');
  console.log('3. Test actual signup/login on the website');
  console.log('4. Check Vercel function logs if any issues persist');
}

// Run the test
testAuthEndpoints().catch(console.error);