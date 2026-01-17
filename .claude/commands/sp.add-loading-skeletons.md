# Skill: Add Loading Skeletons

## Purpose
Implement skeleton loading screens to provide visual feedback during data fetching, improving perceived performance and user experience by showing content placeholders instead of blank screens or generic spinners.

## When to Use
- After replacing UI with shadcn/ui components
- When implementing data fetching (API calls)
- Before adding toast notifications and animations
- When users report slow loading perception
- During async operations (create, update, delete)
- When implementing infinite scroll or pagination
- Before production deployment

## Inputs
- Existing components with data fetching
- shadcn/ui skeleton component
- Component layouts and structures
- Loading state management patterns
- API response times and data structures

## Step-by-Step Process

### 1. Install shadcn/ui Skeleton Component
```bash
cd web
npx shadcn-ui@latest add skeleton
```

This creates `web/src/components/ui/skeleton.tsx`:
```typescript
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

### 2. Create Todo Item Skeleton
Create `web/src/components/todos/TodoItemSkeleton.tsx`:
```typescript
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton loader for TodoItem component.
 */
export function TodoItemSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Checkbox skeleton */}
            <Skeleton className="h-5 w-5 rounded mt-1" />

            <div className="flex-1 space-y-2">
              {/* Title skeleton */}
              <Skeleton className="h-5 w-3/4" />
              {/* Description skeleton */}
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Badge skeleton */}
            <Skeleton className="h-6 w-16 rounded-full" />
            {/* Menu button skeleton */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

/**
 * Multiple skeleton items for list loading.
 */
export function TodoListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TodoItemSkeleton key={i} />
      ))}
    </div>
  );
}
```

### 3. Create Todo Form Skeleton
Create `web/src/components/todos/TodoFormSkeleton.tsx`:
```typescript
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton loader for TodoForm component.
 */
export function TodoFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title input skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Description textarea skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Priority select skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Create Dashboard Stats Skeleton
Create `web/src/components/dashboard/StatsSkeleton.tsx`:
```typescript
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton loader for stat card.
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

/**
 * Multiple stat card skeletons.
 */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### 5. Create User Profile Skeleton
Create `web/src/components/dashboard/UserProfileSkeleton.tsx`:
```typescript
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for user profile in sidebar.
 */
export function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-t border-border">
      {/* Avatar skeleton */}
      <Skeleton className="h-10 w-10 rounded-full" />

      <div className="flex-1 space-y-2">
        {/* Name skeleton */}
        <Skeleton className="h-4 w-24" />
        {/* Email skeleton */}
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Logout button skeleton */}
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}
```

### 6. Create Table Skeleton
Create `web/src/components/ui/TableSkeleton.tsx`:
```typescript
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton loader for data tables.
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full">
      {/* Table header */}
      <div className="border-b border-border">
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-4 w-20" />
          ))}
        </div>
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="border-b border-border last:border-0"
        >
          <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 w-full"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 7. Update Todos Page with Loading States
Update `web/src/app/dashboard/todos/page.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '@/components/todos/TodoItem';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoListSkeleton } from '@/components/todos/TodoItemSkeleton';
import { TodoFormSkeleton } from '@/components/todos/TodoFormSkeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (todoData: any) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/v1/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsCreating(false);
    }
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
        <div>
          {isCreating ? (
            <TodoFormSkeleton />
          ) : (
            <TodoForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 8. Create Inline Loading Skeleton
Create `web/src/components/ui/InlineSkeleton.tsx`:
```typescript
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Inline skeleton for buttons during async operations.
 */
export function ButtonSkeleton() {
  return <Skeleton className="h-10 w-24" />;
}

/**
 * Skeleton for text content.
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for images.
 */
export function ImageSkeleton({ aspectRatio = '16/9' }: { aspectRatio?: string }) {
  return (
    <Skeleton
      className="w-full"
      style={{ aspectRatio }}
    />
  );
}
```

### 9. Create Page-Level Loading Component
Create `web/src/components/ui/PageLoader.tsx`:
```typescript
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Full-page skeleton loader for initial page loads.
 */
export function PageLoader() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
```

### 10. Add Skeleton to Button During Loading
Update button components to show loading state:
```typescript
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function LoadingButton({
  isLoading,
  children,
  onClick,
  variant = 'default',
}: LoadingButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant={variant}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

### 11. Create Suspense Boundary with Skeleton
Create `web/src/components/ui/SuspenseLoader.tsx`:
```typescript
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SuspenseLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Suspense wrapper with skeleton fallback.
 */
export function SuspenseLoader({ children, fallback }: SuspenseLoaderProps) {
  return (
    <Suspense fallback={fallback || <DefaultSkeleton />}>
      {children}
    </Suspense>
  );
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
```

### 12. Add Skeleton Export Index
Create `web/src/components/skeletons/index.ts`:
```typescript
/**
 * Centralized skeleton component exports.
 */

export { TodoItemSkeleton, TodoListSkeleton } from '../todos/TodoItemSkeleton';
export { TodoFormSkeleton } from '../todos/TodoFormSkeleton';
export { StatCardSkeleton, StatsSkeleton } from '../dashboard/StatsSkeleton';
export { UserProfileSkeleton } from '../dashboard/UserProfileSkeleton';
export { TableSkeleton } from '../ui/TableSkeleton';
export { ButtonSkeleton, TextSkeleton, ImageSkeleton } from '../ui/InlineSkeleton';
export { PageLoader } from '../ui/PageLoader';
export { SuspenseLoader } from '../ui/SuspenseLoader';
```

### 13. Test Loading Skeletons
1. Add artificial delay to API calls for testing:
```typescript
await new Promise(resolve => setTimeout(resolve, 2000));
```

2. Test each skeleton:
   - TodoListSkeleton on page load
   - TodoFormSkeleton during creation
   - StatsSkeleton on dashboard
   - UserProfileSkeleton in sidebar
   - TableSkeleton for data tables
   - ButtonSkeleton during async operations

3. Verify:
   - Skeletons match actual component layout
   - Smooth transition from skeleton to content
   - No layout shift (CLS)
   - Proper animation (pulse effect)
   - Theme compatibility (light/dark)

4. Test edge cases:
   - Very fast API responses
   - Very slow API responses
   - Failed API requests
   - Empty states

## Output
- ✅ Skeleton component installed
- ✅ TodoItemSkeleton created
- ✅ TodoFormSkeleton created
- ✅ StatsSkeleton created
- ✅ UserProfileSkeleton created
- ✅ TableSkeleton created
- ✅ InlineSkeleton utilities created
- ✅ PageLoader for full-page loading
- ✅ LoadingButton component
- ✅ SuspenseLoader wrapper
- ✅ All skeletons match component layouts
- ✅ Smooth transitions without layout shift
- ✅ Theme-compatible animations

## Failure Handling

### Error: "Skeleton doesn't match component layout"
**Solution**:
1. Compare skeleton structure with actual component
2. Match spacing, sizing, and positioning exactly
3. Use same Card/CardHeader structure
4. Test side-by-side with actual component

### Error: "Layout shift when content loads"
**Solution**:
1. Ensure skeleton has same dimensions as content
2. Use fixed heights where possible
3. Reserve space for images with aspect-ratio
4. Test with Chrome DevTools CLS metric

### Error: "Skeleton animation too fast/slow"
**Solution**:
1. Adjust animation duration in skeleton component
2. Use Tailwind's `animate-pulse` utility
3. Customize animation in tailwind.config.ts
4. Test on different devices

### Error: "Skeleton doesn't respect theme"
**Solution**:
1. Use `bg-muted` instead of fixed colors
2. Verify CSS variables are defined
3. Test in both light and dark modes
4. Check Tailwind dark mode configuration

### Error: "Too many skeleton variants"
**Solution**:
1. Create reusable skeleton patterns
2. Use composition over duplication
3. Extract common skeleton layouts
4. Document skeleton usage patterns

### Error: "Skeleton shows for too long"
**Solution**:
1. Optimize API response times
2. Implement proper error handling
3. Add timeout for skeleton display
4. Show error state after timeout

### Error: "Skeleton flashes briefly"
**Solution**:
1. Add minimum display time (e.g., 300ms)
2. Use debouncing for loading states
3. Cache data to reduce loading frequency
4. Implement optimistic UI updates

## Validation Checklist
- [ ] Skeleton component installed
- [ ] TodoItemSkeleton matches TodoItem layout
- [ ] TodoFormSkeleton matches TodoForm layout
- [ ] StatsSkeleton matches stat cards
- [ ] UserProfileSkeleton matches profile component
- [ ] TableSkeleton for data tables
- [ ] InlineSkeleton utilities created
- [ ] PageLoader for full-page loading
- [ ] LoadingButton component works
- [ ] SuspenseLoader wrapper implemented
- [ ] No layout shift (CLS = 0)
- [ ] Smooth transitions
- [ ] Theme-compatible
- [ ] Proper animation timing
- [ ] Works on mobile devices
- [ ] Accessible (screen reader announces loading)
- [ ] No console errors

## Best Practices
- Match skeleton layout exactly to actual component
- Use same spacing, sizing, and structure
- Avoid layout shift (Cumulative Layout Shift)
- Show skeleton for minimum 300ms to avoid flash
- Use `bg-muted` for theme compatibility
- Animate with `animate-pulse` for visual feedback
- Create reusable skeleton patterns
- Test with slow network (Chrome DevTools throttling)
- Provide meaningful loading states
- Don't overuse skeletons (simple spinners for quick operations)
- Use Suspense boundaries for React 18+ features
- Implement error states after timeout
- Cache data to reduce loading frequency
- Use optimistic UI updates when possible
- Document skeleton usage in component library
