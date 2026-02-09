# Kubernetes Deployment Access Guide

## Phase IV: Local Kubernetes Deployment - COMPLETED ✅

### Deployment Status

- **Minikube**: Running
- **Namespace**: `todo`
- **Frontend Pods**: 2/2 Running
- **Backend Pods**: 2/2 Running
- **Services**: NodePort (External Access Enabled)

### Service Configuration

| Service | Type | Container Port | NodePort | Internal DNS |
|---------|------|----------------|----------|--------------|
| Frontend | NodePort | 3000 | 30000 | todo-frontend.todo.svc.cluster.local |
| Backend | NodePort | 8000 | 30001 | todo-backend.todo.svc.cluster.local |

### Environment Variables

- **Frontend API_BASE_URL**: `http://todo-backend.todo.svc.cluster.local:8000`
- **Backend Health Endpoint**: `/health`
- **Frontend Health Endpoint**: `/api/health`

---

## Access Methods for Windows with Docker Desktop

### Method 1: Minikube Service Command (RECOMMENDED)

This is the recommended method for Windows with Docker Desktop. Minikube creates a tunnel that forwards traffic to the NodePort services.

#### Access Frontend (Web UI)

```bash
minikube service todo-frontend -n todo
```

This command will:
1. Create a tunnel to the frontend service
2. Automatically open your default browser
3. Display the URL (e.g., `http://127.0.0.1:xxxxx`)

**Important**: Keep the terminal window open while using the application. Closing it will terminate the tunnel.

#### Access Backend API

```bash
minikube service todo-backend -n todo
```

This opens the backend API in your browser. You can test endpoints like:
- Health check: `http://127.0.0.1:xxxxx/health`
- API docs: `http://127.0.0.1:xxxxx/docs`

#### Get URLs Without Opening Browser

```bash
# Get frontend URL
minikube service todo-frontend -n todo --url

# Get backend URL
minikube service todo-backend -n todo --url
```

Use these URLs in your browser or API testing tools (Postman, curl, etc.).

---

### Method 2: kubectl Port Forward (Alternative)

If you prefer to use specific local ports:

#### Terminal 1 - Frontend
```bash
kubectl port-forward -n todo svc/todo-frontend 3000:3000
```

Then access: **http://localhost:3000**

#### Terminal 2 - Backend
```bash
kubectl port-forward -n todo svc/todo-backend 8000:8000
```

Then access: **http://localhost:8000**

**Note**: You need to keep both terminal windows open.

---

## Verification Commands

### Check Deployment Status

```bash
# View all resources
kubectl get all -n todo

# Check pod status (should show READY 1/1)
kubectl get pods -n todo

# Check service configuration
kubectl get svc -n todo

# Check service endpoints
kubectl get endpoints -n todo
```

### Test Backend Health

```bash
# Using minikube service URL
minikube service todo-backend -n todo --url
# Then curl the URL: curl http://127.0.0.1:xxxxx/health

# Using port-forward
kubectl port-forward -n todo svc/todo-backend 8000:8000
# In another terminal: curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","service":"todo-api","version":"1.0.0"}
```

### Test Internal DNS Connectivity

Verify that frontend can reach backend using Kubernetes DNS:

```bash
kubectl exec -n todo deployment/todo-frontend -- wget -qO- http://todo-backend.todo.svc.cluster.local:8000/health
```

Expected response:
```json
{"status":"healthy","service":"todo-api","version":"1.0.0"}
```

### View Pod Logs

```bash
# Frontend logs
kubectl logs -n todo -l app=todo-frontend --tail=50

# Backend logs
kubectl logs -n todo -l app=todo-backend --tail=50

# Follow logs in real-time
kubectl logs -n todo -l app=todo-frontend -f
```

---

## Troubleshooting

### Issue: "Connection Refused" or "Cannot Access Services"

**Solution 1**: Verify pods are running
```bash
kubectl get pods -n todo
# All pods should show READY 1/1 and STATUS Running
```

**Solution 2**: Restart Minikube tunnel
```bash
# Close all minikube service terminal windows
# Then run the service command again
minikube service todo-frontend -n todo
```

**Solution 3**: Check Minikube status
```bash
minikube status
# Should show: host: Running, kubelet: Running, apiserver: Running
```

### Issue: "Port Already in Use"

If using port-forward and getting port conflicts:

```bash
# Windows: Find process using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

### Issue: Pods Not Ready

Check pod events and logs:
```bash
# Describe pod to see events
kubectl describe pod -n todo <pod-name>

# View pod logs
kubectl logs -n todo <pod-name>
```

### Issue: Minikube Not Starting

```bash
# Stop Minikube
minikube stop

# Delete and recreate cluster
minikube delete
minikube start --driver=docker

# Redeploy application
helm upgrade --install todo-frontend ./helm/todo-frontend -n todo
helm upgrade --install todo-backend ./helm/todo-backend -n todo
```

---

## Deployment Management

### Update Deployment

If you make changes to the Docker images:

```bash
# Rebuild images
docker build -t todo-frontend:v1.0.0 ./web
docker build -t todo-backend:v1.0.1 ./api

# Load images into Minikube
minikube image load todo-frontend:v1.0.0
minikube image load todo-backend:v1.0.1

# Upgrade Helm releases
helm upgrade todo-frontend ./helm/todo-frontend -n todo
helm upgrade todo-backend ./helm/todo-backend -n todo
```

### Scale Replicas

```bash
# Scale frontend to 3 replicas
kubectl scale deployment todo-frontend -n todo --replicas=3

# Scale backend to 3 replicas
kubectl scale deployment todo-backend -n todo --replicas=3

# Verify scaling
kubectl get pods -n todo
```

### Restart Deployments

```bash
# Restart frontend
kubectl rollout restart deployment/todo-frontend -n todo

# Restart backend
kubectl rollout restart deployment/todo-backend -n todo

# Check rollout status
kubectl rollout status deployment/todo-frontend -n todo
```

---

## Phase IV Completion Checklist ✅

- [x] Minikube cluster running
- [x] Docker images built and loaded
- [x] Helm charts created for frontend and backend
- [x] Services exposed via NodePort (30000, 30001)
- [x] Pods running successfully (2 frontend, 2 backend)
- [x] Health checks passing
- [x] Internal DNS connectivity verified
- [x] Frontend can call backend using Kubernetes DNS
- [x] External access working via minikube service
- [x] Documentation updated with access instructions

---

## Quick Reference

### Essential Commands

```bash
# Start Minikube
minikube start

# Access frontend
minikube service todo-frontend -n todo

# Access backend
minikube service todo-backend -n todo

# Check status
kubectl get all -n todo

# View logs
kubectl logs -n todo -l app=todo-frontend --tail=50

# Stop Minikube
minikube stop
```

### URLs

- **Frontend (via minikube service)**: Run `minikube service todo-frontend -n todo --url`
- **Backend (via minikube service)**: Run `minikube service todo-backend -n todo --url`
- **Minikube IP**: Run `minikube ip` (Note: Direct IP access doesn't work on Windows/Docker)

---

## Architecture Notes

- **Frontend → Backend Communication**: Uses internal Kubernetes DNS (`http://todo-backend.todo.svc.cluster.local:8000`)
- **External Access**: Via NodePort services (30000 for frontend, 30001 for backend)
- **High Availability**: 2 replicas for both frontend and backend
- **Health Checks**: Liveness and readiness probes ensure zero-downtime deployments
- **Resource Limits**: CPU and memory limits prevent resource exhaustion
