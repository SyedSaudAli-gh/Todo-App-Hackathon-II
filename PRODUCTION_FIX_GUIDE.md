# 🔥 PRODUCTION FIX: "Invalid origin" & "Failed to fetch" Errors

## 🎯 Problem Summary

**Symptoms:**
- ❌ Email sign-up/login fails with "Invalid origin" error
- ❌ "Failed to fetch" errors in browser console
- ❌ OAuth (Google/Facebook) redirects fail

**Root Cause:**
URL mismatch between actual production deployment and configured environment variables.

- **Actual Production URL**: `https://todo-app-hackathon-ii.vercel.app`
- **Configured URL (WRONG)**: `https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app`

---

## ✅ SOLUTION: 3-Step Fix

### Step 1: Update Vercel Environment Variables

Go to your Vercel project settings: https://vercel.com/syedsaudali-ghs-projects/todo-app-hackathon-ii/settings/environment-variables

**Update/Add these environment variables:**

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://syedsaudali-todo-backend-api.hf.space
NEXT_PUBLIC_API_VERSION=v1

# Better Auth - CRITICAL: Use correct production URL
BETTER_AUTH_SECRET=Z1A0Fj2lifbHe9raL02CWGjZVhmt027/NlZ77hGebMQ=
BETTER_AUTH_URL=https://todo-app-hackathon-ii.vercel.app
DATABASE_URL=file:auth.db

# JWT Private Key (copy from your local .env.local - including quotes and \n)
JWT_PRIVATE_KEY=<your-jwt-private-key-here>

# Google OAuth (copy from your local .env.local)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Facebook OAuth (copy from your local .env.local)
FACEBOOK_APP_ID=<your-facebook-app-id>
FACEBOOK_APP_SECRET=<your-facebook-app-secret>

# App URL - CRITICAL: Use correct production URL
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-ii.vercel.app
```

**Important Notes:**
- Set environment for: **Production**, **Preview**, and **Development**
- After updating, trigger a new deployment (or push a commit)

---

### Step 2: Update Hugging Face Space Environment Variables

Go to your Hugging Face Space settings:
https://huggingface.co/spaces/syedsaudali/todo-backend-api/settings

**Update this environment variable:**

```bash
CORS_ORIGINS=https://todo-app-hackathon-ii.vercel.app
```

**After updating:**
- Click "Restart Space" to apply changes
- Wait for the space to rebuild (2-3 minutes)

---

### Step 3: Update OAuth Redirect URLs

#### 3a. Google OAuth Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/google
   ```
4. **Remove** the old URL:
   ```
   https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app/api/auth/callback/google
   ```
5. Click **Save**

#### 3b. Facebook Developer Console

1. Go to: https://developers.facebook.com/apps (select your app)
2. Navigate to: **Facebook Login** → **Settings**
3. Under **Valid OAuth Redirect URIs**, add:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/facebook
   ```
4. **Remove** the old URL:
   ```
   https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app/api/auth/callback/facebook
   ```
5. Click **Save Changes**

---

## 🧪 Testing & Verification

After completing all 3 steps, test the following:

### 1. Email/Password Authentication
```
URL: https://todo-app-hackathon-ii.vercel.app/login
```
- ✅ Sign up with new email should work
- ✅ Login with existing credentials should work
- ✅ No "Invalid origin" errors
- ✅ No "Failed to fetch" errors

### 2. Google OAuth
```
URL: https://todo-app-hackathon-ii.vercel.app/login
```
- ✅ Click "Sign in with Google"
- ✅ Should redirect to Google login
- ✅ After authentication, should redirect back to dashboard
- ✅ User should be logged in

### 3. Facebook OAuth
```
URL: https://todo-app-hackathon-ii.vercel.app/login
```
- ✅ Click "Sign in with Facebook"
- ✅ Should redirect to Facebook login
- ✅ After authentication, should redirect back to dashboard
- ✅ User should be logged in

### 4. API Communication
Open browser DevTools (F12) → Network tab:
- ✅ API calls should go to: `https://syedsaudali-todo-backend-api.hf.space/api/v1/...`
- ✅ No CORS errors
- ✅ Requests should return 200 OK (or appropriate status codes)

### 5. Session Persistence
- ✅ Refresh the page → should remain logged in
- ✅ Close and reopen browser → should remain logged in (within 7 days)
- ✅ Todos should load correctly

---

## 🔍 Troubleshooting

### Still seeing "Invalid origin" error?

**Check:**
1. Verify `BETTER_AUTH_URL` in Vercel matches exactly: `https://todo-app-hackathon-ii.vercel.app`
2. Ensure you triggered a new deployment after updating environment variables
3. Clear browser cache and cookies
4. Try in incognito/private browsing mode

**Debug:**
```bash
# Check Vercel deployment logs
vercel logs <deployment-url>
```

### Still seeing "Failed to fetch" error?

**Check:**
1. Verify backend is running: https://syedsaudali-todo-backend-api.hf.space/
2. Check CORS configuration on Hugging Face Space
3. Verify `CORS_ORIGINS` includes: `https://todo-app-hackathon-ii.vercel.app`
4. Ensure Hugging Face Space has been restarted after env var changes

**Debug:**
```bash
# Test backend health
curl https://syedsaudali-todo-backend-api.hf.space/api/v1/health
```

### OAuth not working?

**Check:**
1. Verify redirect URLs in Google/Facebook consoles match exactly
2. No trailing slashes in redirect URLs
3. OAuth credentials are set in Vercel environment variables
4. Try revoking app access and re-authenticating

**Debug:**
- Check browser console for redirect errors
- Verify OAuth callback URL in network tab

### JWT Token Issues?

**Check:**
1. `JWT_PRIVATE_KEY` is set in Vercel (with escaped newlines `\n`)
2. `JWT_PUBLIC_KEY` is set in Hugging Face Space
3. Keys are properly formatted PEM strings
4. Keys match (public key derived from private key)

**Debug:**
```bash
# Verify JWT token structure
# In browser console after login:
console.log(document.cookie)
```

---

## 📋 Deployment Checklist

- [ ] Updated Vercel environment variables
- [ ] Triggered new Vercel deployment
- [ ] Updated Hugging Face Space environment variables
- [ ] Restarted Hugging Face Space
- [ ] Updated Google OAuth redirect URLs
- [ ] Updated Facebook OAuth redirect URLs
- [ ] Tested email/password login
- [ ] Tested Google OAuth
- [ ] Tested Facebook OAuth
- [ ] Verified API calls work
- [ ] Verified session persistence
- [ ] Checked browser console for errors
- [ ] Tested in incognito mode

---

## 🎉 Expected Result

After completing all steps:
- ✅ Email sign-up/login works without errors
- ✅ Google OAuth works seamlessly
- ✅ Facebook OAuth works seamlessly
- ✅ API calls succeed without CORS errors
- ✅ Sessions persist across page refreshes
- ✅ No "Invalid origin" errors
- ✅ No "Failed to fetch" errors

---

## 📝 Technical Details

### Why This Happened

Vercel generates multiple URLs for deployments:
- **Production URL**: `https://todo-app-hackathon-ii.vercel.app` (custom/project domain)
- **Preview URLs**: `https://todo-app-hackathon-ii-<hash>.vercel.app` (per-deployment)
- **Legacy URLs**: `https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app`

Better Auth validates requests against the configured `BETTER_AUTH_URL`. When requests come from a different origin, it rejects them with "Invalid origin" error.

### Security Implications

- Better Auth's origin validation is a security feature (prevents CSRF attacks)
- CORS configuration on backend prevents unauthorized cross-origin requests
- OAuth redirect URL validation prevents token theft

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (https://todo-app-hackathon-ii.vercel.app)        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─► Better Auth (Cookie-based sessions)
                 │   - Email/Password authentication
                 │   - OAuth (Google, Facebook)
                 │   - Session management
                 │
                 └─► FastAPI Backend (https://syedsaudali-todo-backend-api.hf.space)
                     - JWT validation (RS256)
                     - Todo CRUD operations
                     - PostgreSQL database
```

---

## 🆘 Need Help?

If you're still experiencing issues after following this guide:

1. Check Vercel deployment logs
2. Check Hugging Face Space logs
3. Check browser console for detailed error messages
4. Verify all environment variables are set correctly
5. Ensure all services have been restarted/redeployed

**Common mistakes:**
- Forgetting to redeploy after updating environment variables
- Typos in URLs (trailing slashes, http vs https)
- Not restarting Hugging Face Space after env var changes
- OAuth redirect URLs don't match exactly
