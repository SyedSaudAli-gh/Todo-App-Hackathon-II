import { Todo, DashboardStatistics, ActivityEvent } from '@/types/storage';

/**
 * Calculate dashboard statistics from todos and activity events
 */
export function calculateStatistics(todos: Todo[], events: ActivityEvent[]): DashboardStatistics {
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.status === 'Done').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const priorityBreakdown = {
    high: todos.filter((t) => t.priority === 'High').length,
    medium: todos.filter((t) => t.priority === 'Medium').length,
    low: todos.filter((t) => t.priority === 'Low').length,
  };

  const statusBreakdown = {
    toDo: todos.filter((t) => t.status === 'To Do').length,
    inProgress: todos.filter((t) => t.status === 'In Progress').length,
    done: todos.filter((t) => t.status === 'Done').length,
  };

  const recentActivity = events.slice(0, 5);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate: Math.round(completionRate * 10) / 10, // Round to 1 decimal place
    priorityBreakdown,
    statusBreakdown,
    recentActivity,
  };
}

/**
 * Calculate chart data for completion trends
 */
export function calculateChartData(
  todos: Todo[],
  timeRange: 7 | 30 | 90
): {
  timeRange: 7 | 30 | 90;
  dataPoints: Array<{ date: string; completed: number; created: number }>;
  totalCompleted: number;
  totalCreated: number;
} {
  const now = new Date();
  const startDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000);

  const dataPoints: Array<{ date: string; completed: number; created: number }> = [];
  let totalCompleted = 0;
  let totalCreated = 0;

  for (let i = 0; i < timeRange; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    const completed = todos.filter(
      (t) => t.completedAt && t.completedAt.startsWith(dateStr)
    ).length;

    const created = todos.filter((t) => t.createdAt.startsWith(dateStr)).length;

    dataPoints.push({ date: dateStr, completed, created });
    totalCompleted += completed;
    totalCreated += created;
  }

  return { timeRange, dataPoints, totalCompleted, totalCreated };
}

/**
 * Get statistics for a specific user
 */
export function getUserStatistics(
  todos: Todo[],
  events: ActivityEvent[],
  userId: string
): DashboardStatistics {
  const userTodos = todos.filter((t) => t.userId === userId);
  const userEvents = events.filter((e) => e.userId === userId);
  return calculateStatistics(userTodos, userEvents);
}

/**
 * Get completion rate for a specific time period
 */
export function getCompletionRateForPeriod(
  todos: Todo[],
  days: number
): number {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const todosInPeriod = todos.filter((t) => {
    const createdDate = new Date(t.createdAt);
    return createdDate >= startDate;
  });

  const completedInPeriod = todosInPeriod.filter((t) => t.status === 'Done').length;
  const totalInPeriod = todosInPeriod.length;

  return totalInPeriod > 0 ? (completedInPeriod / totalInPeriod) * 100 : 0;
}

/**
 * Get most productive day of the week
 */
export function getMostProductiveDay(todos: Todo[]): string {
  const dayCompletions: Record<string, number> = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  todos.forEach((todo) => {
    if (todo.completedAt) {
      const date = new Date(todo.completedAt);
      const dayName = dayNames[date.getDay()];
      dayCompletions[dayName]++;
    }
  });

  let maxDay = 'Sunday';
  let maxCompletions = 0;

  Object.entries(dayCompletions).forEach(([day, count]) => {
    if (count > maxCompletions) {
      maxCompletions = count;
      maxDay = day;
    }
  });

  return maxDay;
}
