# Quickstart: Deploy Todo AI Chatbot to Minikube

**Feature**: Local Kubernetes Deployment of Phase III Todo AI Chatbot
**Branch**: `001-minikube-deployment`
**Date**: 2026-02-12
**Estimated Time**: 30 minutes

This guide provides step-by-step instructions to deploy the Todo AI Chatbot to a local Minikube cluster.

---

## Prerequisites

Before starting, ensure you have the following installed:

- ✅ **Docker Desktop 4.53+** (with Gordon enabled)
- ✅ **Minikube** (latest version)
- ✅ **kubectl** (Kubernetes CLI)
- ✅ **Helm 3.x** (Kubernetes package manager)
- ✅ **Minimum Resources**: 4GB RAM, 2 CPU cores available

**Verify Prerequisites**:
```bash
# Check Docker
docker --version

# Check Minikube
minikube version

# Check kubectl
kubectl version --client

# Check Helm
helm version
```

---

## Quick Deploy (5 Steps)

### Step 1: Start Minikube Cluster

```bash
# Start Minikube with adequate resources
minikube start --cpus=2 --memory=4096 --driver=docker

# Verify cluster is running
minikube status

# Expected output:
# host: Running
# kubelet: Running
# apiserver: Running
```

**Troubleshooting**:
- If Minikube fails to start, try: `minikube delete && minikube start --cpus=2 --memory=4096`
- If Docker driver fails, try: `minikube start --cpus=2 --memory=4096 --driver=hyperv` (Windows)

---

### Step 2: Build Docker Images

**Option A: Using Gordon (AI-Assisted)**

```bash
# Navigate to project root
cd "E:\Q4_Prompt_Context_Eng_or_MCP_Server\Hackathon II\Todo-App-Hackathon-II"

# Build backend image with Gordon
docker ai "Build a multi-stage Docker image for the FastAPI backend in ./api with tag todo-backend:v1.0.0"

# Build frontend image with Gordon
docker ai "Build a multi-stage Docker image for the Next.js frontend in ./web with tag todo-frontend:v1.0.0"
```

**Option B: Manual Build (Fallback)**

```bash
# Navigate to project root
cd "E:\Q4_Prompt_Context_Eng_or_MCP_Server\Hackathon II\Todo-App-Hackathon-II"

# Build backend image
docker build -t todo-backend:v1.0.0 ./api

# Build frontend image
docker build -t todo-frontend:v1.0.0 ./web

# Verify images built
docker images | grep todo

# Expected output:
# todo-backend    v1.0.0    <image-id>    <time>    ~150MB
# todo-frontend   v1.0.0    <image-id>    <time>    ~120MB
```

**Troubleshooting**:
- If build fails, check Dockerfile syntax
- If image size too large, verify multi-stage build is used
- If Gordon unavailable, use manual build commands

---

### Step 3: Load Images into Minikube

```bash
# Load backend image
minikube image load todo-backend:v1.0.0

# Load frontend image
minikube image load todo-frontend:v1.0.0

# Verify images loaded
minikube image ls | grep todo

# Expected output:
# docker.io/library/todo-backend:v1.0.0
# docker.io/library/todo-frontend:v1.0.0
```

**Note**: This step is required because Minikube runs in a separate Docker environment.

---

### Step 4: Create Namespace and Secrets

```bash
# Create namespace
kubectl create namespace todo

# Create secrets (replace with your actual values)
kubectl create secret generic todo-secrets -n todo \
  --from-literal=database-url="postgresql://user:password@host/database" \
  --from-literal=openrouter-api-key="sk-or-v1-..."

# Create configmap
kubectl create configmap todo-config -n todo \
  --from-literal=frontend-url="http://localhost:30030" \
  --from-literal=api-url="http://localhost:30080"

# Verify resources created
kubectl get secrets -n todo
kubectl get configmap -n todo

# Expected output:
# NAME           TYPE     DATA   AGE
# todo-secrets   Opaque   2      <time>
# NAME          DATA   AGE
# todo-config   2      <time>
```

**Important**: Replace placeholder values with your actual:
- **DATABASE_URL**: Your Neon PostgreSQL connection string
- **OPENROUTER_API_KEY**: Your OpenRouter API key

---

### Step 5: Deploy with Helm

**Option A: Using kubectl-ai (AI-Assisted)**

```bash
# Deploy backend
kubectl-ai "install the todo-backend helm chart from ./helm/todo-backend in the todo namespace"

# Deploy frontend
kubectl-ai "install the todo-frontend helm chart from ./helm/todo-frontend in the todo namespace"
```

**Option B: Manual Deploy (Fallback)**

```bash
# Deploy backend
helm install todo-backend ./helm/todo-backend -n todo

# Deploy frontend
helm install todo-frontend ./helm/todo-frontend -n todo

# Verify deployments
helm list -n todo

# Expected output:
# NAME            NAMESPACE  REVISION  STATUS    CHART
# todo-backend    todo       1         deployed  todo-backend-1.0.0
# todo-frontend   todo       1         deployed  todo-frontend-1.0.0
```

---

## Verify Deployment

### Check Pod Status

```bash
# Watch pods until Running
kubectl get pods -n todo -w

# Expected output (after ~2 minutes):
# NAME                             READY   STATUS    RESTARTS   AGE
# todo-backend-xxx                 1/1     Running   0          2m
# todo-frontend-xxx                1/1     Running   0          2m

# Press Ctrl+C to stop watching
```

### Check Service Status

```bash
# List services
kubectl get services -n todo

# Expected output:
# NAME            TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# todo-backend    NodePort   10.96.xxx.xxx   <none>        8000:30080/TCP   2m
# todo-frontend   NodePort   10.96.xxx.xxx   <none>        3000:30030/TCP   2m
```

### Test Backend Health

```bash
# Test backend health endpoint
curl http://localhost:30080/health

# Expected output:
# {"status":"healthy"}
```

### Test Frontend Access

```bash
# Test frontend accessibility
curl -I http://localhost:30030

# Expected output:
# HTTP/1.1 200 OK
```

---

## Access Application

### Option 1: Direct NodePort Access

```bash
# Open frontend in browser
start http://localhost:30030

# Or manually navigate to:
# http://localhost:30030
```

### Option 2: Minikube Service Command

```bash
# Open frontend with Minikube
minikube service todo-frontend -n todo

# Open backend with Minikube
minikube service todo-backend -n todo
```

### Option 3: Port Forwarding (Alternative)

```bash
# Forward frontend port
kubectl port-forward -n todo svc/todo-frontend 3000:3000

# In another terminal, forward backend port
kubectl port-forward -n todo svc/todo-backend 8000:8000

# Access at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## Test Functionality

### 1. Create Task

1. Open browser to http://localhost:30030
2. Verify chat interface loads
3. Type: "Add task: Buy groceries"
4. Verify task created successfully

### 2. Update Task

1. Type: "Mark task 1 as complete"
2. Verify task status updated

### 3. Delete Task

1. Type: "Delete task 1"
2. Confirm deletion
3. Verify task removed

### 4. Test Persistence

```bash
# Delete backend pod
kubectl delete pod -n todo -l app=todo-backend

# Wait for new pod to start
kubectl get pods -n todo -w

# Verify tasks still exist in UI
# Open http://localhost:30030 and check task list
```

---

## View Logs

### Backend Logs

```bash
# View backend logs (last 50 lines)
kubectl logs -n todo -l app=todo-backend --tail=50

# Follow backend logs (real-time)
kubectl logs -n todo -l app=todo-backend -f
```

### Frontend Logs

```bash
# View frontend logs (last 50 lines)
kubectl logs -n todo -l app=todo-frontend --tail=50

# Follow frontend logs (real-time)
kubectl logs -n todo -l app=todo-frontend -f
```

### All Logs

```bash
# View all logs in namespace
kubectl logs -n todo --all-containers=true --tail=50
```

---

## Update Deployment

### Update Image

```bash
# Build new image
docker build -t todo-backend:v1.0.1 ./api

# Load into Minikube
minikube image load todo-backend:v1.0.1

# Update values.yaml with new tag
# Then upgrade with Helm
helm upgrade todo-backend ./helm/todo-backend -n todo

# Verify rollout
kubectl rollout status deployment/todo-backend -n todo
```

### Update Configuration

```bash
# Update ConfigMap
kubectl edit configmap todo-config -n todo

# Restart pods to pick up changes
kubectl rollout restart deployment/todo-backend -n todo
kubectl rollout restart deployment/todo-frontend -n todo
```

---

## Troubleshooting

### Pods Not Starting

```bash
# Describe pod to see events
kubectl describe pod -n todo <pod-name>

# Check for common issues:
# - ImagePullBackOff: Image not loaded into Minikube
# - CrashLoopBackOff: Application startup failure
# - Pending: Insufficient resources
```

### Service Not Accessible

```bash
# Verify service exists
kubectl get svc -n todo

# Check NodePort value
kubectl get svc todo-frontend -n todo -o jsonpath='{.spec.ports[0].nodePort}'

# Test with Minikube IP
minikube ip
curl http://$(minikube ip):30030
```

### Database Connection Issues

```bash
# Check backend logs for connection errors
kubectl logs -n todo -l app=todo-backend | grep -i "database\|connection"

# Verify Secret exists
kubectl get secret todo-secrets -n todo

# Check Secret value (base64 encoded)
kubectl get secret todo-secrets -n todo -o jsonpath='{.data.database-url}' | base64 -d
```

### Health Checks Failing

```bash
# Check pod events
kubectl describe pod -n todo <pod-name>

# Look for:
# - Liveness probe failed
# - Readiness probe failed

# Adjust probe timing in values.yaml if needed
```

---

## Clean Up

### Delete Deployment

```bash
# Uninstall Helm releases
helm uninstall todo-backend -n todo
helm uninstall todo-frontend -n todo

# Delete namespace (removes all resources)
kubectl delete namespace todo

# Verify cleanup
kubectl get all -n todo
# Expected: No resources found
```

### Stop Minikube

```bash
# Stop Minikube cluster
minikube stop

# Delete Minikube cluster (optional)
minikube delete
```

### Remove Docker Images

```bash
# Remove local images
docker rmi todo-backend:v1.0.0
docker rmi todo-frontend:v1.0.0
```

---

## Next Steps

After successful deployment:

1. ✅ **Document AI Tool Usage**: Capture screenshots of Gordon, kubectl-ai, kagent usage
2. ✅ **Run Verification Tests**: Execute all tests from deployment-validation.yaml
3. ✅ **Update README**: Add deployment instructions to main README
4. ✅ **Prepare Demo**: Create hackathon demonstration materials
5. ✅ **Capture Learnings**: Document AI-assisted DevOps insights

---

## Quick Reference

### Common Commands

```bash
# Check cluster status
minikube status

# List all resources
kubectl get all -n todo

# Describe resource
kubectl describe <resource-type> <resource-name> -n todo

# View logs
kubectl logs -n todo <pod-name>

# Execute command in pod
kubectl exec -it -n todo <pod-name> -- /bin/sh

# Port forward
kubectl port-forward -n todo <pod-name> <local-port>:<pod-port>

# Scale deployment
kubectl scale deployment <deployment-name> --replicas=<count> -n todo

# Restart deployment
kubectl rollout restart deployment/<deployment-name> -n todo
```

### Useful Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias k='kubectl'
alias kn='kubectl -n todo'
alias kgp='kubectl get pods -n todo'
alias kgs='kubectl get services -n todo'
alias kl='kubectl logs -n todo'
```

---

**Quickstart Status**: ✅ COMPLETE - Ready for deployment
**Estimated Time**: 30 minutes (first-time deployment)
**Next Command**: `/sp.tasks` (to break down into atomic tasks)
