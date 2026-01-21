import { Todo, FilterState } from '@/types/storage';

/**
 * Apply filters to a list of todos
 */
export function applyFilters(todos: Todo[], filters: FilterState): Todo[] {
  let filtered = [...todos];

  // Priority filter (OR logic within priorities)
  if (filters.priorities.length > 0) {
    filtered = filtered.filter((t) => filters.priorities.includes(t.priority));
  }

  // Status filter (OR logic within statuses)
  if (filters.statuses.length > 0) {
    filtered = filtered.filter((t) => filters.statuses.includes(t.status));
  }

  // Search query (case-insensitive, title + description)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
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

/**
 * Get priority badge color
 */
export function getPriorityColor(priority: 'High' | 'Medium' | 'Low'): string {
  switch (priority) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'default';
    case 'Low':
      return 'secondary';
    default:
      return 'default';
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(status: 'To Do' | 'In Progress' | 'Done'): string {
  switch (status) {
    case 'To Do':
      return 'secondary';
    case 'In Progress':
      return 'default';
    case 'Done':
      return 'outline';
    default:
      return 'default';
  }
}

/**
 * Sort todos by priority (High > Medium > Low)
 */
export function sortByPriority(todos: Todo[], direction: 'asc' | 'desc' = 'desc'): Todo[] {
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };

  return [...todos].sort((a, b) => {
    const aValue = priorityOrder[a.priority];
    const bValue = priorityOrder[b.priority];
    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  });
}

/**
 * Sort todos by status (To Do > In Progress > Done)
 */
export function sortByStatus(todos: Todo[], direction: 'asc' | 'desc' = 'desc'): Todo[] {
  const statusOrder = { 'To Do': 3, 'In Progress': 2, 'Done': 1 };

  return [...todos].sort((a, b) => {
    const aValue = statusOrder[a.status];
    const bValue = statusOrder[b.status];
    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  });
}

/**
 * Group todos by priority
 */
export function groupByPriority(todos: Todo[]): Record<'High' | 'Medium' | 'Low', Todo[]> {
  return {
    High: todos.filter((t) => t.priority === 'High'),
    Medium: todos.filter((t) => t.priority === 'Medium'),
    Low: todos.filter((t) => t.priority === 'Low'),
  };
}

/**
 * Group todos by status
 */
export function groupByStatus(todos: Todo[]): Record<'To Do' | 'In Progress' | 'Done', Todo[]> {
  return {
    'To Do': todos.filter((t) => t.status === 'To Do'),
    'In Progress': todos.filter((t) => t.status === 'In Progress'),
    'Done': todos.filter((t) => t.status === 'Done'),
  };
}
