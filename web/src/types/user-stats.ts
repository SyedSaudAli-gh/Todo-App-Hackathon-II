/**
 * User statistics types for profile dashboard.
 *
 * These types match the backend API response from GET /api/v1/users/me/stats
 */

/**
 * User activity statistics from backend API
 */
export interface UserStats {
  /** Total number of todos created by user */
  total_tasks: number;

  /** Number of todos marked as completed */
  completed_tasks: number;

  /** Completion rate percentage (0-100) */
  completion_rate: number;

  /** Days since user account creation (inclusive) */
  active_days: number;
}

/**
 * API error response
 */
export interface ApiError {
  detail: string;
}
