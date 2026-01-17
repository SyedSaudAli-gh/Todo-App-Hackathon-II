import { useState, useMemo } from 'react';
import { Todo, FilterState, DEFAULT_FILTER_STATE } from '@/types/storage';

/**
 * Hook to manage filter state and apply filters to todos
 */
export function useFilters(todos: Todo[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // Apply filters to todos
  const filteredTodos = useMemo(() => {
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
  }, [todos, filters]);

  // Update priority filters
  const setPriorityFilters = (priorities: ('High' | 'Medium' | 'Low')[]) => {
    setFilters((prev) => ({ ...prev, priorities }));
  };

  // Update status filters
  const setStatusFilters = (statuses: ('To Do' | 'In Progress' | 'Done')[]) => {
    setFilters((prev) => ({ ...prev, statuses }));
  };

  // Update search query
  const setSearchQuery = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  // Update sort
  const setSort = (sortBy: FilterState['sortBy'], sortDirection: FilterState['sortDirection']) => {
    setFilters((prev) => ({ ...prev, sortBy, sortDirection }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
  };

  // Remove specific filter
  const removeFilter = (filterType: 'priority' | 'status' | 'search', value?: string) => {
    if (filterType === 'priority' && value) {
      setFilters((prev) => ({
        ...prev,
        priorities: prev.priorities.filter((p) => p !== value),
      }));
    } else if (filterType === 'status' && value) {
      setFilters((prev) => ({
        ...prev,
        statuses: prev.statuses.filter((s) => s !== value),
      }));
    } else if (filterType === 'search') {
      setFilters((prev) => ({ ...prev, searchQuery: '' }));
    }
  };

  // Get active filter count
  const activeFilterCount = filters.priorities.length + filters.statuses.length + (filters.searchQuery ? 1 : 0);

  return {
    filters,
    filteredTodos,
    setPriorityFilters,
    setStatusFilters,
    setSearchQuery,
    setSort,
    clearFilters,
    removeFilter,
    activeFilterCount,
  };
}
