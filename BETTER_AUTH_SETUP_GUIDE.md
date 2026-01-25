# Better Auth PostgreSQL Setup - Complete Guide

## Current Issue
Authentication fails with 500 errors and "Unexpected end of JSON input" because Better Auth cannot connect to or query the database properly.

## Root Cause Analysis

Better Auth v1.4.17 requires:
1. Proper database tables with exact schema
2. Kysely adapter for PostgreSQL
3. Correct environment variables

## ✅ SOLUTION: Step-by-Step Fix

### Step 1: Verify Database Tables in Supabase

**CRITICAL: You must verify this first**

1. Go to https://supabase.com/dashboard
2. Select project: `faixxdifbqxallkxlydd`
3. Click **"Table Editor"** in left sidebar
4. Check if you see these 4 tables:
   - `user`
   - `session`
   - `account`
   - `verification`

**If tables are missing or have wrong structure:**
- The SQL script didn't run correctly
- You need to run it again in SQL Editor (not Table Editor)

### Step 2: Verify Table Structure

Click on `user` table and confirm these columns exist:

```
id              TEXT (PRIMARY KEY)
name            TEXT
email           TEXT (UNIQUE)
emailVerified   BOOLEAN
image           TEXT
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### Step 3: Check Vercel Environment Variables

Go to Vercel → Your Project → Settings → Environment Variables

**Verify these are set for PRODUCTION environment:**

```bash
DATABASE_URL=postgresql://postgres:syed242821%25@db.faixxdifbqxallkxlydd.supabase.co:5432/postgres
BETTER_AUTH_SECRET=Z1A0Fj2lifbHe9raL02CWGjZVhmt027/NlZ77hGebMQ=
BETTER_AUTH_URL=https://todo-app-hackathon-ii.vercel.app
JWT_PRIVATE_KEY=[your-base64-key]
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-ii.vercel.app
```

**Common mistakes:**
- Using `http://localhost:3000` instead of production URL
- Missing `%25` in DATABASE_URL password
- Variables set for "Development" instead of "Production"

### Step 4: Alternative Database Setup (If SQL Script Failed)

If the SQL script didn't work, try this manual approach:

1. In Supabase, go to **SQL Editor**
2. Run each table creation separately:

```sql
-- Create user table
CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

3. Verify it created successfully (you should see "Success" message)
4. Repeat for `session`, `account`, and `verification` tables

### Step 5: Check Vercel Function Logs

After redeployment:

1. Go to Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Click **"Functions"** filter
4. Look for errors containing:
   - "relation does not exist"
   - "column does not exist"
   - "connection refused"
   - "authentication failed"

**Share the exact error message you see in logs.**

### Step 6: Test with Simple Query

If tables exist but auth still fails, the issue might be:
- Schema mismatch (column names or types)
- Connection string encoding issue
- Kysely adapter configuration

## 🔍 Diagnostic Questions

Please answer these to help me identify the exact issue:

1. **In Supabase Table Editor, do you see all 4 tables?** (Yes/No)
   - If No: Which tables are missing?

2. **When you click on the `user` table, how many columns do you see?**
   - Expected: 7 columns (id, name, email, emailVerified, image, createdAt, updatedAt)

3. **In Vercel Logs, what is the EXACT error message?**
   - Copy the full error from Function logs

4. **Did you set environment variables for "Production" environment?**
   - Not "Development" or "Preview"

5. **When you redeploy, does Vercel show "Build successful"?**
   - Or does it show warnings/errors?

## 🎯 Next Steps

Based on your answers, I'll provide the exact fix. The most common issues are:

1. **Tables don't exist** → Run SQL script again
2. **Wrong schema** → Drop and recreate tables
3. **Wrong env vars** → Update Vercel settings
4. **Connection issue** → Fix DATABASE_URL encoding

Please verify Steps 1-2 and share your findings.
