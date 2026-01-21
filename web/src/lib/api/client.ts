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
  // Get JWT token for authentication
  const token = await getJwtToken();

  if (!token) {
    // No token available - user not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError('Not authenticated', 401);
  }

  // Construct full URL without /v1 versioning
  const url = `${API_BASE_URL}/api${endpoint}`;
  console.log('Calling API URL:', url); // Debug log

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

    if (!response.ok) {
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new ApiError('Not authenticated', 401);
      }

      const error = await response.json().catch(() => ({
        error: 'Unknown',
        message: 'An unexpected error occurred',
      }));

      throw new ApiError(
        error.message || 'Request failed',
        response.status,
        error.details
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}
