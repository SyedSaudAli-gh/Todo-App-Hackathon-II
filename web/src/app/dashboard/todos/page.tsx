"use client";

import { useState, useEffect } from "react";
import { TodoForm } from "@/components/todos/TodoForm";
import { TodoList } from "@/components/todos/TodoList";
import { FilterPanel } from "@/components/todos/FilterPanel";
import { FilterTags } from "@/components/todos/FilterTags";
import { FilterEmptyState } from "@/components/todos/FilterEmptyState";
import type { TodoCreate, Todo } from "@/types/todo";
import { createTodo, listTodos } from "@/lib/api/todos";
import { ApiError } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";
import { useActivity } from "@/contexts/ActivityContext";

export default function TodosPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { addEvent } = useActivity();

  // Filter state
  const [showCompleted, setShowCompleted] = useState(true);
  const [showActive, setShowActive] = useState(true);

  // Load todos
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        console.log('📋 Loading todos...');
        const response = await listTodos();
        setTodos(response.todos);
        console.log(`✅ Loaded ${response.todos.length} todos`);
      } catch (err) {
        console.error('❌ Error loading todos:', err);

        // Show error toast with helpful message
        const errorMessage = err instanceof ApiError
          ? err.message
          : 'Failed to load todos';

        toast({
          title: "Failed to load todos",
          description: errorMessage,
          variant: "destructive",
        });

        // If it's an auth error, show additional help
        if (err instanceof ApiError && err.status === 401) {
          console.error('\n⚠️  AUTHENTICATION ERROR');
          console.error('   Check the console logs above for JWT token fetch errors');
          console.error('   Common causes:');
          console.error('   1. JWT_PRIVATE_KEY environment variable not set');
          console.error('   2. Better Auth session expired');
          console.error('   3. Backend API is not running or unreachable\n');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [refreshTrigger, toast]);

  // Apply filters
  const filteredTodos = todos.filter((todo) => {
    // Filter by completion status
    if (todo.completed && !showCompleted) {
      return false;
    }
    if (!todo.completed && !showActive) {
      return false;
    }
    return true;
  });

  const handleCreateTodo = async (data: TodoCreate) => {
    try {
      setIsCreating(true);

      const newTodo = await createTodo(data);

      toast({
        title: "Success",
        description: "Todo created successfully",
      });

      // Track activity
      addEvent('created', newTodo.id.toString(), newTodo.title);

      // Trigger refresh of todo list
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to create todo";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleToggleActive = () => {
    setShowActive((prev) => !prev);
  };

  const handleClearAllFilters = () => {
    setShowCompleted(true);
    setShowActive(true);
  };

  const hasActiveFilters = !showCompleted || !showActive;
  const showFilteredEmptyState = hasActiveFilters && filteredTodos.length === 0 && todos.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Todos</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tasks and stay organized
        </p>
      </div>

      <TodoForm onSubmit={handleCreateTodo} isLoading={isCreating} />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Filter Panel */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <FilterPanel
            showCompleted={showCompleted}
            showActive={showActive}
            onToggleCompleted={handleToggleCompleted}
            onToggleActive={handleToggleActive}
            onClearAll={handleClearAllFilters}
            totalCount={todos.length}
            filteredCount={filteredTodos.length}
          />
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {/* Filter Tags */}
          <FilterTags
            showCompleted={showCompleted}
            showActive={showActive}
            onToggleCompleted={handleToggleCompleted}
            onToggleActive={handleToggleActive}
            onClearAll={handleClearAllFilters}
          />

          {/* Empty State for Filtered Results */}
          {showFilteredEmptyState ? (
            <FilterEmptyState onClearFilters={handleClearAllFilters} />
          ) : (
            <TodoList
              refreshTrigger={refreshTrigger}
              filteredTodos={filteredTodos}
              showFiltered={hasActiveFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}