/**
 * Todo type definitions for the frontend.
 *
 * IMPORTANT: These types must match the backend schemas exactly.
 * Backend: api/src/schemas/todo.py
 */

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string | null;
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
}
