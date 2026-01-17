# Skill: Implement Auth Context

## Purpose
Create a React Context Provider that wraps the Next.js application and provides centralized authentication state management, user session data, and auth methods to all components.

## When to Use
- After completing `setup-better-auth` skill
- Need to access auth state in multiple components
- Want centralized loading and error handling for auth
- Before implementing protected routes or user-specific features
- Need to display user information in navigation/header

## Inputs
- Better Auth client instance (from `@/lib/auth/client`)
- Session data structure from Better Auth
- List of auth methods to expose: `signIn`, `signUp`, `signOut`, `updateUser`

## Step-by-Step Process

### 1. Create Auth Context Type Definitions
Create `web/src/lib/auth/types.ts`:
```typescript
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expiresAt: Date;
}

export interface AuthContextValue {
  // State
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;

  // Methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
}
```

### 2. Create Auth Context Provider
Create `web/src/lib/auth/AuthProvider.tsx`:
```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn as betterAuthSignIn, signUp as betterAuthSignUp, signOut as betterAuthSignOut } from '@/lib/auth/client';
import type { AuthContextValue, Session, User } from './types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending, error: sessionError } = useSession();
  const [error, setError] = useState<Error | null>(null);

  // Clear error when session changes
  useEffect(() => {
    if (sessionData) {
      setError(null);
    }
  }, [sessionData]);

  const session: Session | null = sessionData ? {
    user: sessionData.user,
    expiresAt: new Date(sessionData.expiresAt),
  } : null;

  const user: User | null = session?.user || null;
  const isAuthenticated = !!user;
  const isLoading = isPending;

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await betterAuthSignIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign in failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign in failed');
      setError(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const result = await betterAuthSignUp.email({
        email,
        password,
        name,
        callbackURL: '/dashboard',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign up failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign up failed');
      setError(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await betterAuthSignOut({
        callbackURL: '/login',
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign out failed');
      setError(error);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      setError(null);
      // Implement user update logic using Better Auth API
      const response = await fetch('/api/auth/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refresh session to get updated data
      await refreshSession();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      setError(null);
      // Better Auth automatically refreshes session
      // This is a manual trigger if needed
      window.location.reload();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Refresh failed');
      setError(error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    session,
    user,
    isLoading,
    isAuthenticated,
    error: error || sessionError || null,
    signIn,
    signUp,
    signOut,
    updateUser,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. Wrap Application with Auth Provider
Update `web/src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo Management App',
  description: 'Phase II Todo Management - Create, view, update, and delete todos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 4. Create User Profile Component
Create `web/src/components/auth/UserProfile.tsx`:
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';

export function UserProfile() {
  const { user, isLoading, signOut } = useAuth();

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
      <Button variant="secondary" size="sm" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}
```

### 5. Create Login Form Component
Create `web/src/components/auth/LoginForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      await signIn(email, password);
      // Redirect handled by Better Auth
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || localError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {localError || error?.message || 'An error occurred'}
          </p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        disabled={isLoading}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

### 6. Create Auth Status Component
Create `web/src/components/auth/AuthStatus.tsx`:
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isAuthenticated ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      <span className="text-sm text-gray-600">
        {isAuthenticated ? `Signed in as ${user?.email}` : 'Not signed in'}
      </span>
    </div>
  );
}
```

### 7. Test Auth Context
Create test page `web/src/app/auth-context-test/page.tsx`:
```typescript
'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';

export default function AuthContextTest() {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signOut,
  } = useAuth();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Context Test</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Status</h2>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>Error: {error?.message || 'None'}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">User Data</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => signIn('test@example.com', 'password')}
            disabled={isLoading}
          >
            Test Sign In
          </Button>
          <Button
            onClick={signOut}
            disabled={isLoading || !isAuthenticated}
            variant="secondary"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
```

Visit http://localhost:3000/auth-context-test to verify context is working.

## Output
- ✅ Auth context created with type-safe interface
- ✅ AuthProvider wraps entire application
- ✅ `useAuth()` hook available in all components
- ✅ Centralized auth state management
- ✅ Loading and error states handled globally
- ✅ User profile component displays current user
- ✅ Login form uses auth context
- ✅ Sign out functionality works across app

## Failure Handling

### Error: "useAuth must be used within an AuthProvider"
**Solution**:
1. Verify `<AuthProvider>` wraps the component tree in `layout.tsx`
2. Check component is client-side (`'use client'` directive)
3. Ensure AuthProvider is imported correctly

### Error: "Cannot read property 'user' of undefined"
**Solution**:
1. Always check `isLoading` before accessing `user`
2. Use optional chaining: `user?.email`
3. Provide fallback UI for loading state

### Error: "Session not updating after sign in"
**Solution**:
1. Verify Better Auth session cookies are being set
2. Check browser allows cookies
3. Ensure `callbackURL` redirects properly
4. Try hard refresh (Ctrl+Shift+R)

### Error: "Context re-renders too frequently"
**Solution**:
1. Memoize context value with `useMemo`
2. Split context into separate providers if needed
3. Use React DevTools to identify render causes

### Error: "Sign out doesn't clear user state"
**Solution**:
1. Verify `signOut` calls Better Auth's signOut method
2. Check cookies are being cleared
3. Ensure session is invalidated on server
4. Add manual state reset if needed

### Error: "Type errors with User interface"
**Solution**:
1. Ensure `types.ts` matches Better Auth's user schema
2. Update types if custom fields added to user table
3. Use `typeof auth.$Infer.Session.user` for type safety

## Validation Checklist
- [ ] `AuthProvider.tsx` created and exports `useAuth` hook
- [ ] `types.ts` defines `User`, `Session`, `AuthContextValue`
- [ ] `layout.tsx` wraps children with `<AuthProvider>`
- [ ] `useAuth()` hook works in client components
- [ ] `isLoading` state shows during auth operations
- [ ] `isAuthenticated` correctly reflects auth status
- [ ] `user` object contains expected fields
- [ ] `signIn` method triggers authentication
- [ ] `signOut` method clears session
- [ ] Error states display properly
- [ ] Test page at `/auth-context-test` works
- [ ] No console errors related to context

## Best Practices
- Always check `isLoading` before rendering user-dependent UI
- Use `isAuthenticated` instead of checking `user !== null`
- Handle errors gracefully with user-friendly messages
- Provide loading skeletons for better UX
- Don't store sensitive data in context (use server-side)
- Memoize expensive computations in context
- Keep context focused on auth only (don't add unrelated state)
