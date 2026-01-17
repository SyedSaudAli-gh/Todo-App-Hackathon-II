"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ListTodo, TrendingUp, Calendar } from 'lucide-react';

interface ProfileStatsProps {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  activeDays: number;
}

export function ProfileStats({
  totalTasks,
  completedTasks,
  completionRate,
  activeDays,
}: ProfileStatsProps) {
  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      description: 'All tasks created',
      color: 'text-blue-500',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      description: 'Tasks finished',
      color: 'text-green-500',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      description: 'Success rate',
      color: 'text-purple-500',
    },
    {
      title: 'Active Days',
      value: activeDays,
      icon: Calendar,
      description: 'Days with activity',
      color: 'text-orange-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Statistics</CardTitle>
        <CardDescription>Your productivity overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 text-center"
              >
                <Icon className={`h-8 w-8 mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
