# Skill: Setup Better Auth

## Purpose
Initialize Better Auth library in the Next.js application with database integration, session management, and core authentication configuration.

## When to Use
- Starting authentication implementation from scratch
- No existing Better Auth configuration exists
- Need to establish foundational auth infrastructure
- Before implementing any auth features (login, signup, OAuth)

## Inputs
- Database connection string (from `web/.env.local`)
- Session secret key (generate if not exists)
- Application base URL (default: http://localhost:3000)

## Step-by-Step Process

### 1. Install Better Auth Dependencies
```bash
cd web
npm install better-auth@latest
npm install @better-auth/react
```

### 2. Create Auth Configuration File
Create `web/src/lib/auth/config.ts`:
```typescript
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
```

### 3. Add Environment Variables
Update `web/.env.local`:
```env
# Better Auth Configuration
BETTER_AUTH_SECRET=<generate-32-char-random-string>
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database URL (should already exist)
DATABASE_URL=postgresql://...
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create Auth API Route Handler
Create `web/src/app/api/auth/[...all]/route.ts`:
```typescript
import { auth } from "@/lib/auth/config";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 5. Create Auth Client
Create `web/src/lib/auth/client.ts`:
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useActiveOrganization,
} = authClient;
```

### 6. Run Database Migrations
Better Auth will auto-create tables on first request, but verify:
```bash
# Start the dev server
npm run dev

# Make a test request to initialize tables
curl http://localhost:3000/api/auth/get-session
```

### 7. Verify Installation
Create test file `web/src/app/auth-test/page.tsx`:
```typescript
'use client';

import { useSession } from '@/lib/auth/client';

export default function AuthTest() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
```

Visit http://localhost:3000/auth-test to verify setup.

## Output
- ✅ Better Auth installed and configured
- ✅ Auth API routes created at `/api/auth/*`
- ✅ Database tables created (users, sessions, accounts)
- ✅ Auth client available for use in components
- ✅ Environment variables configured
- ✅ Test page confirms setup working

## Failure Handling

### Error: "DATABASE_URL is not defined"
**Solution**: Add DATABASE_URL to `web/.env.local`

### Error: "BETTER_AUTH_SECRET is not defined"
**Solution**: Generate and add secret to environment variables

### Error: "Cannot connect to database"
**Solution**:
1. Verify DATABASE_URL is correct
2. Ensure database is running
3. Check network connectivity
4. Verify database user has CREATE TABLE permissions

### Error: "Module not found: better-auth"
**Solution**:
```bash
cd web
rm -rf node_modules package-lock.json
npm install
```

### Error: "Tables already exist"
**Solution**: This is normal if re-running setup. Better Auth handles existing tables gracefully.

### Error: "Session not persisting"
**Solution**:
1. Verify BETTER_AUTH_SECRET is set
2. Check browser cookies are enabled
3. Ensure baseURL matches your domain
4. Clear browser cookies and retry

## Validation Checklist
- [ ] `npm list better-auth` shows installed version
- [ ] `web/src/lib/auth/config.ts` exists and exports `auth`
- [ ] `web/src/lib/auth/client.ts` exists and exports `authClient`
- [ ] `web/src/app/api/auth/[...all]/route.ts` exists
- [ ] `web/.env.local` contains BETTER_AUTH_SECRET
- [ ] Database contains `user`, `session`, `account` tables
- [ ] Test page at `/auth-test` loads without errors
- [ ] `useSession()` hook returns data structure (even if null)
