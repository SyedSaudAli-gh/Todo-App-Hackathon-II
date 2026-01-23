# ✅ JWT Authentication Setup Complete

## 🎉 What Was Done

I've successfully generated and configured a new RSA key pair (RS256, 2048 bits) for JWT authentication in your Todo App.

### Changes Made:

1. **Generated New RSA Key Pair**
   - Algorithm: RS256 (RSA with SHA-256)
   - Key Size: 2048 bits
   - Format: PKCS#8 (private), SPKI (public)

2. **Updated Frontend Configuration** (`web/.env.local`)
   - Added base64-encoded private key to `JWT_PRIVATE_KEY`
   - Updated `BETTER_AUTH_URL` to production URL
   - Updated `NEXT_PUBLIC_APP_URL` to production URL

3. **Updated Backend Configuration** (`api/.env`)
   - Added matching public key to `JWT_PUBLIC_KEY`
   - Updated `CORS_ORIGINS` to production URL

4. **Updated Auth Library** (`web/src/lib/auth/auth.ts`)
   - Modified to decode base64-encoded private key
   - Added proper error handling for key decoding

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### Step 1: Update Vercel Environment Variables (CRITICAL)

Go to: https://vercel.com/syedsaudali-ghs-projects/todo-app-hackathon-ii/settings/environment-variables

**Add/Update these variables:**

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=Z1A0Fj2lifbHe9raL02CWGjZVhmt027/NlZ77hGebMQ=
BETTER_AUTH_URL=https://todo-app-hackathon-ii.vercel.app
DATABASE_URL=file:auth.db

# JWT Private Key - Base64 Encoded (COPY EXACTLY AS SHOWN)
JWT_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRRGtBMzVlenNybngrUTEKZlJJcjJRUzNMT2dRUkN5aDUwam5IaGRuQ0lvZGlrZjZMMnc2OVFacTRnUzdrOVdqOVdhNnNIQnBQTnZiUVRGeQppMzVVcnZVKzYrQThEb2pjTlVacFRES3pxdXZTU3RyckQzZkFMbVFVWkpzdFVyZ3dTUkNDbGs1V1J6U2hUS2J2ClAwbm9rcW4rZjJHWTlGbGpmcHROdUNZVjJSMVh3b3lHdUYraEc3bDlnZFhYZFpIMkRITmpienA1a3Jvb0lEaWUKdnN2MGFCc284SUFHM1c3bElaL2VZWlRzbVF3ZHh0aUI1TmdOOHRlTi9zanBtZ1VETmorcVQrS1BXRWJteG9sNgpySDd4UC9tUFRUVWhrWTlKeVVpZWxaMWVXT3ZIWGsxdXN4b2daaDZBeFlqS2pKdFFtSERZbXN0UmtpNHBtd2NUCjA1VVg5MFh4QWdNQkFBRUNnZ0VBQXZSdklxNGt4OEVVYjdqWS80KzM4dUkrZUhoK1hoT1dnMC9sanlpaU5wSUoKcEZWbWs3TXV3K1k5Z3JYejhnUnovTkJ5SFNaWnRkM2luM05YNktQSVNwVHBYVFNMTGo4SlZGa1ZacDg4OVZ3OAo1RWlENkNOZkdXVzQza0JlVEpvNUlDekZEak5DY2JmWE5DT1gzYVNwNitJQ3l5WHVmY2sySE1QdThyL3pWRnFWCjJkRG9TbElQeWpFV3FXMjBybEtMM0Y3UWJYQi9nU3pGTDNlb0V1dmJSZHlubGNLYUExUVVPMDBTQzJrTk5LNUEKUjMvQ21LYmdNOG5wSzlOMTlsT09VRmdQUFVQclVLQ3NpOU5SUWtleUFzMlc2T2NHQ0dseUNCREdEKy9TRHB4SApBaVB4MWRXSnRvMUJLQnJ6bmNaNVVJc21xRXpCcXJoU2hkblBpM3lXeVFLQmdRRHhuQzRFdHNqd21tVDZqOUo5ClVRbFJxWU5xdmM3WkVCWU84RlZPbUJvTnM3Z0F5ZE5IMVBOMTNXd2tSVXFJVXR5UGNoUkpXdlZwQ0RoL3llT1UKUE0wdWdOSkNPSTRsOFZad1dKTUl5TFgrRVFhak5ncjAyVUkxVXg4cUs0VHVyVkVFU2tSc1o3cjBzTlFWR2NMYgpteUtLSVpnYUJrQ3lyRnpwTXpwMmlxb2pDUUtCZ1FEeG1BSjBYaFFhejhoYzRFTWJFUWZaWHZ6cVpXcC9hcmxQCkxOSVpCa1NzeFp4VjkvR2tYWHM1T1d4TW9FdHRoNjlIeXhDUnlrdlZsaHIvdDdmUGdBSlFOQVFkQWMxT3BncEcKdVd0cGNhTHMvTTZ0QUM1ZUJkUXJoTXJzbkVaeDgyNWZWYWVSWGF6NFlFL0pRMC9raWtxaHZ0aHVuai9ZcVo1WgpnZ0FBR3lVOXFRS0JnUURkUjBMR1FubXFFbDFsTlk5OEFsbmNscm1yYXdja3VaemFOYmFMY3JaNTBoMDFhNks3CmFRZEk3Vy83a0JLQTVCTG90WHhxNm9sVWxwallRSmpUelJQR0FXbVFDS2YzakI2MGFnclB3ck1iYTVCK3JpSSsKdVRQd0RwNitTbmxHOXlqNkd1S3J2aHoxdVhXamxhSm02cUFwampiMXJzQldZNUg4YWxTaStNQjFzUUtCZ0RwNwordlFpcGlsTGJZeVdPWWgrMmZDVUh4TzdFMG5mRXhjSW1aKzNOYjdCWTdRbi9wWTBqeFR1UXJwVi80eDNVVVpHCjhTN3AwdXZVbDVxWjVlUlViN3JzcktZOC9tOXdvSUk0ZHJraTZqY0dpQjIzTW9KT1ZPdG9EUnUwUlJWbXdheFEKZHUwb3lTdWpYUTB5djA5cTd1QXk2Ly96VFM5cytFbGd3QkZHZ1FCcEFvR0FHcWNUS0JSVEI1T01LTzNNOG4yNwpyME5mQTlReFZ5elpNMzJpTkc0L0tuRTFvRWxQQ044TmMyQkN0aGNMSEFreStJUlQ1WXZKTjUwc05RUEV0bkNZCnRGcjRPZ1I4UXJHYStzYUJXME9WRjZQQ1BRWFhWT0dlKzM5NGpZRWlqZkE4Z3dKZUZUU0ZoWWdJZSsrbm04R28KNnY1V2RsdlFwWFVXbjhkNWVqemh2clE9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://syedsaudali-todo-backend-api.hf.space
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_APP_URL=https://todo-app-hackathon-ii.vercel.app

# OAuth Credentials (copy from your local .env.local)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FACEBOOK_APP_ID=<your-facebook-app-id>
FACEBOOK_APP_SECRET=<your-facebook-app-secret>
```

**Important:**
- Set for: **Production**, **Preview**, and **Development** environments
- After updating, trigger a new deployment (push a commit or click "Redeploy")

---

### Step 2: Update Hugging Face Space Environment Variables

Go to: https://huggingface.co/spaces/syedsaudali/todo-backend-api/settings

**Add/Update these variables:**

```bash
# CORS Configuration
CORS_ORIGINS=https://todo-app-hackathon-ii.vercel.app

# JWT Public Key (COPY EXACTLY AS SHOWN - including quotes)
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5AN+Xs7K58fkNX0SK9kE
tyzoEEQsoedI5x4XZwiKHYpH+i9sOvUGauIEu5PVo/VmurBwaTzb20Excot+VK71
PuvgPA6I3DVGaUwys6rr0kra6w93wC5kFGSbLVK4MEkQgpZOVkc0oUym7z9J6JKp
/n9hmPRZY36bTbgmFdkdV8KMhrhfoRu5fYHV13WR9gxzY286eZK6KCA4nr7L9Ggb
KPCABt1u5SGf3mGU7JkMHcbYgeTYDfLXjf7I6ZoFAzY/qk/ij1hG5saJeqx+8T/5
j001IZGPSclInpWdXljrx15NbrMaIGYegMWIyoybUJhw2JrLUZIuKZsHE9OVF/dF
8QIDAQAB
-----END PUBLIC KEY-----
"
```

**Important:**
- Include the quotes around the public key
- Include the newlines (press Enter after each line)
- After updating, click **"Restart Space"** and wait 2-3 minutes

---

### Step 3: Update OAuth Redirect URLs

#### Google OAuth Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, ensure this URL is present:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/google
   ```
4. Remove any old URLs with different domains
5. Click **Save**

#### Facebook Developer Console
1. Go to: https://developers.facebook.com/apps
2. Select your app → **Facebook Login** → **Settings**
3. Under **Valid OAuth Redirect URIs**, ensure this URL is present:
   ```
   https://todo-app-hackathon-ii.vercel.app/api/auth/callback/facebook
   ```
4. Remove any old URLs with different domains
5. Click **Save Changes**

---

## 🧪 Testing Instructions

After completing all deployment steps:

### 1. Test Local Development First

```bash
cd web
npm run dev
```

Visit: http://localhost:3000/login

- ✅ Sign up with email/password should work
- ✅ Login should work
- ✅ Check browser console for "✓ JWT_PRIVATE_KEY loaded and decoded"

### 2. Test Production Deployment

Visit: https://todo-app-hackathon-ii.vercel.app/login

**Test Email Authentication:**
- Sign up with a new email
- Login with existing credentials
- Should NOT see "Invalid origin" errors
- Should NOT see "Failed to fetch" errors

**Test Google OAuth:**
- Click "Sign in with Google"
- Should redirect to Google login
- After authentication, should redirect back to dashboard
- User should be logged in

**Test Facebook OAuth:**
- Click "Sign in with Facebook"
- Should redirect to Facebook login
- After authentication, should redirect back to dashboard
- User should be logged in

**Verify API Communication:**
- Open browser DevTools (F12) → Network tab
- API calls should go to: `https://syedsaudali-todo-backend-api.hf.space/api/v1/...`
- Should return 200 OK (or appropriate status codes)
- No CORS errors

**Test Session Persistence:**
- Refresh the page → should remain logged in
- Close and reopen browser → should remain logged in (within 7 days)
- Todos should load correctly

---

## 🔍 Troubleshooting

### "Invalid origin" Error Still Appears

**Possible causes:**
1. Vercel environment variables not updated
2. Deployment not triggered after env var update
3. Browser cache not cleared

**Solutions:**
```bash
# Trigger new Vercel deployment
git commit --allow-empty -m "Trigger deployment"
git push origin main

# Or use Vercel CLI
vercel --prod
```

Clear browser cache and cookies, or test in incognito mode.

---

### "Failed to fetch" Error

**Possible causes:**
1. Backend not running
2. CORS not configured correctly
3. JWT public key mismatch

**Solutions:**
1. Verify backend is running: https://syedsaudali-todo-backend-api.hf.space/
2. Check Hugging Face Space logs for errors
3. Ensure `CORS_ORIGINS` includes production URL
4. Verify `JWT_PUBLIC_KEY` matches the private key

---

### JWT Token Validation Fails

**Possible causes:**
1. Public/private key mismatch
2. Key format incorrect
3. Key not loaded properly

**Solutions:**
1. Verify both keys were updated together
2. Check Vercel logs for "✓ JWT_PRIVATE_KEY loaded and decoded"
3. Check Hugging Face logs for JWT validation errors
4. Ensure public key includes quotes and newlines

**Debug command:**
```bash
# Test JWT token generation locally
cd web
node -e "
const crypto = require('crypto');
const privateKeyBase64 = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...';
const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
console.log('Private key decoded successfully:');
console.log(privateKey.substring(0, 50) + '...');
"
```

---

### OAuth Redirect Fails

**Possible causes:**
1. Redirect URLs not configured in OAuth console
2. OAuth credentials not set in Vercel
3. Callback URL mismatch

**Solutions:**
1. Double-check redirect URLs in Google/Facebook consoles
2. Ensure no trailing slashes in URLs
3. Verify OAuth credentials are set in Vercel environment variables
4. Test OAuth flow in incognito mode

---

## 📋 Deployment Checklist

- [ ] Updated `JWT_PRIVATE_KEY` in Vercel (base64 encoded)
- [ ] Updated `BETTER_AUTH_URL` in Vercel to production URL
- [ ] Updated `NEXT_PUBLIC_APP_URL` in Vercel
- [ ] Updated all OAuth credentials in Vercel
- [ ] Triggered new Vercel deployment
- [ ] Updated `JWT_PUBLIC_KEY` in Hugging Face Space (with quotes and newlines)
- [ ] Updated `CORS_ORIGINS` in Hugging Face Space
- [ ] Restarted Hugging Face Space
- [ ] Updated Google OAuth redirect URL
- [ ] Updated Facebook OAuth redirect URL
- [ ] Tested local development
- [ ] Tested production email login
- [ ] Tested production Google OAuth
- [ ] Tested production Facebook OAuth
- [ ] Verified API calls work
- [ ] Verified session persistence
- [ ] Checked browser console for errors
- [ ] Tested in incognito mode

---

## 🎯 Expected Results

After completing all steps:

✅ **Authentication Works:**
- Email sign-up/login works without errors
- Google OAuth works seamlessly
- Facebook OAuth works seamlessly
- No "Invalid origin" errors
- No "Failed to fetch" errors

✅ **API Communication Works:**
- API calls succeed without CORS errors
- JWT tokens are generated and validated correctly
- Backend accepts requests from frontend

✅ **Session Management Works:**
- Sessions persist across page refreshes
- Users remain logged in for 7 days
- Logout works correctly

✅ **Security:**
- Private key is securely stored in environment variables
- Public key validates JWT tokens correctly
- CORS prevents unauthorized cross-origin requests
- OAuth redirects are validated

---

## 📝 Technical Details

### Key Format

**Private Key (Frontend):**
- Format: Base64-encoded PKCS#8 PEM
- Storage: Single-line string in environment variable
- Decoding: Automatic in `auth.ts` using Buffer.from()

**Public Key (Backend):**
- Format: SPKI PEM with newlines
- Storage: Multi-line string with \n escape sequences
- Usage: Direct validation of JWT tokens

### JWT Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. User logs in via Better Auth (email/password or OAuth)  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Better Auth creates session (cookie-based)              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Frontend requests JWT token from /api/token             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Token endpoint signs JWT with private key (RS256)       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Frontend sends JWT to backend API in Authorization      │
│     header: "Bearer <token>"                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Backend validates JWT with public key (RS256)           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Backend extracts user ID from 'sub' claim               │
│     and processes request                                   │
└─────────────────────────────────────────────────────────────┘
```

### Security Considerations

1. **Private Key Security:**
   - Never commit private key to git
   - Store only in environment variables
   - Use base64 encoding to avoid newline issues
   - Rotate keys periodically

2. **Public Key Distribution:**
   - Public key can be safely shared
   - Must match the private key exactly
   - Include in backend environment variables

3. **CORS Configuration:**
   - Restricts API access to authorized origins
   - Prevents CSRF attacks
   - Must match production frontend URL exactly

4. **OAuth Security:**
   - Redirect URLs must be whitelisted
   - Credentials stored in environment variables
   - Tokens validated by OAuth providers

---

## 🆘 Need Help?

If you're still experiencing issues:

1. Check Vercel deployment logs: `vercel logs <deployment-url>`
2. Check Hugging Face Space logs in the Space dashboard
3. Check browser console for detailed error messages
4. Verify all environment variables are set correctly
5. Ensure all services have been restarted/redeployed

**Common mistakes:**
- Forgetting to redeploy after updating environment variables
- Not restarting Hugging Face Space after env var changes
- Typos in URLs or keys
- Missing quotes around public key
- Not including newlines in public key
- OAuth redirect URLs don't match exactly

---

## ✅ Summary

Your JWT authentication system is now properly configured with:
- ✅ New RSA key pair (RS256, 2048 bits)
- ✅ Base64-encoded private key for frontend
- ✅ Matching public key for backend
- ✅ Automatic key decoding in auth.ts
- ✅ Production URLs configured
- ✅ CORS properly set up

**Next step:** Follow the deployment instructions above to update your production environment variables.
