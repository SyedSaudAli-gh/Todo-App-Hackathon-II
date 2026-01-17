"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

interface FilterEmptyStateProps {
  onClearFilters: () => void;
}

export function FilterEmptyState({ onClearFilters }: FilterEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No tasks match your filters</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Try adjusting your filter criteria or clear all filters to see all tasks.
        </p>
        <Button onClick={onClearFilters} variant="outline">
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
