import { Todo, STORAGE_KEYS, isTodo } from '@/types/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get all todos from localStorage
 */
export function getTodos(): Todo[] {
  if (typeof window === 'undefined') return [];

  try {
    const item = window.localStorage.getItem(STORAGE_KEYS.TODOS);
    if (!item) return [];

    const todos = JSON.parse(item);
    return Array.isArray(todos) ? todos.filter(isTodo) : [];
  } catch (error) {
    console.error('Error reading todos from localStorage:', error);
    return [];
  }
}

/**
 * Save todos to localStorage
 */
export function saveTodos(todos: Todo[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
}

/**
 * Create a new todo
 */
export function createTodo(
  title: string,
  description: string | undefined,
  priority: 'High' | 'Medium' | 'Low',
  status: 'To Do' | 'In Progress' | 'Done',
  userId: string
): Todo {
  const now = new Date().toISOString();

  const todo: Todo = {
    id: uuidv4(),
    title,
    description,
    priority,
    status,
    createdAt: now,
    updatedAt: now,
    completedAt: status === 'Done' ? now : undefined,
    userId,
  };

  const todos = getTodos();
  todos.push(todo);
  saveTodos(todos);

  return todo;
}

/**
 * Update an existing todo
 */
export function updateTodo(id: string, updates: Partial<Todo>): Todo | null {
  const todos = getTodos();
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) return null;

  const now = new Date().toISOString();
  const updatedTodo: Todo = {
    ...todos[index],
    ...updates,
    updatedAt: now,
    completedAt:
      updates.status === 'Done'
        ? now
        : updates.status !== undefined
        ? undefined
        : todos[index].completedAt,
  };

  todos[index] = updatedTodo;
  saveTodos(todos);

  return updatedTodo;
}

/**
 * Delete a todo
 */
export function deleteTodo(id: string): boolean {
  const todos = getTodos();
  const filteredTodos = todos.filter((t) => t.id !== id);

  if (filteredTodos.length === todos.length) return false;

  saveTodos(filteredTodos);
  return true;
}

/**
 * Get a single todo by ID
 */
export function getTodoById(id: string): Todo | null {
  const todos = getTodos();
  return todos.find((t) => t.id === id) || null;
}

/**
 * Clear all todos (for testing/reset)
 */
export function clearTodos(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEYS.TODOS);
  } catch (error) {
    console.error('Error clearing todos from localStorage:', error);
  }
}
