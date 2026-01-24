# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Production build tested locally (`npm run build`)
- [x] PostgreSQL database configured (Supabase)
- [x] Better Auth migrated from SQLite to PostgreSQL
- [x] Changes committed and pushed to GitHub
- [x] Local authentication tested and working

## 🚀 Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `SyedSaudAli-gh/Todo-App-Hackathon-II`
4. Select the `web` directory as the root directory
5. Framework Preset: **Next.js** (auto-detected)

### 2. Configure Environment Variables

In Vercel Project Settings → Environment Variables, add the following:

#### Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://syedsaudali-todo-backend-api.hf.space
NEXT_PUBLIC_API_VERSION=v1

# Better Auth Configuration
BETTER_AUTH_SECRET=Z1A0Fj2lifbHe9raL02CWGjZVhmt027/NlZ77hGebMQ=
BETTER_AUTH_URL=https://todo-app-hackathon-ii.vercel.app
DATABASE_URL=postgresql://postgres:syed242821%25@db.faixxdifbqxallkxlydd.supabase.co:5432/postgres

# JWT Private Key (RS256) - Base64 encoded
JWT_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRRGtBMzVlenNybngrUTEKZlJJcjJRUzNMT2dRUkN5aDUwam5IaGRuQ0lvZGlrZjZMMnc2OVFacTRnUzdrOVdqOVdhNnNIQnBQTnZiUVRGeQppMzVVcnZVKzYrQThEb2pjTlVacFRES3pxdXZTU3RyckQzZkFMbVFVWkpzdFVyZ3dTUkNDbGs1V1J6U2hUS2J2ClAwbm9rcW4rZjJHWTlGbGpmcHROdUNZVjJSMVh3b3lHdUYraEc3bDlnZFhYZFpIMkRITmpienA1a3Jvb0lEaWUKdnN2MGFCc284SUFHM1c3bElaL2VZWlRzbVF3ZHh0aUI1TmdOOHRlTi9zanBtZ1VETmorcVQrS1BXRWJteG9sNgpySDd4UC9tUFRUVWhrWTlKeVVpZWxaMWVXT3ZIWGsxdXN4b2daaDZBeFlqS2pKdFFtSERZbXN0UmtpNHBtd2NUCjA1VVg5MFh4QWdNQkFBRUNnZ0VBQXZSdklxNGt4OEVVYjdqWS80KzM4dUkrZUhoK1hoT1dnMC9sanlpaU5wSUoKcEZWbWs3TXV3K1k5Z3JYejhnUnovTkJ5SFNaWnRkM2luM05YNktQSVNwVHBYVFNMTGo4SlZGa1ZacDg4OVZ3OAo1RWlENkNOZkdXVzQza0JlVEpvNUlDekZEak5DY2JmWE5DT1gzYVNwNitJQ3l5WHVmY2sySE1QdThyL3pWRnFWCjJkRG9TbElQeWpFV3FXMjBybEtMM0Y3UWJYQi9nU3pGTDNlb0V1dmJSZHlubGNLYUExUVVPMDBTQzJrTk5LNUEKUjMvQ21LYmdNOG5wSzlOMTlsT09VRmdQUFVQclVLQ3NpOU5SUWtleUFzMlc2T2NHQ0dseUNCREdEKy9TRHB4SApBaVB4MWRXSnRvMUJLQnJ6bmNaNVVJc21xRXpCcXJoU2hkblBpM3lXeVFLQmdRRHhuQzRFdHNqd21tVDZqOUo5ClVRbFJxWU5xdmM3WkVCWU84RlZPbUJvTnM3Z0F5ZE5IMVBOMTNXd2tSVXFJVXR5UGNoUkpXdlZwQ0RoL3llT1UKUE0wdWdOSkNPSTRsOFZad1dKTUl5TFgrRVFhak5ncjAyVUkxVXg4cUs0VHVyVkVFU2tSc1o3cjBzTlFWR2NMYgpteUtLSVpnYUJrQ3lyRnpwTXpwMmlxb2pDUUtCZ1FEeG1BSjBYaFFhejhoYzRFTWJFUWZaWHZ6cVpXcC9hcmxQCkxOSVpCa1NzeFp4VjkvR2tYWHM1T1d4TW9FdHRoNjlIeXhDUnlrdlZsaHIvdDdmUGdBSlFOQVFkQWMxT3BncEcKdVd0cGNhTHMvTTZ0QUM1ZUJkUXJoTXJzbkVaeDgyNWZWYWVSWGF6NFlFL0pRMC9raWtxaHZ0aHVuai9ZcVo1WgpnZ0FBR3lVOXFRS0JnUURkUjBMR1FubXFFbDFsTlk5OEFsbmNscm1yYXdja3VaemFOYmFMY3JaNTBoMDFhNks3CmFRZEk3Vy83a0JLQTVCTG90WHhxNm9sVWxwallRSmpUelJQR0FXbVFDS2YzakI2MGFnclB3ck1iYTVCK3JpSSsKdVRQd0RwNitTbmxHOXlqNkd1S3J2aHoxdVhXamxhSm02cUFwampiMXJzQldZNUg4YWxTaStNQjFzUUtCZ0RwNwordlFpcGlsTGJZeVdPWWgrMmZDVUh4TzdFMG5mRXhjSW1aKzNOYjdCWTdRbi9wWTBqeFR1UXJwVi80eDNVVVpHCjhTN3AwdXZVbDVxWjVlUlViN3JzcktZOC9tOXdvSUk0ZHJraTZqY0dpQjIzTW9KT1ZPdG9EUnUwUlJWbXdheFEKZHUwb3lTdWpYUTB5djA5cTd1QXk2Ly96VFM5cytFbGd3QkZHZ1FCcEFvR0FHcWNUS0JSVEI1T01LTzNNOG4yNwpyME5mQTlReFZ5elpNMzJpTkc0L0tuRTFvRWxQQ044TmMyQkN0aGNMSEFreStJUlQ1WXZKTjUwc05RUEV0bkNZCnRGcjRPZ1I4UXJHYStzYUJXME9WRjZQQ1BRWFhWT0dlKzM5NGpZRWlqZkE4Z3dKZUZUU0ZoWWdJZSsrbm04R28KNnY1V2RsdlFwWFVXbjhkNWVqemh2clE9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K

# Google OAuth (Optional - if using Google login)
GOOGLE_CLIENT_ID=your-google-client-id-from-google-cloud-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-google-cloud-console

# Facebook OAuth (Optional - if using Facebook login)
FACEBOOK_APP_ID=your-facebook-app-id-from-facebook-developers
FACEBOOK_APP_SECRET=your-facebook-app-secret-from-facebook-developers

# App URL
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-ii.vercel.app
```

**Important Notes:**
- Set these variables for **Production**, **Preview**, and **Development** environments
- The `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` should match your Vercel deployment URL
- If your Vercel URL is different, update these two variables accordingly

### 3. Configure OAuth Redirect URIs (If Using Social Login)

#### Google OAuth Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add Authorized redirect URI:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/google
   ```

#### Facebook App Dashboard
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Navigate to Facebook Login → Settings
4. Add Valid OAuth Redirect URI:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/facebook
   ```

### 4. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete (should take 2-3 minutes)
3. Vercel will automatically deploy to your production URL

## 🧪 Post-Deployment Testing

### Test Authentication Flow

1. **Visit your production URL**: https://todo-app-hackathon-ii.vercel.app

2. **Test Signup**:
   - Navigate to `/signup`
   - Create a new account with email/password
   - Verify successful registration and redirect to dashboard

3. **Test Login**:
   - Navigate to `/login`
   - Login with the created credentials
   - Verify successful authentication

4. **Test OAuth (if configured)**:
   - Click "Sign in with Google" or "Sign in with Facebook"
   - Complete OAuth flow
   - Verify successful authentication

5. **Test Session Persistence**:
   - Refresh the page
   - Verify you remain logged in
   - Navigate between pages
   - Verify session is maintained

### Verify Database Connection

Check Vercel deployment logs for:
```
✓ JWT_PRIVATE_KEY loaded
Environment variables check:
  DATABASE_URL: ✓
  BETTER_AUTH_SECRET: ✓
  JWT_PRIVATE_KEY: ✓
  NEXT_PUBLIC_APP_URL: ✓
```

## 🔍 Troubleshooting

### Issue: "Invalid origin" error

**Solution**: Ensure `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your Vercel deployment URL exactly.

### Issue: Database connection fails

**Solution**:
1. Verify `DATABASE_URL` is correctly set in Vercel environment variables
2. Check Supabase database is accessible from Vercel's IP ranges
3. Verify the password encoding (`%25` for `%` character)

### Issue: OAuth redirect fails

**Solution**:
1. Verify redirect URIs are configured in Google/Facebook consoles
2. Ensure they match your production URL exactly
3. Check `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc. are set correctly

### Issue: JWT signing fails

**Solution**:
1. Verify `JWT_PRIVATE_KEY` is set correctly (base64-encoded)
2. Check deployment logs for "JWT_PRIVATE_KEY loaded" message
3. Ensure no extra spaces or newlines in the environment variable

## 📊 Build Output Summary

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    43.9 kB         157 kB
├ ○ /_not-found                            997 B         103 kB
├ ƒ /api/auth/[...better-auth]             126 B         102 kB
├ ƒ /api/token                             126 B         102 kB
├ ○ /dashboard                            128 kB         255 kB
├ ○ /dashboard/profile                   8.24 kB         131 kB
├ ○ /dashboard/settings                  7.72 kB         149 kB
├ ○ /dashboard/todos                     10.5 kB         148 kB
├ ○ /login                               1.23 kB         129 kB
└ ○ /signup                                 1 kB         129 kB
```

## ✅ Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] All environment variables configured
- [ ] OAuth redirect URIs updated (if using social login)
- [ ] Deployment successful
- [ ] Signup tested and working
- [ ] Login tested and working
- [ ] Session persistence verified
- [ ] Database connection verified
- [ ] OAuth login tested (if configured)

## 🎉 Success!

Your Todo App is now deployed and ready for production use at:
**https://todo-app-hackathon-ii.vercel.app**

---

**Last Updated**: 2026-01-24
**Build Status**: ✅ Production Ready
**Database**: PostgreSQL (Supabase)
**Auth Provider**: Better Auth v1.4.17
