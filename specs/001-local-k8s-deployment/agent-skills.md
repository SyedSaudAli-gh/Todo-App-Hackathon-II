# Phase 1: Agent Skills Specification

**Feature**: Local Kubernetes Deployment
**Date**: 2026-02-07
**Status**: Complete
**Prerequisites**: deployment-architecture.md complete

## Overview

This document specifies the SKILL.md requirements for each of the 6 Claude Agents used in Phase IV deployment automation. Each agent has a dedicated SKILL.md file that defines its purpose, inputs, outputs, success criteria, and error handling.

---

## Agent 1: docker-build-optimizer

### Purpose
Build optimized Docker images for frontend and backend applications using multi-stage builds with layer caching and size optimization.

### SKILL.md Location
`.claude/skills/docker-build.skill.md`

### Inputs
- **Source Directories**:
  - Frontend: `web/` (Next.js application)
  - Backend: `api/` (FastAPI application)
- **Version Tag**: Image version (e.g., `v1.0.0`)
- **Build Context**: Current working directory (repository root)

### Outputs
- **Docker Images**:
  - `todo-frontend:v1.0.0` (target size: < 200MB)
  - `todo-backend:v1.0.0` (target size: < 300MB)
- **Build Logs**: Detailed build output for debugging
- **Image Metadata**: Size, layers, creation timestamp

### Success Criteria
1. ✅ Frontend image builds successfully
2. ✅ Backend image builds successfully
3. ✅ Frontend image size under 200MB
4. ✅ Backend image size under 300MB
5. ✅ Images tagged with correct version
6. ✅ Build completes in under 8 minutes total (frontend 3min, backend 5min)
7. ✅ No build errors or warnings

### Execution Steps
1. **Generate Dockerfiles** (if not exist):
   - Create `web/Dockerfile` with multi-stage build for Next.js
   - Create `api/Dockerfile` with multi-stage build for FastAPI
   - Create `.dockerignore` files to exclude unnecessary files

2. **Build Frontend Image**:
   ```bash
   docker build -t todo-frontend:v1.0.0 -f web/Dockerfile web/
   ```

3. **Build Backend Image**:
   ```bash
   docker build -t todo-backend:v1.0.0 -f api/Dockerfile api/
   ```

4. **Verify Images**:
   ```bash
   docker images | grep todo-frontend
   docker images | grep todo-backend
   ```

5. **Check Image Sizes**:
   ```bash
   docker inspect todo-frontend:v1.0.0 --format='{{.Size}}'
   docker inspect todo-backend:v1.0.0 --format='{{.Size}}'
   ```

### Error Handling

**Error: Docker daemon not running**
- **Detection**: `Cannot connect to the Docker daemon`
- **Remediation**: Start Docker Desktop, wait for daemon to be ready
- **Exit Code**: 1

**Error: Build failure (dependency issues)**
- **Detection**: `ERROR [stage X/Y]` in build output
- **Remediation**: Check Dockerfile syntax, verify dependencies in package.json/requirements.txt
- **Exit Code**: 2

**Error: Image size exceeds target**
- **Detection**: Image size > 200MB (frontend) or > 300MB (backend)
- **Remediation**: Review Dockerfile for optimization opportunities, check .dockerignore
- **Exit Code**: 3

**Error: Disk space insufficient**
- **Detection**: `no space left on device`
- **Remediation**: Clean up unused Docker images (`docker system prune`), free disk space
- **Exit Code**: 4

### Validation Commands
```bash
# Verify images exist
docker images todo-frontend:v1.0.0
docker images todo-backend:v1.0.0

# Check image sizes
docker inspect todo-frontend:v1.0.0 --format='{{.Size}}' | awk '{print $1/1024/1024 " MB"}'
docker inspect todo-backend:v1.0.0 --format='{{.Size}}' | awk '{print $1/1024/1024 " MB"}'

# Verify image layers
docker history todo-frontend:v1.0.0
docker history todo-backend:v1.0.0
```

---

## Agent 2: docker-container-runner

### Purpose
Test Docker containers locally before deployment to verify they start correctly, health checks pass, and no runtime errors occur.

### SKILL.md Location
`.claude/skills/docker-run.skill.md`

### Inputs
- **Docker Images**:
  - `todo-frontend:v1.0.0`
  - `todo-backend:v1.0.0`
- **Test Duration**: 60 seconds (time to wait for health checks)
- **Environment Variables**: Required for backend (DATABASE_URL, OPENROUTER_API_KEY)

### Outputs
- **Container Status**: Running, Exited, Error
- **Health Check Results**: Pass/Fail for each container
- **Container Logs**: Startup logs for debugging
- **Test Report**: Summary of test results

### Success Criteria
1. ✅ Frontend container starts successfully
2. ✅ Backend container starts successfully
3. ✅ Frontend health check endpoint responds (GET /api/health → 200 OK)
4. ✅ Backend health check endpoint responds (GET /health → 200 OK)
5. ✅ No errors in container logs
6. ✅ Containers run for at least 60 seconds without crashing

### Execution Steps
1. **Start Frontend Container**:
   ```bash
   docker run -d --name test-frontend -p 3000:3000 todo-frontend:v1.0.0
   ```

2. **Start Backend Container**:
   ```bash
   docker run -d --name test-backend -p 8000:8000 \
     -e DATABASE_URL="$DATABASE_URL" \
     -e OPENROUTER_API_KEY="$OPENROUTER_API_KEY" \
     todo-backend:v1.0.0
   ```

3. **Wait for Startup** (30 seconds):
   ```bash
   sleep 30
   ```

4. **Test Frontend Health Check**:
   ```bash
   curl -f http://localhost:3000/api/health
   ```

5. **Test Backend Health Check**:
   ```bash
   curl -f http://localhost:8000/health
   ```

6. **Check Container Logs**:
   ```bash
   docker logs test-frontend
   docker logs test-backend
   ```

7. **Stop and Remove Containers**:
   ```bash
   docker stop test-frontend test-backend
   docker rm test-frontend test-backend
   ```

### Error Handling

**Error: Container fails to start**
- **Detection**: Container exits immediately or status is "Exited"
- **Remediation**: Check container logs, verify image is correct, check port conflicts
- **Exit Code**: 1

**Error: Health check fails**
- **Detection**: HTTP request returns non-200 status or times out
- **Remediation**: Check application logs, verify health endpoint exists, check network connectivity
- **Exit Code**: 2

**Error: Port already in use**
- **Detection**: `port is already allocated`
- **Remediation**: Stop conflicting containers, use different ports for testing
- **Exit Code**: 3

**Error: Environment variables missing**
- **Detection**: Backend fails to start due to missing DATABASE_URL or OPENROUTER_API_KEY
- **Remediation**: Set required environment variables before running agent
- **Exit Code**: 4

### Validation Commands
```bash
# Check container status
docker ps -a | grep test-frontend
docker ps -a | grep test-backend

# Test health endpoints
curl -v http://localhost:3000/api/health
curl -v http://localhost:8000/health

# View container logs
docker logs test-frontend --tail 50
docker logs test-backend --tail 50
```

---

## Agent 3: helm-chart-generator

### Purpose
Generate Helm charts with validated templates, parameterized configuration, and proper resource definitions for frontend and backend services.

### SKILL.md Location
`.claude/skills/helm-generate.skill.md`

### Inputs
- **Application Configuration**:
  - Replica counts (frontend: 2, backend: 2)
  - Resource limits (from deployment-architecture.md)
  - Image tags (v1.0.0)
  - Service ports (frontend: 3000, backend: 8000)
- **Chart Metadata**:
  - Chart name, version, description
  - Maintainer information

### Outputs
- **Helm Charts**:
  - `helm/todo-frontend/` (complete chart directory)
  - `helm/todo-backend/` (complete chart directory)
- **Chart Files**:
  - Chart.yaml (metadata)
  - values.yaml (configuration)
  - templates/ (Kubernetes manifests)
- **Validation Report**: `helm lint` results

### Success Criteria
1. ✅ Frontend chart directory created with all required files
2. ✅ Backend chart directory created with all required files
3. ✅ Charts pass `helm lint` validation (no errors)
4. ✅ Templates render correctly with `helm template`
5. ✅ values.yaml contains all required parameters
6. ✅ Resource limits match deployment-architecture.md specifications

### Execution Steps
1. **Create Chart Directories**:
   ```bash
   mkdir -p helm/todo-frontend/templates
   mkdir -p helm/todo-backend/templates
   ```

2. **Generate Frontend Chart**:
   - Create `helm/todo-frontend/Chart.yaml`
   - Create `helm/todo-frontend/values.yaml`
   - Create `helm/todo-frontend/templates/deployment.yaml`
   - Create `helm/todo-frontend/templates/service.yaml`
   - Create `helm/todo-frontend/templates/configmap.yaml`
   - Create `helm/todo-frontend/templates/_helpers.tpl`

3. **Generate Backend Chart**:
   - Create `helm/todo-backend/Chart.yaml`
   - Create `helm/todo-backend/values.yaml`
   - Create `helm/todo-backend/templates/deployment.yaml`
   - Create `helm/todo-backend/templates/service.yaml`
   - Create `helm/todo-backend/templates/configmap.yaml`
   - Create `helm/todo-backend/templates/secret.yaml`
   - Create `helm/todo-backend/templates/_helpers.tpl`

4. **Validate Charts**:
   ```bash
   helm lint helm/todo-frontend
   helm lint helm/todo-backend
   ```

5. **Test Template Rendering**:
   ```bash
   helm template todo-frontend helm/todo-frontend
   helm template todo-backend helm/todo-backend
   ```

### Error Handling

**Error: Chart.yaml syntax error**
- **Detection**: `helm lint` reports YAML parsing error
- **Remediation**: Fix YAML syntax, verify indentation
- **Exit Code**: 1

**Error: Template rendering fails**
- **Detection**: `helm template` returns error
- **Remediation**: Check template syntax, verify values.yaml references
- **Exit Code**: 2

**Error: Missing required values**
- **Detection**: Template references undefined value
- **Remediation**: Add missing values to values.yaml
- **Exit Code**: 3

**Error: Invalid resource limits**
- **Detection**: Resource limits exceed cluster capacity
- **Remediation**: Adjust resource limits in values.yaml
- **Exit Code**: 4

### Validation Commands
```bash
# Lint charts
helm lint helm/todo-frontend
helm lint helm/todo-backend

# Render templates
helm template todo-frontend helm/todo-frontend --debug
helm template todo-backend helm/todo-backend --debug

# Verify chart structure
tree helm/todo-frontend
tree helm/todo-backend
```

---

## Agent 4: k8s-deploy-agent

### Purpose
Deploy Helm charts to Minikube cluster, create namespace, wait for pods to reach Running state, and verify health checks pass.

### SKILL.md Location
`.claude/skills/k8s-deploy.skill.md`

### Inputs
- **Helm Charts**:
  - `helm/todo-frontend/`
  - `helm/todo-backend/`
- **Namespace**: `todo`
- **Release Names**: `todo-frontend`, `todo-backend`
- **Timeout**: 5 minutes per deployment

### Outputs
- **Deployment Status**: Success/Failure for each release
- **Pod Status**: Running, Pending, Failed for each pod
- **Service Endpoints**: ClusterIP addresses and ports
- **Deployment Logs**: Helm output and Kubernetes events

### Success Criteria
1. ✅ Namespace `todo` created
2. ✅ Frontend release deployed successfully
3. ✅ Backend release deployed successfully
4. ✅ All pods reach Running state within 5 minutes
5. ✅ Health checks pass for all pods (liveness and readiness)
6. ✅ Services are accessible within cluster
7. ✅ No errors in Kubernetes events

### Execution Steps
1. **Verify Minikube Running**:
   ```bash
   minikube status
   ```

2. **Create Namespace**:
   ```bash
   kubectl create namespace todo --dry-run=client -o yaml | kubectl apply -f -
   ```

3. **Deploy Frontend**:
   ```bash
   helm upgrade --install todo-frontend ./helm/todo-frontend \
     --namespace todo \
     --wait \
     --timeout 5m
   ```

4. **Deploy Backend**:
   ```bash
   helm upgrade --install todo-backend ./helm/todo-backend \
     --namespace todo \
     --wait \
     --timeout 5m
   ```

5. **Verify Pod Status**:
   ```bash
   kubectl get pods -n todo
   kubectl wait --for=condition=Ready pod -l app=todo-frontend -n todo --timeout=300s
   kubectl wait --for=condition=Ready pod -l app=todo-backend -n todo --timeout=300s
   ```

6. **Check Services**:
   ```bash
   kubectl get services -n todo
   ```

7. **Verify Health Checks**:
   ```bash
   kubectl describe pods -n todo | grep -A 5 "Liveness\|Readiness"
   ```

### Error Handling

**Error: Minikube not running**
- **Detection**: `minikube status` shows "Stopped" or error
- **Remediation**: Start Minikube with `minikube start --cpus=4 --memory=8192`
- **Exit Code**: 1

**Error: Helm deployment fails**
- **Detection**: `helm upgrade` returns non-zero exit code
- **Remediation**: Check Helm output, verify chart syntax, check resource availability
- **Exit Code**: 2

**Error: Pods fail to start**
- **Detection**: Pods stuck in Pending, CrashLoopBackOff, or Error state
- **Remediation**: Check pod logs, verify image exists, check resource limits
- **Exit Code**: 3

**Error: Image pull failure**
- **Detection**: `ImagePullBackOff` or `ErrImagePull` in pod status
- **Remediation**: Verify images exist locally, check image pull policy
- **Exit Code**: 4

**Error: Resource limits exceeded**
- **Detection**: Pods pending due to insufficient CPU/memory
- **Remediation**: Reduce resource requests or increase cluster resources
- **Exit Code**: 5

### Validation Commands
```bash
# Check namespace
kubectl get namespace todo

# Check deployments
kubectl get deployments -n todo

# Check pods
kubectl get pods -n todo -o wide

# Check services
kubectl get services -n todo

# Check events
kubectl get events -n todo --sort-by='.lastTimestamp'

# Describe pods
kubectl describe pods -n todo
```

---

## Agent 5: k8s-cleanup

### Purpose
Remove all Kubernetes resources from the todo namespace, delete the namespace, and optionally remove Docker images to fully reset the environment.

### SKILL.md Location
`.claude/skills/k8s-cleanup.skill.md`

### Inputs
- **Namespace**: `todo`
- **Release Names**: `todo-frontend`, `todo-backend`
- **Cleanup Scope**:
  - `kubernetes-only`: Remove Kubernetes resources only
  - `full`: Remove Kubernetes resources and Docker images

### Outputs
- **Cleanup Status**: Success/Failure
- **Removed Resources**: List of deleted resources
- **Cleanup Logs**: Detailed output of cleanup operations

### Success Criteria
1. ✅ Frontend release uninstalled
2. ✅ Backend release uninstalled
3. ✅ All pods deleted
4. ✅ All services deleted
5. ✅ Namespace deleted
6. ✅ No orphaned resources remain
7. ✅ Docker images removed (if full cleanup)

### Execution Steps
1. **Uninstall Helm Releases**:
   ```bash
   helm uninstall todo-frontend -n todo
   helm uninstall todo-backend -n todo
   ```

2. **Delete Namespace** (cascades to all resources):
   ```bash
   kubectl delete namespace todo --wait=true --timeout=120s
   ```

3. **Verify Cleanup**:
   ```bash
   kubectl get all -n todo
   kubectl get namespace todo
   ```

4. **Remove Docker Images** (if full cleanup):
   ```bash
   docker rmi todo-frontend:v1.0.0
   docker rmi todo-backend:v1.0.0
   ```

### Error Handling

**Error: Helm release not found**
- **Detection**: `Error: release: not found`
- **Remediation**: Release already deleted, continue with namespace deletion
- **Exit Code**: 0 (not an error)

**Error: Namespace stuck in Terminating**
- **Detection**: Namespace remains in Terminating state after timeout
- **Remediation**: Force delete with `kubectl delete namespace todo --grace-period=0 --force`
- **Exit Code**: 1

**Error: Resources in use**
- **Detection**: Deletion blocked by finalizers or dependencies
- **Remediation**: Remove finalizers, check for dependent resources
- **Exit Code**: 2

**Error: Docker image in use**
- **Detection**: `image is being used by running container`
- **Remediation**: Stop and remove containers first
- **Exit Code**: 3

### Validation Commands
```bash
# Verify releases deleted
helm list -n todo

# Verify namespace deleted
kubectl get namespace todo

# Verify no orphaned resources
kubectl get all --all-namespaces | grep todo

# Verify Docker images removed
docker images | grep todo
```

---

## Agent 6: cluster-health-monitor

### Purpose
Monitor cluster health, pod status, resource usage, and health check results to ensure deployment remains stable and within resource constraints.

### SKILL.md Location
`.claude/skills/cluster-monitor.skill.md`

### Inputs
- **Namespace**: `todo`
- **Monitoring Interval**: 30 seconds
- **Resource Thresholds**:
  - CPU: 4 CPUs (hard limit)
  - Memory: 8GB (hard limit)
  - Warning threshold: 80% of limits

### Outputs
- **Pod Status Report**: Status of all pods (Running, Pending, Failed)
- **Resource Usage Metrics**: CPU and memory per pod, total cluster usage
- **Health Check Results**: Liveness and readiness probe status
- **Cluster Events**: Recent warnings and errors
- **Monitoring Report**: Summary of cluster health

### Success Criteria
1. ✅ All pods in Running state
2. ✅ Total CPU usage under 4 CPUs
3. ✅ Total memory usage under 8GB
4. ✅ All health checks passing (100% success rate)
5. ✅ No CrashLoopBackOff or Error states
6. ✅ No critical events in last 5 minutes

### Execution Steps
1. **Check Pod Status**:
   ```bash
   kubectl get pods -n todo -o wide
   ```

2. **Check Resource Usage**:
   ```bash
   kubectl top pods -n todo
   kubectl top nodes
   ```

3. **Check Health Probes**:
   ```bash
   kubectl describe pods -n todo | grep -A 10 "Liveness\|Readiness"
   ```

4. **Check Events**:
   ```bash
   kubectl get events -n todo --sort-by='.lastTimestamp' | tail -20
   ```

5. **Generate Report**:
   - Pod count and status
   - Resource usage summary
   - Health check status
   - Recent events
   - Recommendations (if any)

### Error Handling

**Error: kubectl connection failure**
- **Detection**: `Unable to connect to the server`
- **Remediation**: Verify Minikube is running, check kubectl context
- **Exit Code**: 1

**Error: Metrics server not available**
- **Detection**: `error: Metrics API not available`
- **Remediation**: Enable metrics server in Minikube (`minikube addons enable metrics-server`)
- **Exit Code**: 2

**Warning: Resource usage high**
- **Detection**: CPU or memory usage > 80% of limits
- **Remediation**: Log warning, recommend reducing replica counts or resource requests
- **Exit Code**: 0 (warning, not error)

**Error: Pods not healthy**
- **Detection**: Pods in CrashLoopBackOff, Error, or health checks failing
- **Remediation**: Check pod logs, investigate application issues
- **Exit Code**: 3

### Validation Commands
```bash
# Pod status
kubectl get pods -n todo

# Resource usage
kubectl top pods -n todo
kubectl top nodes

# Health checks
kubectl get pods -n todo -o json | jq '.items[] | {name: .metadata.name, ready: .status.conditions[] | select(.type=="Ready") | .status}'

# Events
kubectl get events -n todo --field-selector type=Warning

# Logs
kubectl logs -n todo -l app=todo-frontend --tail=50
kubectl logs -n todo -l app=todo-backend --tail=50
```

---

## Agent Execution Summary

| Agent | Purpose | Inputs | Outputs | Success Criteria |
|-------|---------|--------|---------|------------------|
| docker-build-optimizer | Build Docker images | Source code, version tag | Docker images | Images built, sizes under targets |
| docker-container-runner | Test containers locally | Docker images | Health check results | Containers start, health checks pass |
| helm-chart-generator | Generate Helm charts | App config, resources | Helm charts | Charts pass lint, templates valid |
| k8s-deploy-agent | Deploy to Minikube | Helm charts, namespace | Deployment status | Pods Running, health checks pass |
| k8s-cleanup | Remove resources | Namespace, releases | Cleanup status | All resources deleted |
| cluster-health-monitor | Monitor cluster | Namespace, thresholds | Health report | Resources under limits, no errors |

---

## Implementation Readiness

All agent skill specifications complete. Ready to proceed to contracts and quickstart guide.

**Next Steps**:
1. Create contracts/ directory with Helm chart contracts
2. Create quickstart.md with deployment guide
3. Update agent context with Phase IV technologies
