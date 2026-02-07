# Phase 1: Deployment Architecture Design

**Feature**: Local Kubernetes Deployment
**Date**: 2026-02-07
**Status**: Complete
**Prerequisites**: research.md complete

## 1. Kubernetes Cluster Architecture

### Cluster Configuration

**Platform**: Minikube (local Kubernetes cluster)
**Version**: Kubernetes 1.28+
**Driver**: Docker (uses Docker Desktop as container runtime)
**Resources**: 4 CPUs, 8GB RAM

**Cluster Initialization**:
```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

### Namespace Design

**Primary Namespace**: `todo`
- **Purpose**: Isolate all Todo Chatbot resources
- **Resources**: Deployments, Services, ConfigMaps, Secrets, Pods
- **Benefits**: Clean separation, easy cleanup, resource quotas

**System Namespaces** (Minikube default):
- `kube-system`: Kubernetes system components
- `kube-public`: Public cluster information
- `default`: Default namespace (not used for this deployment)

### Network Topology

**Service Discovery**: DNS-based within cluster
- Frontend service: `todo-frontend.todo.svc.cluster.local`
- Backend service: `todo-backend.todo.svc.cluster.local`

**Service Types**:
- **ClusterIP** (internal only): Frontend and backend services
- **NodePort** (optional): For external access during demonstration

**Network Flow**:
```
External Access (optional)
    ↓
NodePort Service (if enabled)
    ↓
Frontend Service (ClusterIP)
    ↓
Frontend Pods (2 replicas)
    ↓
Backend Service (ClusterIP)
    ↓
Backend Pods (2 replicas)
    ↓
External Database (Neon PostgreSQL)
```

### Resource Quotas and Limits

**Namespace Resource Quota**:
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: todo-quota
  namespace: todo
spec:
  hard:
    requests.cpu: "3"
    requests.memory: "6Gi"
    limits.cpu: "4"
    limits.memory: "8Gi"
    pods: "10"
```

**Pod Resource Allocation**:
- Frontend: 0.5 CPU request / 0.75 CPU limit, 1GB request / 1.5GB limit per pod
- Backend: 0.75 CPU request / 1 CPU limit, 1.5GB request / 2GB limit per pod
- Total: 2.5 CPUs request / 3.5 CPUs limit, 5GB request / 7GB limit

---

## 2. Docker Image Architecture

### Frontend Image (Next.js)

**Base Image**: `node:20-alpine`
**Final Image Size Target**: < 200MB

**Multi-Stage Build Design**:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
CMD ["npm", "start"]
```

**Layer Optimization Strategy**:
1. Separate dependency installation from source code copy
2. Use `.dockerignore` to exclude unnecessary files
3. Multi-stage build discards build artifacts
4. Alpine base image minimizes size

**Health Check Implementation**:
- Endpoint: `/api/health`
- Interval: 30 seconds
- Timeout: 5 seconds
- Retries: 3 attempts

**Security**:
- Non-root user: `nextjs` (UID 1001)
- Read-only filesystem where possible
- No secrets in image layers

### Backend Image (FastAPI)

**Base Image**: `python:3.13-slim`
**Final Image Size Target**: < 300MB

**Multi-Stage Build Design**:

```dockerfile
# Stage 1: Dependencies
FROM python:3.13-slim AS deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Production
FROM python:3.13-slim AS runner
WORKDIR /app
ENV PYTHONUNBUFFERED=1
RUN addgroup --gid 1001 --system appuser && \
    adduser --uid 1001 --system --gid 1001 appuser
COPY --from=deps --chown=appuser:appuser /root/.local /home/appuser/.local
COPY --chown=appuser:appuser ./src ./src
COPY --chown=appuser:appuser ./alembic ./alembic
COPY --chown=appuser:appuser ./alembic.ini .
ENV PATH=/home/appuser/.local/bin:$PATH
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health').read()"
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Layer Optimization Strategy**:
1. Install dependencies in separate stage
2. Use `--no-cache-dir` to reduce image size
3. Slim base image instead of full Python image
4. Copy only necessary application files

**Health Check Implementation**:
- Endpoint: `/health`
- Interval: 30 seconds
- Timeout: 5 seconds
- Retries: 3 attempts

**Security**:
- Non-root user: `appuser` (UID 1001)
- No secrets in image layers
- Environment variables for configuration

---

## 3. Helm Chart Architecture

### Chart Structure

**Frontend Chart** (`helm/todo-frontend/`):
```
todo-frontend/
├── Chart.yaml           # Chart metadata
├── values.yaml          # Default configuration values
├── templates/
│   ├── deployment.yaml  # Pod specification
│   ├── service.yaml     # Service definition
│   ├── configmap.yaml   # Non-sensitive config
│   └── _helpers.tpl     # Template helpers
└── .helmignore          # Files to ignore
```

**Backend Chart** (`helm/todo-backend/`):
```
todo-backend/
├── Chart.yaml           # Chart metadata
├── values.yaml          # Default configuration values
├── templates/
│   ├── deployment.yaml  # Pod specification
│   ├── service.yaml     # Service definition
│   ├── configmap.yaml   # Non-sensitive config
│   ├── secret.yaml      # Sensitive data
│   └── _helpers.tpl     # Template helpers
└── .helmignore          # Files to ignore
```

### Values.yaml Parameterization

**Frontend values.yaml**:
```yaml
replicaCount: 2

image:
  repository: todo-frontend
  tag: v1.0.0
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 3000

resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 750m
    memory: 1.5Gi

healthCheck:
  enabled: true
  path: /api/health
  initialDelaySeconds: 10
  periodSeconds: 30
  timeoutSeconds: 5
  failureThreshold: 3

env:
  - name: NODE_ENV
    value: "production"
  - name: API_BASE_URL
    value: "http://todo-backend.todo.svc.cluster.local:8000"
```

**Backend values.yaml**:
```yaml
replicaCount: 2

image:
  repository: todo-backend
  tag: v1.0.0
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8000

resources:
  requests:
    cpu: 750m
    memory: 1.5Gi
  limits:
    cpu: 1000m
    memory: 2Gi

healthCheck:
  enabled: true
  path: /health
  initialDelaySeconds: 30
  periodSeconds: 30
  timeoutSeconds: 5
  failureThreshold: 3

env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: todo-backend-secret
        key: database-url
  - name: OPENROUTER_API_KEY
    valueFrom:
      secretKeyRef:
        name: todo-backend-secret
        key: openrouter-api-key
```

### Template Design Patterns

**Deployment Template** (deployment.yaml):
- Uses `{{ .Values.replicaCount }}` for replica count
- Uses `{{ .Values.image.repository }}:{{ .Values.image.tag }}` for image
- Uses `{{ .Values.resources }}` for resource limits
- Includes health probes from `{{ .Values.healthCheck }}`
- Environment variables from `{{ .Values.env }}`

**Service Template** (service.yaml):
- Uses `{{ .Values.service.type }}` for service type
- Uses `{{ .Values.service.port }}` for port
- Selector matches deployment labels

**ConfigMap Template** (configmap.yaml):
- Non-sensitive configuration only
- Environment-specific settings

**Secret Template** (secret.yaml - backend only):
- Base64-encoded sensitive data
- Database credentials, API keys

### Deployment Strategy

**RollingUpdate**:
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

**Benefits**:
- Zero-downtime updates
- Gradual rollout
- Automatic rollback on failure

---

## 4. Agent Workflow Architecture

### Agent Execution Sequence

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Workflow                       │
└─────────────────────────────────────────────────────────────┘

1. docker-build-optimizer
   ├─ Build frontend image (web/Dockerfile)
   ├─ Build backend image (api/Dockerfile)
   ├─ Tag images with version
   └─ Validation: Images exist, sizes under targets
        ↓ PASS

2. docker-container-runner
   ├─ Start frontend container locally
   ├─ Start backend container locally
   ├─ Test health check endpoints
   └─ Validation: Containers start, health checks pass
        ↓ PASS

3. helm-chart-generator
   ├─ Generate frontend Helm chart
   ├─ Generate backend Helm chart
   ├─ Run helm lint validation
   └─ Validation: Charts pass lint, templates valid
        ↓ PASS

4. k8s-deploy-agent
   ├─ Create todo namespace
   ├─ Deploy frontend chart (helm upgrade --install)
   ├─ Deploy backend chart (helm upgrade --install)
   ├─ Wait for pods to reach Running state
   └─ Validation: All pods Running, health checks pass
        ↓ PASS

5. cluster-health-monitor
   ├─ Check pod status
   ├─ Monitor resource usage
   ├─ Verify health checks
   └─ Validation: Resource usage under limits, no errors
        ↓ PASS

✅ Deployment Complete
```

### Agent Dependencies

**Sequential Dependencies**:
1. docker-build-optimizer → docker-container-runner (need images to test)
2. docker-container-runner → helm-chart-generator (validate images work)
3. helm-chart-generator → k8s-deploy-agent (need charts to deploy)
4. k8s-deploy-agent → cluster-health-monitor (need deployment to monitor)

**No Parallel Execution**: All agents run sequentially with validation gates

### Error Handling Strategy

**Validation Gate Failure**:
1. Stop execution immediately
2. Log detailed error message
3. Provide remediation steps
4. Preserve state for debugging

**Rollback Strategy**:
- Helm automatic rollback on deployment failure
- Manual rollback: `helm rollback <release> <revision>`
- Cleanup: k8s-cleanup agent removes all resources

**Retry Logic**:
- Transient failures: Retry up to 3 times with exponential backoff
- Permanent failures: Stop and report error

### Parallel Execution Opportunities

**None in Current Design**: Sequential execution chosen for reliability and debugging simplicity. Future optimization could parallelize:
- Frontend and backend image builds (independent)
- Frontend and backend chart generation (independent)

---

## Architecture Diagrams

### Cluster Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Minikube Cluster                        │
│                    (4 CPUs, 8GB RAM)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              todo Namespace                            │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Frontend Service (ClusterIP)                   │  │  │
│  │  │  Port: 3000                                      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │           │                                            │  │
│  │           ├─────────────┬─────────────┐               │  │
│  │           ▼             ▼             ▼               │  │
│  │  ┌──────────────┐ ┌──────────────┐                   │  │
│  │  │ Frontend Pod │ │ Frontend Pod │                   │  │
│  │  │ (Replica 1)  │ │ (Replica 2)  │                   │  │
│  │  │ 0.75 CPU     │ │ 0.75 CPU     │                   │  │
│  │  │ 1.5GB RAM    │ │ 1.5GB RAM    │                   │  │
│  │  └──────────────┘ └──────────────┘                   │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Backend Service (ClusterIP)                    │  │  │
│  │  │  Port: 8000                                      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │           │                                            │  │
│  │           ├─────────────┬─────────────┐               │  │
│  │           ▼             ▼             ▼               │  │
│  │  ┌──────────────┐ ┌──────────────┐                   │  │
│  │  │ Backend Pod  │ │ Backend Pod  │                   │  │
│  │  │ (Replica 1)  │ │ (Replica 2)  │                   │  │
│  │  │ 1 CPU        │ │ 1 CPU        │                   │  │
│  │  │ 2GB RAM      │ │ 2GB RAM      │                   │  │
│  │  └──────────────┘ └──────────────┘                   │  │
│  │           │                                            │  │
│  │           └────────────────────────────────────────┐  │  │
│  │                                                      │  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            ▼  │
│                                              External Database│
│                                              (Neon PostgreSQL)│
└─────────────────────────────────────────────────────────────┘
```

### Deployment Flow

```
Developer
    │
    ├─ Run docker-build-optimizer agent
    │       │
    │       ├─ Generate Dockerfiles (Claude)
    │       ├─ Build frontend image
    │       ├─ Build backend image
    │       └─ Tag images
    │
    ├─ Run docker-container-runner agent
    │       │
    │       ├─ Start frontend container
    │       ├─ Start backend container
    │       ├─ Test health checks
    │       └─ Stop containers
    │
    ├─ Run helm-chart-generator agent
    │       │
    │       ├─ Generate frontend chart
    │       ├─ Generate backend chart
    │       ├─ Validate with helm lint
    │       └─ Output charts to helm/
    │
    ├─ Run k8s-deploy-agent
    │       │
    │       ├─ Create todo namespace
    │       ├─ Deploy frontend (helm upgrade --install)
    │       ├─ Deploy backend (helm upgrade --install)
    │       ├─ Wait for pods Running
    │       └─ Verify health checks
    │
    └─ Run cluster-health-monitor agent
            │
            ├─ Check pod status
            ├─ Monitor resource usage
            ├─ Verify health checks
            └─ Report cluster health
```

---

## Implementation Readiness

All architectural designs complete. Ready to proceed to agent skills specification.

**Next Steps**:
1. Create agent-skills.md with detailed SKILL.md specifications
2. Create contracts/ directory with Helm chart contracts
3. Create quickstart.md with deployment guide
4. Update agent context with Phase IV technologies
