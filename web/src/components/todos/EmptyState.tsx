'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No todos yet. Create your first one!" }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="max-w-sm mx-auto">
          <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No todos</h3>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
