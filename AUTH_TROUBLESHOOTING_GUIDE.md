# 🚨 Authentication Troubleshooting Guide

## Current Issues & Solutions

### 1. "Failed to execute 'json' on 'Response': Unexpected end of JSON input"

**Cause**: Your auth API is returning an empty response instead of JSON.

**Root Cause**: Database connection failure - you're using `DATABASE_URL=file:auth.db` which doesn't work on Vercel.

**Solution**:
```bash
# Replace in Vercel environment variables
DATABASE_URL=postgresql://your-connection-string
# NOT: DATABASE_URL=file:auth.db
```

### 2. OAuth "Connecting..." Forever

**Cause**: OAuth redirect URLs are incorrect or environment variables missing.

**Solutions**:

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client ID
4. Add redirect URI: `https://todo-app-hackathon-ii.vercel.app/api/auth/callback/google`
5. Add environment variables in Vercel:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXT_PUBLIC_GOOGLE_ENABLED=true
   ```

#### Facebook OAuth Setup:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Your App → Facebook Login → Settings
3. Add redirect URI: `https://todo-app-hackathon-ii.vercel.app/api/auth/callback/facebook`
4. Add environment variables in Vercel:
   ```bash
   FACEBOOK_APP_ID=your-app-id
   FACEBOOK_APP_SECRET=your-app-secret
   NEXT_PUBLIC_FACEBOOK_ENABLED=true
   ```

### 3. Auth Route Not Found

**Issue**: Your auth route is at `[...better-auth]` but should be `[...all]`

**Fixed**: I've already renamed the directory for you.

## 🔧 Step-by-Step Fix Process

### Step 1: Set Up Cloud Database

**Option A: Supabase (Recommended)**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string (starts with `postgresql://`)
5. Run the SQL schema from `web/scripts/setup-auth-db.sql`

**Option B: Vercel Postgres**
1. Vercel Dashboard → Storage → Create Database
2. Copy connection string
3. Run schema in database

### Step 2: Update Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
# Database (CRITICAL)
DATABASE_URL=postgresql://your-connection-string

# Auth Configuration (CRITICAL)
BETTER_AUTH_SECRET=generate-32-char-secret-with-openssl-rand-base64-32
BETTER_AUTH_URL=https://todo-app-hackathon-ii.vercel.app
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-ii.vercel.app

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://huggingface.co/spaces/SyedSaudAli/todo-backend-api
NEXT_PUBLIC_API_VERSION=v1

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_ENABLED=true

# Facebook OAuth (if using)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

### Step 3: Redeploy

After adding environment variables, trigger a new deployment:
1. Push any small change to your repo, OR
2. Go to Vercel Dashboard → Deployments → Redeploy

### Step 4: Test

Run the diagnostic script:
```bash
node web/test-auth-production.js
```

## 🔍 Debugging Commands

### Check if auth endpoints are working:
```bash
curl https://todo-app-hackathon-ii.vercel.app/api/auth/session
```

### Test signup:
```bash
curl -X POST https://todo-app-hackathon-ii.vercel.app/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

### Check OAuth redirect:
```bash
curl -I https://todo-app-hackathon-ii.vercel.app/api/auth/google
```

## 🚨 Critical Checklist

- [ ] **DATABASE_URL** points to cloud database (not `file:auth.db`)
- [ ] **BETTER_AUTH_SECRET** is set (32+ characters)
- [ ] **OAuth redirect URLs** updated in provider consoles
- [ ] **Environment variables** added to Vercel
- [ ] **App redeployed** after env var changes
- [ ] **Database schema** created in cloud database

## 📊 Expected Responses

### Working Session Endpoint:
```json
{
  "user": null,
  "session": null
}
```

### Working Signup:
```json
{
  "user": {
    "id": "user-id",
    "email": "test@example.com",
    "name": "Test"
  },
  "session": {
    "token": "session-token",
    "expiresAt": "2024-02-01T00:00:00.000Z"
  }
}
```

### Working OAuth:
- Status: 302 (redirect)
- Location header pointing to OAuth provider

## 🆘 If Still Not Working

1. **Check Vercel Function Logs**:
   - Vercel Dashboard → Functions → View Logs
   - Look for database connection errors

2. **Verify Database Connection**:
   - Test connection string in database client
   - Ensure schema is created

3. **Check OAuth App Settings**:
   - Verify client IDs/secrets are correct
   - Ensure redirect URLs match exactly

4. **Contact Support**:
   - Provide Vercel function logs
   - Share environment variable names (not values)
   - Include specific error messages