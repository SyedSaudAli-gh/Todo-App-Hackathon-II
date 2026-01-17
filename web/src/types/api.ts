/**
 * API response type definitions.
 */

export interface ApiError {
  error: string;
  message: string;
  details?: string | null;
}

export interface ValidationError {
  error: string;
  message: string;
  details: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

export interface TodoListResponse {
  todos: import('./todo').Todo[];
  total: number;
}
