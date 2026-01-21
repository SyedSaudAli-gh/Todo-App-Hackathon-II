/**
 * Utility functions to calculate user statistics from todos data.
 *
 * This eliminates the need for a separate stats API endpoint and ensures
 * stats are always in sync with actual todos data.
 */

import { Todo } from '@/types/todo';

export interface TodoStats {
  totalTasks: number;
  completedTasks: number;
  incompleteTasks: number;
  completionRate: number;
  activeDays: number;
}

/**
 * Calculate user statistics from an array of todos
 *
 * @param todos - Array of todo items
 * @returns Calculated statistics
 */
export function calculateTodoStats(todos: Todo[]): TodoStats {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const incompleteTasks = totalTasks - completedTasks;

  // Calculate completion rate (avoid division by zero)
  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // Calculate active days (unique dates when todos were created)
  const activeDays = calculateActiveDays(todos);

  return {
    totalTasks,
    completedTasks,
    incompleteTasks,
    completionRate,
    activeDays,
  };
}

/**
 * Calculate the number of unique days with todo activity
 *
 * @param todos - Array of todo items
 * @returns Number of unique days with activity
 */
function calculateActiveDays(todos: Todo[]): number {
  if (todos.length === 0) return 0;

  // Extract unique dates (YYYY-MM-DD format)
  const uniqueDates = new Set<string>();

  todos.forEach(todo => {
    try {
      const date = new Date(todo.created_at);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      uniqueDates.add(dateString);
    } catch (error) {
      // Skip invalid dates
      console.warn('Invalid date in todo:', todo.id, error);
    }
  });

  return uniqueDates.size;
}
