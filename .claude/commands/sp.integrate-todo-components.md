# Skill: Integrate Todo Components

## Purpose
Integrate existing Todo components (TodoList, TodoForm, TodoItem) into the dashboard layout, connecting them to the backend API and implementing proper state management for a seamless user experience.

## When to Use
- After completing `build-dashboard-shell` skill
- Existing Todo components are available
- Need to create todos page within dashboard
- Ready to connect frontend to backend API
- Want to implement CRUD operations in dashboard

## Inputs
- Existing Todo components from Phase I
- Dashboard layout structure
- Backend API endpoints (`/api/v1/todos`)
- API client functions (`listTodos`, `createTodo`, etc.)
- Todo type definitions

## Step-by-Step Process

### 1. Review Existing Todo Components
Check available components in `web/src/components/todos/`:
```bash
web/src/components/todos/
├── TodoList.tsx       # List of todos
├── TodoItem.tsx       # Single todo item
├── TodoForm.tsx       # Create/edit form
└── EmptyState.tsx     # Empty state UI
```

### 2. Create Todos Dashboard Page
Create `web/src/app/todos/page.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { MainContent } from '@/components/dashboard/layout/MainContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoList } from '@/components/todos/TodoList';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { listTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api/todos';
import type { Todo, TodoCreate, TodoUpdate } from '@/types/todo';

function TodosContent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await listTodos();
      setTodos(response.todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: TodoCreate) => {
    try {
      const newTodo = await createTodo(data);
      setTodos([newTodo, ...todos]);
      setShowForm(false);
    } catch (err) {
      throw err; // Let form handle error display
    }
  };

  const handleUpdate = async (id: number, data: TodoUpdate) => {
    try {
      const updatedTodo = await updateTodo(id, data);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    await handleUpdate(id, { completed });
  };

  return (
    <MainContent
      title="Todos"
      subtitle={`${todos.length} total, ${todos.filter(t => t.completed).length} completed`}
      actions={
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Todo'}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Todo Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <TodoForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          /* Todo List */
          <TodoList
            todos={todos}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>
    </MainContent>
  );
}

export default function TodosPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <TodosContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

### 3. Update TodoList Component for Dashboard
Update `web/src/components/todos/TodoList.tsx`:
```typescript
'use client';

import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import type { Todo, TodoUpdate } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: number, data: TodoUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
}

export function TodoList({
  todos,
  onUpdate,
  onDelete,
  onToggleComplete,
}: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  // Group todos by status
  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Pending ({pendingTodos.length})
          </h2>
          <div className="space-y-3">
            {pendingTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Completed ({completedTodos.length})
          </h2>
          <div className="space-y-3">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. Update TodoItem Component
Update `web/src/components/todos/TodoItem.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Todo, TodoUpdate } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: TodoUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
}

export function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onToggleComplete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update todo:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggleComplete(todo.id, !todo.completed);
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
          placeholder="Todo title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
          placeholder="Description (optional)"
          rows={3}
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isUpdating || !editTitle.trim()}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white p-4 rounded-lg shadow border border-gray-200
        transition-opacity duration-200
        ${todo.completed ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className="mt-1 flex-shrink-0"
        >
          <div
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center
              transition-colors duration-200
              ${
                todo.completed
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 hover:border-blue-600'
              }
            `}
          >
            {todo.completed && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-base font-medium
              ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}
            `}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Created {formatDate(todo.created_at)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5. Update TodoForm Component
Update `web/src/components/todos/TodoForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { TodoCreate } from '@/types/todo';

interface TodoFormProps {
  onSubmit: (data: TodoCreate) => Promise<void>;
  onCancel?: () => void;
}

export function TodoForm({ onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
      });
      // Reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Create New Todo</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Input
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo title..."
        required
        maxLength={200}
        disabled={isSubmitting}
      />

      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter todo description..."
        maxLength={2000}
        rows={3}
        disabled={isSubmitting}
      />

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Todo'}
        </Button>
      </div>
    </form>
  );
}
```

### 6. Add Todo Count to Sidebar Badge
Update `web/src/components/dashboard/layout/Sidebar.tsx` to show dynamic todo count:
```typescript
// Add this hook at the top of Sidebar component
const [todoCount, setTodoCount] = useState(0);

useEffect(() => {
  // Fetch todo count
  listTodos().then(response => {
    const pending = response.todos.filter(t => !t.completed).length;
    setTodoCount(pending);
  }).catch(console.error);
}, []);

// Update navigation items
const navigationItems = [
  // ... other items
  {
    href: '/todos',
    icon: /* ... */,
    label: 'Todos',
    badge: todoCount, // Dynamic count
  },
  // ... other items
];
```

### 7. Create Dashboard Overview with Todo Stats
Update `web/src/app/dashboard/page.tsx` to show real todo statistics:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { MainContent } from '@/components/dashboard/layout/MainContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { listTodos } from '@/lib/api/todos';
import Link from 'next/link';

function DashboardContent() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await listTodos();
      const completed = response.todos.filter(t => t.completed).length;
      setStats({
        total: response.total,
        completed,
        pending: response.total - completed,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <MainContent
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your todos."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Todos */}
        <Link href="/todos" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Todos</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Completed */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats.completed}</p>
              <p className="mt-2 text-sm text-gray-600">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="mt-2 text-3xl font-bold text-orange-600">{stats.pending}</p>
              <p className="mt-2 text-sm text-gray-600">Tasks to complete</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

### 8. Test Todo Integration
1. Navigate to `/dashboard` - verify stats display
2. Navigate to `/todos` - verify todo list loads
3. Create a new todo - verify it appears in list
4. Toggle todo completion - verify state updates
5. Edit a todo - verify changes save
6. Delete a todo - verify it's removed
7. Check dashboard stats update after changes
8. Verify sidebar badge shows correct count

## Output
- ✅ Todos page integrated into dashboard
- ✅ TodoList, TodoItem, TodoForm components working
- ✅ CRUD operations functional (Create, Read, Update, Delete)
- ✅ Real-time todo statistics on dashboard
- ✅ Dynamic sidebar badge with todo count
- ✅ Loading and error states handled
- ✅ Optimistic UI updates
- ✅ Confirmation dialogs for destructive actions

## Failure Handling

### Error: "API calls failing"
**Solution**:
1. Verify backend server is running on port 8001
2. Check API client base URL in `.env.local`
3. Verify CORS is configured correctly
4. Check network tab in browser DevTools
5. Ensure authentication token is being sent

### Error: "Todos not displaying"
**Solution**:
1. Check console for errors
2. Verify API response structure matches types
3. Check todos array is being set in state
4. Verify TodoList component is rendering
5. Test API endpoint directly with curl

### Error: "State not updating after create/update"
**Solution**:
1. Verify state setter is being called
2. Check API response includes updated data
3. Ensure component re-renders after state change
4. Use React DevTools to inspect state

### Error: "Delete confirmation not showing"
**Solution**:
1. Verify `confirm()` is being called
2. Check browser allows dialogs
3. Implement custom confirmation modal if needed
4. Test in different browsers

### Error: "Form not resetting after submit"
**Solution**:
1. Verify form state is being reset
2. Check `onSubmit` callback completes successfully
3. Ensure no errors are thrown
4. Add explicit state reset after success

## Validation Checklist
- [ ] Todos page created at `/todos`
- [ ] TodoList component displays todos
- [ ] TodoItem component shows todo details
- [ ] TodoForm component creates new todos
- [ ] Create todo functionality works
- [ ] Update todo functionality works
- [ ] Delete todo functionality works
- [ ] Toggle completion works
- [ ] Dashboard shows real todo statistics
- [ ] Sidebar badge shows pending count
- [ ] Loading states display correctly
- [ ] Error messages show when API fails
- [ ] Confirmation dialog for delete
- [ ] Form validation works
- [ ] Empty state shows when no todos

## Best Practices
- Use optimistic UI updates for better UX
- Show loading states during API calls
- Handle errors gracefully with user-friendly messages
- Implement confirmation for destructive actions
- Keep state management simple and local
- Use TypeScript for type safety
- Validate user input before API calls
- Debounce rapid API calls if needed
- Cache API responses when appropriate
- Implement proper error boundaries
- Test all CRUD operations thoroughly
- Consider implementing undo functionality
- Add keyboard shortcuts for power users
