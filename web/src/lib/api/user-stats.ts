/**
 * API client for user statistics endpoints.
 *
 * This module provides functions to fetch user statistics from the backend API.
 */
import { UserStats } from '@/types/user-stats';
import { apiClient } from './client';

/**
 * Fetch user statistics from backend API
 *
 * @returns Promise resolving to user statistics
 * @throws Error if request fails or user not authenticated
 */
export async function getUserStats(): Promise<UserStats> {
  try {
    return await apiClient<UserStats>('/users/me/stats', {
      method: 'GET',
    });
  } catch (error: any) {
    // Re-throw with user-friendly messages
    if (error.status === 401) {
      throw new Error('Not authenticated');
    }
    if (error.status === 500) {
      throw new Error('Failed to calculate statistics');
    }
    throw new Error('Failed to fetch user statistics');
  }
}
