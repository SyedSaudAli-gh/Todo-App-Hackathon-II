'use client';

import React from 'react';
import type { Todo } from '@/types/todo';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Undo2, Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete?: (id: number, completed: boolean) => void;
  onDelete?: (id: number) => void;
  selected?: boolean;
  onSelect?: () => void;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onDelete
}: TodoItemProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:bg-accent/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg font-semibold ${todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {todo.title}
              </h3>
              {todo.completed && (
                <Badge variant="default" className="ml-2">
                  Completed
                </Badge>
              )}
            </div>

            {todo.description && (
              <p className={`mt-2 text-sm ${todo.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                {todo.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>Created: {formatDate(todo.created_at)}</span>
              {todo.updated_at !== todo.created_at && (
                <span>Updated: {formatDate(todo.updated_at)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onToggleComplete && (
              <Button
                onClick={() => onToggleComplete(todo.id, !todo.completed)}
                variant={todo.completed ? "outline" : "default"}
                size="sm"
                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {todo.completed ? (
                  <>
                    <Undo2 className="h-4 w-4 mr-1" />
                    Undo
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Complete
                  </>
                )}
              </Button>
            )}

            {onDelete && (
              <Button
                onClick={() => onDelete(todo.id)}
                variant="destructive"
                size="sm"
                aria-label="Delete todo"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
