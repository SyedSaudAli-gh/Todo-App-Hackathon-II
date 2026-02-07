# Phase IV Quickstart Guide: Local Kubernetes Deployment

**Feature**: Local Kubernetes Deployment
**Date**: 2026-02-07
**Audience**: Developers and hackathon judges
**Estimated Time**: 15 minutes

## Overview

This guide walks you through deploying the Todo Chatbot to a local Kubernetes cluster using Minikube, Helm charts, and AI-powered DevOps agents. All deployment tasks are automated via Claude Agents with no manual coding required.

---

## Prerequisites

### Required Software

1. **Docker Desktop** (Windows 10+)
   - Download: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version` (should show Docker version 20.10+)
   - Status: Docker daemon must be running

2. **Minikube** (Kubernetes local cluster)
   - Download: https://minikube.sigs.k8s.io/docs/start/
   - Verify: `minikube version` (should show v1.30+)
   - Install: `choco install minikube` (Windows) or download installer

3. **kubectl** (Kubernetes CLI)
   - Download: https://kubernetes.io/docs/tasks/tools/
   - Verify: `kubectl version --client` (should show v1.28+)
   - Install: Included with Docker Desktop or `choco install kubernetes-cli`

4. **Helm 3+** (Kubernetes package manager)
   - Download: https://helm.sh/docs/intro/install/
   - Verify: `helm version` (should show v3.12+)
   - Install: `choco install kubernetes-helm` (Windows)

5. **kubectl-ai** (AI-powered Kubernetes operations) - OPTIONAL
   - Install: Follow instructions at kubectl-ai repository
   - Verify: `kubectl ai --version`

6. **Kagent** (AI cluster monitoring) - OPTIONAL
   - Install: Follow instructions at Kagent repository
   - Verify: `kagent --version`

### Environment Variables

Set the following environment variables before deployment:

```bash
# Required for backend
export DATABASE_URL="postgresql://user:password@host:5432/database"
export OPENROUTER_API_KEY="sk-or-your-api-key-here"

# Windows PowerShell
$env:DATABASE_URL="postgresql://user:password@host:5432/database"
$env:OPENROUTER_API_KEY="sk-or-your-api-key-here"
```

### Verify Prerequisites

Run this command to verify all prerequisites are installed:

```bash
# Check Docker
docker --version && docker ps

# Check Minikube
minikube version

# Check kubectl
kubectl version --client

# Check Helm
helm version

# Check environment variables
echo $DATABASE_URL
echo $OPENROUTER_API_KEY
```

**All commands should succeed before proceeding.**

---

## Step 1: Start Minikube Cluster

**Objective**: Initialize local Kubernetes cluster with resource constraints

**Command**:
```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

**Expected Output**:
```
😄  minikube v1.30.0 on Windows 10
✨  Using the docker driver based on user configuration
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🔥  Creating docker container (CPUs=4, Memory=8192MB) ...
🐳  Preparing Kubernetes v1.28.0 on Docker 24.0.0 ...
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster
```

**Verification**:
```bash
minikube status
kubectl cluster-info
```

**Troubleshooting**:
- If Minikube fails to start, ensure Docker Desktop is running
- If resource allocation fails, close other applications to free resources
- If driver issues occur, try `--driver=hyperv` or `--driver=virtualbox`

**Time**: ~2 minutes

---

## Step 2: Run docker-build-optimizer Agent

**Objective**: Build optimized Docker images for frontend and backend

**Agent**: docker-build-optimizer
**SKILL.md**: `.claude/skills/docker-build.skill.md`

**Command**:
```bash
# Navigate to repository root
cd /path/to/Todo-App-Hackathon-II

# Run agent (Claude will generate Dockerfiles and build images)
# This is automated via Claude Agent - no manual commands needed
```

**What the Agent Does**:
1. Generates `web/Dockerfile` with multi-stage build for Next.js
2. Generates `api/Dockerfile` with multi-stage build for FastAPI
3. Creates `.dockerignore` files
4. Builds frontend image: `docker build -t todo-frontend:v1.0.0 -f web/Dockerfile web/`
5. Builds backend image: `docker build -t todo-backend:v1.0.0 -f api/Dockerfile api/`
6. Verifies image sizes (frontend < 200MB, backend < 300MB)

**Expected Output**:
```
✅ Frontend image built: todo-frontend:v1.0.0 (185 MB)
✅ Backend image built: todo-backend:v1.0.0 (275 MB)
✅ All images under size targets
```

**Verification**:
```bash
docker images | grep todo
```

**Troubleshooting**:
- If build fails, check Docker daemon is running
- If size exceeds target, review Dockerfile optimization
- If dependency errors occur, verify package.json/requirements.txt

**Time**: ~8 minutes (frontend 3min, backend 5min)

---

## Step 3: Run docker-container-runner Agent

**Objective**: Test containers locally before deployment

**Agent**: docker-container-runner
**SKILL.md**: `.claude/skills/docker-run.skill.md`

**Command**:
```bash
# Run agent (Claude will start containers and test health checks)
# This is automated via Claude Agent - no manual commands needed
```

**What the Agent Does**:
1. Starts frontend container on port 3000
2. Starts backend container on port 8000 with environment variables
3. Waits 30 seconds for startup
4. Tests health endpoints (GET /api/health, GET /health)
5. Checks container logs for errors
6. Stops and removes test containers

**Expected Output**:
```
✅ Frontend container started successfully
✅ Backend container started successfully
✅ Frontend health check: 200 OK
✅ Backend health check: 200 OK
✅ No errors in logs
✅ Containers cleaned up
```

**Verification**:
```bash
# Containers should be stopped and removed
docker ps -a | grep test-
```

**Troubleshooting**:
- If health checks fail, verify environment variables are set
- If port conflicts occur, stop conflicting containers
- If startup fails, check container logs

**Time**: ~2 minutes

---

## Step 4: Run helm-chart-generator Agent

**Objective**: Generate Helm charts with validated templates

**Agent**: helm-chart-generator
**SKILL.md**: `.claude/skills/helm-generate.skill.md`

**Command**:
```bash
# Run agent (Claude will generate Helm charts)
# This is automated via Claude Agent - no manual commands needed
```

**What the Agent Does**:
1. Creates `helm/todo-frontend/` directory structure
2. Creates `helm/todo-backend/` directory structure
3. Generates Chart.yaml, values.yaml, and templates for both charts
4. Validates charts with `helm lint`
5. Tests template rendering with `helm template`

**Expected Output**:
```
✅ Frontend chart generated: helm/todo-frontend/
✅ Backend chart generated: helm/todo-backend/
✅ Frontend chart passes helm lint
✅ Backend chart passes helm lint
✅ All templates render correctly
```

**Verification**:
```bash
# Check chart structure
ls -R helm/

# Lint charts
helm lint helm/todo-frontend
helm lint helm/todo-backend

# Test rendering
helm template todo-frontend helm/todo-frontend
helm template todo-backend helm/todo-backend --set secrets.databaseUrl="test" --set secrets.openrouterApiKey="test"
```

**Troubleshooting**:
- If lint fails, check YAML syntax in generated files
- If template errors occur, verify values.yaml references
- If validation fails, review chart structure

**Time**: ~1 minute

---

## Step 5: Run k8s-deploy-agent

**Objective**: Deploy Helm charts to Minikube cluster

**Agent**: k8s-deploy-agent
**SKILL.md**: `.claude/skills/k8s-deploy.skill.md`

**Command**:
```bash
# Run agent (Claude will deploy to Minikube)
# This is automated via Claude Agent - no manual commands needed
```

**What the Agent Does**:
1. Verifies Minikube is running
2. Creates `todo` namespace
3. Deploys frontend chart: `helm upgrade --install todo-frontend ./helm/todo-frontend --namespace todo --wait`
4. Deploys backend chart: `helm upgrade --install todo-backend ./helm/todo-backend --namespace todo --wait`
5. Waits for all pods to reach Running state
6. Verifies health checks pass

**Expected Output**:
```
✅ Namespace 'todo' created
✅ Frontend deployed: 2/2 pods Running
✅ Backend deployed: 2/2 pods Running
✅ All health checks passing
✅ Services accessible within cluster
```

**Verification**:
```bash
# Check namespace
kubectl get namespace todo

# Check deployments
kubectl get deployments -n todo

# Check pods
kubectl get pods -n todo -o wide

# Check services
kubectl get services -n todo

# Check health
kubectl describe pods -n todo | grep -A 5 "Liveness\|Readiness"
```

**Troubleshooting**:
- If pods fail to start, check `kubectl describe pod <pod-name> -n todo`
- If image pull fails, verify images exist locally
- If resource limits exceeded, reduce replica counts
- If health checks fail, check pod logs

**Time**: ~5 minutes

---

## Step 6: Run cluster-health-monitor Agent

**Objective**: Monitor cluster health and resource usage

**Agent**: cluster-health-monitor
**SKILL.md**: `.claude/skills/cluster-monitor.skill.md`

**Command**:
```bash
# Run agent (Claude will monitor cluster)
# This is automated via Claude Agent - no manual commands needed
```

**What the Agent Does**:
1. Checks pod status (all should be Running)
2. Monitors resource usage (CPU and memory)
3. Verifies health checks (liveness and readiness)
4. Checks cluster events for warnings/errors
5. Generates health report

**Expected Output**:
```
✅ All pods Running (4/4)
✅ CPU usage: 2.8 / 4.0 CPUs (70%)
✅ Memory usage: 5.2 / 8.0 GB (65%)
✅ Health checks: 100% success rate
✅ No errors in cluster events
```

**Verification**:
```bash
# Check pod status
kubectl get pods -n todo

# Check resource usage
kubectl top pods -n todo
kubectl top nodes

# Check events
kubectl get events -n todo --sort-by='.lastTimestamp' | tail -20

# Check logs
kubectl logs -n todo -l app=todo-frontend --tail=50
kubectl logs -n todo -l app=todo-backend --tail=50
```

**Troubleshooting**:
- If metrics unavailable, enable metrics-server: `minikube addons enable metrics-server`
- If resource usage high, consider reducing replica counts
- If errors found, investigate pod logs

**Time**: ~1 minute

---

## Deployment Complete! 🎉

**Total Time**: ~12-15 minutes

### Verify Deployment Success

Run these commands to verify everything is working:

```bash
# Check all resources
kubectl get all -n todo

# Verify pod count (should be 4: 2 frontend, 2 backend)
kubectl get pods -n todo | grep Running | wc -l

# Check resource usage
kubectl top pods -n todo

# Test services from within cluster
kubectl run test-pod --image=curlimages/curl:latest --rm -it --restart=Never -n todo -- \
  curl -f http://todo-frontend.todo.svc.cluster.local:3000/api/health

kubectl run test-pod --image=curlimages/curl:latest --rm -it --restart=Never -n todo -- \
  curl -f http://todo-backend.todo.svc.cluster.local:8000/health
```

**Expected Results**:
- ✅ 4 pods Running
- ✅ 2 services (ClusterIP)
- ✅ 2 deployments (2 replicas each)
- ✅ Resource usage under 4 CPUs and 8GB RAM
- ✅ Health checks returning 200 OK

---

## Accessing the Application

### Option 1: Port Forwarding (Recommended for Testing)

```bash
# Forward frontend port
kubectl port-forward -n todo svc/todo-frontend 3000:3000

# Access in browser
http://localhost:3000
```

### Option 2: Minikube Service (Exposes NodePort)

```bash
# Get service URL
minikube service todo-frontend -n todo --url

# Access in browser (use URL from command output)
```

### Option 3: Ingress (Advanced)

```bash
# Enable ingress addon
minikube addons enable ingress

# Create ingress resource (requires additional configuration)
```

---

## Cleanup

### Option 1: Remove Kubernetes Resources Only

**Agent**: k8s-cleanup
**SKILL.md**: `.claude/skills/k8s-cleanup.skill.md`

```bash
# Run agent with kubernetes-only scope
# This is automated via Claude Agent - no manual commands needed
```

**What the Agent Does**:
1. Uninstalls Helm releases
2. Deletes namespace (cascades to all resources)
3. Verifies cleanup complete

**Manual Commands** (if needed):
```bash
# Uninstall releases
helm uninstall todo-frontend -n todo
helm uninstall todo-backend -n todo

# Delete namespace
kubectl delete namespace todo --wait=true

# Verify cleanup
kubectl get all -n todo
```

### Option 2: Full Cleanup (Kubernetes + Docker Images)

```bash
# Run agent with full scope
# This is automated via Claude Agent - no manual commands needed
```

**What the Agent Does**:
1. Uninstalls Helm releases
2. Deletes namespace
3. Removes Docker images

**Manual Commands** (if needed):
```bash
# Remove Kubernetes resources
helm uninstall todo-frontend -n todo
helm uninstall todo-backend -n todo
kubectl delete namespace todo

# Remove Docker images
docker rmi todo-frontend:v1.0.0
docker rmi todo-backend:v1.0.0
```

### Stop Minikube (Optional)

```bash
# Stop cluster (preserves state)
minikube stop

# Delete cluster (removes all data)
minikube delete
```

**Time**: ~2 minutes

---

## Troubleshooting Guide

### Issue: Minikube won't start

**Symptoms**: `minikube start` fails or times out

**Solutions**:
1. Ensure Docker Desktop is running
2. Try different driver: `minikube start --driver=hyperv`
3. Delete and recreate: `minikube delete && minikube start`
4. Check system resources (need 4 CPUs, 8GB RAM available)

### Issue: Pods stuck in Pending

**Symptoms**: Pods don't reach Running state

**Solutions**:
1. Check resource availability: `kubectl describe nodes`
2. Check pod events: `kubectl describe pod <pod-name> -n todo`
3. Verify image exists: `docker images | grep todo`
4. Check resource limits in Helm values.yaml

### Issue: Image pull errors

**Symptoms**: `ImagePullBackOff` or `ErrImagePull`

**Solutions**:
1. Verify images exist locally: `docker images`
2. Check image pull policy in values.yaml (should be `IfNotPresent`)
3. Load images into Minikube: `minikube image load todo-frontend:v1.0.0`

### Issue: Health checks failing

**Symptoms**: Pods restart frequently, readiness probes fail

**Solutions**:
1. Check pod logs: `kubectl logs <pod-name> -n todo`
2. Verify health endpoints exist in application
3. Increase initialDelaySeconds in values.yaml
4. Test health endpoint manually: `kubectl exec -it <pod-name> -n todo -- curl localhost:3000/api/health`

### Issue: Resource limits exceeded

**Symptoms**: Pods pending due to insufficient resources

**Solutions**:
1. Check resource usage: `kubectl top nodes`
2. Reduce replica counts in values.yaml
3. Reduce resource requests/limits in values.yaml
4. Increase Minikube resources: `minikube start --cpus=6 --memory=10240`

### Issue: Deployment takes too long

**Symptoms**: Deployment exceeds 15-minute constraint

**Solutions**:
1. Check Docker build cache is working
2. Ensure good internet connection for base image pulls
3. Optimize Dockerfiles (multi-stage builds, layer caching)
4. Use local image registry to avoid repeated pulls

---

## Next Steps

After successful deployment:

1. **Test Application**: Access frontend and verify Todo Chatbot functionality
2. **Monitor Cluster**: Use kubectl-ai or Kagent for AI-powered monitoring
3. **Run Validation**: Execute deployment-validation.yaml checks
4. **Test Idempotency**: Re-run deployment to verify repeatability
5. **Document Results**: Create deployment validation report

---

## Additional Resources

- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **Helm Documentation**: https://helm.sh/docs/
- **Minikube Documentation**: https://minikube.sigs.k8s.io/docs/
- **Docker Documentation**: https://docs.docker.com/
- **Phase IV Constitution**: `.specify/memory/constitution.md`
- **Deployment Architecture**: `specs/001-local-k8s-deployment/deployment-architecture.md`
- **Agent Skills**: `specs/001-local-k8s-deployment/agent-skills.md`

---

## Support

For issues or questions:
1. Check troubleshooting guide above
2. Review agent SKILL.md files in `.claude/skills/`
3. Check deployment validation contract
4. Review pod logs and Kubernetes events
5. Consult Phase IV constitution for requirements

**Deployment Status**: Ready for hackathon demonstration! 🚀
