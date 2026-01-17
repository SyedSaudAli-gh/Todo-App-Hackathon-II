# Signin Diagnostic Guide

## Current Status

✅ **API Test:** Signin endpoint works correctly (Status 200)
✅ **Password System:** Hashing and comparison working
❓ **User's Issue:** Need to identify exact failure point

---

## Step-by-Step Diagnosis

### Step 1: Identify Which Page You're Using

**Question:** When you try to sign in, what URL are you on?

- **Option A:** `http://localhost:3000/login` (New landing page)
- **Option B:** Different URL?

### Step 2: Open Browser Developer Tools

1. Press `F12` or right-click → "Inspect"
2. Go to **Console** tab
3. Go to **Network** tab
4. Keep both tabs open

### Step 3: Attempt Signin

1. Enter your email and password
2. Click "Sign In"
3. **Watch the Console tab** - any red errors?
4. **Watch the Network tab** - look for requests

### Step 4: Check Network Request

In the Network tab, find the request to `/api/auth/sign-in/email`:

**Click on it and check:**

1. **Status Code:**
   - 200 = Success (but you're not being redirected?)
   - 400 = Bad request (check response)
   - 401 = Invalid credentials
   - 500 = Server error

2. **Request Payload:**
   - Click "Payload" or "Request" tab
   - Should show: `{ "email": "...", "password": "..." }`
   - Is the email correct?

3. **Response:**
   - Click "Response" tab
   - What does it say?
   - Copy the full response here

### Step 5: Check Cookies

1. In dev tools, go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Click **Cookies** → `http://localhost:3000`
3. Look for: `better-auth.session_token`

**Questions:**
- Does this cookie exist?
- What's its value?
- Does it have an expiration date?

---

## Common Issues & Solutions

### Issue 1: Email Case Sensitivity

**Problem:** Signed up with `User@Example.com`, trying to sign in with `user@example.com`

**Solution:**
- Better Auth normalizes emails to lowercase
- Try signing in with lowercase email

**Test:**
```bash
cd web
node -e "const Database = require('better-sqlite3'); const db = new Database('auth.db'); const users = db.prepare('SELECT email FROM user').all(); console.log(users);"
```

Check the exact email format in the database.

### Issue 2: Wrong Password

**Problem:** Password is incorrect

**Solution:**
- Double-check password
- Try resetting or creating a new test account

**Create new test account:**
1. Go to `/signup`
2. Use: `testuser@example.com` / `testpass123` / "Test User"
3. Then try signing in with same credentials

### Issue 3: Session Cookie Not Set

**Problem:** API returns 200 but cookie isn't set

**Check:**
1. Response headers in Network tab
2. Look for `Set-Cookie` header
3. Should contain `better-auth.session_token`

**If missing:**
- CORS issue
- Cookie settings issue
- Browser blocking third-party cookies

### Issue 4: Redirect Not Working

**Problem:** Signin succeeds but doesn't redirect to dashboard

**Check:**
- Console for JavaScript errors
- Is `router.push("/dashboard")` being called?
- Add console.log to verify:

Open `web/src/app/login/page.tsx` and add logging:
```typescript
if (!response.ok) {
  const errorData = await response.json();
  console.log("Signin failed:", errorData);
  throw new Error(errorData.message || "Sign in failed");
}

console.log("Signin successful, redirecting...");
// Success - redirect to dashboard
router.push("/dashboard");
```

---

## Quick Test Script

Run this to test signin with a known user:

```bash
cd web
node test-signin-issue.js
```

**If this succeeds but browser fails:**
- Issue is in browser/frontend
- Check cookies, CORS, JavaScript errors

**If this also fails:**
- Issue is in API/backend
- Check server logs
- Check database

---

## Manual Test with cURL

Test the API directly:

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test-1768643316723@example.com","password":"testpass123"}' \
  -v
```

**Expected:** Status 200 with user data and Set-Cookie header

---

## What to Report

Please provide:

1. **URL you're using:** (e.g., http://localhost:3000/login)

2. **Exact error message:** (screenshot or copy-paste)

3. **Browser console errors:** (screenshot or copy-paste)

4. **Network request details:**
   - Status code
   - Request payload
   - Response body

5. **Cookies:**
   - Does `better-auth.session_token` exist?

6. **Test results:**
   - Does `node test-signin-issue.js` succeed?
   - Does the cURL command succeed?

With this information, I can identify the exact issue and provide a targeted fix.
