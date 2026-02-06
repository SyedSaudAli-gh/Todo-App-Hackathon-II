# Vercel + Hugging Face Deployment Guide

## 🚀 Quick Setup

### Step 1: Deploy Backend to Hugging Face Spaces

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Create a new Space (select "Docker" or "Python")
3. Push your `api/` directory to the Space
4. Set the following **Environment Variables** in Space Settings:

```bash
# Required
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_PUBLIC_KEY=<your-rsa-public-key-pem-format>
JWT_ALGORITHM=RS256

# AI Agent (choose one)
OPENAI_API_KEY=sk-...                    # Recommended
# OR
OPENROUTER_API_KEY=sk-or-...

# Optional
DEBUG=false
API_VERSION=v1
CORS_ORIGINS=http://localhost:3000       # Regex in code handles Vercel
```

5. Note your Space URL: `https://your-username-your-space.hf.space`

---

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Set **Root Directory** to `web`
4. Set the following **Environment Variables**:

#### ✅ Required Environment Variables

```bash
# Backend API URLs (CRITICAL - use your Hugging Face Space URL)
NEXT_PUBLIC_API_BASE_URL=https://your-username-your-space.hf.space/api/v1
NEXT_PUBLIC_API_URL=https://your-username-your-space.hf.space
NEXT_PUBLIC_API_VERSION=v1

# Better Auth Configuration
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
BETTER_AUTH_URL=https://your-app.vercel.app
DATABASE_URL=postgresql://user:password@host:5432/dbname

# App URL (your Vercel deployment URL)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# OAuth (if using social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

#### 🔑 Critical Notes:

1. **NEXT_PUBLIC_API_BASE_URL** must include `/api/v1` at the end
2. **NEXT_PUBLIC_API_URL** must NOT include `/api/v1`
3. All `NEXT_PUBLIC_*` variables are exposed to the browser
4. **BETTER_AUTH_URL** must match your actual Vercel domain
5. Use the same **DATABASE_URL** for both frontend and backend

---

## 🔍 Verification Checklist

### Backend (Hugging Face)

1. ✅ Space is running (green status)
2. ✅ Visit: `https://your-space.hf.space/api/v1/docs`
3. ✅ Should see Swagger UI with API documentation
4. ✅ Test health endpoint: `https://your-space.hf.space/api/v1/health`

### Frontend (Vercel)

1. ✅ Deployment succeeded (no build errors)
2. ✅ Open browser DevTools → Console
3. ✅ Visit your Vercel URL
4. ✅ Check for CORS errors (should be NONE)
5. ✅ Check API calls in Network tab

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error in Browser Console

**Error:**
```
Access to fetch at 'https://your-space.hf.space/api/v1/tasks' from origin 'https://your-app.vercel.app'
has been blocked by CORS policy
```

**Solution:**
- Backend CORS is configured to allow all `*.vercel.app` domains automatically
- If still blocked, add your specific domain to `CORS_ORIGINS` in Hugging Face:
  ```bash
  CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
  ```

---

### Issue 2: 404 Not Found on API Calls

**Error:**
```
GET https://your-space.hf.space/api/v1/tasks 404 Not Found
```

**Solution:**
1. Check backend is running on Hugging Face
2. Verify API routes are registered in `main.py`
3. Test endpoint directly: `curl https://your-space.hf.space/api/v1/health`
4. Check Hugging Face logs for startup errors

---

### Issue 3: 401 Unauthorized

**Error:**
```
GET https://your-space.hf.space/api/v1/tasks 401 Unauthorized
```

**Solution:**
1. Verify `JWT_PUBLIC_KEY` is set correctly in Hugging Face
2. Check Better Auth is generating valid JWT tokens
3. Verify `BETTER_AUTH_SECRET` matches between frontend and backend
4. Test token in browser console:
   ```javascript
   localStorage.getItem('better-auth.session_token')
   ```

---

### Issue 4: Environment Variables Not Working

**Symptoms:**
- API calls go to `localhost:8001` instead of Hugging Face
- `process.env.NEXT_PUBLIC_API_BASE_URL` is undefined

**Solution:**
1. Verify all variables start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding environment variables (Vercel doesn't auto-redeploy)
3. Check in browser console:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
   ```
4. If undefined, go to Vercel → Project Settings → Environment Variables → Redeploy

---

### Issue 5: Chat/AI Features Not Working

**Error:**
```
An unexpected error occurred. Please try again.
```

**Solution:**
1. Check `OPENAI_API_KEY` or `OPENROUTER_API_KEY` is set in Hugging Face
2. Verify backend logs for AI agent errors
3. Test chat endpoint:
   ```bash
   curl -X POST https://your-space.hf.space/api/v1/chat \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```

---

## 🧪 Testing Integration

### Test 1: Health Check
```bash
curl https://your-space.hf.space/api/v1/health
```
Expected: `{"status": "healthy"}`

### Test 2: Todos API (requires auth)
```bash
curl https://your-space.hf.space/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
Expected: `{"todos": [], "total": 0}`

### Test 3: Chat API (requires auth)
```bash
curl -X POST https://your-space.hf.space/api/v1/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "List my tasks"}'
```
Expected: JSON response with AI message

### Test 4: Frontend → Backend
1. Open your Vercel app
2. Open DevTools → Network tab
3. Try to fetch todos
4. Check request URL matches your Hugging Face Space
5. Check response status (should be 200 or 401, NOT 404 or CORS error)

---

## 📋 Environment Variables Reference

### Frontend (Vercel)

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://user-space.hf.space/api/v1` | ✅ Yes | Must include `/api/v1` |
| `NEXT_PUBLIC_API_URL` | `https://user-space.hf.space` | ✅ Yes | No `/api/v1` suffix |
| `NEXT_PUBLIC_API_VERSION` | `v1` | ✅ Yes | API version |
| `BETTER_AUTH_SECRET` | `<random-32-char-string>` | ✅ Yes | Generate with openssl |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` | ✅ Yes | Your Vercel domain |
| `DATABASE_URL` | `postgresql://...` | ✅ Yes | Postgres connection |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | ✅ Yes | Your Vercel domain |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | ❌ No | For OAuth |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | ❌ No | For OAuth |

### Backend (Hugging Face)

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| `DATABASE_URL` | `postgresql://...` | ✅ Yes | Postgres connection |
| `JWT_PUBLIC_KEY` | `-----BEGIN PUBLIC KEY-----...` | ✅ Yes | RSA public key (PEM) |
| `JWT_ALGORITHM` | `RS256` | ✅ Yes | JWT algorithm |
| `OPENAI_API_KEY` | `sk-proj-...` | ⚠️ One | For AI features |
| `OPENROUTER_API_KEY` | `sk-or-...` | ⚠️ One | Alternative to OpenAI |
| `DEBUG` | `false` | ❌ No | Enable debug logs |
| `API_VERSION` | `v1` | ❌ No | API version |
| `CORS_ORIGINS` | `http://localhost:3000` | ❌ No | Regex handles Vercel |

---

## 🎯 Success Criteria

After deployment, you should be able to:

✅ Visit Vercel app and see login page
✅ Login with credentials
✅ See todos list (empty or with data)
✅ Create a new todo
✅ Open AI chat and send a message
✅ Receive AI response
✅ No CORS errors in browser console
✅ No 404 errors in Network tab

---

## 🆘 Still Having Issues?

1. Check Hugging Face Space logs for backend errors
2. Check Vercel deployment logs for build errors
3. Check browser DevTools Console for frontend errors
4. Verify all environment variables are set correctly
5. Try redeploying both frontend and backend

**Common mistake:** Forgetting to redeploy Vercel after adding environment variables!
