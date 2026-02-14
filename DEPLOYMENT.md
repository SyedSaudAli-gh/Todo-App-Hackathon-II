# Todo App - Minikube Deployment Guide

## Prerequisites

- **Docker Desktop**: Version 20.10 or higher
- **Minikube**: Version 1.30 or higher
- **kubectl**: Version 1.27 or higher
- **Helm**: Version 3.12 or higher
- **Operating System**: Windows 10/11, macOS, or Linux

## Quick Start

### 1. Start Minikube

```bash
# Delete existing cluster (if any) and start fresh
minikube delete
minikube start --driver=docker --cpus=4 --memory=8192
```

### 2. Build Docker Images

```bash
# Build backend image
docker build -t todo-backend:v1.0.2 ./api

# Build frontend image
docker build -t todo-frontend:v1.0.0 ./web
```

### 3. Load Images into Minikube

```bash
# Load images into Minikube's Docker daemon
minikube image load todo-backend:v1.0.2
minikube image load todo-frontend:v1.0.0
```

### 4. Create Kubernetes Resources

```bash
# Create namespace
kubectl create namespace todo

# Copy secrets template and fill in your actual values
cp helm/secrets-template.yaml helm/secrets.yaml
# Edit helm/secrets.yaml with your actual credentials:
# - DATABASE_URL: Use PostgreSQL with format: postgresql+psycopg://user:pass@host:5432/db
# - OPENROUTER_API_KEY: Your OpenRouter API key
# - NEXTAUTH_SECRET: Generate with: openssl rand -base64 32
# - JWT_PRIVATE_KEY: Generate with: openssl rand -base64 32
# - Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
# - Facebook OAuth credentials (FACEBOOK_APP_ID, FACEBOOK_APP_SECRET)

# Apply secrets
kubectl apply -f helm/secrets.yaml

# Apply ConfigMap (contains correct Kubernetes DNS and NodePort URLs)
kubectl apply -f helm/configmap.yaml
```

**Important**: The `secrets.yaml` file is gitignored. Never commit actual secrets to git.

### 5. Deploy with Helm

```bash
# Install backend
helm install todo-backend helm/todo-backend -n todo

# Install frontend
helm install todo-frontend helm/todo-frontend -n todo
```

### 6. Verify Deployment

```bash
# Check pod status (wait for all pods to be Running)
kubectl get pods -n todo

# Check services
kubectl get services -n todo
```

### 7. Access the Application

**Windows Docker Driver - Port Forwarding (Recommended):**

The Docker driver on Windows doesn't expose the minikube IP to the host. Use port forwarding for stable, accessible URLs:

```bash
# Frontend (keep this running in a terminal)
kubectl port-forward svc/todo-frontend 30030:3000 -n todo

# Backend (optional, in another terminal)
kubectl port-forward svc/todo-backend 30080:8001 -n todo
```

Access the application:
- **Frontend**: http://localhost:30030
- **Backend API**: http://localhost:30080/api/v1/health

**Alternative - Minikube Service Tunnels (Dynamic Ports):**

```bash
# These create dynamic tunnel URLs (ports change on restart)
minikube service todo-backend -n todo --url
minikube service todo-frontend -n todo --url
```

**Note**: Port forwarding provides stable URLs required for OAuth callbacks.

## Architecture

### Components

- **Backend**: FastAPI application (2 replicas)
  - Image: `todo-backend:v1.0.3`
  - Port: 8001
  - NodePort: 30080
  - Health endpoint: `/api/v1/health`
  - Database: PostgreSQL (Supabase) via psycopg3 driver

- **Frontend**: Next.js application (2 replicas)
  - Image: `todo-frontend:v1.0.0`
  - Port: 3000
  - NodePort: 30030
  - Authentication: NextAuth with database adapter
  - Database: PostgreSQL (Supabase) - shared with backend

### Database Architecture

**Single PostgreSQL Database (Supabase)**:
- Both frontend and backend use the same PostgreSQL database
- Frontend: NextAuth authentication tables
- Backend: Todo tasks and user data
- Connection: `postgresql+psycopg://` (psycopg3 driver)

### Network Architecture

**Frontend → Backend Communication**:
- Frontend uses Kubernetes service DNS: `http://todo-backend:8001`
- NOT localhost (localhost inside container refers to the container itself)
- Backend service is accessible at `todo-backend:8001` within the cluster

**External Access (Windows Docker Driver)**:
- Frontend: `http://localhost:30030` (via kubectl port-forward)
- Backend: `http://localhost:30080` (via kubectl port-forward)
- Port forwarding required because Docker driver doesn't expose minikube IP to host
- OAuth callbacks use stable localhost URLs

### Resources

- **CPU**: Backend (100m-500m), Frontend (50m-200m)
- **Memory**: Backend (128Mi-512Mi), Frontend (64Mi-256Mi)

## OAuth Configuration

### Required OAuth Provider Setup

**Google Cloud Console**:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   - `http://localhost:30030/api/auth/callback/google`
4. Save changes

**Facebook Developer Console**:
1. Go to: https://developers.facebook.com/apps
2. Select your app → Settings → Basic
3. Add to "Valid OAuth Redirect URIs":
   - `http://localhost:30030/api/auth/callback/facebook`
4. Save changes

**Why localhost:30030?**
- Port forwarding provides stable URL (doesn't change on restart)
- Accessible from browser on Windows host via kubectl port-forward
- OAuth providers require exact callback URL match
- Windows Docker driver doesn't expose minikube IP to host

## Troubleshooting

### Pods Not Starting

**Issue**: Pods stuck in `CrashLoopBackOff` or `ImagePullBackOff`

**Solutions**:
1. Check pod logs: `kubectl logs -n todo <pod-name>`
2. Verify images are loaded: `minikube image ls | grep todo`
3. Check image pull policy in values.yaml (should be `Never` for local images)

### Permission Denied Errors

**Issue**: Backend pods crash with permission errors

**Solution**: Ensure Dockerfile copies packages to `/home/appuser/.local` with proper ownership:
```dockerfile
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local
```

### Health Check Failures

**Issue**: Pods not becoming Ready (0/1)

**Solution**: Verify health probe path matches the actual endpoint:
- Backend health endpoint: `/api/v1/health` (not `/health`)
- Update `livenessProbe` and `readinessProbe` in values.yaml

### Cannot Access Services

**Issue**: `curl: (7) Failed to connect to host`

**Solution**: On Windows with Docker driver, use Minikube service tunnels:
```bash
minikube service todo-backend -n todo --url
minikube service todo-frontend -n todo --url
```

### Database Connection Errors

**Issue**: Backend crashes with `ModuleNotFoundError: No module named 'psycopg2'`

**Root Cause**: SQLAlchemy defaults to psycopg2 driver, but backend uses psycopg3

**Solution**: Ensure DATABASE_URL uses psycopg3 driver format:
```
postgresql+psycopg://user:password@host:5432/database
```

NOT:
```
postgresql://user:password@host:5432/database  # Wrong - defaults to psycopg2
```

### Frontend Cannot Reach Backend

**Issue**: Frontend shows connection errors or API calls fail

**Root Cause**: Frontend using `localhost` instead of Kubernetes service DNS

**Solution**: Verify ConfigMap has correct values:
```bash
kubectl get configmap todo-config -n todo -o yaml
```

Should show:
- `API_URL: "http://todo-backend:8000"`
- `NEXT_PUBLIC_API_BASE_URL: "http://todo-backend:8000/api/v1"`

NOT `localhost:30080` (localhost inside container refers to the container itself)

### OAuth Errors

**Issue**: OAuth login redirects to `/login?error=Configuration`

**Root Cause**: NEXTAUTH_URL doesn't match actual frontend URL or OAuth provider callback URLs not configured

**Solution**:
1. Verify NEXTAUTH_URL in ConfigMap: `http://localhost:30030`
2. Update Google Cloud Console with callback: `http://localhost:30030/api/auth/callback/google`
3. Update Facebook Developer Console with callback: `http://localhost:30030/api/auth/callback/facebook`

### Frontend Auth Errors

**Issue**: `UntrustedHost` errors in frontend logs

**Solution**: This is a configuration warning for NextAuth. The application will still function, but authentication features may not work properly without proper host configuration.

## Cleanup

To remove the deployment:

**Windows (PowerShell)**:
```powershell
.\scripts\cleanup.ps1
```

**Linux/macOS (Bash)**:
```bash
./scripts/cleanup.sh
```

Or manually:
```bash
helm uninstall todo-backend -n todo
helm uninstall todo-frontend -n todo
kubectl delete namespace todo
```

## Verification Checklist

- [ ] All pods are Running (1/1 Ready)
- [ ] Backend health check returns `{"status":"healthy","service":"todo-api","version":"1.0.0"}`
- [ ] Frontend is accessible and loads UI at http://localhost:30030
- [ ] Services have correct NodePort configuration (backend: 30080, frontend: 30030)
- [ ] Backend uses PostgreSQL (not SQLite): `kubectl exec -n todo <backend-pod> -- printenv DATABASE_URL`
- [ ] Frontend can reach backend via Kubernetes DNS: `kubectl exec -n todo <frontend-pod> -- wget -q -O- http://todo-backend:8000/api/v1/health`
- [ ] Database connectivity verified for both backend and frontend
- [ ] No critical errors in pod logs
- [ ] Pod restart resilience works (pods recreate after deletion)
- [ ] OAuth providers configured with correct callback URLs

## Key Files

- `api/Dockerfile` - Backend Docker image configuration
- `web/Dockerfile` - Frontend Docker image configuration
- `helm/todo-backend/` - Backend Helm chart
- `helm/todo-frontend/` - Frontend Helm chart
- `helm/secrets-template.yaml` - Template for Kubernetes Secrets (copy and fill with actual values)
- `helm/configmap.yaml` - ConfigMap with non-sensitive configuration
- `scripts/cleanup.sh` - Cleanup script (Bash)
- `scripts/cleanup.ps1` - Cleanup script (PowerShell)

## Notes

- **Image Sizes**: Backend (~345MB), Frontend (~1.63GB)
- **Database**: PostgreSQL (Supabase) shared between frontend and backend
- **Database Driver**: Backend uses psycopg3 (`postgresql+psycopg://` format)
- **API Key**: Replace placeholder with real OPENROUTER_API_KEY for chatbot functionality
- **OAuth**: Requires Google and Facebook OAuth credentials and callback URL configuration
- **Minikube Driver**: Tested with Docker driver on Windows
- **Network**: Frontend uses Kubernetes service DNS (todo-backend:8000) for backend communication
- **Secrets Management**: Never commit helm/secrets.yaml to git (it's gitignored)
