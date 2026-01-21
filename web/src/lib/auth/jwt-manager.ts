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
    const response = await fetch('/api/token', {
      credentials: 'include', // Include session cookies
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Not authenticated - no session found');
        return null;
      }
      throw new Error(`Failed to fetch token: ${response.status}`);
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error('No token in response');
    }

    // Cache token and expiry time
    cachedToken = data.token;
    // Set expiry to 5 minutes before actual expiry to refresh proactively
    tokenExpiry = Date.now() + (data.expiresIn - 300) * 1000;

    console.log('✓ JWT token fetched and cached');
    return data.token;
  } catch (error) {
    console.error('Error fetching JWT token:', error);
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
