/**
 * JWT token utilities for Better Auth integration.
 *
 * This module provides functionality to work with JWT tokens
 * for API authentication with the FastAPI backend.
 */

/**
 * Extract JWT token from Better Auth session.
 *
 * Better Auth can be configured to include JWT tokens in the session.
 * This function extracts the token for use in API calls.
 *
 * @param session - Better Auth session object
 * @returns JWT token string or null if not available
 */
export function extractJwtFromSession(session: any): string | null {
  // Check if session has a token field (added by JWT plugin)
  if (session?.token) {
    return session.token;
  }

  // Check if session has accessToken field (alternative naming)
  if (session?.accessToken) {
    return session.accessToken;
  }

  return null;
}

/**
 * Decode JWT token payload (without validation).
 *
 * This is for debugging purposes only. The backend validates tokens.
 *
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired (client-side check only).
 *
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}
