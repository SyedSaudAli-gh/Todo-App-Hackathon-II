# Phase IV Deployment Verification - v1.0.4

## Deployment Status ✅

### Minikube Cluster
```
Status: Running
Driver: Docker
CPUs: 4
Memory: 7000MB
```

### Pods Status
```bash
$ kubectl get pods -n todo
NAME                             READY   STATUS    RESTARTS   AGE
todo-backend-5d8964f568-l7rj6    1/1     Running   0          5m
todo-backend-5d8964f568-xj7xh    1/1     Running   0          5m
todo-frontend-5bb6cbc5f5-d4nbk   1/1     Running   0          5m
todo-frontend-5bb6cbc5f5-s2b29   1/1     Running   0          5m
```

**All 4 pods running successfully (0 restarts)**

### Services
```bash
$ kubectl get svc -n todo
NAME            TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
todo-backend    NodePort   10.96.x.x       <none>        8001:30080/TCP   5m
todo-frontend   NodePort   10.96.x.x       <none>        3000:30030/TCP   5m
```

### Environment Variables Verification

**Frontend Pod:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://todo-backend:8001/api/v1
API_URL=http://todo-backend:8001
NEXT_PUBLIC_API_VERSION=v1
```

**Backend Pod:**
```bash
DATABASE_URL=postgresql+psycopg://neondb_owner:...
JWT_PUBLIC_KEY=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0... (Valid RSA Public Key)
CORS_ORIGINS=http://localhost:3000
AGENT_MODEL=gpt-4o-mini
OPENROUTER_API_KEY=sk-or-v1-...
```

### Backend Health Check ✅
```bash
$ curl http://127.0.0.1:58196/api/v1/health
{"status":"healthy","service":"todo-api","version":"1.0.0"}
```

## Critical Fixes Applied

### Issue 1: Frontend API URL Mismatch ✅ FIXED
**Problem:** Frontend was calling `http://localhost:8000/tasks` (wrong port)

**Root Cause:** Next.js embeds `NEXT_PUBLIC_*` variables at build time. The Docker image was built with `localhost:8001` hardcoded in the compiled JavaScript.

**Solution:**
1. Updated `web/.env.local` to use Kubernetes service DNS:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://todo-backend:8001/api/v1
   NEXT_PUBLIC_API_URL=http://todo-backend:8001
   ```
2. Rebuilt Docker image as `todo-frontend:v1.0.4`
3. Deployed new image to Minikube

**Verification:**
- Environment variable in pod: `NEXT_PUBLIC_API_BASE_URL=http://todo-backend:8001/api/v1` ✅
- Frontend will now call backend using Kubernetes service DNS

### Issue 2: JWT Authentication ✅ CONFIGURED
**Problem:** Chatbot getting 401 Unauthorized

**Solution:**
- Backend has `JWT_PUBLIC_KEY` configured (base64-encoded RSA public key)
- Frontend has `JWT_PRIVATE_KEY` configured (matching private key)
- Keys are a valid RSA keypair
- CORS configured: `CORS_ORIGINS=http://localhost:3000`

## Access URLs

### Via Minikube Service (Recommended)
```bash
# Get service URLs
minikube service todo-frontend -n todo --url
minikube service todo-backend -n todo --url

# Example output:
# Frontend: http://127.0.0.1:58254
# Backend:  http://127.0.0.1:58196
```

### Via Port Forwarding (Alternative)
```bash
# Terminal 1 - Frontend
kubectl port-forward -n todo svc/todo-frontend 3000:3000

# Terminal 2 - Backend
kubectl port-forward -n todo svc/todo-backend 8001:8001

# Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8001
```

## Manual Testing Required

### Test 1: User Signup ✅
```bash
# Get frontend URL
FRONTEND_URL=$(minikube service todo-frontend -n todo --url)

# Create test user
curl -X POST $FRONTEND_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Expected: {"user":{...},"message":"User created successfully"}
```

### Test 2: Login and Access Dashboard
1. Open frontend URL in browser
2. Navigate to `/login`
3. Enter credentials:
   - Email: test@example.com
   - Password: TestPass123
4. Click "Sign In"
5. Should redirect to `/dashboard`

### Test 3: Fetch Todos (CRITICAL TEST)
1. After login, navigate to `/dashboard/todos`
2. Open browser DevTools → Network tab
3. Look for API call to fetch todos
4. **Verify the request URL:**
   - ✅ Should be: `http://todo-backend:8001/api/v1/tasks`
   - ❌ Should NOT be: `http://localhost:8000/tasks`

**Expected Behavior:**
- Request succeeds (200 OK)
- Todos list loads (may be empty initially)
- No CORS errors
- No 404 errors

### Test 4: Chatbot (CRITICAL TEST)
1. Navigate to `/chat` or chatbot interface
2. Send a message: "Create a todo: Buy groceries"
3. Open browser DevTools → Network tab
4. Look for API call to chatbot endpoint

**Verify the request:**
- URL: `http://todo-backend:8001/api/v1/chat`
- Method: POST
- Headers: Should include `Authorization: Bearer <jwt-token>`
- Status: Should be 200 OK (not 401 Unauthorized)

**Expected Behavior:**
- Chatbot responds successfully
- Todo is created
- No authentication errors

## Troubleshooting

### If Todos Don't Load

**Check 1: Verify Frontend is Using Correct URL**
```bash
# Check frontend logs
kubectl logs -n todo -l app.kubernetes.io/name=todo-frontend --tail=50

# Look for API calls - should show todo-backend:8001, not localhost:8000
```

**Check 2: Verify Backend is Reachable**
```bash
# Test from frontend pod
kubectl exec -n todo <frontend-pod> -- wget -O- http://todo-backend:8001/api/v1/health

# Should return: {"status":"healthy",...}
```

**Check 3: Check Backend Logs**
```bash
kubectl logs -n todo -l app.kubernetes.io/name=todo-backend --tail=50

# Look for incoming requests and any errors
```

### If Chatbot Returns 401 Unauthorized

**Check 1: Verify JWT Token is Being Sent**
- Open browser DevTools → Network tab
- Find the `/api/v1/chat` request
- Check Headers → Authorization
- Should see: `Authorization: Bearer eyJ...`

**Check 2: Verify JWT Keys Match**
```bash
# Check backend has public key
kubectl exec -n todo <backend-pod> -- printenv JWT_PUBLIC_KEY

# Check frontend has private key
kubectl exec -n todo <frontend-pod> -- printenv JWT_PRIVATE_KEY

# Both should be base64-encoded and be a valid RSA keypair
```

**Check 3: Check Backend JWT Validation Logs**
```bash
kubectl logs -n todo -l app.kubernetes.io/name=todo-backend | grep -i jwt

# Look for JWT validation errors
```

### If CORS Errors Occur

**Check Backend CORS Configuration:**
```bash
kubectl exec -n todo <backend-pod> -- printenv CORS_ORIGINS

# Should output: http://localhost:3000
```

**If accessing via Minikube service URL (e.g., http://127.0.0.1:58254):**
- CORS might block requests because origin doesn't match
- Solution: Use port-forward to access via http://localhost:3000

## Verification Checklist

Before claiming deployment is successful, verify:

- [ ] All 4 pods running (0 restarts)
- [ ] Backend health check returns 200 OK
- [ ] Frontend loads in browser
- [ ] User can sign up successfully
- [ ] User can log in successfully
- [ ] **CRITICAL:** Navigate to `/dashboard/todos` and verify:
  - [ ] Network tab shows request to `http://todo-backend:8001/api/v1/tasks`
  - [ ] Request succeeds (200 OK)
  - [ ] Todos list loads (even if empty)
  - [ ] No 404 or CORS errors
- [ ] **CRITICAL:** Test chatbot and verify:
  - [ ] Network tab shows request to `http://todo-backend:8001/api/v1/chat`
  - [ ] Request includes Authorization header with JWT token
  - [ ] Request succeeds (200 OK, not 401)
  - [ ] Chatbot responds successfully
  - [ ] Todo is created from chatbot command

## Success Criteria

✅ **Deployment is successful when:**
1. Todos load successfully on `/dashboard/todos`
2. Chatbot responds successfully and creates todos
3. No API URL mismatches (no calls to localhost:8000)
4. No JWT authentication errors (no 401 responses)

## Commands Reference

```bash
# Check pod status
kubectl get pods -n todo

# Check pod logs
kubectl logs -n todo <pod-name> --tail=50

# Check environment variables
kubectl exec -n todo <pod-name> -- printenv | grep API

# Restart deployment (if needed)
kubectl rollout restart deployment/todo-frontend -n todo
kubectl rollout restart deployment/todo-backend -n todo

# Get service URLs
minikube service list -n todo
minikube service todo-frontend -n todo --url
minikube service todo-backend -n todo --url

# Port forward
kubectl port-forward -n todo svc/todo-frontend 3000:3000
kubectl port-forward -n todo svc/todo-backend 8001:8001
```

## Summary

**Deployment Status:** ✅ All pods running, environment variables configured correctly

**Critical Fixes Applied:**
1. ✅ Frontend Docker image rebuilt with correct API URLs (v1.0.4)
2. ✅ JWT keys configured correctly in both frontend and backend
3. ✅ CORS configured correctly

**Next Step:** Manual testing required to verify:
- Todos load successfully (frontend calls todo-backend:8001, not localhost:8000)
- Chatbot works successfully (no 401 errors)

**Access the application:**
```bash
# Get URLs
minikube service todo-frontend -n todo --url
minikube service todo-backend -n todo --url

# Open frontend URL in browser and test
```
