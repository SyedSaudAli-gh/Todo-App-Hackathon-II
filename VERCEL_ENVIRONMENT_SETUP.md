# 🔧 Vercel Environment Variables Setup

## Critical Fixes Applied

I've fixed the database configuration and OAuth setup in your code. Now you need to update your Vercel environment variables.

## Required Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables using your actual values from `web/.env.local`:

```bash
# Database (CRITICAL - use %40 for @ symbol)
DATABASE_URL=your-supabase-connection-string-with-proper-encoding

# Auth Configuration  
BETTER_AUTH_SECRET=your-secret-from-env-local
BETTER_AUTH_URL=https://todo-app-hackathon-ii.vercel.app
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-ii.vercel.app

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://syedsaudali-todo-backend-api.hf.space
NEXT_PUBLIC_API_VERSION=v1

# Google OAuth (use your actual values from .env.local)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (use your actual values from .env.local)
FACEBOOK_APP_ID=your-facebook-app-id  
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Enable OAuth
NEXT_PUBLIC_GOOGLE_ENABLED=true
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

## OAuth Redirect URLs

### Google Cloud Console:
Add: `https://todo-app-hackathon-ii.vercel.app/api/auth/callback/google`

### Facebook Developers:
Add: `https://todo-app-hackathon-ii.vercel.app/api/auth/callback/facebook`

## After Setup

1. Redeploy your Vercel app
2. Test: https://todo-app-hackathon-ii.vercel.app/api/auth/session
3. Should return JSON, not 500 error

## What I Fixed

1. **Database Configuration**: Changed to proper object format for Better Auth
2. **OAuth Providers**: Simplified detection logic  
3. **URL Encoding**: Fixed @ symbol encoding issues

The authentication should work after you update the Vercel environment variables!