# Authentication Setup Guide

This guide will help you set up authentication for both local development and Vercel deployment.

## Quick Start (Local Development)

### 1. Generate JWT Key Pair

**Option A: Using OpenSSL (Recommended)**

```bash
# Navigate to web directory
cd web

# Generate private key
openssl genrsa -out private_key.pem 2048

# Generate public key (for backend)
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Convert private key to single-line format for .env
# On Windows PowerShell:
$key = Get-Content private_key.pem -Raw
$key = $key -replace "`r`n", "\n" -replace "`n", "\n"
Write-Output $key

# On Linux/Mac:
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private_key.pem
```

**Option B: Using Node.js**

```bash
node -e "const crypto = require('crypto'); const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } }); console.log('Private Key:\n', privateKey.replace(/\n/g, '\\n')); console.log('\nPublic Key:\n', publicKey);"
```

### 2. Configure Environment Variables

Create or update `web/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_API_VERSION=v1

# Better Auth (Required)
BETTER_AUTH_SECRET=CEmalrWsEs9eVOOKoe04G93Bf1zp8e8/D8rVho5E/Iw=
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=file:auth.db

# JWT Configuration (Required for backend API calls)
# Paste the single-line private key from step 1
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (Optional)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Share Public Key with Backend

Copy `public_key.pem` to your FastAPI backend for JWT verification.

### 4. Start Development Server

```bash
npm run dev
```

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add Facebook Login product
4. Settings → Basic:
   - Copy App ID and App Secret to `.env.local`
5. Facebook Login → Settings:
   - Valid OAuth Redirect URIs:
     - Local: `http://localhost:3000/api/auth/callback/facebook`
     - Production: `https://yourdomain.com/api/auth/callback/facebook`

## Vercel Deployment

### 1. Prepare Environment Variables

Convert your private key to single-line format (see step 1 above).

### 2. Add Environment Variables to Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-api.com` | Production, Preview, Development |
| `NEXT_PUBLIC_API_VERSION` | `v1` | Production, Preview, Development |
| `BETTER_AUTH_SECRET` | Generate with `openssl rand -base64 32` | Production, Preview, Development |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` | Production, Preview, Development |
| `JWT_PRIVATE_KEY` | Single-line private key | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | Your Google Client ID | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret | Production, Preview, Development |
| `FACEBOOK_APP_ID` | Your Facebook App ID | Production, Preview, Development |
| `FACEBOOK_APP_SECRET` | Your Facebook App Secret | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production, Preview, Development |

### 3. Update OAuth Redirect URIs

Update your OAuth provider settings with production URLs:
- Google: Add `https://your-app.vercel.app/api/auth/callback/google`
- Facebook: Add `https://your-app.vercel.app/api/auth/callback/facebook`

### 4. Deploy

```bash
git push origin main
```

Vercel will automatically deploy.

## Testing Authentication

### Test Email/Password Login

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign Up"
4. Enter email, name, and password (min 8 characters)
5. Click "Create Account"
6. Should redirect to dashboard with session

### Test OAuth Login

1. Click "Sign in with Google" or "Sign in with Facebook"
2. Complete OAuth flow
3. Should redirect to dashboard with session

### Test JWT Token Generation

1. After logging in, open browser console
2. Run: `fetch('/api/token', { credentials: 'include' }).then(r => r.json()).then(console.log)`
3. Should return JWT token with user info

## Troubleshooting

### "JWT_PRIVATE_KEY environment variable is not set"

**Cause**: Missing JWT_PRIVATE_KEY in environment variables.

**Solution**:
- Generate key pair (see step 1)
- Add to `.env.local` for local dev
- Add to Vercel environment variables for production

### "OAuth callback error"

**Cause**: Redirect URI mismatch.

**Solution**:
- Verify redirect URIs in OAuth provider settings match exactly
- Format: `http://localhost:3000/api/auth/callback/{provider}`
- No trailing slashes

### "Database locked" error

**Cause**: SQLite database file locked by another process.

**Solution**:
```bash
# Stop dev server
# Delete auth.db
rm auth.db
# Restart dev server
npm run dev
```

### "Session not found" after login

**Cause**: Cookie not being set properly.

**Solution**:
- Check `BETTER_AUTH_URL` matches your current URL
- Ensure no CORS issues
- Check browser console for cookie errors

### Build fails on Vercel

**Cause**: Missing environment variables during build.

**Solution**:
- Ensure all required env vars are set in Vercel
- Check build logs for specific missing variables
- Redeploy after adding variables

## Security Best Practices

1. **Never commit secrets to git**
   - `private_key.pem` is in `.gitignore`
   - Never commit `.env.local`

2. **Rotate keys regularly**
   - Generate new JWT key pair every 90 days
   - Update both frontend and backend

3. **Use strong secrets**
   - Generate `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`
   - Never use default or weak secrets

4. **Secure OAuth credentials**
   - Keep Client Secrets private
   - Use environment variables only
   - Rotate if compromised

5. **HTTPS in production**
   - Always use HTTPS for OAuth callbacks
   - Vercel provides HTTPS by default

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User Login/Signup                                        │
│     ↓                                                         │
│  2. Better Auth (Cookie-based session)                       │
│     ↓                                                         │
│  3. Session stored in SQLite (auth.db)                       │
│     ↓                                                         │
│  4. Frontend calls /api/token                                │
│     ↓                                                         │
│  5. JWT generated with RS256 (private key)                   │
│     ↓                                                         │
│  6. JWT sent to backend API                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  7. Verify JWT with RS256 (public key)                       │
│     ↓                                                         │
│  8. Extract user ID from 'sub' claim                         │
│     ↓                                                         │
│  9. Process API request                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Points

- **Better Auth** handles login/signup and session management (cookies)
- **JWT tokens** are only used for backend API authentication
- **OAuth** is optional but recommended for better UX
- **Private key** stays in frontend, **public key** goes to backend
- **Environment variables** are the only way to store secrets (no files)
