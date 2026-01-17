/**
 * localStorage Schema Type Definitions
 * Feature: 003-dashboard-polish
 *
 * This file defines all TypeScript interfaces for data stored in browser localStorage.
 */

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Todo entity with priority and status for advanced task management
 */
export interface Todo {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Task title (required, 1-200 characters) */
  title: string;

  /** Task description (optional, 0-1000 characters) */
  description?: string;

  /** Priority level (required) */
  priority: 'High' | 'Medium' | 'Low';

  /** Current status (required) */
  status: 'To Do' | 'In Progress' | 'Done';

  /** Creation timestamp (ISO 8601, auto-generated) */
  createdAt: string;

  /** Last update timestamp (ISO 8601, auto-updated) */
  updatedAt: string;

  /** Completion timestamp (ISO 8601, set when status → Done) */
  completedAt?: string;

  /** User ID from Better Auth session */
  userId: string;
}

/**
 * User profile information
 */
export interface UserProfile {
  /** User ID from Better Auth */
  id: string;

  /** Display name (1-100 characters) */
  name: string;

  /** Email address (from Better Auth) */
  email: string;

  /** Avatar image (base64 encoded or URL) */
  avatar?: string;

  /** Account creation timestamp (ISO 8601) */
  joinDate: string;

  /** Last profile update timestamp (ISO 8601) */
  updatedAt: string;
}

/**
 * User customization preferences
 */
export interface UserPreferences {
  /** User ID from Better Auth */
  userId: string;

  /** Theme preference */
  theme: 'Light' | 'Dark' | 'System';

  /** Show completed tasks in list */
  showCompletedTodos: boolean;

  /** Default sort field */
  defaultSortOrder: 'createdAt' | 'priority' | 'status' | 'title';

  /** Default sort direction */
  defaultSortDirection: 'asc' | 'desc';

  /** Default chart time range (days) */
  chartTimeRange: 7 | 30 | 90;

  /** Last preferences update timestamp (ISO 8601) */
  updatedAt: string;
}

/**
 * Activity event for dashboard feed
 */
export interface ActivityEvent {
  /** Unique identifier (UUID v4) */
  id: string;

  /** User ID from Better Auth */
  userId: string;

  /** Type of action performed */
  eventType: 'created' | 'completed' | 'updated' | 'deleted';

  /** ID of affected todo */
  todoId: string;

  /** Title of todo (snapshot at event time) */
  todoTitle: string;

  /** Human-readable event description */
  description: string;

  /** Event timestamp (ISO 8601) */
  timestamp: string;

  /** Optional additional event data */
  metadata?: Record<string, any>;
}

/**
 * Schema version for migrations
 */
export interface SchemaVersion {
  /** Semantic version (e.g., '1.0.0') */
  version: string;

  /** Last migration timestamp (ISO 8601) */
  lastMigration?: string;
}

// ============================================================================
// Computed Entities (not stored in localStorage)
// ============================================================================

/**
 * Dashboard statistics (computed from todos)
 */
export interface DashboardStatistics {
  /** Total number of todos */
  totalTasks: number;

  /** Number of completed todos */
  completedTasks: number;

  /** Number of pending todos */
  pendingTasks: number;

  /** Completion rate percentage (0-100) */
  completionRate: number;

  /** Task count by priority level */
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };

  /** Task count by status */
  statusBreakdown: {
    toDo: number;
    inProgress: number;
    done: number;
  };

  /** Recent activity events (last 5) */
  recentActivity: ActivityEvent[];
}

/**
 * Chart data point for completion trends
 */
export interface ChartDataPoint {
  /** Date (ISO 8601 date format: YYYY-MM-DD) */
  date: string;

  /** Number of tasks completed on this date */
  completed: number;

  /** Number of tasks created on this date */
  created: number;
}

/**
 * Chart data for completion trends
 */
export interface ChartData {
  /** Selected time range (days) */
  timeRange: 7 | 30 | 90;

  /** Array of daily data points */
  dataPoints: ChartDataPoint[];

  /** Total completions in time range */
  totalCompleted: number;

  /** Total creations in time range */
  totalCreated: number;
}

/**
 * Filter state for todo list
 */
export interface FilterState {
  /** Selected priority filters (empty = show all) */
  priorities: ('High' | 'Medium' | 'Low')[];

  /** Selected status filters (empty = show all) */
  statuses: ('To Do' | 'In Progress' | 'Done')[];

  /** Text search query */
  searchQuery: string;

  /** Sort field */
  sortBy: 'createdAt' | 'priority' | 'status' | 'title';

  /** Sort direction */
  sortDirection: 'asc' | 'desc';
}

// ============================================================================
// localStorage Keys
// ============================================================================

/**
 * localStorage key constants
 */
export const STORAGE_KEYS = {
  TODOS: 'todos',
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  ACTIVITY_EVENTS: 'activity_events',
  APP_VERSION: 'app_version',
} as const;

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: Omit<UserPreferences, 'userId' | 'updatedAt'> = {
  theme: 'System',
  showCompletedTodos: true,
  defaultSortOrder: 'createdAt',
  defaultSortDirection: 'desc',
  chartTimeRange: 7,
};

/**
 * Default filter state
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  priorities: [],
  statuses: [],
  searchQuery: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

/**
 * Current schema version
 */
export const CURRENT_SCHEMA_VERSION = '1.0.0';

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for Todo
 */
export function isTodo(value: any): value is Todo {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    ['High', 'Medium', 'Low'].includes(value.priority) &&
    ['To Do', 'In Progress', 'Done'].includes(value.status) &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    typeof value.userId === 'string'
  );
}

/**
 * Type guard for UserProfile
 */
export function isUserProfile(value: any): value is UserProfile {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.joinDate === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

/**
 * Type guard for UserPreferences
 */
export function isUserPreferences(value: any): value is UserPreferences {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.userId === 'string' &&
    ['Light', 'Dark', 'System'].includes(value.theme) &&
    typeof value.showCompletedTodos === 'boolean' &&
    ['createdAt', 'priority', 'status', 'title'].includes(value.defaultSortOrder) &&
    ['asc', 'desc'].includes(value.defaultSortDirection) &&
    [7, 30, 90].includes(value.chartTimeRange) &&
    typeof value.updatedAt === 'string'
  );
}

/**
 * Type guard for ActivityEvent
 */
export function isActivityEvent(value: any): value is ActivityEvent {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.userId === 'string' &&
    ['created', 'completed', 'updated', 'deleted'].includes(value.eventType) &&
    typeof value.todoId === 'string' &&
    typeof value.todoTitle === 'string' &&
    typeof value.description === 'string' &&
    typeof value.timestamp === 'string'
  );
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate todo data
 */
export function validateTodo(todo: Partial<Todo>): string[] {
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

  return errors;
}

/**
 * Validate user profile data
 */
export function validateUserProfile(profile: Partial<UserProfile>): string[] {
  const errors: string[] = [];

  if (!profile.name || profile.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (profile.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  if (!profile.email || !profile.email.includes('@')) {
    errors.push('Valid email is required');
  }

  return errors;
}

/**
 * Validate avatar file size (before base64 encoding)
 */
export function validateAvatarFile(file: File): string[] {
  const errors: string[] = [];
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (file.size > maxSize) {
    errors.push('Avatar file must be 2MB or less');
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('Avatar must be JPEG, PNG, or GIF format');
  }

  return errors;
}
