"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface ProfileTaskSummaryProps {
  totalTasks: number;
  completedTasks: number;
  incompleteTasks: number;
}

export function ProfileTaskSummary({
  totalTasks,
  completedTasks,
  incompleteTasks,
}: ProfileTaskSummaryProps) {
  const summaryItems = [
    {
      label: 'All Tasks',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Incomplete',
      value: incompleteTasks,
      icon: Circle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Summary</CardTitle>
        <CardDescription>Overview of your todo items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-4 p-4 rounded-lg ${item.bgColor}`}
              >
                <div className={`p-3 rounded-full bg-white dark:bg-gray-800`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
