import { useMemo } from 'react';
import { Todo, DashboardStatistics, ActivityEvent } from '@/types/storage';
import { calculateStatistics, calculateChartData } from '@/lib/storage/statistics';

/**
 * Hook to calculate dashboard statistics from todos and activity events
 */
export function useStatistics(todos: Todo[], events: ActivityEvent[]): DashboardStatistics {
  return useMemo(() => {
    return calculateStatistics(todos, events);
  }, [todos, events]);
}

/**
 * Hook to calculate chart data for completion trends
 */
export function useChartData(
  todos: Todo[],
  timeRange: 7 | 30 | 90
): {
  timeRange: 7 | 30 | 90;
  dataPoints: Array<{ date: string; completed: number; created: number }>;
  totalCompleted: number;
  totalCreated: number;
} {
  return useMemo(() => {
    return calculateChartData(todos, timeRange);
  }, [todos, timeRange]);
}
