'use client';

import React, { useState } from 'react';
import type { Todo } from '@/types/todo';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Undo2, Trash2, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete?: (id: number, completed: boolean) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number, title: string, description: string | null) => Promise<void>;
  selected?: boolean;
  onSelect?: () => void;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
  onEdit
}: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!onEdit || !editTitle.trim()) return;

    try {
      setIsSaving(true);
      await onEdit(todo.id, editTitle.trim(), editDescription.trim() || null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving edit:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
              {onEdit && (
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  size="sm"
                  aria-label="Edit todo"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}

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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>
              Update the title and description of your todo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter todo title"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter todo description"
                rows={4}
                maxLength={2000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
