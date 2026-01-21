/**
 * JWT Token Manager
 *
 * Manages JWT tokens for API authentication.
 * Tokens are stored in memory and fetched from /api/token endpoint.
 */

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Fetch a new JWT token from the /api/token endpoint
 */
async function fetchNewToken(): Promise<string | null> {
  try {
    console.log('🔑 Fetching JWT token from /api/token...');

    const response = await fetch('/api/token', {
      credentials: 'include', // Include session cookies
    });

    console.log(`📡 /api/token response status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('❌ Not authenticated - no Better Auth session found');
        console.warn('   Make sure you are logged in via Better Auth first');
        return null;
      }

      if (response.status === 500) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ JWT token generation failed (500)');
        console.error('   Error:', errorData.error);
        console.error('   Message:', errorData.message);
        console.error('   Hint:', errorData.hint);

        if (errorData.message?.includes('JWT_PRIVATE_KEY')) {
          console.error('\n⚠️  SETUP REQUIRED: JWT_PRIVATE_KEY environment variable is not set');
          console.error('   Follow these steps:');
          console.error('   1. Generate RSA key: openssl genrsa -out private_key.pem 2048');
          console.error('   2. Convert to single-line: see web/SETUP.md');
          console.error('   3. Add to .env.local: JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"');
          console.error('   4. Restart dev server: npm run dev\n');
        }
        return null;
      }

      throw new Error(`Failed to fetch token: ${response.status}`);
    }

    const data = await response.json();

    if (!data.token) {
      console.error('❌ No token in /api/token response');
      throw new Error('No token in response');
    }

    // Cache token and expiry time
    cachedToken = data.token;
    // Set expiry to 5 minutes before actual expiry to refresh proactively
    tokenExpiry = Date.now() + (data.expiresIn - 300) * 1000;

    console.log('✅ JWT token fetched and cached successfully');
    console.log(`   Token expires in: ${Math.floor(data.expiresIn / 60)} minutes`);
    console.log(`   User: ${data.user?.email || 'unknown'}`);

    return data.token;
  } catch (error) {
    console.error('❌ Error fetching JWT token:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
    }
    return null;
  }
}

/**
 * Get a valid JWT token (from cache or fetch new)
 */
export async function getJwtToken(): Promise<string | null> {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // Fetch new token
  return await fetchNewToken();
}

/**
 * Clear cached token (call on logout)
 */
export function clearJwtToken(): void {
  cachedToken = null;
  tokenExpiry = null;
  console.log('✓ JWT token cache cleared');
}

/**
 * Force refresh token (call after login)
 */
export async function refreshJwtToken(): Promise<string | null> {
  cachedToken = null;
  tokenExpiry = null;
  return await fetchNewToken();
}
