# Skill: Implement Toast Feedback

## Purpose
Add non-intrusive toast notifications to provide immediate user feedback for actions (success, error, info, warning), improving user confidence and error awareness without blocking interactions.

## When to Use
- After replacing UI with shadcn/ui components
- After adding loading skeletons
- Before implementing UI animations
- When users need feedback for async operations
- After CRUD operations (create, update, delete)
- For form submissions and validations
- When displaying error messages
- Before production deployment

## Inputs
- Existing components with user actions
- shadcn/ui toast component (Sonner library)
- Action success/error states
- Error messages from API responses
- User action patterns (create, update, delete)

## Step-by-Step Process

### 1. Install shadcn/ui Toast Component (Sonner)
```bash
cd web
npx shadcn-ui@latest add sonner
```

This installs the Sonner toast library and creates `web/src/components/ui/sonner.tsx`:
```typescript
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```

### 2. Add Toaster to Root Layout
Update `web/src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/theme-variables.css';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ThemeScript } from '@/lib/theme/theme-script';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Phase II',
  description: 'Full-stack todo application with authentication and themes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 3. Create Toast Utility Functions
Create `web/src/lib/toast.ts`:
```typescript
/**
 * Toast notification utilities with consistent messaging.
 */

import { toast } from 'sonner';

export const showToast = {
  /**
   * Success toast for completed actions.
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Error toast for failed actions.
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Info toast for informational messages.
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Warning toast for cautionary messages.
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Loading toast for async operations.
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Promise toast for async operations with automatic state handling.
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },

  /**
   * Dismiss a specific toast or all toasts.
   */
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
};

/**
 * Todo-specific toast messages.
 */
export const todoToasts = {
  created: () => showToast.success('Todo created', 'Your todo has been added successfully'),
  updated: () => showToast.success('Todo updated', 'Your changes have been saved'),
  deleted: () => showToast.success('Todo deleted', 'The todo has been removed'),
  completed: () => showToast.success('Todo completed', 'Great job! Keep it up'),
  uncompleted: () => showToast.info('Todo reopened', 'The todo is now active again'),

  createError: (error?: string) =>
    showToast.error('Failed to create todo', error || 'Please try again'),
  updateError: (error?: string) =>
    showToast.error('Failed to update todo', error || 'Please try again'),
  deleteError: (error?: string) =>
    showToast.error('Failed to delete todo', error || 'Please try again'),

  loadError: () =>
    showToast.error('Failed to load todos', 'Please refresh the page'),
};

/**
 * Auth-specific toast messages.
 */
export const authToasts = {
  loginSuccess: (name: string) =>
    showToast.success(`Welcome back, ${name}!`, 'You have successfully signed in'),
  loginError: (error?: string) =>
    showToast.error('Sign in failed', error || 'Please check your credentials'),

  logoutSuccess: () =>
    showToast.success('Signed out', 'You have been signed out successfully'),
  logoutError: () =>
    showToast.error('Sign out failed', 'Please try again'),

  sessionExpired: () =>
    showToast.warning('Session expired', 'Please sign in again to continue'),
};

/**
 * Generic error handler with toast.
 */
export function handleError(error: unknown, fallbackMessage: string = 'An error occurred') {
  console.error(error);

  if (error instanceof Error) {
    showToast.error(fallbackMessage, error.message);
  } else if (typeof error === 'string') {
    showToast.error(fallbackMessage, error);
  } else {
    showToast.error(fallbackMessage);
  }
}
```

### 4. Update Todos Page with Toast Notifications
Update `web/src/app/dashboard/todos/page.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '@/components/todos/TodoItem';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoListSkeleton } from '@/components/todos/TodoItemSkeleton';
import { DeleteTodoDialog } from '@/components/todos/DeleteTodoDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { showToast, todoToasts, handleError } from '@/lib/toast';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; todo: any | null }>({
    isOpen: false,
    todo: null,
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      handleError(error, 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (todoData: any) => {
    const promise = fetch('/api/v1/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    }).then(async (response) => {
      if (!response.ok) throw new Error('Failed to create todo');
      return response.json();
    });

    showToast.promise(promise, {
      loading: 'Creating todo...',
      success: (newTodo) => {
        setTodos([newTodo, ...todos]);
        setShowForm(false);
        return 'Todo created successfully';
      },
      error: 'Failed to create todo',
    });
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    // Optimistic update
    setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));

    try {
      const response = await fetch(`/api/v1/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedTodo.completed }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      if (updatedTodo.completed) {
        todoToasts.completed();
      } else {
        todoToasts.uncompleted();
      }
    } catch (error) {
      // Revert optimistic update
      setTodos(todos.map((t) => (t.id === id ? todo : t)));
      handleError(error, 'Failed to update todo');
    }
  };

  const handleEdit = async (id: string, todoData: any) => {
    const promise = fetch(`/api/v1/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    }).then(async (response) => {
      if (!response.ok) throw new Error('Failed to update todo');
      return response.json();
    });

    showToast.promise(promise, {
      loading: 'Updating todo...',
      success: (updatedTodo) => {
        setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
        return 'Todo updated successfully';
      },
      error: 'Failed to update todo',
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.todo) return;

    const todoId = deleteDialog.todo.id;
    const promise = fetch(`/api/v1/todos/${todoId}`, {
      method: 'DELETE',
    }).then(async (response) => {
      if (!response.ok) throw new Error('Failed to delete todo');
    });

    showToast.promise(promise, {
      loading: 'Deleting todo...',
      success: () => {
        setTodos(todos.filter((t) => t.id !== todoId));
        setDeleteDialog({ isOpen: false, todo: null });
        return 'Todo deleted successfully';
      },
      error: 'Failed to delete todo',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Todo
        </Button>
      </div>

      {showForm && (
        <TodoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div>
        {isLoading ? (
          <TodoListSkeleton count={5} />
        ) : todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No todos yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={(id) => {
                  // Open edit form
                }}
                onDelete={(id) => {
                  const todo = todos.find((t) => t.id === id);
                  setDeleteDialog({ isOpen: true, todo });
                }}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteTodoDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, todo: null })}
        onConfirm={handleDelete}
        todoTitle={deleteDialog.todo?.title || ''}
      />
    </div>
  );
}
```

### 5. Add Toast to Authentication Flow
Update `web/src/lib/auth/AuthProvider.tsx`:
```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authToasts } from '@/lib/toast';

// ... existing code ...

const signIn = async (credentials: { email: string; password: string }) => {
  try {
    setError(null);
    const response = await betterAuthSignIn(credentials);

    if (response.user) {
      setUser(response.user);
      authToasts.loginSuccess(response.user.name || 'User');
    }

    return response;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Sign in failed');
    setError(error);
    authToasts.loginError(error.message);
    throw error;
  }
};

const signOut = async () => {
  try {
    setError(null);
    await betterAuthSignOut();
    setUser(null);
    authToasts.logoutSuccess();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Sign out failed');
    setError(error);
    authToasts.logoutError();
    throw error;
  }
};

// ... rest of the code ...
```

### 6. Create Custom Toast with Actions
Create `web/src/components/ui/CustomToast.tsx`:
```typescript
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Toast with custom action button.
 */
export function showActionToast(
  message: string,
  actionLabel: string,
  onAction: () => void
) {
  toast(message, {
    action: {
      label: actionLabel,
      onClick: onAction,
    },
  });
}

/**
 * Toast with undo functionality.
 */
export function showUndoToast(
  message: string,
  onUndo: () => void,
  duration: number = 5000
) {
  toast(message, {
    duration,
    action: {
      label: 'Undo',
      onClick: onUndo,
    },
  });
}

/**
 * Example: Delete with undo
 */
export function showDeleteWithUndo(
  itemName: string,
  onUndo: () => void
) {
  showUndoToast(
    `${itemName} deleted`,
    onUndo,
    5000
  );
}
```

### 7. Add Toast for Form Validation
Create `web/src/lib/validation-toast.ts`:
```typescript
import { showToast } from '@/lib/toast';

/**
 * Show validation errors as toast.
 */
export function showValidationErrors(errors: Record<string, string[]>) {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');

  showToast.error('Validation failed', errorMessages);
}

/**
 * Show single field validation error.
 */
export function showFieldError(field: string, message: string) {
  showToast.error(`Invalid ${field}`, message);
}

/**
 * Example usage in form
 */
export function validateTodoForm(data: any) {
  const errors: Record<string, string[]> = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = ['Title is required'];
  }

  if (data.title && data.title.length > 100) {
    errors.title = ['Title must be less than 100 characters'];
  }

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors);
    return false;
  }

  return true;
}
```

### 8. Add Toast for Network Errors
Create `web/src/lib/network-toast.ts`:
```typescript
import { showToast } from '@/lib/toast';

/**
 * Handle network errors with appropriate toast messages.
 */
export function handleNetworkError(error: any) {
  if (!navigator.onLine) {
    showToast.error(
      'No internet connection',
      'Please check your network and try again'
    );
    return;
  }

  if (error.response) {
    // Server responded with error
    const status = error.response.status;

    switch (status) {
      case 400:
        showToast.error('Bad request', 'Please check your input and try again');
        break;
      case 401:
        showToast.error('Unauthorized', 'Please sign in to continue');
        break;
      case 403:
        showToast.error('Forbidden', 'You do not have permission to perform this action');
        break;
      case 404:
        showToast.error('Not found', 'The requested resource was not found');
        break;
      case 500:
        showToast.error('Server error', 'Something went wrong on our end. Please try again later');
        break;
      default:
        showToast.error('Request failed', `Error ${status}: ${error.response.statusText}`);
    }
  } else if (error.request) {
    // Request made but no response
    showToast.error(
      'Network error',
      'Unable to reach the server. Please check your connection'
    );
  } else {
    // Something else happened
    showToast.error('Error', error.message || 'An unexpected error occurred');
  }
}
```

### 9. Add Toast Position Configuration
Update `web/src/app/layout.tsx` to configure toast position:
```typescript
<Toaster
  position="top-right"
  expand={false}
  richColors
  closeButton
/>
```

Available positions:
- `top-left`
- `top-center`
- `top-right` (default)
- `bottom-left`
- `bottom-center`
- `bottom-right`

### 10. Create Toast Testing Page
Create `web/src/app/toast-test/page.tsx`:
```typescript
'use client';

import { Button } from '@/components/ui/button';
import { showToast, todoToasts, authToasts } from '@/lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ToastTestPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Toast Notifications Test</h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => showToast.success('Success!', 'Operation completed')}>
            Success
          </Button>
          <Button onClick={() => showToast.error('Error!', 'Something went wrong')}>
            Error
          </Button>
          <Button onClick={() => showToast.info('Info', 'Here is some information')}>
            Info
          </Button>
          <Button onClick={() => showToast.warning('Warning', 'Please be careful')}>
            Warning
          </Button>
          <Button onClick={() => showToast.loading('Loading...')}>
            Loading
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todo Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => todoToasts.created()}>Created</Button>
          <Button onClick={() => todoToasts.updated()}>Updated</Button>
          <Button onClick={() => todoToasts.deleted()}>Deleted</Button>
          <Button onClick={() => todoToasts.completed()}>Completed</Button>
          <Button onClick={() => todoToasts.createError()}>Create Error</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auth Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => authToasts.loginSuccess('John')}>Login Success</Button>
          <Button onClick={() => authToasts.loginError()}>Login Error</Button>
          <Button onClick={() => authToasts.logoutSuccess()}>Logout Success</Button>
          <Button onClick={() => authToasts.sessionExpired()}>Session Expired</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promise Toast</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              const promise = new Promise((resolve) => {
                setTimeout(() => resolve('Done!'), 2000);
              });

              showToast.promise(promise, {
                loading: 'Processing...',
                success: 'Success!',
                error: 'Failed!',
              });
            }}
          >
            Test Promise Toast
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 11. Test Toast Notifications
1. Navigate to `/toast-test` page
2. Test each toast type:
   - Success, error, info, warning
   - Loading and promise toasts
   - Todo-specific toasts
   - Auth-specific toasts
3. Verify:
   - Toasts appear in correct position
   - Proper styling (theme-compatible)
   - Auto-dismiss after duration
   - Close button works
   - Multiple toasts stack correctly
   - Accessible (screen reader announces)
4. Test in both light and dark themes
5. Test on mobile devices

## Output
- ✅ Sonner toast library installed
- ✅ Toaster component added to layout
- ✅ Toast utility functions created
- ✅ Todo-specific toast messages
- ✅ Auth-specific toast messages
- ✅ Error handling with toasts
- ✅ Promise toasts for async operations
- ✅ Custom action toasts
- ✅ Undo functionality
- ✅ Validation error toasts
- ✅ Network error handling
- ✅ Theme-compatible styling
- ✅ Accessible notifications

## Failure Handling

### Error: "Toasts don't appear"
**Solution**:
1. Verify `<Toaster />` is in root layout
2. Check that Sonner is installed correctly
3. Ensure no CSS conflicts hiding toasts
4. Check z-index of toast container

### Error: "Toasts don't match theme"
**Solution**:
1. Verify ThemeProvider wraps Toaster
2. Check theme prop is passed to Sonner
3. Update toast classNames in Toaster component
4. Test in both light and dark modes

### Error: "Too many toasts stacking"
**Solution**:
1. Limit visible toasts: `<Toaster visibleToasts={3} />`
2. Dismiss previous toast before showing new one
3. Use `toast.dismiss()` to clear toasts
4. Debounce rapid toast triggers

### Error: "Toast duration too short/long"
**Solution**:
1. Adjust duration in toast options
2. Use different durations for different types
3. Allow user to dismiss manually
4. Consider importance of message

### Error: "Toast blocks UI interaction"
**Solution**:
1. Use `position="top-right"` or `bottom-right`
2. Avoid center positions
3. Ensure toasts are dismissible
4. Don't use toasts for critical information

### Error: "Promise toast doesn't update"
**Solution**:
1. Ensure promise resolves/rejects properly
2. Check error handling in promise
3. Verify toast.promise syntax
4. Test with simple promise first

### Error: "Undo action doesn't work"
**Solution**:
1. Verify onUndo callback is called
2. Check state management for undo
3. Ensure sufficient duration for user to click
4. Test undo logic independently

## Validation Checklist
- [ ] Sonner installed and configured
- [ ] Toaster added to root layout
- [ ] Toast utility functions created
- [ ] Success toasts work
- [ ] Error toasts work
- [ ] Info toasts work
- [ ] Warning toasts work
- [ ] Loading toasts work
- [ ] Promise toasts work
- [ ] Custom action toasts work
- [ ] Undo functionality works
- [ ] Theme-compatible styling
- [ ] Proper positioning
- [ ] Auto-dismiss works
- [ ] Manual dismiss works
- [ ] Multiple toasts stack correctly
- [ ] Accessible (screen reader)
- [ ] Mobile responsive
- [ ] No console errors

## Best Practices
- Use appropriate toast type (success, error, info, warning)
- Keep messages concise and actionable
- Use descriptions for additional context
- Set appropriate durations (4-5 seconds)
- Don't overuse toasts (avoid toast spam)
- Use promise toasts for async operations
- Provide undo for destructive actions
- Make toasts dismissible
- Position toasts to not block content
- Test with screen readers
- Use consistent messaging patterns
- Handle network errors gracefully
- Show validation errors clearly
- Don't use toasts for critical information
- Implement proper error boundaries
