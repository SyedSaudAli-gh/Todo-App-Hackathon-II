# Skill: Logout and Session Clear

## Purpose
Implement complete logout functionality that properly clears user sessions, invalidates tokens, removes cookies, clears cached data, and redirects users to the login page with appropriate UI feedback.

## When to Use
- After completing `implement-auth-context` skill
- Need to implement sign out functionality
- User requests to log out of the application
- Session expires and needs cleanup
- Security requirement to clear all auth data
- Before implementing "remember me" or persistent sessions

## Inputs
- Current user session (from auth context)
- Better Auth signOut method
- Redirect destination after logout (default: `/login`)
- Optional: Logout reason (expired, user-initiated, security)

## Step-by-Step Process

### 1. Create Logout Button Component
Create `web/src/components/auth/LogoutButton.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  redirectTo?: string;
}

export function LogoutButton({
  variant = 'secondary',
  size = 'md',
  className,
  showIcon = true,
  redirectTo = '/login',
}: LogoutButtonProps) {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      await signOut();
      // Redirect is handled by Better Auth
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Signing out...
          </>
        ) : (
          <>
            {showIcon && (
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            )}
            Sign Out
          </>
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

### 2. Create Logout Confirmation Modal
Create `web/src/components/auth/LogoutConfirmation.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function LogoutConfirmation({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmationProps) {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      onConfirm?.();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sign Out
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to sign out? You'll need to sign in again to access your account.
        </p>

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 3. Update Auth Context with Enhanced Logout
Update `web/src/lib/auth/AuthProvider.tsx` to add cleanup logic:
```typescript
const signOut = async () => {
  try {
    setError(null);

    // Clear any local storage data
    if (typeof window !== 'undefined') {
      // Clear cached user data
      localStorage.removeItem('user-preferences');
      localStorage.removeItem('cached-todos');

      // Clear session storage
      sessionStorage.clear();
    }

    // Call Better Auth signOut
    await betterAuthSignOut({
      callbackURL: '/login',
    });

    // Additional cleanup if needed
    // e.g., clear React Query cache, reset global state, etc.

  } catch (err) {
    const error = err instanceof Error ? err : new Error('Sign out failed');
    setError(error);
    throw error;
  }
};
```

### 4. Create Logout API Route for Server-Side Cleanup
Create `web/src/app/api/auth/logout/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
  try {
    // Get session from request
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;

    if (sessionToken) {
      // Invalidate session in database
      await auth.api.signOut({
        headers: request.headers,
      });
    }

    // Clear all auth cookies
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.delete('better-auth.session_token');

    // Clear any other auth-related cookies
    response.cookies.delete('better-auth.csrf_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
```

### 5. Create Logout Page with Feedback
Create `web/src/app/logout/page.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LogoutPage() {
  const { signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<'logging-out' | 'success' | 'error'>('logging-out');

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        setStatus('success');

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Logout failed:', error);
        setStatus('error');
      }
    };

    if (isAuthenticated) {
      performLogout();
    } else {
      // Already logged out, redirect immediately
      router.push('/login');
    }
  }, [isAuthenticated, signOut, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
        {status === 'logging-out' && (
          <>
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Signing Out
            </h2>
            <p className="text-gray-600">
              Please wait while we sign you out...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Signed Out Successfully
            </h2>
            <p className="text-gray-600">
              You have been signed out. Redirecting to login...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Logout Failed
            </h2>
            <p className="text-gray-600 mb-4">
              There was an error signing you out. Please try again.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

### 6. Add Logout to User Menu
Update `web/src/components/auth/UserProfile.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { LogoutButton } from './LogoutButton';
import { LogoutConfirmation } from './LogoutConfirmation';

export function UserProfile() {
  const { user, isLoading } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {user.name || 'User'}
          </span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
        <LogoutButton
          variant="secondary"
          size="sm"
          onClick={() => setShowLogoutConfirm(true)}
        />
      </div>

      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
```

### 7. Handle Session Expiration
Create `web/src/lib/auth/useSessionExpiration.ts`:
```typescript
'use client';

import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export function useSessionExpiration() {
  const { session, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    const expiresAt = new Date(session.expiresAt).getTime();
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    // If session already expired
    if (timeUntilExpiry <= 0) {
      signOut();
      return;
    }

    // Set timeout to auto-logout when session expires
    const timeout = setTimeout(async () => {
      await signOut();
      router.push('/login?reason=session-expired');
    }, timeUntilExpiry);

    return () => clearTimeout(timeout);
  }, [session, signOut, router]);
}
```

Use in layout:
```typescript
'use client';

import { useSessionExpiration } from '@/lib/auth/useSessionExpiration';

export function SessionManager() {
  useSessionExpiration();
  return null;
}

// Add to layout.tsx
<AuthProvider>
  <SessionManager />
  {children}
</AuthProvider>
```

### 8. Test Logout Flow
1. Sign in to the application
2. Click "Sign Out" button
3. Verify confirmation modal appears (if implemented)
4. Confirm logout
5. Verify loading state shows
6. Verify redirect to `/login`
7. Verify session cookie is cleared (check browser DevTools)
8. Try accessing protected route (should redirect to login)
9. Check database - session should be invalidated
10. Test logout from multiple tabs simultaneously

## Output
- ✅ Logout button component with loading state
- ✅ Optional confirmation modal before logout
- ✅ Session invalidated in database
- ✅ All auth cookies cleared
- ✅ Local storage and session storage cleared
- ✅ User redirected to login page
- ✅ Protected routes inaccessible after logout
- ✅ Session expiration handled automatically
- ✅ Logout feedback page with success/error states

## Failure Handling

### Error: "Logout button doesn't work"
**Solution**:
1. Check `signOut` method is called correctly
2. Verify Better Auth is configured properly
3. Check browser console for errors
4. Ensure network requests are completing

### Error: "Session cookie not cleared"
**Solution**:
1. Verify cookie domain matches application domain
2. Check cookie path is correct
3. Ensure `httpOnly` flag allows client-side deletion
4. Try clearing cookies manually in browser

### Error: "User still authenticated after logout"
**Solution**:
1. Hard refresh the page (Ctrl+Shift+R)
2. Check session is invalidated in database
3. Verify auth context updates after signOut
4. Clear browser cache and cookies manually

### Error: "Logout redirects to wrong page"
**Solution**:
1. Check `callbackURL` in signOut call
2. Verify redirect logic in middleware
3. Ensure no conflicting redirects in code
4. Check for cached redirects in browser

### Error: "Multiple logout requests"
**Solution**:
1. Disable button during logout: `disabled={isLoggingOut}`
2. Add debouncing to logout handler
3. Check for duplicate event listeners
4. Verify component doesn't re-render during logout

### Error: "Logout fails silently"
**Solution**:
1. Add try-catch blocks around signOut
2. Log errors to console
3. Show error message to user
4. Implement error boundary for auth errors

### Error: "Session expires but user not logged out"
**Solution**:
1. Implement `useSessionExpiration` hook
2. Check session expiry time is correct
3. Verify timeout is set properly
4. Add session refresh logic if needed

## Validation Checklist
- [ ] `LogoutButton` component created
- [ ] `LogoutConfirmation` modal created (optional)
- [ ] Logout API route created
- [ ] Auth context includes signOut method
- [ ] Logout clears session cookie
- [ ] Logout clears local storage
- [ ] Logout clears session storage
- [ ] User redirected to login after logout
- [ ] Protected routes inaccessible after logout
- [ ] Database session invalidated
- [ ] Loading state shows during logout
- [ ] Error handling implemented
- [ ] Session expiration handled
- [ ] Logout works from multiple tabs
- [ ] No console errors during logout

## Security Considerations
- Always invalidate session on server, not just client
- Clear all auth-related cookies and storage
- Log logout events for security monitoring
- Implement CSRF protection on logout endpoint
- Rate limit logout endpoint to prevent abuse
- Clear sensitive data from memory
- Revoke refresh tokens if used
- Notify user of logout via email (optional, for security)
- Handle concurrent sessions properly
- Implement "logout from all devices" feature

## Best Practices
- Show confirmation before logout (prevents accidental logouts)
- Provide clear feedback during logout process
- Redirect to appropriate page after logout
- Clear all cached user data
- Handle logout errors gracefully
- Test logout in different scenarios (network failure, expired session)
- Implement auto-logout on session expiration
- Log logout events for analytics
- Consider "remember me" functionality
- Provide option to logout from all devices
- Handle logout in service workers/background tasks
- Test logout with browser back button
