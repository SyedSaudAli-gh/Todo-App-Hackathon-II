# Skill: Configure Social OAuth

## Purpose
Configure OAuth 2.0 authentication providers (Google, Facebook, LinkedIn) in Better Auth to enable social login functionality.

## When to Use
- After completing `setup-better-auth` skill
- Need to add social login options (Google, Facebook, LinkedIn)
- Users request "Sign in with Google/Facebook/LinkedIn" functionality
- Want to reduce friction in user registration process

## Inputs
- OAuth provider credentials (Client ID, Client Secret) for each provider
- Redirect URIs configured in OAuth provider dashboards
- List of providers to enable: `google`, `facebook`, `linkedin`

## Step-by-Step Process

### 1. Obtain OAuth Credentials

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret

#### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app or select existing
3. Add "Facebook Login" product
4. Settings → Basic: Copy App ID and App Secret
5. Facebook Login → Settings:
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook`
     - `https://yourdomain.com/api/auth/callback/facebook`

#### LinkedIn OAuth Setup
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create new app
3. Auth tab: Copy Client ID and Client Secret
4. Authorized redirect URLs:
   - `http://localhost:3000/api/auth/callback/linkedin`
   - `https://yourdomain.com/api/auth/callback/linkedin`
5. Products tab: Request "Sign In with LinkedIn using OpenID Connect"

### 2. Add OAuth Environment Variables
Update `web/.env.local`:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

### 3. Update Auth Configuration
Modify `web/src/lib/auth/config.ts`:
```typescript
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/facebook`,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin`,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
```

### 4. Create Social Login UI Component
Create `web/src/components/auth/SocialLogin.tsx`:
```typescript
'use client';

import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function SocialLogin() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'linkedin') => {
    setLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="secondary"
          onClick={() => handleSocialLogin('google')}
          disabled={loading !== null}
          className="w-full"
        >
          {loading === 'google' ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading !== null}
          className="w-full"
        >
          {loading === 'facebook' ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleSocialLogin('linkedin')}
          disabled={loading !== null}
          className="w-full"
        >
          {loading === 'linkedin' ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}
```

### 5. Integrate Social Login into Login Page
Update `web/src/app/login/page.tsx` to include social login:
```typescript
import { SocialLogin } from '@/components/auth/SocialLogin';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>

        {/* Email/Password form here */}

        <SocialLogin />
      </div>
    </div>
  );
}
```

### 6. Test OAuth Flow
1. Start development server: `npm run dev`
2. Navigate to login page
3. Click each social provider button
4. Verify redirect to provider's consent screen
5. After consent, verify redirect back to `/dashboard`
6. Check database for new user record with provider account linked

### 7. Verify Database Schema
Check that `account` table contains OAuth provider data:
```sql
SELECT * FROM account WHERE provider IN ('google', 'facebook', 'linkedin');
```

Expected columns:
- `id`, `userId`, `provider`, `providerAccountId`, `accessToken`, `refreshToken`, `expiresAt`

## Output
- ✅ OAuth providers configured in Better Auth
- ✅ Social login buttons rendered on login page
- ✅ OAuth flow redirects to provider consent screens
- ✅ Successful authentication creates user and account records
- ✅ Users can sign in with Google, Facebook, or LinkedIn
- ✅ Provider profile data (name, email, avatar) synced to user record

## Failure Handling

### Error: "Invalid client ID"
**Solution**:
1. Verify CLIENT_ID in `.env.local` matches provider dashboard
2. Check for extra spaces or quotes in environment variable
3. Restart Next.js dev server after changing `.env.local`

### Error: "Redirect URI mismatch"
**Solution**:
1. Verify redirect URI in provider dashboard exactly matches:
   - `http://localhost:3000/api/auth/callback/{provider}`
2. Check NEXT_PUBLIC_APP_URL is set correctly
3. Ensure no trailing slashes in URLs

### Error: "Access denied" or "User cancelled"
**Solution**: This is normal user behavior. Handle gracefully:
```typescript
try {
  await authClient.signIn.social({ provider: 'google' });
} catch (error) {
  if (error.message.includes('cancelled')) {
    // User cancelled - no action needed
    return;
  }
  // Show error message to user
}
```

### Error: "Provider not configured"
**Solution**:
1. Verify provider is added to `socialProviders` in `config.ts`
2. Check environment variables are set
3. Restart dev server

### Error: "Email already exists"
**Solution**: Better Auth handles account linking automatically. If error persists:
1. Check `emailAndPassword.enabled` is true
2. Verify user table has unique constraint on email
3. Implement account linking UI if needed

### Error: "Token expired"
**Solution**:
1. Better Auth handles token refresh automatically
2. If persists, check `refreshToken` is stored in database
3. Verify provider supports refresh tokens

### Error: "CORS error" in production
**Solution**:
1. Add production domain to provider's authorized domains
2. Update redirect URIs to use HTTPS
3. Verify NEXT_PUBLIC_APP_URL uses production URL

## Validation Checklist
- [ ] All provider credentials added to `.env.local`
- [ ] Redirect URIs configured in all provider dashboards
- [ ] Social login buttons render without errors
- [ ] Clicking Google button redirects to Google consent screen
- [ ] Clicking Facebook button redirects to Facebook consent screen
- [ ] Clicking LinkedIn button redirects to LinkedIn consent screen
- [ ] After consent, user is redirected to `/dashboard`
- [ ] New user record created in database
- [ ] Account record created with provider details
- [ ] User profile data (name, email, avatar) populated
- [ ] Subsequent logins with same provider work correctly
- [ ] Account linking works if email already exists

## Security Considerations
- Store CLIENT_SECRET in environment variables, never in code
- Use HTTPS in production for all redirect URIs
- Validate state parameter to prevent CSRF attacks (Better Auth handles this)
- Implement rate limiting on OAuth endpoints
- Log OAuth failures for security monitoring
