# Authentication Flows

**Feature**: 002-authenticated-dashboard
**Date**: 2026-01-07
**Status**: Complete

## Overview

This document defines the authentication flows for the authenticated dashboard feature using Better Auth.

## Flow Diagrams

### 1. Email/Password Login Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Navigates to /login
       ▼
┌─────────────────────┐
│   Login Page        │
│  - Email input      │
│  - Password input   │
│  - Submit button    │
└──────┬──────────────┘
       │ Enters credentials
       │ Clicks submit
       ▼
┌─────────────────────┐
│   LoginForm         │
│  - Validates input  │
│  - Calls authClient │
└──────┬──────────────┘
       │ authClient.signIn()
       ▼
┌─────────────────────┐
│   Better Auth       │
│  - Verifies email   │
│  - Checks password  │
│  - Creates session  │
└──────┬──────────────┘
       │
       ├─── Success ───┐
       │               ▼
       │        ┌─────────────────┐
       │        │ Session Created │
       │        │ - Set cookies   │
       │        │ - Store token   │
       │        └────────┬────────┘
       │                 │
       │                 ▼
       │        ┌─────────────────┐
       │        │ Redirect to     │
       │        │ /dashboard      │
       │        └─────────────────┘
       │
       └─── Error ─────┐
                       ▼
               ┌─────────────────┐
               │ Show Error      │
               │ - Invalid creds │
               │ - Stay on login │
               └─────────────────┘
```

### 2. Email/Password Signup Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Navigates to /signup
       ▼
┌─────────────────────┐
│   Signup Page       │
│  - Email input      │
│  - Password input   │
│  - Confirm password │
│  - Submit button    │
└──────┬──────────────┘
       │ Enters details
       │ Clicks submit
       ▼
┌─────────────────────┐
│   SignupForm        │
│  - Validates input  │
│  - Checks password  │
│    match            │
│  - Calls authClient │
└──────┬──────────────┘
       │ authClient.signUp()
       ▼
┌─────────────────────┐
│   Better Auth       │
│  - Checks email     │
│    uniqueness       │
│  - Hashes password  │
│  - Creates account  │
│  - Creates session  │
└──────┬──────────────┘
       │
       ├─── Success ───┐
       │               ▼
       │        ┌─────────────────┐
       │        │ Account Created │
       │        │ Session Created │
       │        │ - Set cookies   │
       │        │ - Store token   │
       │        └────────┬────────┘
       │                 │
       │                 ▼
       │        ┌─────────────────┐
       │        │ Redirect to     │
       │        │ /dashboard      │
       │        └─────────────────┘
       │
       └─── Error ─────┐
                       ▼
               ┌─────────────────┐
               │ Show Error      │
               │ - Email exists  │
               │ - Weak password │
               │ - Stay on signup│
               └─────────────────┘
```

### 3. OAuth Login Flow (Google/Facebook/LinkedIn)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Navigates to /login
       ▼
┌─────────────────────┐
│   Login Page        │
│  - OAuth buttons    │
│    • Google         │
│    • Facebook       │
│    • LinkedIn       │
└──────┬──────────────┘
       │ Clicks OAuth button
       │ (e.g., "Sign in with Google")
       ▼
┌─────────────────────┐
│   OAuthButtons      │
│  - Calls authClient │
└──────┬──────────────┘
       │ authClient.signIn({ provider: "google" })
       ▼
┌─────────────────────┐
│   Better Auth       │
│  - Redirects to     │
│    OAuth provider   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  OAuth Provider     │
│  (Google/FB/LI)     │
│  - User login       │
│  - Grant consent    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  OAuth Callback     │
│  /api/auth/callback │
│  /google (or fb/li) │
└──────┬──────────────┘
       │ Authorization code
       ▼
┌─────────────────────┐
│   Better Auth       │
│  - Exchange code    │
│    for token        │
│  - Get user info    │
│  - Create/update    │
│    account          │
│  - Create session   │
└──────┬──────────────┘
       │
       ├─── Success ───┐
       │               ▼
       │        ┌─────────────────┐
       │        │ Session Created │
       │        │ - Set cookies   │
       │        │ - Store token   │
       │        └────────┬────────┘
       │                 │
       │                 ▼
       │        ┌─────────────────┐
       │        │ Redirect to     │
       │        │ /dashboard      │
       │        └─────────────────┘
       │
       └─── Error ─────┐
                       ▼
               ┌─────────────────┐
               │ Show Error      │
               │ - OAuth failed  │
               │ - Redirect to   │
               │   /login        │
               └─────────────────┘
```

### 4. Logout Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Authenticated
       │ On /dashboard
       ▼
┌─────────────────────┐
│   Dashboard Header  │
│  - Logout button    │
└──────┬──────────────┘
       │ Clicks logout
       ▼
┌─────────────────────┐
│   Header Component  │
│  - Calls authClient │
└──────┬──────────────┘
       │ authClient.signOut()
       ▼
┌─────────────────────┐
│   Better Auth       │
│  - Clear session    │
│  - Remove cookies   │
│  - Clear token      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Session Cleared     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect to /login  │
└─────────────────────┘
```

### 5. Route Protection Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Navigates to /dashboard
       ▼
┌─────────────────────┐
│ Dashboard Layout    │
│ (Server Component)  │
└──────┬──────────────┘
       │ Check session
       ▼
┌─────────────────────┐
│   Better Auth       │
│  - authClient       │
│    .getSession()    │
└──────┬──────────────┘
       │
       ├─── Session Valid ───┐
       │                     ▼
       │              ┌─────────────────┐
       │              │ Render Dashboard│
       │              │ - Pass user data│
       │              │ - Show content  │
       │              └─────────────────┘
       │
       └─── No Session ─────┐
                            ▼
                    ┌─────────────────┐
                    │ Redirect to     │
                    │ /login          │
                    └─────────────────┘
```

### 6. Session Persistence Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Logged in
       │ Closes browser
       ▼
┌─────────────────────┐
│ Session Stored      │
│ - HTTP-only cookie  │
│ - localStorage      │
└──────┬──────────────┘
       │
       │ Time passes...
       │
       ▼
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Reopens browser
       │ Navigates to /dashboard
       ▼
┌─────────────────────┐
│ Dashboard Layout    │
└──────┬──────────────┘
       │ Check session
       ▼
┌─────────────────────┐
│   Better Auth       │
│  - Read cookie      │
│  - Validate token   │
│  - Check expiry     │
└──────┬──────────────┘
       │
       ├─── Valid & Not Expired ───┐
       │                           ▼
       │                    ┌─────────────────┐
       │                    │ Session Restored│
       │                    │ - User logged in│
       │                    │ - Show dashboard│
       │                    └─────────────────┘
       │
       └─── Invalid or Expired ────┐
                                   ▼
                           ┌─────────────────┐
                           │ Redirect to     │
                           │ /login          │
                           └─────────────────┘
```

## Error Handling

### Login Errors

| Error | Cause | User Message | Action |
|-------|-------|--------------|--------|
| Invalid credentials | Wrong email/password | "Invalid email or password" | Stay on login page |
| Account not found | Email doesn't exist | "No account found with this email" | Suggest signup |
| Too many attempts | Rate limiting | "Too many login attempts. Try again later." | Show cooldown timer |
| Network error | API unreachable | "Connection error. Please try again." | Retry button |

### Signup Errors

| Error | Cause | User Message | Action |
|-------|-------|--------------|--------|
| Email exists | Duplicate email | "An account with this email already exists" | Suggest login |
| Weak password | Password too short | "Password must be at least 8 characters" | Show requirements |
| Password mismatch | Confirm doesn't match | "Passwords do not match" | Clear confirm field |
| Invalid email | Bad email format | "Please enter a valid email address" | Highlight field |

### OAuth Errors

| Error | Cause | User Message | Action |
|-------|-------|--------------|--------|
| OAuth denied | User cancelled | "Sign in cancelled" | Return to login |
| Provider error | OAuth provider down | "Unable to connect to [Provider]. Try again later." | Show alternatives |
| Invalid callback | Redirect URI mismatch | "Authentication error. Please contact support." | Log error details |
| Token exchange failed | OAuth flow error | "Sign in failed. Please try again." | Retry button |

### Session Errors

| Error | Cause | User Message | Action |
|-------|-------|--------------|--------|
| Session expired | Token expired | "Your session has expired. Please log in again." | Redirect to login |
| Invalid session | Tampered token | "Invalid session. Please log in again." | Clear session, redirect |
| Session not found | Cookie cleared | "Please log in to continue" | Redirect to login |

## Security Considerations

### Password Security
- Passwords hashed with bcrypt (Better Auth default)
- Minimum 8 characters (configurable)
- No password complexity requirements (per spec assumptions)
- No password reset flow (out of scope)

### Session Security
- HTTP-only cookies (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)
- Session expiration (Better Auth default: 7-30 days)

### OAuth Security
- State parameter for CSRF protection (Better Auth handles)
- Redirect URI validation (must match configured URIs)
- Token exchange over HTTPS only
- No client-side token storage (Better Auth manages)

### Rate Limiting
- Login attempts: 5 per 15 minutes (Better Auth default)
- Signup attempts: 3 per hour (Better Auth default)
- OAuth attempts: 10 per hour (Better Auth default)

## Testing Checklist

### Email/Password Login
- [ ] Valid credentials → successful login → redirect to /dashboard
- [ ] Invalid email → error message displayed
- [ ] Invalid password → error message displayed
- [ ] Empty fields → validation errors
- [ ] Network error → error message with retry

### Email/Password Signup
- [ ] Valid details → account created → redirect to /dashboard
- [ ] Duplicate email → error message displayed
- [ ] Weak password → error message displayed
- [ ] Password mismatch → error message displayed
- [ ] Empty fields → validation errors

### OAuth Login
- [ ] Google OAuth → successful login → redirect to /dashboard
- [ ] Facebook OAuth → successful login → redirect to /dashboard
- [ ] LinkedIn OAuth → successful login → redirect to /dashboard
- [ ] OAuth cancelled → return to login page
- [ ] OAuth error → error message displayed

### Logout
- [ ] Logout button → session cleared → redirect to /login
- [ ] After logout → cannot access /dashboard without login
- [ ] After logout → cookies cleared

### Route Protection
- [ ] Unauthenticated user → /dashboard → redirect to /login
- [ ] Authenticated user → /dashboard → dashboard displayed
- [ ] Authenticated user → /login → redirect to /dashboard

### Session Persistence
- [ ] Login → refresh page → still logged in
- [ ] Login → close browser → reopen → still logged in (if "remember me")
- [ ] Session expires → redirect to /login with message
