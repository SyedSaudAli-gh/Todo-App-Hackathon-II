# 🔧 Production Authentication Fix Guide

## Problem Summary
- ✅ Deployment successful
- ❌ Sign up fails with: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
- ❌ OAuth buttons show "Connecting..." but don't work
- ❌ Server returns 500 Internal Server Error with empty response

## Root Cause
**Better Auth database tables don't exist in Supabase PostgreSQL database.**

---

## 🚨 CRITICAL FIX - Step 1: Initialize Database Tables

### 1.1 Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `faixxdifbqxallkxlydd`
3. Click on **SQL Editor** in the left sidebar

### 1.2 Run the Database Initialization Script
1. Click **"New Query"**
2. Copy the entire contents of `web/scripts/init-better-auth-db.sql`
3. Paste into the SQL editor
4. Click **"Run"** or press `Ctrl+Enter`

### 1.3 Verify Tables Were Created
You should see output showing 4 tables created:
```
table_name    | column_count
--------------+-------------
account       | 11
session       | 8
user          | 6
verification  | 5
```

If you see this output, **the database is ready!** ✅

---

## 🔧 Step 2: Verify Vercel Environment Variables

Go to your Vercel project settings and verify these variables are set correctly.

### ⚠️ Critical Variables to Check:

1. **BETTER_AUTH_URL** = `https://todo-app-hackathon-ii.vercel.app` (NOT localhost)
2. **NEXT_PUBLIC_APP_URL** = `https://todo-app-hackathon-ii.vercel.app` (NOT localhost)
3. **DATABASE_URL** = Your Supabase connection string (with `%25` for `%` in password)

### Common Mistakes:
- ❌ Using `http://localhost:3000` in production
- ❌ Missing `%25` encoding in DATABASE_URL password
- ❌ BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL don't match

---

## 🔧 Step 3: Configure OAuth Redirect URIs

### Google OAuth Console
1. Go to https://console.cloud.google.com/
2. Navigate to: **APIs & Services → Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add redirect URI:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/google
   ```
5. Click **Save**

### Facebook App Dashboard
1. Go to https://developers.facebook.com/
2. Navigate to: **Facebook Login → Settings**
3. Add redirect URI:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/facebook
   ```
4. Click **Save Changes**

---

## 🚀 Step 4: Redeploy on Vercel

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Click **"..."** menu on latest deployment
4. Click **"Redeploy"**
5. Wait for completion (~2-3 minutes)

---

## ✅ Step 5: Test Authentication

### Test Signup:
1. Visit: https://todo-app-hackathon-ii.vercel.app/signup
2. Create account with email/password
3. **Expected**: Redirect to dashboard ✅

### Test Login:
1. Visit: https://todo-app-hackathon-ii.vercel.app/login
2. Login with credentials
3. **Expected**: Redirect to dashboard ✅

### Test OAuth:
1. Click "Sign in with Google" or "Sign in with Facebook"
2. Complete OAuth flow
3. **Expected**: Redirect to dashboard ✅

---

## 🔍 Troubleshooting

### Check Vercel Logs:
1. Vercel Dashboard → Your Project → **Logs**
2. Look for errors about:
   - "relation does not exist" → Run SQL script (Step 1)
   - "Invalid origin" → Check BETTER_AUTH_URL (Step 2)
   - "Failed to connect" → Check DATABASE_URL (Step 2)

### Expected Success Logs:
```
✓ JWT_PRIVATE_KEY loaded
Environment variables check:
  DATABASE_URL: ✓
  BETTER_AUTH_SECRET: ✓
  JWT_PRIVATE_KEY: ✓
  NEXT_PUBLIC_APP_URL: ✓
```

---

## 🎯 Quick Checklist

- [ ] Run SQL script in Supabase SQL Editor
- [ ] Verify 4 tables created (user, session, account, verification)
- [ ] Check BETTER_AUTH_URL = production URL (not localhost)
- [ ] Check NEXT_PUBLIC_APP_URL = production URL (not localhost)
- [ ] Configure Google OAuth redirect URI
- [ ] Configure Facebook OAuth redirect URI
- [ ] Redeploy on Vercel
- [ ] Test signup
- [ ] Test login
- [ ] Test OAuth

---

**Most Common Issue**: Database tables not created. Always start with Step 1!
