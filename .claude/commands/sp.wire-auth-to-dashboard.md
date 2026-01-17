# Skill: Wire Auth to Dashboard

## Purpose
Connect the Better Auth authentication system to the dashboard, ensuring proper user session management, protected routes, user data flow, and seamless integration between authentication state and dashboard components.

## When to Use
- After completing authentication setup (`setup-better-auth`, `implement-auth-context`)
- After building dashboard shell and components
- Before implementing todo CRUD operations in dashboard
- When users can access dashboard without authentication
- When user data doesn't display in dashboard
- Before production deployment

## Inputs
- Completed Better Auth setup with database
- AuthProvider with useAuth hook
- Dashboard layout components (Header, Sidebar, MainContent)
- Protected route middleware
- User session management
- API endpoints for user data

## Step-by-Step Process

### 1. Verify Auth Context is Available
Check `web/src/lib/auth/AuthProvider.tsx` exports:
```typescript
export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 2. Wrap Dashboard Layout with Auth Check
Update `web/src/app/dashboard/layout.tsx`:
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageLoader } from '@/components/ui/PageLoader';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
```

### 3. Update Dashboard Header with User Data
Update `web/src/components/dashboard/Header.tsx`:
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      showToast.error('Sign out failed', 'Please try again');
    }
  };

  if (!user) return null;

  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <h1 className="text-xl font-bold text-foreground">Todo App</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user.image} alt={user.name || user.email} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

### 4. Update Sidebar with User Profile
Update `web/src/components/dashboard/Sidebar.tsx`:
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, CheckSquare, User, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/todos', label: 'Todos', icon: CheckSquare },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User profile section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.image} alt={user.name || user.email} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
```

### 5. Add API Authentication Headers
Create `web/src/lib/api/auth-fetch.ts`:
```typescript
/**
 * Fetch wrapper that includes authentication headers.
 */

export async function authFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  // Better Auth automatically includes session cookie
  // Add any additional headers if needed
  headers.set('Content-Type', 'application/json');

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    throw new Error('Unauthorized');
  }

  return response;
}
```

### 6. Update Todo API Calls with Auth
Update `web/src/lib/api/todos.ts`:
```typescript
import { authFetch } from './auth-fetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export const todosApi = {
  /**
   * Get all todos for authenticated user.
   */
  async getAll(): Promise<Todo[]> {
    const response = await authFetch(`${API_BASE_URL}/api/v1/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  /**
   * Get single todo by ID.
   */
  async getById(id: string): Promise<Todo> {
    const response = await authFetch(`${API_BASE_URL}/api/v1/todos/${id}`);
    if (!response.ok) throw new Error('Failed to fetch todo');
    return response.json();
  },

  /**
   * Create new todo.
   */
  async create(data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const response = await authFetch(`${API_BASE_URL}/api/v1/todos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  /**
   * Update existing todo.
   */
  async update(id: string, data: Partial<Todo>): Promise<Todo> {
    const response = await authFetch(`${API_BASE_URL}/api/v1/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },

  /**
   * Delete todo.
   */
  async delete(id: string): Promise<void> {
    const response = await authFetch(`${API_BASE_URL}/api/v1/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },
};
```

### 7. Add Server-Side Auth Check (Optional)
Create `web/src/lib/auth/server-auth.ts`:
```typescript
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server-side authentication check for Server Components.
 */
export async function requireAuth() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('better-auth.session_token');

  if (!sessionToken) {
    redirect('/login');
  }

  // Optionally verify session with Better Auth API
  // const session = await verifySession(sessionToken.value);
  // if (!session) redirect('/login');

  return sessionToken;
}
```

### 8. Create Auth Status Indicator
Create `web/src/components/auth/AuthStatus.tsx`:
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

/**
 * Visual indicator of authentication status (for debugging).
 */
export function AuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
        {isLoading ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Loading...
          </>
        ) : isAuthenticated ? (
          <>
            <CheckCircle className="mr-1 h-3 w-3" />
            Authenticated: {user?.email}
          </>
        ) : (
          <>
            <XCircle className="mr-1 h-3 w-3" />
            Not authenticated
          </>
        )}
      </Badge>
    </div>
  );
}
```

### 9. Test Auth Integration
Create test checklist in `web/docs/auth-integration-test.md`:
```markdown
# Auth Integration Test Checklist

## 1. Login Flow
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Click "Sign In"
- [ ] Verify redirect to `/dashboard`
- [ ] Verify user data appears in header
- [ ] Verify user data appears in sidebar

## 2. Protected Routes
- [ ] Log out
- [ ] Try to access `/dashboard` directly
- [ ] Verify redirect to `/login?redirect=/dashboard`
- [ ] Log in
- [ ] Verify redirect back to `/dashboard`

## 3. Session Persistence
- [ ] Log in
- [ ] Refresh page
- [ ] Verify still authenticated
- [ ] Verify user data still displays
- [ ] Close browser
- [ ] Reopen and navigate to `/dashboard`
- [ ] Verify still authenticated (if "remember me")

## 4. User Data Flow
- [ ] Verify user name in header dropdown
- [ ] Verify user email in header dropdown
- [ ] Verify user avatar displays (if set)
- [ ] Verify user initials as fallback
- [ ] Verify user data in sidebar footer

## 5. Sign Out
- [ ] Click user dropdown
- [ ] Click "Sign Out"
- [ ] Verify redirect to `/login`
- [ ] Try to access `/dashboard`
- [ ] Verify redirect to `/login`

## 6. API Authentication
- [ ] Log in
- [ ] Create a todo
- [ ] Verify API request includes auth
- [ ] Log out
- [ ] Try to access API directly
- [ ] Verify 401 Unauthorized

## 7. Session Expiration
- [ ] Log in
- [ ] Wait for session to expire (or manually expire)
- [ ] Try to perform action
- [ ] Verify redirect to login
- [ ] Verify "Session expired" message

## 8. Multiple Tabs
- [ ] Open dashboard in two tabs
- [ ] Log out in one tab
- [ ] Try to perform action in other tab
- [ ] Verify proper handling

## 9. Error Handling
- [ ] Disconnect network
- [ ] Try to log in
- [ ] Verify error message
- [ ] Reconnect network
- [ ] Verify can log in

## 10. Theme Persistence
- [ ] Log in
- [ ] Change theme
- [ ] Log out
- [ ] Log in again
- [ ] Verify theme persists (if server-synced)
```

### 10. Manual Testing Procedure
1. **Start servers**:
   ```bash
   # Terminal 1: Backend
   cd api && source venv/Scripts/activate && python -m uvicorn src.main:app --reload --port 8001

   # Terminal 2: Frontend
   cd web && npm run dev
   ```

2. **Test login flow**:
   - Navigate to `http://localhost:3000/login`
   - Enter credentials
   - Verify redirect to dashboard
   - Check user data in header and sidebar

3. **Test protected routes**:
   - Log out
   - Try accessing `/dashboard` directly
   - Verify redirect to login
   - Log in and verify redirect back

4. **Test session persistence**:
   - Refresh page multiple times
   - Close and reopen browser
   - Verify session persists

5. **Test API authentication**:
   - Open browser DevTools Network tab
   - Create a todo
   - Verify request includes cookies
   - Check response is successful

6. **Test sign out**:
   - Click sign out
   - Verify redirect to login
   - Verify cannot access dashboard

7. **Test error scenarios**:
   - Invalid credentials
   - Network errors
   - Session expiration
   - Concurrent sessions

### 11. Debug Common Issues

**Issue: User data not displaying**
```typescript
// Add debug logging
console.log('Auth state:', { user, isLoading, isAuthenticated });
```

**Issue: Infinite redirect loop**
```typescript
// Check redirect logic
useEffect(() => {
  console.log('Auth check:', { isLoading, isAuthenticated, pathname });
  if (!isLoading && !isAuthenticated) {
    console.log('Redirecting to login');
    router.push('/login');
  }
}, [isLoading, isAuthenticated]);
```

**Issue: API requests fail with 401**
```typescript
// Verify credentials are included
const response = await fetch(url, {
  credentials: 'include', // Must include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 12. Add Integration Tests (Optional)
Create `web/tests/integration/auth-dashboard.test.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Auth Dashboard Integration', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display user data after login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=test@example.com')).toBeVisible();
  });

  test('should sign out and redirect to login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Sign out
    await page.click('[aria-label="User menu"]');
    await page.click('text=Sign Out');

    await expect(page).toHaveURL('/login');
  });
});
```

## Output
- ✅ Auth context integrated with dashboard layout
- ✅ User data flows to header and sidebar
- ✅ Protected routes enforce authentication
- ✅ API requests include authentication
- ✅ Session persistence works correctly
- ✅ Sign out functionality works
- ✅ Error handling for auth failures
- ✅ Manual test checklist completed
- ✅ All integration points verified
- ✅ Debug tools available

## Failure Handling

### Error: "User data not displaying in dashboard"
**Solution**:
1. Check AuthProvider wraps dashboard layout
2. Verify useAuth hook returns user data
3. Check user object structure matches component expectations
4. Add console.log to debug data flow
5. Verify Better Auth session is valid

### Error: "Infinite redirect loop"
**Solution**:
1. Check redirect logic doesn't trigger on loading state
2. Verify isAuthenticated updates correctly
3. Add guards to prevent multiple redirects
4. Check for conflicting middleware
5. Test with React DevTools to see state changes

### Error: "API requests return 401"
**Solution**:
1. Verify `credentials: 'include'` in fetch options
2. Check Better Auth session cookie is set
3. Verify CORS settings allow credentials
4. Check API expects correct auth header/cookie
5. Test API endpoint directly with Postman

### Error: "Session doesn't persist after refresh"
**Solution**:
1. Check localStorage/cookies are not blocked
2. Verify Better Auth session cookie has correct settings
3. Check cookie domain and path
4. Test in incognito mode
5. Verify session expiration time

### Error: "User avatar doesn't display"
**Solution**:
1. Check user.image URL is valid
2. Verify CORS allows image loading
3. Check AvatarFallback displays correctly
4. Test with different image URLs
5. Verify image URL is absolute, not relative

### Error: "Theme doesn't sync with user preferences"
**Solution**:
1. Verify server-side theme persistence is implemented
2. Check theme loads from user preferences API
3. Verify theme updates save to server
4. Test theme persistence across sessions
5. Check for localStorage/server sync conflicts

## Validation Checklist
- [ ] AuthProvider wraps dashboard layout
- [ ] useAuth hook works in all dashboard components
- [ ] User data displays in header
- [ ] User data displays in sidebar
- [ ] User avatar displays correctly
- [ ] Protected routes redirect to login
- [ ] Login redirects to dashboard
- [ ] Sign out redirects to login
- [ ] Session persists after refresh
- [ ] API requests include authentication
- [ ] 401 errors redirect to login
- [ ] Multiple tabs handle auth correctly
- [ ] Error messages display for auth failures
- [ ] Theme persists with user session
- [ ] No console errors
- [ ] Manual test checklist passed

## Best Practices
- Always check isLoading before redirecting
- Use credentials: 'include' for API requests
- Handle 401 errors gracefully with redirects
- Provide clear error messages for auth failures
- Test session persistence thoroughly
- Verify auth state in multiple components
- Use AuthStatus component for debugging
- Test with multiple browsers
- Test session expiration scenarios
- Document auth flow for team
- Use TypeScript for type safety
- Implement proper error boundaries
- Test concurrent sessions
- Verify CORS settings
- Monitor auth-related errors in production
