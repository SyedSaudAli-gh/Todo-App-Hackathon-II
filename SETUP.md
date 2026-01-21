# Authentication Setup Guide

This guide walks you through setting up production-grade JWT authentication for the Todo Application.

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- OpenSSL installed (for key generation)
- PostgreSQL database (Neon DB recommended)

## Step 1: Generate RSA Key Pair

Generate a 2048-bit RSA key pair for JWT signing:

```bash
# Generate private key
openssl genrsa -out private_key.pem 2048

# Generate public key from private key
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

## Step 2: Convert Keys to Single-Line Format

Environment variables require single-line format with `\n` escape sequences:

```bash
# Convert private key (for JWT_PRIVATE_KEY)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private_key.pem

# Convert public key (for JWT_PUBLIC_KEY)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' public_key.pem
```

**Copy the output** - you'll need it for environment variables.

## Step 3: Configure Frontend Environment Variables

Create `web/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_API_VERSION=v1

# Better Auth (Session Management)
BETTER_AUTH_SECRET=<generate-random-32-byte-base64-string>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=file:auth.db

# JWT Private Key (paste single-line output from Step 2)
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Step 4: Configure Backend Environment Variables

Create `api/.env`:

```bash
# Database Configuration
DATABASE_URL=postgresql+psycopg://<user>:<password>@<host>/<database>?sslmode=require

# JWT Public Key (paste single-line output from Step 2)
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG...\n-----END PUBLIC KEY-----"
JWT_ALGORITHM=RS256

# API Configuration
API_VERSION=v1
DEBUG=false

# CORS Configuration
CORS_ORIGINS=http://localhost:3000

# Server Configuration
HOST=0.0.0.0
PORT=8001
```

## Step 5: Delete Key Files (IMPORTANT)

After copying keys to environment variables, **delete the PEM files**:

```bash
rm private_key.pem public_key.pem
```

**Never commit these files to git!**

## Step 6: Verify .gitignore

Ensure `.gitignore` excludes sensitive files:

```
# Environment variables
.env
.env.local
.env.*.local

# Private keys
*.pem
private_key.*
public_key.*

# Better Auth database
auth.db
```

## Step 7: Install Dependencies

### Frontend
```bash
cd web
npm install
```

### Backend
```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Step 8: Initialize Database

```bash
cd api
python -m alembic upgrade head
```

## Step 9: Start Development Servers

### Terminal 1 - Backend
```bash
cd api
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn src.main:app --reload --host 0.0.0.0 --port 8001
```

### Terminal 2 - Frontend
```bash
cd web
npm run dev
```

## Step 10: Verify Setup

### 1. Check Backend Health
```bash
curl http://localhost:8001/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### 2. Create Test User
Navigate to `http://localhost:3000/sign-up` and create an account.

### 3. Test JWT Token Generation
```bash
# Login first, then check browser console
# You should see: "✓ JWT token fetched and cached"
```

### 4. Test Todo Creation
Create a todo in the UI. Check browser network tab:
- Request should have `Authorization: Bearer <token>` header
- Response should return todo with `user_id` field

### 5. Test Data Isolation
Create two users and verify:
- User A cannot see User B's todos
- User A cannot update/delete User B's todos

## Verification Checklist

Before deploying to production, verify:

- [ ] RSA keys generated (2048-bit minimum)
- [ ] Keys converted to single-line format
- [ ] JWT_PRIVATE_KEY set in frontend environment
- [ ] JWT_PUBLIC_KEY set in backend environment
- [ ] PEM files deleted from filesystem
- [ ] .gitignore excludes *.pem files
- [ ] BETTER_AUTH_SECRET is random and secure
- [ ] DATABASE_URL points to production database
- [ ] CORS_ORIGINS includes production domain
- [ ] Better Auth session cookies work
- [ ] JWT token generation works (/api/token)
- [ ] JWT token validation works (backend)
- [ ] Todo CRUD operations work
- [ ] Data isolation verified (cross-user access denied)
- [ ] Logout clears JWT from memory

## Vercel Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (your Vercel domain)
   - `JWT_PRIVATE_KEY` (single-line format)
   - `NEXT_PUBLIC_API_BASE_URL` (backend URL)
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
   - OAuth credentials (if using)

4. Deploy

### Backend (Railway/Render/Fly.io)

1. Push code to GitHub
2. Create new service
3. Add environment variables:
   - `DATABASE_URL` (Neon PostgreSQL)
   - `JWT_PUBLIC_KEY` (single-line format)
   - `JWT_ALGORITHM=RS256`
   - `CORS_ORIGINS` (your Vercel domain)
   - `API_VERSION=v1`
   - `DEBUG=false`

4. Deploy

### Post-Deployment Verification

```bash
# Test backend health
curl https://your-api.railway.app/api/v1/health

# Test frontend
open https://your-app.vercel.app

# Test login flow
# 1. Sign up
# 2. Create todo
# 3. Verify todo appears
# 4. Logout
# 5. Login again
# 6. Verify todo still appears
```

## Troubleshooting

### Issue: "JWT_PRIVATE_KEY not configured"

**Cause**: Environment variable not set or incorrectly formatted

**Solution**:
1. Verify JWT_PRIVATE_KEY is in `.env.local`
2. Ensure it's single-line format with `\n` escape sequences
3. Restart Next.js dev server

### Issue: "Invalid authentication credentials"

**Cause**: Public key doesn't match private key

**Solution**:
1. Regenerate key pair
2. Ensure public key is derived from private key
3. Update both environment variables
4. Restart both servers

### Issue: "Not authenticated" on API calls

**Cause**: JWT token not generated or expired

**Solution**:
1. Check browser console for JWT errors
2. Verify Better Auth session exists (check cookies)
3. Test `/api/token` endpoint directly
4. Clear browser cookies and login again

### Issue: User sees other users' todos

**Cause**: Missing user_id filter in database queries

**Solution**:
1. Review `api/src/services/todo_service.py`
2. Ensure all queries include `WHERE user_id = authenticated_user_id`
3. Run security tests (see ARCHITECTURE.md)

### Issue: Vercel deployment fails

**Cause**: Filesystem-based secret loading

**Solution**:
1. Verify `web/src/lib/auth/auth.ts` uses `process.env.JWT_PRIVATE_KEY`
2. Ensure no `fs.readFileSync` calls for secrets
3. Check Vercel environment variables are set

## Security Best Practices

1. **Never commit secrets to git**
   - Use `.env` files (gitignored)
   - Use environment variables in production

2. **Use strong keys**
   - Minimum 2048-bit RSA keys
   - Random BETTER_AUTH_SECRET (32+ bytes)

3. **Rotate keys periodically**
   - Generate new key pair every 6-12 months
   - Update environment variables
   - Invalidate old tokens

4. **Monitor authentication logs**
   - Watch for JWT validation failures
   - Alert on cross-user access attempts
   - Track token expiration errors

5. **Use HTTPS in production**
   - Vercel provides HTTPS by default
   - Ensure backend uses HTTPS
   - Set secure cookie flags

## Next Steps

After setup is complete:

1. **Add OAuth providers** (optional)
   - Configure Google/Facebook/LinkedIn OAuth
   - Test social login flows

2. **Implement email verification** (optional)
   - Enable `requireEmailVerification` in Better Auth
   - Configure email provider

3. **Add rate limiting** (recommended)
   - Protect login endpoint from brute force
   - Limit API requests per user

4. **Set up monitoring** (recommended)
   - Add error tracking (Sentry)
   - Monitor API performance
   - Track authentication metrics

5. **Write integration tests** (recommended)
   - Test authentication flows
   - Test data isolation
   - Test error handling

## Support

For issues or questions:
- Review `ARCHITECTURE.md` for detailed architecture
- Check troubleshooting section above
- Review code comments in `web/src/lib/auth/` and `api/src/core/security.py`

## Summary

You now have:
- ✅ Production-grade JWT authentication (RS256)
- ✅ Strict multi-user data isolation
- ✅ Vercel-compatible deployment
- ✅ No filesystem dependencies
- ✅ Automatic token management
- ✅ Defense in depth security

Your Todo Application is ready for production deployment!
