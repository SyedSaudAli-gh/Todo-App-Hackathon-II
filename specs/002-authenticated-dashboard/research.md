# Research: Authenticated Dashboard Upgrade

**Feature**: 002-authenticated-dashboard
**Date**: 2026-01-07
**Status**: Complete

## Overview

This document contains research findings for implementing authentication, dashboard layout, theme system, and UI upgrades for the Phase II Todo App frontend.

## 1. Better Auth Configuration

### Decision: Better Auth for Next.js 15 App Router

**Research Question**: How to configure Better Auth with Next.js 15 App Router?

**Findings**:
- Better Auth is a modern authentication library designed for Next.js 15+ with native App Router support
- Provides built-in support for email/password and OAuth providers
- Uses client-side session management (no backend API changes needed)
- Configuration via `lib/auth/auth.ts` file

**Configuration Approach**:
```typescript
// lib/auth/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: {
    // Better Auth can use its own database or integrate with existing
    // For this project: client-side session management (no DB needed)
    type: "memory" // or configure with existing Neon DB if needed
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false // Per spec assumptions
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    },
    facebook: {
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
    }
  }
})
```

**Client-Side Usage**:
```typescript
// lib/auth/auth-client.ts
import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})
```

**Rationale**: Better Auth simplifies authentication without requiring backend API changes, which aligns with the frontend-only constraint.

## 2. OAuth Provider Setup

### Google OAuth 2.0

**Setup Steps**:
1. Go to Google Cloud Console (console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (dev), `https://yourdomain.com/api/auth/callback/google` (prod)
6. Copy Client ID and Client Secret to .env.local

**Environment Variables**:
```
GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

### Facebook OAuth

**Setup Steps**:
1. Go to Facebook Developers (developers.facebook.com)
2. Create new app or select existing
3. Add Facebook Login product
4. Configure OAuth redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
5. Copy App ID and App Secret to .env.local

**Environment Variables**:
```
FACEBOOK_APP_ID=<your-app-id>
FACEBOOK_APP_SECRET=<your-app-secret>
```

### LinkedIn OAuth

**Setup Steps**:
1. Go to LinkedIn Developers (developer.linkedin.com)
2. Create new app
3. Add Sign In with LinkedIn product
4. Configure redirect URLs: `http://localhost:3000/api/auth/callback/linkedin`
5. Copy Client ID and Client Secret to .env.local

**Environment Variables**:
```
LINKEDIN_CLIENT_ID=<your-client-id>
LINKEDIN_CLIENT_SECRET=<your-client-secret>
```

**Common OAuth Errors**:
- **Redirect URI mismatch**: Ensure exact match between configured URI and callback URL
- **Invalid credentials**: Verify client ID/secret are correct and not expired
- **Scope issues**: Request minimal scopes (email, profile) to avoid approval delays

## 3. shadcn/ui Integration

### Decision: shadcn/ui for Component Library

**Research Question**: How to integrate shadcn/ui with existing Next.js + Tailwind setup?

**Findings**:
- shadcn/ui is not an npm package - components are copied into your codebase
- Built on Radix UI primitives (accessible, unstyled)
- Fully compatible with Tailwind CSS
- Components are customizable and maintainable

**Installation Steps**:
1. Install dependencies:
```bash
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
```

2. Initialize shadcn/ui:
```bash
npx shadcn-ui@latest init
```

3. Add components as needed:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add skeleton
```

**Component Structure**:
- Components installed to `src/components/ui/`
- Each component is a single .tsx file
- Fully customizable with Tailwind classes
- TypeScript types included

**Rationale**: Copy-paste approach gives full control over components, no version conflicts, and better bundle size optimization.

## 4. Theme System Architecture

### Decision: React Context + CSS Variables

**Research Question**: Best practices for light/dark theme with Next.js + Tailwind?

**Findings**:
- React Context API sufficient for global theme state
- CSS variables for theme colors (easy to adjust for accessibility)
- Tailwind dark mode with `class` strategy
- localStorage for persistence

**Architecture**:

**1. CSS Variables** (`globals.css`):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more variables */
}
```

**2. Tailwind Config** (`tailwind.config.ts`):
```typescript
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        // ... more colors
      }
    }
  }
}
```

**3. Theme Provider** (`contexts/ThemeContext.tsx`):
```typescript
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("theme-preference")
    if (stored) setTheme(stored as Theme)
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Save to localStorage
    localStorage.setItem("theme-preference", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

**Rationale**: Simple, performant, and follows Next.js + Tailwind best practices.

## 5. Route Protection Strategy

### Decision: Layout-Level Protection

**Research Question**: How to protect routes with Better Auth in Next.js App Router?

**Findings**:
- Three approaches: middleware, layout-level, component-level
- Layout-level protection cleanest for route groups
- Better Auth provides session checking utilities

**Implementation Approach**:

**Route Group Structure**:
```
app/
├── (auth)/          # Unauthenticated routes
│   ├── login/
│   └── signup/
└── (dashboard)/     # Protected routes
    ├── layout.tsx   # Protection here
    ├── dashboard/
    └── todos/
```

**Dashboard Layout Protection** (`app/(dashboard)/layout.tsx`):
```typescript
import { redirect } from "next/navigation"
import { authClient } from "@/lib/auth/auth-client"

export default async function DashboardLayout({ children }) {
  const session = await authClient.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={session.user}>
      {children}
    </DashboardLayout>
  )
}
```

**Rationale**: Layout-level protection is cleaner than per-page checks and simpler than middleware for this use case.

## 6. Animation Approach

### Decision: CSS Transitions + Framer Motion (if needed)

**Research Question**: Best animation library for React?

**Comparison**:

| Library | Bundle Size | Performance | DX | Use Case |
|---------|-------------|-------------|-----|----------|
| CSS Transitions | 0 KB | Excellent | Good | Simple hover/focus |
| Framer Motion | ~60 KB | Good | Excellent | Complex animations |
| React Spring | ~40 KB | Excellent | Good | Physics-based |
| GSAP | ~50 KB | Excellent | Excellent | Professional |

**Decision**: CSS Transitions for simple animations, Framer Motion for complex

**CSS Transitions** (hover, focus, theme toggle):
```css
.button {
  transition: all 0.2s ease-in-out;
}

.button:hover {
  transform: scale(1.05);
}

.theme-toggle {
  transition: background-color 0.3s ease;
}
```

**Framer Motion** (page transitions, if needed):
```typescript
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

**Rationale**: Performance-first approach - use CSS for simple animations (zero JS overhead), Framer Motion only for complex animations.

## 7. Figma Layout Analysis

### Dashboard Structure from Figma Template

**Research Question**: How to extract layout structure from Figma template?

**Figma URL**: https://www.figma.com/design/zxSqt5U4zQDXvO5sQJSR1I/

**Layout Analysis**:

**Desktop Layout (≥ 1024px)**:
- Sidebar: 256px fixed width, left side
- Header: Full width minus sidebar, 64px height, top
- Content: Remaining space, scrollable

**Tablet Layout (768-1023px)**:
- Sidebar: 200px fixed width, collapsible
- Header: Full width minus sidebar, 64px height
- Content: Remaining space

**Mobile Layout (< 768px)**:
- Sidebar: Hidden, hamburger menu
- Header: Full width, 56px height
- Content: Full width, below header

**Component Hierarchy**:
```
DashboardLayout
├── Sidebar (desktop/tablet) or MobileMenu (mobile)
│   ├── Logo
│   ├── Navigation Links
│   │   ├── Dashboard
│   │   ├── Todos
│   │   ├── Profile
│   │   └── Settings
│   └── User Info (bottom)
├── Header
│   ├── Hamburger Menu (mobile only)
│   ├── Page Title
│   ├── Theme Toggle
│   └── Logout Button
└── Content Area
    └── {children}
```

**Responsive Breakpoints**:
- Mobile: `< 768px` (Tailwind: default)
- Tablet: `768px - 1023px` (Tailwind: `md:`)
- Desktop: `≥ 1024px` (Tailwind: `lg:`)

**Color Scheme** (adapted for accessibility):
- Light mode: White background, dark text
- Dark mode: Dark background, light text
- Ensure WCAG AA contrast ratios (4.5:1 minimum)

**Rationale**: Figma provides structure and hierarchy guidance, not pixel-perfect design. Adapt colors and spacing for accessibility compliance.

## Research Summary

### Key Decisions Made

1. **Better Auth**: Modern, Next.js 15 optimized, no backend changes needed
2. **shadcn/ui**: Accessible, customizable, Tailwind-integrated components
3. **React Context**: Simple theme state management with localStorage
4. **Layout-Level Protection**: Clean route protection in dashboard layout
5. **CSS Transitions + Framer Motion**: Performance-first animation approach
6. **Figma Structure**: Extract layout hierarchy, adapt for accessibility

### Technologies Selected

- **Authentication**: Better Auth ^1.0.0
- **Components**: shadcn/ui (Radix UI + Tailwind)
- **Icons**: Lucide React
- **Animations**: CSS transitions + Framer Motion ^11.0.0 (if needed)
- **State**: React Context API
- **Styling**: Tailwind CSS 3+ (existing)

### Environment Setup Required

```bash
# Install Better Auth
npm install better-auth

# Install shadcn/ui dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# Install Framer Motion (if needed for complex animations)
npm install framer-motion

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add shadcn/ui components
npx shadcn-ui@latest add button input card dialog toast skeleton
```

### Next Steps

All research questions answered. Ready to proceed to Phase 1 (Design & Contracts).
