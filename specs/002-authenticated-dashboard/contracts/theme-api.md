# Theme Context API

**Feature**: 002-authenticated-dashboard
**Date**: 2026-01-07
**Status**: Complete

## Overview

This document defines the Theme Context API for managing light/dark mode in the authenticated dashboard.

## API Contract

### ThemeContext Interface

```typescript
// web/src/contexts/ThemeContext.tsx

export type Theme = "light" | "dark" | "system"

export interface ThemeContextValue {
  /** Current theme setting ("light", "dark", or "system") */
  theme: Theme

  /** Set the theme preference */
  setTheme: (theme: Theme) => void

  /** Resolved theme ("light" or "dark") - computed from system preference if theme is "system" */
  resolvedTheme: "light" | "dark"

  /** Whether the theme system is initialized */
  isInitialized: boolean
}
```

### ThemeProvider Component

```typescript
// web/src/contexts/ThemeContext.tsx

export interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode

  /** Default theme if no preference stored (default: "system") */
  defaultTheme?: Theme

  /** localStorage key for storing preference (default: "theme-preference") */
  storageKey?: string

  /** Disable localStorage persistence (default: false) */
  disableStorage?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme-preference",
  disableStorage = false
}: ThemeProviderProps): JSX.Element
```

### useTheme Hook

```typescript
// web/src/hooks/useTheme.ts

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 * @returns ThemeContextValue
 */
export function useTheme(): ThemeContextValue
```

## Usage Examples

### Basic Setup

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/contexts/ThemeContext"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationMismatch>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Theme Toggle Component

```typescript
// components/theme/ThemeToggle.tsx
import { useTheme } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {resolvedTheme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
}
```

### Theme-Aware Component

```typescript
// components/dashboard/Header.tsx
import { useTheme } from "@/hooks/useTheme"

export function Header() {
  const { resolvedTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-900">
      <h1>Dashboard</h1>
      <p>Current theme: {resolvedTheme}</p>
    </header>
  )
}
```

## Implementation Details

### Theme Resolution Logic

```typescript
function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    // Check system preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return isDark ? "dark" : "light"
  }
  return theme
}
```

### localStorage Persistence

```typescript
// Save theme preference
localStorage.setItem(storageKey, theme)

// Load theme preference
const stored = localStorage.getItem(storageKey) as Theme | null
if (stored && ["light", "dark", "system"].includes(stored)) {
  setTheme(stored)
}
```

### CSS Class Application

```typescript
// Apply theme to document
const root = document.documentElement
root.classList.remove("light", "dark")
root.classList.add(resolvedTheme)
```

### System Preference Listener

```typescript
// Listen for system theme changes
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

const handleChange = (e: MediaQueryListEvent) => {
  if (theme === "system") {
    setResolvedTheme(e.matches ? "dark" : "light")
  }
}

mediaQuery.addEventListener("change", handleChange)

// Cleanup
return () => mediaQuery.removeEventListener("change", handleChange)
```

## CSS Variables

### Root Variables (Light Mode)

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

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
```

### Dark Mode Variables

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

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
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        // ... more colors
      }
    }
  }
}
```

## Accessibility

### WCAG AA Compliance

**Contrast Ratios** (minimum 4.5:1 for normal text):

| Element | Light Mode | Dark Mode | Ratio |
|---------|------------|-----------|-------|
| Body text | #0F172A on #FFFFFF | #F8FAFC on #0F172A | 16.1:1 |
| Primary button | #FFFFFF on #3B82F6 | #1E293B on #60A5FA | 4.5:1 |
| Secondary text | #64748B on #FFFFFF | #94A3B8 on #0F172A | 7.2:1 |
| Border | #E2E8F0 on #FFFFFF | #334155 on #0F172A | 1.5:1 |

**Testing Tools**:
- WebAIM Contrast Checker
- Stark (Figma plugin)
- axe DevTools

### Keyboard Navigation

```typescript
// Theme toggle keyboard support
<button
  onClick={toggleTheme}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleTheme()
    }
  }}
  aria-label="Toggle theme"
  aria-pressed={resolvedTheme === "dark"}
>
  {/* Icon */}
</button>
```

### Screen Reader Support

```typescript
// Announce theme changes
const announceThemeChange = (theme: "light" | "dark") => {
  const announcement = `Theme changed to ${theme} mode`

  // Create live region for announcement
  const liveRegion = document.createElement("div")
  liveRegion.setAttribute("role", "status")
  liveRegion.setAttribute("aria-live", "polite")
  liveRegion.className = "sr-only"
  liveRegion.textContent = announcement

  document.body.appendChild(liveRegion)

  // Remove after announcement
  setTimeout(() => liveRegion.remove(), 1000)
}
```

## Performance

### Transition Animation

```css
/* Smooth theme transition */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Disable transitions on theme change to avoid flash */
.theme-transitioning * {
  transition: none !important;
}
```

### Hydration Handling

```typescript
// Prevent hydration mismatch
<html lang="en" suppressHydrationMismatch>
```

```typescript
// Initialize theme before React hydration
const script = `
  (function() {
    const theme = localStorage.getItem('theme-preference') || 'system'
    const resolved = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme
    document.documentElement.classList.add(resolved)
  })()
`

<script dangerouslySetInnerHTML={{ __html: script }} />
```

## Error Handling

### localStorage Unavailable

```typescript
try {
  localStorage.setItem(storageKey, theme)
} catch (error) {
  console.warn("localStorage unavailable, theme preference will not persist")
  // Continue without persistence
}
```

### Invalid Theme Value

```typescript
const isValidTheme = (value: string): value is Theme => {
  return ["light", "dark", "system"].includes(value)
}

const stored = localStorage.getItem(storageKey)
if (stored && isValidTheme(stored)) {
  setTheme(stored)
} else {
  // Fallback to default
  setTheme(defaultTheme)
}
```

### Context Not Found

```typescript
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
```

## Testing

### Unit Tests

```typescript
// __tests__/ThemeContext.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"

describe("ThemeContext", () => {
  it("provides default theme", () => {
    const TestComponent = () => {
      const { theme } = useTheme()
      return <div>{theme}</div>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByText("system")).toBeInTheDocument()
  })

  it("toggles theme", () => {
    const TestComponent = () => {
      const { theme, setTheme } = useTheme()
      return (
        <div>
          <span>{theme}</span>
          <button onClick={() => setTheme("dark")}>Dark</button>
        </div>
      )
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByText("Dark"))
    expect(screen.getByText("dark")).toBeInTheDocument()
  })

  it("persists theme to localStorage", () => {
    const TestComponent = () => {
      const { setTheme } = useTheme()
      return <button onClick={() => setTheme("dark")}>Dark</button>
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByText("Dark"))
    expect(localStorage.getItem("theme-preference")).toBe("dark")
  })
})
```

### E2E Tests

```typescript
// e2e/theme.spec.ts
import { test, expect } from "@playwright/test"

test("theme toggle works", async ({ page }) => {
  await page.goto("/dashboard")

  // Check initial theme
  const html = page.locator("html")
  await expect(html).toHaveClass(/light/)

  // Click theme toggle
  await page.click('[aria-label="Toggle theme"]')

  // Check theme changed
  await expect(html).toHaveClass(/dark/)

  // Refresh page
  await page.reload()

  // Check theme persisted
  await expect(html).toHaveClass(/dark/)
})
```

## Summary

### API Surface

- **ThemeContext**: React context for theme state
- **ThemeProvider**: Provider component with props
- **useTheme**: Hook to access theme context
- **Theme**: Type union ("light" | "dark" | "system")

### Features

- Light/dark mode toggle
- System preference detection
- localStorage persistence
- CSS variable-based theming
- Smooth transitions
- WCAG AA compliance
- Keyboard navigation
- Screen reader support

### Integration Points

- Root layout (ThemeProvider)
- Dashboard header (ThemeToggle)
- All components (CSS variables)
- Tailwind config (dark mode)
