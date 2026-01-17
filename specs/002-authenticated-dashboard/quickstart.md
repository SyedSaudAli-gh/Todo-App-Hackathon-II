# Quickstart Guide: Authenticated Dashboard Upgrade

**Feature**: 002-authenticated-dashboard
**Date**: 2026-01-07
**Status**: Complete

## Overview

This guide provides step-by-step instructions for setting up the authenticated dashboard upgrade with Better Auth, shadcn/ui, and theme system.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Existing Next.js 15+ project (Phase II Todo App)
- Git for version control
- Code editor (VS Code recommended)

## Installation Steps

### 1. Install Dependencies

```bash
# Navigate to web directory
cd web

# Install Better Auth
npm install better-auth

# Install shadcn/ui dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# Install Framer Motion (optional, for complex animations)
npm install framer-motion

# Install development dependencies
npm install -D @types/node
```

### 2. Initialize shadcn/ui

```bash
# Run shadcn/ui init
npx shadcn-ui@latest init

# Follow prompts:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind config: tailwind.config.ts
# - Components directory: src/components
# - Utils directory: src/lib
# - React Server Components: Yes
```

### 3. Add shadcn/ui Components

```bash
# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
```

## Configuration

### 1. Configure Better Auth

Create `web/src/lib/auth/auth.ts`:

```typescript
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: {
    type: "memory" // Client-side session management
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
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

Create `web/src/lib/auth/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})
```

### 2. Setup OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Navigate to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret

#### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app or select existing
3. Add "Facebook Login" product
4. Settings → Basic → Copy App ID and App Secret
5. Settings → Advanced → Valid OAuth Redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/facebook`
   - Production: `https://yourdomain.com/api/auth/callback/facebook`

#### LinkedIn OAuth

1. Go to [LinkedIn Developers](https://developer.linkedin.com)
2. Create new app
3. Products → Add "Sign In with LinkedIn"
4. Auth → OAuth 2.0 settings → Redirect URLs:
   - Development: `http://localhost:3000/api/auth/callback/linkedin`
   - Production: `https://yourdomain.com/api/auth/callback/linkedin`
5. Copy Client ID and Client Secret

### 3. Environment Variables

Create `web/.env.local`:

```bash
# Better Auth
BETTER_AUTH_SECRET=your-random-secret-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# API URL (existing)
NEXT_PUBLIC_API_URL=http://localhost:8001

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create `web/.env.local.example` (for version control):

```bash
# Better Auth
BETTER_AUTH_SECRET=<generate-random-secret>
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>

# Facebook OAuth
FACEBOOK_APP_ID=<from-facebook-developers>
FACEBOOK_APP_SECRET=<from-facebook-developers>

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=<from-linkedin-developers>
LINKEDIN_CLIENT_SECRET=<from-linkedin-developers>

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8001

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configure Tailwind for Dark Mode

Update `web/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"], // Enable class-based dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

export default config
```

### 5. Add Theme CSS Variables

Update `web/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
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
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Development Workflow

### 1. Start Development Server

```bash
# Terminal 1: Start backend API (if not running)
cd api
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn src.main:app --reload --port 8001

# Terminal 2: Start frontend
cd web
npm run dev
```

### 2. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/api/v1/docs

### 3. Test Authentication

1. Navigate to http://localhost:3000/login
2. Test email/password signup
3. Test email/password login
4. Test OAuth providers (Google, Facebook, LinkedIn)
5. Verify redirect to /dashboard after login
6. Test logout functionality

### 4. Test Theme Toggle

1. Login to dashboard
2. Click theme toggle button in header
3. Verify theme switches between light and dark
4. Refresh page - verify theme persists
5. Check contrast ratios with browser DevTools

### 5. Test Todo CRUD (Regression)

1. Navigate to /dashboard/todos
2. Create new todo
3. Mark todo as complete
4. Edit todo
5. Delete todo
6. Verify all operations work without errors

## Troubleshooting

### OAuth Errors

**Error**: "Redirect URI mismatch"
- **Solution**: Ensure redirect URI in OAuth provider settings exactly matches callback URL
- **Check**: `http://localhost:3000/api/auth/callback/[provider]`

**Error**: "Invalid client ID"
- **Solution**: Verify client ID/secret in .env.local match OAuth provider settings
- **Check**: No extra spaces or quotes in environment variables

### Theme Issues

**Error**: Theme not persisting
- **Solution**: Check browser localStorage is enabled
- **Check**: Open DevTools → Application → Local Storage → theme-preference

**Error**: Flash of wrong theme on page load
- **Solution**: Add `suppressHydrationMismatch` to html tag
- **Check**: `<html lang="en" suppressHydrationMismatch>`

### Build Errors

**Error**: "Module not found: better-auth"
- **Solution**: Reinstall dependencies: `npm install`
- **Check**: package.json includes better-auth

**Error**: "Cannot find module '@/components/ui/button'"
- **Solution**: Run shadcn/ui init and add components
- **Check**: `npx shadcn-ui@latest add button`

## Next Steps

After setup is complete:

1. **Run `/sp.tasks`**: Generate implementation tasks from plan
2. **Review Tasks**: Ensure all tasks are clear and testable
3. **Run `/sp.implement`**: Execute tasks in priority order (P1 → P5)
4. **Test Thoroughly**: Run all tests (unit, integration, e2e)
5. **Create PR**: Commit changes and create pull request
6. **Deploy**: Deploy to production after approval

## Resources

### Documentation
- [Better Auth Docs](https://better-auth.com)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### OAuth Provider Docs
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login)
- [LinkedIn OAuth](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Stark (Figma Plugin)](https://www.getstark.co/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review specification: `specs/002-authenticated-dashboard/spec.md`
3. Review implementation plan: `specs/002-authenticated-dashboard/plan.md`
4. Check contracts: `specs/002-authenticated-dashboard/contracts/`
5. Consult research: `specs/002-authenticated-dashboard/research.md`
