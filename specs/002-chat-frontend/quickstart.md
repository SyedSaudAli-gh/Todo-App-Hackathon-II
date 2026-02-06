# Quickstart Guide: Chat Frontend Setup

**Feature**: 002-chat-frontend
**Date**: 2026-02-02
**Purpose**: Step-by-step setup and configuration for local development

---

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Backend API running (from feature 001-ai-todo-chatbot)
- ✅ NextAuth configured with JWT tokens
- ✅ OpenAI ChatKit domain key (obtain from OpenAI)

---

## Step 1: Install Dependencies

Navigate to the frontend directory and install ChatKit:

```bash
cd web
npm install @openai/chatkit
```

**Expected Output**:
```
added 1 package, and audited 234 packages in 3s
```

**Verification**:
```bash
npm list @openai/chatkit
```

Should show: `@openai/chatkit@1.x.x`

---

## Step 2: Configure Environment Variables

### 2.1 Create or Update `.env.local`

Add the following environment variables to `web/.env.local`:

```bash
# Existing variables (keep these)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000

# NEW: ChatKit Configuration
NEXT_PUBLIC_CHATKIT_DOMAIN_KEY=your-chatkit-domain-key-here
```

### 2.2 Obtain ChatKit Domain Key

1. Visit OpenAI ChatKit dashboard: https://platform.openai.com/chatkit
2. Create a new project or select existing project
3. Generate a domain key
4. Copy the key and paste into `.env.local`

### 2.3 Configure Domain Allowlist

In the ChatKit dashboard:

1. Navigate to "Domain Settings"
2. Add allowed domains:
   - `localhost:3000` (for local development)
   - `your-app.vercel.app` (for production)
3. Save settings

**Important**: ChatKit will only work on allowlisted domains.

---

## Step 3: Verify Backend API

Ensure the backend API is running and accessible:

```bash
# Test backend health
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy"}
```

If backend is not running, start it:

```bash
cd api
uvicorn src.main:app --reload --port 8000
```

---

## Step 4: Verify Authentication

Ensure NextAuth is configured and working:

```bash
# Check NextAuth configuration
cat web/src/app/api/auth/[...nextauth]/route.ts
```

**Required Configuration**:
- JWT strategy enabled
- `accessToken` included in session callback
- Sign-in page configured

**Test Authentication**:
1. Start frontend: `npm run dev`
2. Navigate to: http://localhost:3000/auth/signin
3. Sign in with test credentials
4. Verify JWT token in session

---

## Step 5: Create Chat Route Structure

Create the necessary directories and files:

```bash
# From web/ directory
mkdir -p src/app/chat/[[...conversationId]]
mkdir -p src/components/chat
mkdir -p src/lib/api
mkdir -p src/lib/hooks
mkdir -p src/types
```

**Expected Structure**:
```
web/src/
├── app/
│   └── chat/
│       └── [[...conversationId]]/
│           └── page.tsx
├── components/
│   └── chat/
│       ├── ChatContainer.tsx
│       ├── MessageList.tsx
│       ├── MessageInput.tsx
│       ├── Message.tsx
│       ├── LoadingIndicator.tsx
│       └── ToolCallDisplay.tsx
├── lib/
│   ├── api/
│   │   └── chat.ts
│   └── hooks/
│       └── useChat.ts
└── types/
    └── chat.ts
```

---

## Step 6: Start Development Server

```bash
cd web
npm run dev
```

**Expected Output**:
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

## Step 7: Verify ChatKit Integration

### 7.1 Test ChatKit Import

Create a test file: `web/src/app/chat-test/page.tsx`

```typescript
import { ChatKit } from '@openai/chatkit';

export default function ChatTestPage() {
  return (
    <div>
      <h1>ChatKit Test</h1>
      <ChatKit
        domainKey={process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY}
        messages={[]}
        onSendMessage={(msg) => console.log(msg)}
      />
    </div>
  );
}
```

### 7.2 Navigate to Test Page

Visit: http://localhost:3000/chat-test

**Expected Result**:
- ChatKit interface renders
- No console errors
- Input field is functional

**If Errors Occur**:
- Check domain key is correct
- Verify domain is in allowlist
- Check browser console for specific errors

---

## Step 8: Test Backend Integration

### 8.1 Test Chat Endpoint

```bash
# Get JWT token from NextAuth session (use browser dev tools)
# Then test chat endpoint:

curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "Hello, create a task to buy groceries"}'
```

**Expected Response**:
```json
{
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "response": "I've created a task for you to buy groceries.",
  "tool_calls": [
    {
      "tool_name": "add_task",
      "arguments": {"title": "Buy groceries", "priority": "medium"},
      "result": {"id": 1, "title": "Buy groceries", "status": "pending"}
    }
  ],
  "timestamp": "2026-02-02T10:30:00Z"
}
```

---

## Step 9: Manual Testing Checklist

Once implementation is complete, test the following:

### Authentication
- [ ] Unauthenticated users redirected to login
- [ ] Authenticated users can access /chat
- [ ] JWT token included in API requests
- [ ] Token expiration handled gracefully

### New Conversation
- [ ] Navigate to /chat (no ID)
- [ ] Send first message
- [ ] Conversation ID created
- [ ] URL updates to /chat/[id]
- [ ] Message appears in UI

### Existing Conversation
- [ ] Navigate to /chat/[existing-id]
- [ ] Conversation history loads
- [ ] All messages displayed correctly
- [ ] Can send new messages
- [ ] Messages persist after refresh

### Message Display
- [ ] User messages right-aligned, blue background
- [ ] Assistant messages left-aligned, gray background
- [ ] Timestamps displayed correctly
- [ ] Tool calls collapsible and readable
- [ ] Auto-scroll to latest message

### Error Handling
- [ ] Network error displays message
- [ ] 401 error redirects to login
- [ ] 404 error starts new conversation
- [ ] 500 error displays retry option
- [ ] Validation errors shown inline

### Performance
- [ ] Page loads in <2 seconds
- [ ] User message displays in <100ms
- [ ] AI response in <5 seconds
- [ ] No UI lag with 20+ messages

---

## Step 10: Troubleshooting

### Issue: ChatKit Not Rendering

**Symptoms**: Blank screen or "ChatKit is not defined" error

**Solutions**:
1. Verify `@openai/chatkit` installed: `npm list @openai/chatkit`
2. Check import statement: `import { ChatKit } from '@openai/chatkit';`
3. Restart dev server: `npm run dev`

### Issue: Domain Key Invalid

**Symptoms**: "Invalid domain key" error in console

**Solutions**:
1. Verify key in `.env.local` is correct
2. Check domain is in ChatKit allowlist
3. Restart dev server after changing `.env.local`

### Issue: API Calls Failing

**Symptoms**: Network errors or 401 responses

**Solutions**:
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check JWT token is valid (use jwt.io to decode)
3. Verify `NEXT_PUBLIC_API_URL` is correct
4. Check CORS settings in backend

### Issue: Messages Not Persisting

**Symptoms**: Messages disappear on page refresh

**Solutions**:
1. Verify conversation ID in URL
2. Check backend database connection
3. Verify API endpoint returns conversation_id
4. Check browser console for errors

### Issue: Authentication Redirect Loop

**Symptoms**: Constantly redirected to login

**Solutions**:
1. Verify NextAuth configuration
2. Check JWT token in session callback
3. Clear browser cookies and retry
4. Check `NEXTAUTH_SECRET` is set

---

## Development Workflow

### Daily Development

```bash
# 1. Start backend
cd api
uvicorn src.main:app --reload --port 8000

# 2. Start frontend (new terminal)
cd web
npm run dev

# 3. Open browser
# http://localhost:3000/chat
```

### Making Changes

1. Edit component files in `web/src/components/chat/`
2. Changes hot-reload automatically
3. Check browser console for errors
4. Test in browser

### Debugging

```typescript
// Add console logs in components
console.log('Messages:', messages);
console.log('Conversation ID:', conversationId);
console.log('Loading:', isLoading);

// Use React DevTools
// Install: https://react.dev/learn/react-developer-tools
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXTAUTH_URL` | Yes | - | Frontend URL (http://localhost:3000) |
| `NEXTAUTH_SECRET` | Yes | - | NextAuth secret key |
| `NEXT_PUBLIC_API_URL` | Yes | - | Backend API URL (http://localhost:8000) |
| `NEXT_PUBLIC_CHATKIT_DOMAIN_KEY` | Yes | - | OpenAI ChatKit domain key |

---

## Next Steps

After completing setup:

1. **Implement Components**: Follow `contracts/components.md` to build React components
2. **Implement API Client**: Follow `contracts/api-client.md` to build API integration
3. **Implement State Management**: Follow `contracts/state-management.md` to build useChat hook
4. **Test Integration**: Use manual testing checklist above
5. **Deploy**: Follow deployment guide (separate document)

---

## Additional Resources

- **ChatKit Documentation**: https://platform.openai.com/docs/chatkit
- **Next.js App Router**: https://nextjs.org/docs/app
- **NextAuth.js**: https://next-auth.js.org/
- **React Hooks**: https://react.dev/reference/react

---

## Support

If you encounter issues not covered in this guide:

1. Check browser console for errors
2. Check backend logs for API errors
3. Review component contracts for expected behavior
4. Verify all environment variables are set correctly

**Common Issues**: See Step 10 (Troubleshooting) above.
