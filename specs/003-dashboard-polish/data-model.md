# Data Model: Dashboard Polish & Advanced Features

**Feature**: 003-dashboard-polish
**Date**: 2026-01-08
**Storage**: localStorage (client-side persistence)

## Purpose

This document defines all data entities for the dashboard polish feature. All entities are TypeScript interfaces stored in localStorage as JSON. No backend database required (portfolio showcase scope).

---

## Entity 1: Todo (Enhanced)

**Purpose**: Represents a task with priority, status, and metadata for advanced filtering and dashboard statistics.

**TypeScript Interface**:
```typescript
interface Todo {
  id: string;                    // UUID v4 (unique identifier)
  title: string;                 // Required, 1-200 characters
  description?: string;          // Optional, 0-1000 characters
  priority: 'High' | 'Medium' | 'Low';  // Required, enum
  status: 'To Do' | 'In Progress' | 'Done';  // Required, enum
  createdAt: string;             // ISO 8601 timestamp (auto-generated)
  updatedAt: string;             // ISO 8601 timestamp (auto-updated)
  completedAt?: string;          // ISO 8601 timestamp (set when status → Done)
  userId: string;                // User ID from Better Auth session
}
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format
- `title`: Required, non-empty, max 200 characters
- `description`: Optional, max 1000 characters
- `priority`: Must be one of: 'High', 'Medium', 'Low'
- `status`: Must be one of: 'To Do', 'In Progress', 'Done'
- `createdAt`: Auto-generated on creation, immutable
- `updatedAt`: Auto-updated on any field change
- `completedAt`: Auto-set when status changes to 'Done', cleared if status changes away from 'Done'
- `userId`: Must match authenticated user's ID

**State Transitions**:
```
To Do → In Progress → Done
  ↓         ↓          ↓
  ←─────────←──────────←  (can move back to any previous state)
```

**localStorage Key**: `todos`
**Storage Format**: JSON array of Todo objects
**Max Items**: 1000 (performance constraint)

---

## Entity 2: UserProfile

**Purpose**: Stores user profile information including avatar for display in header and profile page.

**TypeScript Interface**:
```typescript
interface UserProfile {
  id: string;                    // User ID from Better Auth
  name: string;                  // Display name, 1-100 characters
  email: string;                 // Email address (from Better Auth)
  avatar?: string;               // Base64 encoded image or URL
  joinDate: string;              // ISO 8601 timestamp (account creation)
  updatedAt: string;             // ISO 8601 timestamp (last profile update)
}
```

**Validation Rules**:
- `id`: Must match Better Auth user ID
- `name`: Required, non-empty, max 100 characters
- `email`: Required, valid email format
- `avatar`: Optional, base64 string (max 2MB original file) or URL
- `joinDate`: Auto-generated on first profile creation, immutable
- `updatedAt`: Auto-updated on any field change

**localStorage Key**: `user_profile`
**Storage Format**: Single JSON object
**Max Size**: ~10KB (with base64 avatar)

---

## Entity 3: UserPreferences

**Purpose**: Stores user customization settings for theme and display preferences.

**TypeScript Interface**:
```typescript
interface UserPreferences {
  userId: string;                // User ID from Better Auth
  theme: 'Light' | 'Dark' | 'System';  // Theme preference
  showCompletedTodos: boolean;   // Display completed tasks in list
  defaultSortOrder: 'createdAt' | 'priority' | 'status' | 'title';  // Default sort
  defaultSortDirection: 'asc' | 'desc';  // Sort direction
  chartTimeRange: 7 | 30 | 90;   // Default chart time range (days)
  updatedAt: string;             // ISO 8601 timestamp (last update)
}
```

**Validation Rules**:
- `userId`: Must match authenticated user's ID
- `theme`: Must be one of: 'Light', 'Dark', 'System'
- `showCompletedTodos`: Boolean (default: true)
- `defaultSortOrder`: Must be one of: 'createdAt', 'priority', 'status', 'title'
- `defaultSortDirection`: Must be one of: 'asc', 'desc'
- `chartTimeRange`: Must be one of: 7, 30, 90 (days)
- `updatedAt`: Auto-updated on any field change

**Default Values**:
```typescript
const defaultPreferences: UserPreferences = {
  userId: '', // Set from auth
  theme: 'System',
  showCompletedTodos: true,
  defaultSortOrder: 'createdAt',
  defaultSortDirection: 'desc',
  chartTimeRange: 7,
  updatedAt: new Date().toISOString()
};
```

**localStorage Key**: `user_preferences`
**Storage Format**: Single JSON object
**Max Size**: ~1KB

---

## Entity 4: ActivityEvent

**Purpose**: Tracks user actions on todos for display in dashboard activity feed.

**TypeScript Interface**:
```typescript
interface ActivityEvent {
  id: string;                    // UUID v4 (unique identifier)
  userId: string;                // User ID from Better Auth
  eventType: 'created' | 'completed' | 'updated' | 'deleted';  // Action type
  todoId: string;                // ID of affected todo
  todoTitle: string;             // Title of todo (snapshot at event time)
  description: string;           // Human-readable description
  timestamp: string;             // ISO 8601 timestamp (event time)
  metadata?: Record<string, any>;  // Optional additional data
}
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format
- `userId`: Must match authenticated user's ID
- `eventType`: Must be one of: 'created', 'completed', 'updated', 'deleted'
- `todoId`: Must be valid UUID v4 format
- `todoTitle`: Required, snapshot of todo title at event time
- `description`: Required, human-readable event description
- `timestamp`: Auto-generated on event creation, immutable
- `metadata`: Optional, can store additional context (e.g., changed fields)

**Event Type Examples**:
```typescript
// Created
{
  eventType: 'created',
  description: 'Created task "Buy groceries"',
  metadata: { priority: 'High', status: 'To Do' }
}

// Completed
{
  eventType: 'completed',
  description: 'Completed task "Buy groceries"',
  metadata: { completedAt: '2026-01-08T10:30:00Z' }
}

// Updated
{
  eventType: 'updated',
  description: 'Updated task "Buy groceries"',
  metadata: { changedFields: ['priority'], oldPriority: 'Medium', newPriority: 'High' }
}

// Deleted
{
  eventType: 'deleted',
  description: 'Deleted task "Buy groceries"',
  metadata: { deletedAt: '2026-01-08T11:00:00Z' }
}
```

**localStorage Key**: `activity_events`
**Storage Format**: JSON array of ActivityEvent objects (sorted by timestamp desc)
**Max Items**: 100 (performance constraint - keep most recent)
**Cleanup Strategy**: When array exceeds 100 items, remove oldest events

---

## Entity 5: DashboardStatistics (Computed)

**Purpose**: Aggregated metrics calculated from todos for dashboard display. Not stored in localStorage (computed on-demand).

**TypeScript Interface**:
```typescript
interface DashboardStatistics {
  totalTasks: number;            // Total number of todos
  completedTasks: number;        // Number of todos with status 'Done'
  pendingTasks: number;          // Number of todos with status 'To Do' or 'In Progress'
  completionRate: number;        // Percentage (0-100) of completed tasks
  priorityBreakdown: {
    high: number;                // Count of High priority tasks
    medium: number;              // Count of Medium priority tasks
    low: number;                 // Count of Low priority tasks
  };
  statusBreakdown: {
    toDo: number;                // Count of 'To Do' tasks
    inProgress: number;          // Count of 'In Progress' tasks
    done: number;                // Count of 'Done' tasks
  };
  recentActivity: ActivityEvent[];  // Last 5 activity events
}
```

**Calculation Logic**:
```typescript
function calculateStatistics(todos: Todo[], events: ActivityEvent[]): DashboardStatistics {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.status === 'Done').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const priorityBreakdown = {
    high: todos.filter(t => t.priority === 'High').length,
    medium: todos.filter(t => t.priority === 'Medium').length,
    low: todos.filter(t => t.priority === 'Low').length,
  };

  const statusBreakdown = {
    toDo: todos.filter(t => t.status === 'To Do').length,
    inProgress: todos.filter(t => t.status === 'In Progress').length,
    done: todos.filter(t => t.status === 'Done').length,
  };

  const recentActivity = events.slice(0, 5);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    priorityBreakdown,
    statusBreakdown,
    recentActivity,
  };
}
```

**Note**: This entity is computed on-demand, not persisted to localStorage.

---

## Entity 6: ChartData (Computed)

**Purpose**: Time-series data for completion chart. Computed from todos based on selected time range.

**TypeScript Interface**:
```typescript
interface ChartDataPoint {
  date: string;                  // ISO 8601 date (YYYY-MM-DD)
  completed: number;             // Number of tasks completed on this date
  created: number;               // Number of tasks created on this date
}

interface ChartData {
  timeRange: 7 | 30 | 90;        // Selected time range (days)
  dataPoints: ChartDataPoint[];  // Array of daily data points
  totalCompleted: number;        // Total completions in time range
  totalCreated: number;          // Total creations in time range
}
```

**Calculation Logic**:
```typescript
function calculateChartData(todos: Todo[], timeRange: 7 | 30 | 90): ChartData {
  const now = new Date();
  const startDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000);

  const dataPoints: ChartDataPoint[] = [];
  let totalCompleted = 0;
  let totalCreated = 0;

  for (let i = 0; i < timeRange; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    const completed = todos.filter(t =>
      t.completedAt && t.completedAt.startsWith(dateStr)
    ).length;

    const created = todos.filter(t =>
      t.createdAt.startsWith(dateStr)
    ).length;

    dataPoints.push({ date: dateStr, completed, created });
    totalCompleted += completed;
    totalCreated += created;
  }

  return { timeRange, dataPoints, totalCompleted, totalCreated };
}
```

**Note**: This entity is computed on-demand, not persisted to localStorage.

---

## Entity 7: FilterState

**Purpose**: Current filter selections for todo list. Stored in component state, not localStorage.

**TypeScript Interface**:
```typescript
interface FilterState {
  priorities: ('High' | 'Medium' | 'Low')[];  // Selected priority filters
  statuses: ('To Do' | 'In Progress' | 'Done')[];  // Selected status filters
  searchQuery: string;           // Text search query
  sortBy: 'createdAt' | 'priority' | 'status' | 'title';  // Sort field
  sortDirection: 'asc' | 'desc'; // Sort direction
}
```

**Default Values**:
```typescript
const defaultFilterState: FilterState = {
  priorities: [],  // Empty = show all
  statuses: [],    // Empty = show all
  searchQuery: '',
  sortBy: 'createdAt',
  sortDirection: 'desc'
};
```

**Filter Logic**:
```typescript
function applyFilters(todos: Todo[], filters: FilterState): Todo[] {
  let filtered = [...todos];

  // Priority filter (OR logic within priorities)
  if (filters.priorities.length > 0) {
    filtered = filtered.filter(t => filters.priorities.includes(t.priority));
  }

  // Status filter (OR logic within statuses)
  if (filters.statuses.length > 0) {
    filtered = filtered.filter(t => filters.statuses.includes(t.status));
  }

  // Search query (case-insensitive, title + description)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query))
    );
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[filters.sortBy];
    const bVal = b[filters.sortBy];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return filters.sortDirection === 'asc' ? comparison : -comparison;
  });

  return filtered;
}
```

**Note**: This entity is stored in React component state, not localStorage.

---

## localStorage Schema Version

**Purpose**: Track schema version for future migrations.

**TypeScript Interface**:
```typescript
interface SchemaVersion {
  version: string;               // Semantic version (e.g., '1.0.0')
  lastMigration?: string;        // ISO 8601 timestamp of last migration
}
```

**localStorage Key**: `app_version`
**Storage Format**: Single JSON object
**Current Version**: '1.0.0'

---

## Summary

| Entity | localStorage Key | Type | Max Size | Computed |
|--------|-----------------|------|----------|----------|
| Todo | `todos` | Array | 1000 items | No |
| UserProfile | `user_profile` | Object | ~10KB | No |
| UserPreferences | `user_preferences` | Object | ~1KB | No |
| ActivityEvent | `activity_events` | Array | 100 items | No |
| DashboardStatistics | N/A | Object | N/A | Yes |
| ChartData | N/A | Object | N/A | Yes |
| FilterState | N/A | Object | N/A | No (component state) |
| SchemaVersion | `app_version` | Object | <1KB | No |

**Total localStorage Usage**: ~561KB (well under 5MB browser limit)

## Next Steps

1. Create TypeScript type definitions in `contracts/localStorage-schema.ts`
2. Implement localStorage utility functions in `web/src/lib/storage/`
3. Create React hooks for data access (`useTodos`, `usePreferences`, etc.)
4. Implement validation functions for all entities
5. Create migration strategy for future schema changes
