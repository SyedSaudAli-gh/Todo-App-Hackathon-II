import { Todo, UserProfile } from '@/types/storage';

/**
 * Validate todo data
 */
export function validateTodo(todo: Partial<Todo>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!todo.title || todo.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (todo.title.length > 200) {
    errors.push('Title must be 200 characters or less');
  }

  if (todo.description && todo.description.length > 1000) {
    errors.push('Description must be 1000 characters or less');
  }

  if (!todo.priority || !['High', 'Medium', 'Low'].includes(todo.priority)) {
    errors.push('Priority must be High, Medium, or Low');
  }

  if (!todo.status || !['To Do', 'In Progress', 'Done'].includes(todo.status)) {
    errors.push('Status must be To Do, In Progress, or Done');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate user profile data
 */
export function validateUserProfile(profile: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!profile.name || profile.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (profile.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  if (!profile.email || !profile.email.includes('@')) {
    errors.push('Valid email is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate avatar file size and format
 */
export function validateAvatarFile(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (file.size > maxSize) {
    errors.push('Avatar file must be 2MB or less');
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('Avatar must be JPEG, PNG, or GIF format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input (remove potentially harmful characters)
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate date range for charts
 */
export function validateDateRange(timeRange: number): 7 | 30 | 90 {
  if ([7, 30, 90].includes(timeRange)) {
    return timeRange as 7 | 30 | 90;
  }
  return 7; // Default to 7 days
}
