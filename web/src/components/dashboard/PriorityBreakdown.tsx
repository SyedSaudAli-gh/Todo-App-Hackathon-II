"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowUp, Minus } from "lucide-react";

interface PriorityBreakdownProps {
  high: number;
  medium: number;
  low: number;
  isLoading?: boolean;
  onPriorityClick?: (priority: 'High' | 'Medium' | 'Low') => void;
}

export function PriorityBreakdown({
  high,
  medium,
  low,
  isLoading = false,
  onPriorityClick,
}: PriorityBreakdownProps) {
  const total = high + medium + low;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-56 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const priorityItems = [
    {
      priority: 'High' as const,
      count: high,
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'destructive' as const,
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      priority: 'Medium' as const,
      count: medium,
      icon: <ArrowUp className="h-4 w-4" />,
      color: 'default' as const,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      priority: 'Low' as const,
      count: low,
      icon: <Minus className="h-4 w-4" />,
      color: 'secondary' as const,
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
  ];

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Breakdown</CardTitle>
          <CardDescription>Task distribution by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No tasks yet. Create tasks with different priorities to see the breakdown.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Breakdown</CardTitle>
        <CardDescription>Task distribution by priority level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priorityItems.map((item) => (
            <div
              key={item.priority}
              className={`flex items-center justify-between p-3 rounded-lg ${item.bgColor} ${
                onPriorityClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
              }`}
              onClick={() => onPriorityClick?.(item.priority)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="font-medium">{item.priority}</span>
                </div>
                <Badge variant={item.color}>{item.count} tasks</Badge>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {getPercentage(item.count)}%
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Total Tasks</span>
            <span className="font-bold">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
