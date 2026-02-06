'use client';

import React, { useState, useEffect } from 'react';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Todo } from '@/types/todo';
import { listTodos, updateTodo, deleteTodo } from '@/lib/api/todos';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TodoListProps {
  refreshTrigger?: number;
  filteredTodos?: Todo[];
  showFiltered?: boolean;
}

export function TodoList({ refreshTrigger = 0, filteredTodos, showFiltered = false }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { toast } = useToast();

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await listTodos();
      setTodos(response.todos);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load todos. Please try again.';
      setError(message);
      console.error('Error loading todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [refreshTrigger]);

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const updatedTodo = await updateTodo(id, { completed });
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      toast({
        title: "Success",
        description: completed ? "Todo marked as complete" : "Todo marked as incomplete",
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update todo';
      toast({ title: "Error", description: message, variant: "destructive" });
      console.error('Error updating todo:', err);
    }
  };

  const handleEdit = async (id: number, title: string, description: string | null) => {
    try {
      const updatedTodo = await updateTodo(id, { title, description });
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update todo';
      toast({ title: "Error", description: message, variant: "destructive" });
      console.error('Error updating todo:', err);
      throw err; // Re-throw so TodoItem can handle it
    }
  };

  const handleDeleteClick = (id: number) => setDeleteId(id);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteTodo(deleteId);
      setTodos(prev => prev.filter(todo => todo.id !== deleteId));
      toast({ title: "Success", description: "Todo deleted successfully" });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete todo';
      toast({ title: "Error", description: message, variant: "destructive" });
      console.error('Error deleting todo:', err);
    } finally {
      setDeleteId(null);
    }
  };

  // ✅ Multi Delete
  const toggleSelectTodo = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === displayTodos.length) setSelectedIds([]);
    else setSelectedIds(displayTodos.map(todo => todo.id));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(selectedIds.map(id => deleteTodo(id)));
      setTodos(prev => prev.filter(todo => !selectedIds.includes(todo.id)));
      toast({ title: "Success", description: "Selected todos deleted" });
      setSelectedIds([]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete selected todos';
      toast({ title: "Error", description: message, variant: "destructive" });
      console.error(err);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center py-12"><LoadingSpinner size="lg" /></div>;
  if (error) return (
    <div className="space-y-4">
      <ErrorMessage message={error} />
      <div className="flex justify-center"><Button onClick={loadTodos}>Try Again</Button></div>
    </div>
  );

  const displayTodos = showFiltered && filteredTodos ? filteredTodos : todos;
  if (displayTodos.length === 0) return <EmptyState />;

  return (
    <>
      <div className="space-y-4">
        {/* Header with Select All + Delete Selected */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-semibold">Your Todos ({displayTodos.length})</h2>
          <div className="flex items-center gap-2">
            {displayTodos.length > 0 && (
              <>
                {/* Select All Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedIds.length === displayTodos.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 cursor-pointer"
                />
                {/* Delete Selected Icon */}
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className="p-2 rounded hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Todo Items */}
        {displayTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            selected={selectedIds.includes(todo.id)}
            onSelect={() => toggleSelectTodo(todo.id)}
          />
        ))}
      </div>

      {/* Single Delete Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the todo.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
