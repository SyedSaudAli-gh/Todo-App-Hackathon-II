/**
 * API client functions for todos.
 * Uses /tasks endpoints to match backend API specification.
 */
import { apiClient } from './client';
import type { Todo, TodoCreate, TodoUpdate } from '@/types/todo';
import type { TodoListResponse } from '@/types/api';

// API functions for todos - using /tasks endpoints to match backend
export async function listTodos(): Promise<TodoListResponse> {
  return apiClient<TodoListResponse>('/tasks');
}

export async function createTodo(data: TodoCreate): Promise<Todo> {
  return apiClient<Todo>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTodo(id: number): Promise<Todo> {
  return apiClient<Todo>(`/tasks/${id}`);
}

export async function updateTodo(id: number, data: TodoUpdate): Promise<Todo> {
  return apiClient<Todo>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTodo(id: number): Promise<void> {
  return apiClient<void>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
