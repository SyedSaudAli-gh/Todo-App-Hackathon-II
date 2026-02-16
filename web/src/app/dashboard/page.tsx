"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics, useChartData } from "@/hooks/useStatistics";
import { useActivity } from "@/contexts/ActivityContext";
import { listTodos } from "@/lib/api/todos";
import { Todo } from "@/types/todo";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { CompletionChart } from "@/components/dashboard/CompletionChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PriorityBreakdown } from "@/components/dashboard/PriorityBreakdown";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { events, recentEvents } = useActivity();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(7);
  const [isLoading, setIsLoading] = useState(true);

  // Load todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await listTodos();
        // Backend already filters by authenticated user via JWT
        setTodos(response.todos);
      } catch (error) {
        console.error('Error fetching todos from API:', error);
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [user?.id]);

  // Calculate statistics
  // TODO: Fix type mismatch - API todos vs storage todos
  // Temporarily disabled to fix build
  const statistics = {
    totalTasks: todos.length,
    completedTasks: todos.filter(t => t.completed).length,
    pendingTasks: todos.filter(t => !t.completed).length,
    completionRate: todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0,
    priorityBreakdown: { high: 0, medium: 0, low: 0 },
    statusBreakdown: { toDo: todos.filter(t => !t.completed).length, inProgress: 0, done: todos.filter(t => t.completed).length },
    recentActivity: []
  };
  const chartData = {
    timeRange,
    dataPoints: [],
    totalCompleted: todos.filter(t => t.completed).length,
    totalCreated: todos.length
  };

  // Handle priority click - navigate to todos page with filter
  const handlePriorityClick = (priority: 'High' | 'Medium' | 'Low') => {
    router.push(`/dashboard/todos?priority=${priority}`);
  };

  // Show empty state if no todos
  if (!isLoading && todos.length === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        totalTasks={statistics.totalTasks}
        completedTasks={statistics.completedTasks}
        pendingTasks={statistics.pendingTasks}
        completionRate={statistics.completionRate}
        isLoading={isLoading}
      />

      {/* Charts and Activity Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Completion Chart */}
        <div className="md:col-span-2">
          <CompletionChart
            data={chartData.dataPoints}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isLoading={isLoading}
          />
        </div>

        {/* Activity Feed */}
        <ActivityFeed
          events={recentEvents}
          isLoading={isLoading}
          maxEvents={5}
        />

        {/* Priority Breakdown */}
        <PriorityBreakdown
          high={statistics.priorityBreakdown.high}
          medium={statistics.priorityBreakdown.medium}
          low={statistics.priorityBreakdown.low}
          isLoading={isLoading}
          onPriorityClick={handlePriorityClick}
        />
      </div>
    </div>
  );
}
