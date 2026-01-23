# Deployment Configuration Fixes

## Summary
Fixed authentication errors on Vercel deployment by updating all localhost references to production URLs.

## Changes Made

### 1. Frontend Configuration (`web/.env.local`)
Updated the following environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: `https://syedsaudali-todo-backend-api.hf.space`
- `BETTER_AUTH_URL`: `https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app`
- `NEXT_PUBLIC_APP_URL`: `https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app`

### 2. Backend Configuration (`api/.env`)
Updated CORS origins:
- `CORS_ORIGINS`: `https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app`

### 3. Backend Code (`api/src/main.py`)
Fixed hardcoded CORS origins to use environment variable:
- Changed from: `allow_origins=["http://localhost:3000"]`
- Changed to: `allow_origins=settings.cors_origins_list`

## Required Actions

### 1. Update Vercel Environment Variables
You must add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_API_BASE_URL=https://syedsaudali-todo-backend-api.hf.space
NEXT_PUBLIC_API_VERSION=v1
BETTER_AUTH_SECRET=<your-better-auth-secret>
BETTER_AUTH_URL=https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app
DATABASE_URL=file:auth.db
JWT_PRIVATE_KEY=<your-jwt-private-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FACEBOOK_APP_ID=<your-facebook-app-id>
FACEBOOK_APP_SECRET=<your-facebook-app-secret>
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app
```

**Important:** Copy the `JWT_PRIVATE_KEY` value from your local `.env.local` file (including the quotes and escaped newlines).

### 2. Update Hugging Face Environment Variables
Update the following in your Hugging Face Space settings:

```
CORS_ORIGINS=https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app
```

### 3. Configure OAuth Redirect URLs

#### Google OAuth Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add the following to **Authorized redirect URIs**:
   ```
   https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app/api/auth/callback/google
   ```

#### Facebook Developer Console
1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Select your app
3. Go to **Facebook Login** → **Settings**
4. Add the following to **Valid OAuth Redirect URIs**:
   ```
   https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app/api/auth/callback/facebook
   ```

### 4. Redeploy
After updating environment variables:
1. **Vercel**: Trigger a new deployment (or it will auto-deploy on next push)
2. **Hugging Face**: Restart your Space to apply the new CORS configuration

## Verification Steps

After redeployment, test the following:

1. **Email/Password Login**
   - Navigate to: `https://todo-app-hackathon-9pgjbsgqq-syedsaudali-ghs-projects.vercel.app/login`
   - Try logging in with email/password
   - Should not see "Failed to fetch" or "Invalid origin" errors

2. **Google OAuth**
   - Click "Sign in with Google"
   - Should redirect to Google login
   - After authentication, should redirect back to your app

3. **Facebook OAuth**
   - Click "Sign in with Facebook"
   - Should redirect to Facebook login
   - After authentication, should redirect back to your app

4. **API Calls**
   - After login, check browser console
   - API calls should go to: `https://syedsaudali-todo-backend-api.hf.space/api/...`
   - Should not see CORS errors

5. **Session Persistence**
   - Refresh the page
   - Should remain logged in
   - Todos should load correctly

## Common Issues

### "Invalid origin" Error
- Verify `BETTER_AUTH_URL` matches your Vercel deployment URL exactly
- Check that CORS is configured correctly on backend

### "Failed to fetch" Error
- Verify `NEXT_PUBLIC_API_BASE_URL` points to your Hugging Face backend
- Check that backend is running and accessible
- Verify CORS origins on backend include your Vercel URL

### OAuth Not Working
- Verify redirect URLs are configured in Google/Facebook consoles
- Check that OAuth credentials are set in Vercel environment variables
- Ensure redirect URLs match exactly (no trailing slashes)

### JWT Token Issues
- Verify `JWT_PRIVATE_KEY` is set correctly in Vercel (with escaped newlines)
- Check that backend has the matching `JWT_PUBLIC_KEY`

## Notes

- The local `.env.local` files have been updated but these changes only affect local development
- Production environment variables must be set in Vercel and Hugging Face separately
- After changing environment variables, always redeploy to apply changes
