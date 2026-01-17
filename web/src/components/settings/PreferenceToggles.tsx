"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PreferenceTogglesProps {
  showCompletedTodos: boolean;
  onToggleShowCompleted: (value: boolean) => void;
}

export function PreferenceToggles({
  showCompletedTodos,
  onToggleShowCompleted,
}: PreferenceTogglesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Preferences</CardTitle>
        <CardDescription>
          Customize how tasks and content are displayed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="show-completed" className="text-sm font-medium cursor-pointer">
                Show Completed Tasks
              </Label>
              <p className="text-xs text-muted-foreground">
                Display completed tasks in the todo list
              </p>
            </div>
            <Switch
              id="show-completed"
              checked={showCompletedTodos}
              onCheckedChange={onToggleShowCompleted}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
