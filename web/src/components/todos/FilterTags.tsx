"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterTagsProps {
  showCompleted: boolean;
  showActive: boolean;
  onToggleCompleted: () => void;
  onToggleActive: () => void;
  onClearAll: () => void;
}

export function FilterTags({
  showCompleted,
  showActive,
  onToggleCompleted,
  onToggleActive,
  onClearAll,
}: FilterTagsProps) {
  const hasActiveFilters = !showCompleted || !showActive;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>

      {!showActive && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          <span>Hide Active</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onToggleActive}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {!showCompleted && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          <span>Hide Completed</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onToggleCompleted}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 text-xs ml-auto"
      >
        Clear All
      </Button>
    </div>
  );
}
