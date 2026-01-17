# Skill: Persist User Theme

## Purpose
Implement robust theme persistence across browser sessions, tabs, and devices using localStorage, cookies, and optional server-side storage to ensure users' theme preferences are remembered and synchronized.

## When to Use
- After completing `setup-theme-provider` and `implement-theme-toggle` skills
- When users report theme resets after page refresh
- Implementing cross-tab theme synchronization
- Adding server-side user preferences
- Migrating from old theme storage systems
- Before deploying to production

## Inputs
- Existing ThemeProvider with localStorage support
- User authentication system (optional, for server-side persistence)
- Database schema for user preferences (optional)
- Cookie configuration for SSR support
- Storage key naming convention

## Step-by-Step Process

### 1. Enhance Theme Storage Utilities
Create `web/src/lib/theme/storage.ts`:
```typescript
/**
 * Theme storage utilities with error handling and fallbacks.
 */

import type { Theme } from './types';
import { THEME_STORAGE_KEY } from './types';

export interface ThemeStorage {
  get: () => Theme | null;
  set: (theme: Theme) => void;
  remove: () => void;
  isAvailable: () => boolean;
}

/**
 * Check if localStorage is available and working.
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__theme_storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
}

/**
 * LocalStorage-based theme storage.
 */
export const localStorageTheme: ThemeStorage = {
  get: () => {
    if (!isLocalStorageAvailable()) return null;

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored as Theme;
      }
      return null;
    } catch (error) {
      console.error('Failed to read theme from localStorage:', error);
      return null;
    }
  },

  set: (theme: Theme) => {
    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  },

  remove: () => {
    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove theme from localStorage:', error);
    }
  },

  isAvailable: isLocalStorageAvailable,
};

/**
 * Cookie-based theme storage for SSR support.
 */
export const cookieTheme: ThemeStorage = {
  get: () => {
    if (typeof document === 'undefined') return null;

    try {
      const cookies = document.cookie.split(';');
      const themeCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(`${THEME_STORAGE_KEY}=`)
      );

      if (themeCookie) {
        const value = themeCookie.split('=')[1];
        if (value === 'light' || value === 'dark' || value === 'system') {
          return value as Theme;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to read theme from cookies:', error);
      return null;
    }
  },

  set: (theme: Theme) => {
    if (typeof document === 'undefined') return;

    try {
      // Set cookie with 1 year expiration
      const maxAge = 365 * 24 * 60 * 60; // 1 year in seconds
      document.cookie = `${THEME_STORAGE_KEY}=${theme}; max-age=${maxAge}; path=/; SameSite=Lax`;
    } catch (error) {
      console.error('Failed to save theme to cookies:', error);
    }
  },

  remove: () => {
    if (typeof document === 'undefined') return;

    try {
      document.cookie = `${THEME_STORAGE_KEY}=; max-age=0; path=/`;
    } catch (error) {
      console.error('Failed to remove theme from cookies:', error);
    }
  },

  isAvailable: () => typeof document !== 'undefined',
};

/**
 * Migrate theme from old storage key to new key.
 */
export function migrateThemeStorage(oldKey: string, newKey: string): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const oldValue = localStorage.getItem(oldKey);
    if (oldValue && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, oldValue);
      localStorage.removeItem(oldKey);
      console.log(`Migrated theme from ${oldKey} to ${newKey}`);
    }
  } catch (error) {
    console.error('Failed to migrate theme storage:', error);
  }
}
```

### 2. Add Cross-Tab Synchronization
Create `web/src/lib/theme/useThemeSync.ts`:
```typescript
'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { THEME_STORAGE_KEY } from './types';
import type { Theme } from './types';

/**
 * Hook to synchronize theme across browser tabs.
 */
export function useThemeSync() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Listen for storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      // Only handle theme storage changes
      if (event.key !== THEME_STORAGE_KEY) return;

      // Get new theme value
      const newTheme = event.newValue;

      // Validate and update theme
      if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'system') {
        if (newTheme !== theme) {
          setTheme(newTheme);
          console.log(`Theme synced from another tab: ${newTheme}`);
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [theme, setTheme]);
}
```

### 3. Update ThemeProvider with Enhanced Persistence
Update `web/src/lib/theme/ThemeProvider.tsx`:
```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, DEFAULT_THEME, THEME_ATTRIBUTE } from './types';
import { localStorageTheme, cookieTheme } from './storage';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableCookies?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = 'app-theme',
  enableCookies = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  // Resolve theme (system -> actual light/dark)
  const resolveTheme = (theme: Theme): 'light' | 'dark' => {
    return theme === 'system' ? getSystemTheme() : theme;
  };

  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    root.setAttribute(THEME_ATTRIBUTE, theme);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-transitioning');
      });
    });
  };

  // Set theme with persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // Persist to localStorage
    localStorageTheme.set(newTheme);

    // Persist to cookies if enabled
    if (enableCookies) {
      cookieTheme.set(newTheme);
    }

    // Update resolved theme and apply
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // Dispatch custom event for cross-component communication
    window.dispatchEvent(
      new CustomEvent('theme-change', {
        detail: { theme: newTheme, resolvedTheme: resolved },
      })
    );
  };

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Load theme from storage (localStorage first, then cookies)
    let savedTheme: Theme = defaultTheme;

    const localTheme = localStorageTheme.get();
    if (localTheme) {
      savedTheme = localTheme;
    } else if (enableCookies) {
      const cookieThemeValue = cookieTheme.get();
      if (cookieThemeValue) {
        savedTheme = cookieThemeValue;
        // Sync to localStorage
        localStorageTheme.set(cookieThemeValue);
      }
    }

    setThemeState(savedTheme);
    const resolved = resolveTheme(savedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [defaultTheme, enableCookies]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== storageKey) return;

      const newTheme = event.newValue;
      if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'system') {
        if (newTheme !== theme) {
          setThemeState(newTheme);
          const resolved = resolveTheme(newTheme);
          setResolvedTheme(resolved);
          applyTheme(resolved);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [theme, storageKey]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 4. Add Server-Side Theme Persistence (Optional)
Create `web/src/lib/theme/server-storage.ts`:
```typescript
/**
 * Server-side theme persistence for authenticated users.
 */

import type { Theme } from './types';

export interface UserThemePreference {
  userId: string;
  theme: Theme;
  updatedAt: Date;
}

/**
 * Save user's theme preference to server.
 */
export async function saveThemeToServer(theme: Theme): Promise<void> {
  try {
    const response = await fetch('/api/user/preferences', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    });

    if (!response.ok) {
      throw new Error('Failed to save theme to server');
    }
  } catch (error) {
    console.error('Error saving theme to server:', error);
    throw error;
  }
}

/**
 * Load user's theme preference from server.
 */
export async function loadThemeFromServer(): Promise<Theme | null> {
  try {
    const response = await fetch('/api/user/preferences');

    if (!response.ok) {
      throw new Error('Failed to load theme from server');
    }

    const data = await response.json();
    const theme = data.theme;

    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      return theme;
    }

    return null;
  } catch (error) {
    console.error('Error loading theme from server:', error);
    return null;
  }
}
```

Create API route `web/src/app/api/user/preferences/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

// GET user preferences
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user preferences from database
    // This is a placeholder - implement based on your database schema
    const preferences = {
      theme: 'system', // Default or from database
      // other preferences...
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH user preferences
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { theme } = body;

    // Validate theme
    if (theme !== 'light' && theme !== 'dark' && theme !== 'system') {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      );
    }

    // Save to database
    // This is a placeholder - implement based on your database schema
    // await db.userPreferences.update({
    //   where: { userId: session.user.id },
    //   data: { theme },
    // });

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 5. Create Hook for Server-Synced Theme
Create `web/src/lib/theme/useServerTheme.ts`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { loadThemeFromServer, saveThemeToServer } from './server-storage';

/**
 * Hook to sync theme with server for authenticated users.
 */
export function useServerTheme(isAuthenticated: boolean) {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // Load theme from server on mount
  useEffect(() => {
    if (!isAuthenticated || isSynced) return;

    const loadServerTheme = async () => {
      setIsLoading(true);
      try {
        const serverTheme = await loadThemeFromServer();
        if (serverTheme && serverTheme !== theme) {
          setTheme(serverTheme);
        }
        setIsSynced(true);
      } catch (error) {
        console.error('Failed to load theme from server:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServerTheme();
  }, [isAuthenticated, isSynced, theme, setTheme]);

  // Save theme to server when it changes
  useEffect(() => {
    if (!isAuthenticated || !isSynced || isLoading) return;

    const saveServerTheme = async () => {
      try {
        await saveThemeToServer(theme);
      } catch (error) {
        console.error('Failed to save theme to server:', error);
      }
    };

    saveServerTheme();
  }, [theme, isAuthenticated, isSynced, isLoading]);

  return { isLoading, isSynced };
}
```

### 6. Add Theme Migration Utility
Create `web/src/lib/theme/migrate.ts`:
```typescript
/**
 * Migrate theme from old storage systems.
 */

import { localStorageTheme } from './storage';
import type { Theme } from './types';

interface MigrationConfig {
  oldKey: string;
  newKey: string;
  transform?: (value: string) => Theme | null;
}

/**
 * Migrate theme from old storage key.
 */
export function migrateTheme(config: MigrationConfig): Theme | null {
  if (typeof window === 'undefined') return null;

  try {
    const oldValue = localStorage.getItem(config.oldKey);
    if (!oldValue) return null;

    // Transform value if needed
    let newValue: Theme | null = null;
    if (config.transform) {
      newValue = config.transform(oldValue);
    } else if (oldValue === 'light' || oldValue === 'dark' || oldValue === 'system') {
      newValue = oldValue as Theme;
    }

    if (newValue) {
      // Save to new key
      localStorageTheme.set(newValue);

      // Remove old key
      localStorage.removeItem(config.oldKey);

      console.log(`Migrated theme from ${config.oldKey} to new storage`);
      return newValue;
    }

    return null;
  } catch (error) {
    console.error('Theme migration failed:', error);
    return null;
  }
}

/**
 * Common migration scenarios.
 */
export const migrations = {
  // Migrate from 'dark-mode' boolean to theme string
  fromDarkModeBoolean: (oldKey: string = 'dark-mode'): Theme | null => {
    return migrateTheme({
      oldKey,
      newKey: 'app-theme',
      transform: (value) => {
        if (value === 'true') return 'dark';
        if (value === 'false') return 'light';
        return null;
      },
    });
  },

  // Migrate from 'theme-mode' to 'app-theme'
  fromThemeMode: (oldKey: string = 'theme-mode'): Theme | null => {
    return migrateTheme({
      oldKey,
      newKey: 'app-theme',
    });
  },
};
```

### 7. Update Root Layout with Migration
Update `web/src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/theme-variables.css';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ThemeScript } from '@/lib/theme/theme-script';
import { ThemeMigration } from '@/components/theme/ThemeMigration';

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
        <ThemeProvider
          defaultTheme="system"
          storageKey="app-theme"
          enableCookies={true}
        >
          <ThemeMigration />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Create `web/src/components/theme/ThemeMigration.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { migrations } from '@/lib/theme/migrate';

/**
 * Component to handle theme migration on mount.
 */
export function ThemeMigration() {
  useEffect(() => {
    // Run migrations
    migrations.fromDarkModeBoolean();
    migrations.fromThemeMode();
  }, []);

  return null;
}
```

### 8. Test Theme Persistence
1. Set theme to 'dark' and refresh page → should stay dark
2. Set theme to 'light' and close/reopen browser → should stay light
3. Open app in multiple tabs, change theme in one → should sync to others
4. Clear localStorage and refresh → should fall back to cookies
5. Clear both localStorage and cookies → should use default theme
6. Test with localStorage disabled (private browsing) → should use cookies
7. Test server sync (if authenticated) → theme should persist across devices
8. Test migration from old storage keys → should migrate automatically

## Output
- ✅ Enhanced storage utilities with error handling
- ✅ Cross-tab theme synchronization
- ✅ Cookie-based persistence for SSR
- ✅ Server-side theme persistence (optional)
- ✅ Theme migration from old storage systems
- ✅ Fallback mechanisms for storage failures
- ✅ Custom events for theme changes
- ✅ TypeScript types for all storage operations
- ✅ Comprehensive error handling
- ✅ Theme persists across sessions and devices

## Failure Handling

### Error: "Theme resets after page refresh"
**Solution**:
1. Check localStorage is not disabled
2. Verify storage key is consistent
3. Check for errors in browser console
4. Test with cookies as fallback
5. Verify ThemeScript runs before hydration

### Error: "Theme doesn't sync across tabs"
**Solution**:
1. Verify storage event listener is attached
2. Check that storage key matches
3. Test in different browser (some browsers limit storage events)
4. Ensure listener is not removed prematurely

### Error: "localStorage quota exceeded"
**Solution**:
1. Theme storage is minimal, check for other data
2. Clear old/unused localStorage keys
3. Implement storage cleanup utility
4. Fall back to cookies if localStorage fails

### Error: "Cookies not working"
**Solution**:
1. Check cookie settings in browser
2. Verify SameSite and Secure attributes
3. Test on HTTPS (cookies may be blocked on HTTP)
4. Check cookie size limits

### Error: "Server sync fails"
**Solution**:
1. Verify user is authenticated
2. Check API endpoint is accessible
3. Verify database schema supports theme field
4. Add retry logic for network failures
5. Fall back to local storage if server fails

### Error: "Migration doesn't work"
**Solution**:
1. Check old storage key exists
2. Verify transform function is correct
3. Test migration in isolation
4. Add logging to debug migration
5. Ensure migration runs before theme initialization

### Error: "Theme flashes on page load"
**Solution**:
1. Verify ThemeScript runs synchronously
2. Check that cookies are read in script
3. Ensure no conflicting theme initialization
4. Test with network throttling

## Validation Checklist
- [ ] Storage utilities created with error handling
- [ ] LocalStorage persistence works
- [ ] Cookie persistence works
- [ ] Cross-tab synchronization works
- [ ] Server-side persistence implemented (if needed)
- [ ] Theme migration utility created
- [ ] Migration runs on app initialization
- [ ] Fallback mechanisms work
- [ ] Theme persists after page refresh
- [ ] Theme persists after browser restart
- [ ] Theme syncs across tabs
- [ ] Theme syncs across devices (if server-side)
- [ ] Storage errors are handled gracefully
- [ ] No console errors or warnings
- [ ] TypeScript types are correct

## Best Practices
- Always validate theme values before storing
- Implement fallback mechanisms (localStorage → cookies → default)
- Handle storage errors gracefully
- Sync theme across tabs for better UX
- Use cookies for SSR support
- Implement server-side persistence for authenticated users
- Migrate from old storage systems automatically
- Log storage operations for debugging
- Test with storage disabled (private browsing)
- Clean up old storage keys after migration
- Use consistent storage keys across app
- Implement retry logic for server sync
- Dispatch custom events for theme changes
- Document storage format and keys
- Test on multiple browsers and devices
