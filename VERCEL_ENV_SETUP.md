# 🚀 Vercel Environment Variables Setup

## CRITICAL: Add these to your Vercel Project Settings → Environment Variables

### 1. Database Configuration (REQUIRED)
```bash
# Replace with your actual Supabase/PostgreSQL connection string
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### 2. Better Auth Configuration (REQUIRED)
```bash
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-32-character-secret-here

# Your production URL
BETTER_AUTH_URL=https://todo-app-hackathon-ii.vercel.app
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-ii.vercel.app
```

### 3. API Configuration
```bash
NEXT_PUBLIC_API_BASE_URL=https://huggingface.co/spaces/SyedSaudAli/todo-backend-api
NEXT_PUBLIC_API_VERSION=v1
```

### 4. OAuth Configuration (Google)
```bash
# From Google Cloud Console
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Enable Google OAuth in frontend
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

### 5. OAuth Configuration (Facebook)
```bash
# From Facebook Developers Console
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Enable Facebook OAuth in frontend
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

### 6. JWT Configuration (Optional - for API auth)
```bash
# Generate RSA private key and convert to base64
JWT_PRIVATE_KEY=your-base64-encoded-rsa-private-key
```

## 🔧 OAuth Redirect URLs Setup

### Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to APIs & Services → Credentials
4. Edit your OAuth 2.0 Client ID
5. Add to "Authorized redirect URIs":
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/google
   ```

### Facebook Developers Console
1. Go to https://developers.facebook.com/
2. Select your app
3. Go to Facebook Login → Settings
4. Add to "Valid OAuth Redirect URIs":
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/facebook
   ```

## 🗄️ Database Setup Options

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add as `DATABASE_URL` in Vercel

### Option 2: Vercel Postgres
1. In Vercel dashboard, go to Storage
2. Create new Postgres database
3. Copy connection string
4. Add as `DATABASE_URL`

### Option 3: PlanetScale
1. Go to https://planetscale.com
2. Create new database
3. Get connection string
4. Add as `DATABASE_URL`

## ✅ Verification Steps

After setting up environment variables:

1. **Redeploy your Vercel app**
2. **Test auth endpoints**:
   - `https://todo-app-hackathon-ii.vercel.app/api/auth/session`
   - Should return JSON, not empty response

3. **Test signup**:
   - Go to signup page
   - Try creating account
   - Check Vercel function logs for errors

4. **Test OAuth**:
   - Click Google/Facebook buttons
   - Should redirect to provider
   - Should redirect back to your app

## 🚨 Common Issues

1. **"Unexpected end of JSON input"** = Database connection failed
2. **OAuth "Connecting..." forever** = Wrong redirect URLs or missing secrets
3. **500 errors** = Missing environment variables
4. **CORS errors** = Wrong trusted origins in auth config

## 📋 Deployment Checklist

- [ ] Database URL configured (cloud database, not local file)
- [ ] BETTER_AUTH_SECRET set (32+ characters)
- [ ] OAuth credentials added to Vercel
- [ ] OAuth redirect URLs updated in provider consoles
- [ ] NEXT_PUBLIC_* variables set for frontend
- [ ] App redeployed after env var changes
- [ ] Auth endpoints tested and returning JSON
- [ ] Signup/login tested in production
- [ ] OAuth tested in production