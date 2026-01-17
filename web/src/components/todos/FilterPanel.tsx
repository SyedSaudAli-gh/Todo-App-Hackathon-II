"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  showCompleted: boolean;
  showActive: boolean;
  onToggleCompleted: () => void;
  onToggleActive: () => void;
  onClearAll: () => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterPanel({
  showCompleted,
  showActive,
  onToggleCompleted,
  onToggleActive,
  onClearAll,
  totalCount,
  filteredCount,
}: FilterPanelProps) {
  const hasActiveFilters = showCompleted === false || showActive === false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        <CardDescription>
          Showing {filteredCount} of {totalCount} tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-active"
                checked={showActive}
                onCheckedChange={onToggleActive}
              />
              <label
                htmlFor="filter-active"
                className="text-sm font-medium cursor-pointer"
              >
                Active
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-completed"
                checked={showCompleted}
                onCheckedChange={onToggleCompleted}
              />
              <label
                htmlFor="filter-completed"
                className="text-sm font-medium cursor-pointer"
              >
                Completed
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
