# OAuth Testing Guide - Phase IV Deployment

## Prerequisites ✅

All environment variables are correctly configured:
- ✅ Backend: JWT_PUBLIC_KEY, CORS_ORIGINS, AGENT_MODEL
- ✅ Frontend: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
- ✅ Frontend API URL: http://todo-backend:8001/api/v1 (Kubernetes service DNS)
- ✅ Signup working: User creation successful

## OAuth Provider Configuration

### Google OAuth Configuration

**Step 1: Access Google Cloud Console**
```
URL: https://console.cloud.google.com/apis/credentials
```

**Step 2: Locate Your OAuth Client**
```
Client ID: 722843332696-25etst49idog1opi7jnhknlkt6ibr81r.apps.googleusercontent.com
```

**Step 3: Add Authorized Redirect URI**
```
http://localhost:3000/api/auth/callback/google
```

**Step 4: Save Changes**
- Click "Save" button
- Wait 5-10 minutes for changes to propagate

### Facebook OAuth Configuration

**Step 1: Access Facebook Developers**
```
URL: https://developers.facebook.com/apps
```

**Step 2: Locate Your App**
```
App ID: 28649184158037887
```

**Step 3: Navigate to Facebook Login Settings**
```
Dashboard → Facebook Login → Settings
```

**Step 4: Add Valid OAuth Redirect URI**
```
http://localhost:3000/api/auth/callback/facebook
```

**Step 5: Save Changes**
- Click "Save Changes" button
- Changes are usually immediate

## Testing OAuth Flows

### Test 1: Email/Password Signup (Already Working ✅)

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "Test User",
    "email": "testuser@example.com",
    "image": null
  },
  "message": "User created successfully"
}
```

### Test 2: Email/Password Login

**Browser Test:**
1. Open: http://localhost:3000/login
2. Enter email: testuser@example.com
3. Enter password: SecurePass123!
4. Click "Sign In"
5. Should redirect to dashboard

**API Test:**
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt -v
```

### Test 3: Google OAuth Login

**After configuring redirect URI in Google Console:**

1. Open: http://localhost:3000/login
2. Click "Sign in with Google" button
3. Should redirect to Google OAuth consent screen
4. Select Google account
5. Grant permissions
6. Should redirect back to: http://localhost:3000/api/auth/callback/google
7. Should create user in database and redirect to dashboard

**Check Available Providers:**
```bash
curl -s http://localhost:3000/api/auth/providers | jq
```

**Expected Output:**
```json
{
  "credentials": {
    "id": "credentials",
    "name": "credentials",
    "type": "credentials",
    "signinUrl": "http://localhost:3000/api/auth/signin/credentials",
    "callbackUrl": "http://localhost:3000/api/auth/callback/credentials"
  },
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oidc",
    "signinUrl": "http://localhost:3000/api/auth/signin/google",
    "callbackUrl": "http://localhost:3000/api/auth/callback/google"
  },
  "facebook": {
    "id": "facebook",
    "name": "Facebook",
    "type": "oauth",
    "signinUrl": "http://localhost:3000/api/auth/signin/facebook",
    "callbackUrl": "http://localhost:3000/api/auth/callback/facebook"
  }
}
```

### Test 4: Facebook OAuth Login

**After configuring redirect URI in Facebook Console:**

1. Open: http://localhost:3000/login
2. Click "Sign in with Facebook" button
3. Should redirect to Facebook OAuth consent screen
4. Log in with Facebook account
5. Grant permissions
6. Should redirect back to: http://localhost:3000/api/auth/callback/facebook
7. Should create user in database and redirect to dashboard

## Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**Cause:** OAuth redirect URI not configured in provider console

**Solution:**
1. Verify exact redirect URI in error message
2. Add exact URI to provider console (Google or Facebook)
3. Wait 5-10 minutes for Google changes to propagate
4. Try again

### Issue: "invalid_client" Error

**Cause:** Client ID or Client Secret mismatch

**Solution:**
```bash
# Verify credentials in pod
kubectl exec -n todo <frontend-pod> -- printenv | grep -E "GOOGLE_CLIENT|FACEBOOK_APP"
```

Compare with values in provider console.

### Issue: User Created but Not Logged In

**Cause:** JWT token generation or session creation failed

**Solution:**
```bash
# Check frontend logs
kubectl logs -n todo -l app.kubernetes.io/name=todo-frontend --tail=50

# Look for JWT or session errors
```

### Issue: CORS Error When Calling Backend API

**Cause:** CORS_ORIGINS not configured correctly

**Solution:**
```bash
# Verify backend CORS configuration
kubectl exec -n todo <backend-pod> -- printenv CORS_ORIGINS

# Should output: http://localhost:3000
```

## Verification Checklist

After OAuth configuration, verify:

- [ ] Google OAuth redirect URI added to Google Console
- [ ] Facebook OAuth redirect URI added to Facebook Console
- [ ] Port-forwards running (frontend:3000, backend:8001)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend health check returns 200: http://localhost:8001/api/v1/health
- [ ] Email/Password signup works
- [ ] Email/Password login works
- [ ] Google OAuth login works
- [ ] Facebook OAuth login works
- [ ] User session persists after login
- [ ] JWT token generated and stored in session
- [ ] Backend API calls authenticated with JWT token

## Database Verification

### Check Users Table

```bash
# Connect to frontend pod
kubectl exec -it -n todo <frontend-pod> -- sh

# Inside pod, check database
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT id, email, name, image FROM users LIMIT 10')
  .then(res => console.log(res.rows))
  .catch(err => console.error(err))
  .finally(() => pool.end());
"
```

### Check Sessions Table

```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT * FROM sessions LIMIT 10')
  .then(res => console.log(res.rows))
  .catch(err => console.error(err))
  .finally(() => pool.end());
"
```

## JWT Token Flow

1. **User logs in** (email/password or OAuth)
2. **Frontend generates JWT token** using JWT_PRIVATE_KEY (RS256)
3. **Token stored in session** (NextAuth session)
4. **Frontend sends token to backend** in Authorization header
5. **Backend validates token** using JWT_PUBLIC_KEY (RS256)
6. **Backend returns user data** if token valid

### Verify JWT Token Generation

```bash
# Check frontend logs for JWT generation
kubectl logs -n todo -l app.kubernetes.io/name=todo-frontend | grep -i jwt

# Should see: "✅ JWT access token generated for user: <email>"
```

### Verify JWT Token Validation

```bash
# Check backend logs for JWT validation
kubectl logs -n todo -l app.kubernetes.io/name=todo-backend | grep -i jwt

# Should see successful authentication logs when making API calls
```

## Success Criteria

✅ All tests pass
✅ Users can sign up with email/password
✅ Users can log in with email/password
✅ Users can log in with Google OAuth
✅ Users can log in with Facebook OAuth
✅ JWT tokens generated correctly
✅ Backend API calls authenticated
✅ Sessions persist across page refreshes
✅ No CORS errors
✅ No authentication errors in logs

## Next Steps After OAuth Setup

1. Test all authentication flows
2. Verify JWT token generation and validation
3. Test protected routes (dashboard, todos)
4. Test API calls with authentication
5. Verify session persistence
6. Test logout functionality
7. Deploy to production (if needed)

## Support

If issues persist after following this guide:
1. Check pod logs: `kubectl logs -n todo <pod-name>`
2. Verify environment variables: `kubectl exec -n todo <pod-name> -- printenv`
3. Check secrets: `kubectl get secrets -n todo`
4. Review HELM_FIX_SUMMARY.md for configuration details
