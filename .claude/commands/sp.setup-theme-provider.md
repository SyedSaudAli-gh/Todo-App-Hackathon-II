# Skill: Setup Theme Provider

## Purpose
Establish the foundational theme system with React Context, CSS variables, and Tailwind configuration to support light and dark modes across the entire Next.js application.

## When to Use
- Starting a new Next.js project that requires theme support
- Before implementing any theme-dependent UI components
- When migrating from a static theme to dynamic light/dark mode
- At the beginning of Phase II dashboard implementation
- Before implementing theme toggle or persistence features

## Inputs
- Existing Next.js 15 App Router project structure
- Tailwind CSS configuration file (`tailwind.config.ts`)
- Root layout file (`web/src/app/layout.tsx`)
- Design system color palette (light and dark variants)
- Optional: Existing CSS variables or design tokens

## Step-by-Step Process

### 1. Define Theme Types and Constants
Create `web/src/lib/theme/types.ts`:
```typescript
/**
 * Theme system types and constants.
 */

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Background colors
  background: string;
  foreground: string;

  // Card colors
  card: string;
  cardForeground: string;

  // Primary colors
  primary: string;
  primaryForeground: string;

  // Secondary colors
  secondary: string;
  secondaryForeground: string;

  // Muted colors
  muted: string;
  mutedForeground: string;

  // Accent colors
  accent: string;
  accentForeground: string;

  // Destructive colors
  destructive: string;
  destructiveForeground: string;

  // Border and input
  border: string;
  input: string;
  ring: string;
}

export const THEME_STORAGE_KEY = 'app-theme';
export const THEME_ATTRIBUTE = 'data-theme';

export const DEFAULT_THEME: Theme = 'system';
```

### 2. Create CSS Variables for Theme Colors
Create `web/src/styles/theme-variables.css`:
```css
/**
 * CSS variables for light and dark themes.
 * Uses HSL color space for better manipulation.
 */

:root {
  /* Light theme colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  --radius: 0.5rem;
}

[data-theme='dark'] {
  /* Dark theme colors */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}

/* Smooth transitions for theme changes */
* {
  transition: background-color 0.2s ease-in-out,
              border-color 0.2s ease-in-out,
              color 0.2s ease-in-out;
}

/* Disable transitions on theme change to prevent flash */
.theme-transitioning * {
  transition: none !important;
}
```

### 3. Update Tailwind Configuration
Update `web/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 4. Create Theme Context Provider
Create `web/src/lib/theme/ThemeProvider.tsx`:
```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, DEFAULT_THEME, THEME_ATTRIBUTE } from './types';

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
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = 'app-theme',
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

    // Add transitioning class to prevent flash
    root.classList.add('theme-transitioning');

    // Set theme attribute
    root.setAttribute(THEME_ATTRIBUTE, theme);

    // Remove transitioning class after a frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-transitioning');
      });
    });
  };

  // Set theme and persist
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Load theme from localStorage
    let savedTheme: Theme = defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        savedTheme = stored as Theme;
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }

    setThemeState(savedTheme);
    const resolved = resolveTheme(savedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [defaultTheme, storageKey]);

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

  // Prevent flash of unstyled content
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

### 5. Create Theme Script for SSR
Create `web/src/lib/theme/theme-script.tsx`:
```typescript
/**
 * Inline script to prevent flash of unstyled content (FOUC).
 * This runs before React hydration.
 */

export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const storageKey = 'app-theme';
        const attribute = 'data-theme';

        function getSystemTheme() {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }

        function resolveTheme(theme) {
          return theme === 'system' ? getSystemTheme() : theme;
        }

        const savedTheme = localStorage.getItem(storageKey) || 'system';
        const resolvedTheme = resolveTheme(savedTheme);

        document.documentElement.setAttribute(attribute, resolvedTheme);
      } catch (e) {
        console.error('Theme script error:', e);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
```

### 6. Update Root Layout
Update `web/src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/theme-variables.css';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ThemeScript } from '@/lib/theme/theme-script';

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
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 7. Update Global Styles
Update `web/src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

### 8. Create Theme Hook Export
Create `web/src/lib/theme/index.ts`:
```typescript
/**
 * Theme system exports.
 */

export { ThemeProvider, useTheme } from './ThemeProvider';
export { ThemeScript } from './theme-script';
export type { Theme, ThemeColors } from './types';
export { DEFAULT_THEME, THEME_STORAGE_KEY, THEME_ATTRIBUTE } from './types';
```

### 9. Test Theme System
Create `web/src/app/theme-test/page.tsx`:
```typescript
'use client';

import { useTheme } from '@/lib/theme';

export default function ThemeTestPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Theme System Test</h1>

        <div className="space-y-4">
          <p>Current theme: <strong>{theme}</strong></p>
          <p>Resolved theme: <strong>{resolvedTheme}</strong></p>

          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              System
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-card text-card-foreground border rounded">
            <h3 className="font-semibold mb-2">Card</h3>
            <p className="text-muted-foreground">Card content</p>
          </div>

          <div className="p-4 bg-primary text-primary-foreground rounded">
            <h3 className="font-semibold mb-2">Primary</h3>
            <p>Primary content</p>
          </div>

          <div className="p-4 bg-secondary text-secondary-foreground rounded">
            <h3 className="font-semibold mb-2">Secondary</h3>
            <p>Secondary content</p>
          </div>

          <div className="p-4 bg-destructive text-destructive-foreground rounded">
            <h3 className="font-semibold mb-2">Destructive</h3>
            <p>Destructive content</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 10. Verify Theme System
1. Start development server: `npm run dev`
2. Navigate to `/theme-test`
3. Click theme buttons and verify:
   - Theme changes immediately
   - No flash of unstyled content
   - Colors update correctly
   - localStorage persists theme
4. Refresh page and verify theme persists
5. Change system theme and verify "System" option follows it
6. Check browser DevTools:
   - `data-theme` attribute on `<html>`
   - CSS variables in computed styles
   - localStorage contains theme preference

## Output
- ✅ Theme types and constants defined
- ✅ CSS variables for light and dark themes
- ✅ Tailwind configuration extended with theme colors
- ✅ ThemeProvider with React Context
- ✅ Theme script to prevent FOUC
- ✅ Root layout updated with ThemeProvider
- ✅ Global styles using theme variables
- ✅ useTheme hook for accessing theme state
- ✅ Theme system tested and verified
- ✅ No flash of unstyled content on page load

## Failure Handling

### Error: "Flash of unstyled content on page load"
**Solution**:
1. Verify `ThemeScript` is in `<head>` before any content
2. Add `suppressHydrationWarning` to `<html>` tag
3. Check that theme script runs synchronously
4. Ensure localStorage key matches between script and provider

### Error: "Theme doesn't persist after refresh"
**Solution**:
1. Check localStorage is accessible (not blocked by browser)
2. Verify storage key is consistent
3. Check for localStorage errors in console
4. Test in incognito mode (localStorage might be disabled)

### Error: "System theme doesn't update automatically"
**Solution**:
1. Verify media query listener is attached
2. Check that theme is set to 'system'
3. Test by changing OS theme settings
4. Ensure listener cleanup in useEffect return

### Error: "CSS variables not applied"
**Solution**:
1. Verify `theme-variables.css` is imported in layout
2. Check that `data-theme` attribute is set on `<html>`
3. Inspect computed styles in DevTools
4. Ensure Tailwind config references CSS variables correctly

### Error: "Tailwind classes don't respect theme"
**Solution**:
1. Check `darkMode` config in `tailwind.config.ts`
2. Verify color definitions use `hsl(var(--variable))`
3. Rebuild Tailwind: `npm run dev` (restart)
4. Clear `.next` cache and restart

### Error: "useTheme hook throws error"
**Solution**:
1. Ensure component is wrapped in `ThemeProvider`
2. Check that provider is in client component (`'use client'`)
3. Verify context is created before use
4. Check for typos in hook name

### Error: "Theme transitions are janky"
**Solution**:
1. Add `theme-transitioning` class during changes
2. Use `requestAnimationFrame` for smooth updates
3. Reduce transition duration if needed
4. Test on slower devices

## Validation Checklist
- [ ] Theme types defined in `types.ts`
- [ ] CSS variables created for light and dark themes
- [ ] Tailwind config extended with theme colors
- [ ] ThemeProvider component created
- [ ] useTheme hook works correctly
- [ ] ThemeScript prevents FOUC
- [ ] Root layout includes ThemeProvider
- [ ] Global styles use theme variables
- [ ] Theme persists in localStorage
- [ ] System theme detection works
- [ ] Theme changes are smooth (no flash)
- [ ] All theme colors render correctly
- [ ] Test page verifies all theme states
- [ ] No console errors or warnings
- [ ] TypeScript types are correct

## Best Practices
- Use HSL color space for better color manipulation
- Implement smooth transitions between themes
- Prevent flash of unstyled content with inline script
- Support system theme preference
- Persist user's theme choice
- Use CSS variables for runtime theme changes
- Extend Tailwind with semantic color names
- Test theme system before building components
- Document color palette and usage
- Consider accessibility (contrast ratios)
- Use `suppressHydrationWarning` to prevent React warnings
- Clean up event listeners in useEffect
- Handle localStorage errors gracefully
- Provide fallback for unsupported browsers
- Test on multiple devices and browsers
