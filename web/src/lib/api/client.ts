/**
 * Base API client with fetch wrapper.
 *
 * Uses JWT tokens for backend API authentication.
 * Session cookies are used for UI authentication only.
 */

import { getJwtToken } from '@/lib/auth/jwt-manager';

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API client
 * @param endpoint API endpoint, e.g. '/tasks' or '/tasks/123'
 * @param options Fetch options (method, body, headers)
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  console.log(`🌐 API Request: ${options?.method || 'GET'} ${endpoint}`);

  // Get JWT token for authentication
  const token = await getJwtToken();

  if (!token) {
    console.error('❌ No JWT token available for API request');
    console.error('   This usually means:');
    console.error('   1. You are not logged in (no Better Auth session)');
    console.error('   2. JWT_PRIVATE_KEY environment variable is not set');
    console.error('   3. /api/token endpoint failed to generate token');
    console.error('\n   Check browser console for JWT token fetch errors above');

    // Don't redirect immediately - throw error with helpful message
    throw new ApiError(
      'Authentication required: No JWT token available. Check console for details.',
      401
    );
  }

  // Construct full URL without /v1 versioning
  const url = `${API_BASE_URL}/api${endpoint}`;
  console.log(`   → Calling: ${url}`);

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // JWT token for backend
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    console.log(`   ← Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error('❌ Backend returned 401 Unauthorized');
        console.error('   Possible causes:');
        console.error('   1. JWT token is invalid or expired');
        console.error('   2. Backend cannot verify JWT signature (wrong public key)');
        console.error('   3. Backend is not configured to accept JWT tokens');

        throw new ApiError('Backend authentication failed: Invalid or expired token', 401);
      }

      const error = await response.json().catch(() => ({
        error: 'Unknown',
        message: 'An unexpected error occurred',
      }));

      console.error(`❌ API Error ${response.status}:`, error);

      throw new ApiError(
        error.message || 'Request failed',
        response.status,
        error.details
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      console.log('   ✅ Success (No Content)');
      return undefined as T;
    }

    const data = await response.json();
    console.log('   ✅ Success');
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    console.error('❌ Network error:', error);
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}
