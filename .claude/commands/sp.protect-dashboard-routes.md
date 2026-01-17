# Skill: Protect Dashboard Routes

## Purpose
Implement route protection mechanisms to restrict access to authenticated-only pages (dashboard, profile, settings) and redirect unauthenticated users to the login page.

## When to Use
- After completing `implement-auth-context` skill
- Need to protect pages that require authentication
- Want to prevent unauthorized access to user-specific content
- Before deploying dashboard or admin features
- Need to implement role-based access control

## Inputs
- List of protected routes: `/dashboard`, `/profile`, `/settings`, `/todos`
- Redirect destination for unauthenticated users: `/login`
- Auth context with `isAuthenticated` and `isLoading` state
- Optional: User roles for role-based protection

## Step-by-Step Process

### 1. Create Next.js Middleware for Route Protection
Create `web/src/middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/todos',
];

// Define public routes that should redirect to dashboard if authenticated
const publicRoutes = [
  '/login',
  '/signup',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Get session from Better Auth cookie
  const sessionToken = request.cookies.get('better-auth.session_token');
  const isAuthenticated = !!sessionToken?.value;

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from public routes to dashboard
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
```

### 2. Create Protected Page HOC
Create `web/src/lib/auth/withAuth.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface WithAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectTo = '/login',
    redirectIfAuthenticated = false,
  } = options;

  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      if (redirectIfAuthenticated && isAuthenticated) {
        router.push('/dashboard');
      } else if (!redirectIfAuthenticated && !isAuthenticated) {
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render component if not authenticated
    if (!redirectIfAuthenticated && !isAuthenticated) {
      return null;
    }

    // Don't render component if authenticated and should redirect
    if (redirectIfAuthenticated && isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
```

### 3. Create Protected Route Component
Create `web/src/components/auth/ProtectedRoute.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

### 4. Protect Dashboard Page
Update `web/src/app/dashboard/page.tsx`:
```typescript
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthProvider';
import { UserProfile } from '@/components/auth/UserProfile';

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name || user?.email}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Todos</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Completed</h2>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Pending</h2>
          <p className="text-3xl font-bold text-orange-600">0</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

### 5. Alternative: Use HOC Pattern
Alternative approach using HOC:
```typescript
'use client';

import { withAuth } from '@/lib/auth/withAuth';
import { useAuth } from '@/lib/auth/AuthProvider';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
}

export default withAuth(DashboardPage);
```

### 6. Handle Redirect After Login
Update `web/src/app/login/page.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Sign In</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {searchParams.get('redirect') && (
              <span className="text-orange-600">
                Please sign in to continue
              </span>
            )}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
```

### 7. Create Navigation with Auth-Aware Links
Create `web/src/components/layout/Navigation.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { UserProfile } from '@/components/auth/UserProfile';

export function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Todo App
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/todos"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Todos
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          <div>
            {isLoading ? (
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            ) : isAuthenticated ? (
              <UserProfile />
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 8. Test Route Protection
1. Start dev server: `npm run dev`
2. Navigate to `/dashboard` while logged out
3. Verify redirect to `/login?redirect=/dashboard`
4. Sign in successfully
5. Verify redirect back to `/dashboard`
6. Navigate to `/login` while logged in
7. Verify redirect to `/dashboard`
8. Try accessing `/profile`, `/settings`, `/todos` without auth
9. Verify all protected routes redirect to login

## Output
- ✅ Middleware protects routes at server level
- ✅ Client-side protection with HOC or component wrapper
- ✅ Unauthenticated users redirected to login
- ✅ Authenticated users redirected from public pages
- ✅ Redirect parameter preserves intended destination
- ✅ Loading states shown during auth checks
- ✅ Navigation shows/hides links based on auth status
- ✅ No flash of protected content before redirect

## Failure Handling

### Error: "Middleware not running"
**Solution**:
1. Verify `middleware.ts` is in `src/` directory (not `app/`)
2. Check `matcher` config includes the route
3. Restart Next.js dev server
4. Clear `.next` cache: `rm -rf .next`

### Error: "Infinite redirect loop"
**Solution**:
1. Check middleware doesn't redirect to itself
2. Verify `isAuthenticated` logic is correct
3. Ensure session cookie name matches Better Auth
4. Add logging to debug redirect chain

### Error: "Flash of protected content"
**Solution**:
1. Use `ProtectedRoute` component wrapper
2. Return `null` while checking auth
3. Show loading state immediately
4. Don't render children until auth confirmed

### Error: "Redirect parameter not working"
**Solution**:
1. Verify `searchParams.get('redirect')` is used
2. URL encode redirect path: `encodeURIComponent(path)`
3. Check Better Auth `callbackURL` option
4. Ensure redirect is to internal path only (security)

### Error: "Session cookie not found in middleware"
**Solution**:
1. Check cookie name: `better-auth.session_token`
2. Verify cookies are being set by Better Auth
3. Check domain/path settings on cookie
4. Ensure middleware runs after auth API routes

### Error: "Protected route accessible without auth"
**Solution**:
1. Verify route is in `protectedRoutes` array
2. Check middleware `matcher` includes the route
3. Ensure `isAuthenticated` check is correct
4. Test with browser in incognito mode

## Validation Checklist
- [ ] `middleware.ts` created in `src/` directory
- [ ] Protected routes defined in middleware
- [ ] `ProtectedRoute` component created
- [ ] `withAuth` HOC created
- [ ] Dashboard page uses protection
- [ ] Unauthenticated access to `/dashboard` redirects to `/login`
- [ ] Login page includes redirect parameter
- [ ] After login, user redirected to intended page
- [ ] Authenticated access to `/login` redirects to `/dashboard`
- [ ] Loading state shows during auth check
- [ ] No flash of protected content
- [ ] Navigation links show/hide based on auth
- [ ] All protected routes tested
- [ ] Middleware logs show correct behavior

## Security Considerations
- Validate redirect parameter to prevent open redirects
- Only allow internal paths in redirect
- Use server-side middleware for primary protection
- Client-side protection is UX enhancement, not security
- Don't expose sensitive data in loading states
- Log unauthorized access attempts
- Implement rate limiting on auth endpoints
- Use HTTPS in production for session cookies

## Best Practices
- Combine middleware (server) + client protection for defense in depth
- Show meaningful loading states, not blank screens
- Preserve user's intended destination with redirect parameter
- Use consistent redirect logic across all protected routes
- Test protection with browser dev tools (disable JS, clear cookies)
- Implement proper error boundaries for auth failures
- Consider role-based protection for admin routes
- Document which routes require authentication
