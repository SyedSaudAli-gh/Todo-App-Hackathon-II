# Deployment Architecture: Todo AI Chatbot on Minikube

**Feature**: Local Kubernetes Deployment of Phase III Todo AI Chatbot
**Branch**: `001-minikube-deployment`
**Date**: 2026-02-12
**Status**: Complete

This document describes the deployment architecture for the Todo AI Chatbot on a local Minikube Kubernetes cluster.

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Local Development Machine                       │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                      Minikube Cluster                           │   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────┐   │   │
│  │  │              Namespace: todo                            │   │   │
│  │  │                                                          │   │   │
│  │  │  ┌─────────────────────┐      ┌─────────────────────┐ │   │   │
│  │  │  │  Frontend Pod       │      │  Backend Pod        │ │   │   │
│  │  │  │  ┌───────────────┐ │      │  ┌───────────────┐  │ │   │   │
│  │  │  │  │  Next.js 15   │ │      │  │  FastAPI      │  │ │   │   │
│  │  │  │  │  React 19     │ │      │  │  Python 3.13  │  │ │   │   │
│  │  │  │  │  ChatKit UI   │ │      │  │  Agents SDK   │  │ │   │   │
│  │  │  │  │               │ │      │  │  MCP Server   │  │ │   │   │
│  │  │  │  │  Port: 3000   │ │      │  │  Port: 8000   │  │ │   │   │
│  │  │  │  └───────────────┘ │      │  └───────────────┘  │ │   │   │
│  │  │  │                     │      │                     │ │   │   │
│  │  │  │  Resources:         │      │  Resources:         │ │   │   │
│  │  │  │  CPU: 50m-200m     │      │  CPU: 100m-500m    │ │   │   │
│  │  │  │  Mem: 64Mi-256Mi   │      │  Mem: 128Mi-512Mi  │ │   │   │
│  │  │  └─────────────────────┘      └─────────────────────┘ │   │   │
│  │  │           │                              │              │   │   │
│  │  │           │                              │              │   │   │
│  │  │  ┌────────▼──────────┐      ┌───────────▼──────────┐ │   │   │
│  │  │  │  Service          │      │  Service             │ │   │   │
│  │  │  │  todo-frontend    │      │  todo-backend        │ │   │   │
│  │  │  │  Type: NodePort   │      │  Type: NodePort      │ │   │   │
│  │  │  │  Port: 3000       │      │  Port: 8000          │ │   │   │
│  │  │  │  NodePort: 30030  │      │  NodePort: 30080     │ │   │   │
│  │  │  └───────────────────┘      └──────────────────────┘ │   │   │
│  │  │                                                        │   │   │
│  │  │  ┌──────────────────────────────────────────────────┐│   │   │
│  │  │  │  ConfigMap: todo-config                          ││   │   │
│  │  │  │  - FRONTEND_URL: http://localhost:30030          ││   │   │
│  │  │  │  - API_URL: http://localhost:30080               ││   │   │
│  │  │  └──────────────────────────────────────────────────┘│   │   │
│  │  │                                                        │   │   │
│  │  │  ┌──────────────────────────────────────────────────┐│   │   │
│  │  │  │  Secret: todo-secrets                            ││   │   │
│  │  │  │  - DATABASE_URL: postgresql://...                ││   │   │
│  │  │  │  - OPENROUTER_API_KEY: sk-...                    ││   │   │
│  │  │  └──────────────────────────────────────────────────┘│   │   │
│  │  │                                                        │   │   │
│  │  └────────────────────────────────────────────────────────┘   │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────────┐                                                     │
│  │  Docker Images │                                                     │
│  │  - todo-backend:v1.0.0                                              │
│  │  - todo-frontend:v1.0.0                                             │
│  └────────────────┘                                                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ External Connections
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
         ┌──────────▼──────────┐       ┌───────────▼──────────┐
         │  Neon PostgreSQL    │       │  OpenRouter API      │
         │  (External DB)      │       │  (AI Provider)       │
         │  Serverless         │       │  Gemini Models       │
         └─────────────────────┘       └──────────────────────┘
```

---

## Component Interactions

### User → Frontend Flow

1. **User accesses application**:
   - Browser → `http://localhost:30030` (NodePort)
   - Minikube routes to Frontend Service
   - Service routes to Frontend Pod
   - Next.js serves React application with ChatKit UI

2. **Frontend loads configuration**:
   - Reads `NEXT_PUBLIC_API_URL` from ConfigMap
   - Configures API client to point to Backend Service

### Frontend → Backend Flow

1. **User interacts with chatbot**:
   - User types message in ChatKit UI
   - Frontend sends POST request to `/api/chat` endpoint
   - Request routed through Backend Service (NodePort 30080)
   - Backend Pod receives request

2. **Backend processes request**:
   - FastAPI validates request with Pydantic models
   - Extracts conversation context from database
   - Invokes OpenAI Agents SDK with user message
   - Agent uses MCP tools to perform task operations

### Backend → Database Flow

1. **Backend connects to database**:
   - Reads `DATABASE_URL` from Secret
   - Establishes connection to Neon PostgreSQL (external)
   - Uses SQLModel ORM for database operations

2. **MCP Server performs operations**:
   - Agent invokes MCP tool (e.g., `create_task`)
   - MCP Server validates input
   - MCP Server executes database query
   - Returns structured response to Agent

3. **Data persistence**:
   - Conversations stored in `conversations` table
   - Messages stored in `messages` table
   - Tool calls stored in `tool_calls` table
   - Tasks stored in `tasks` table

### Backend → OpenRouter Flow

1. **Agent generates response**:
   - Reads `OPENROUTER_API_KEY` from Secret
   - Configures Agents SDK with OpenRouter base URL
   - Sends conversation context to Gemini model via OpenRouter
   - Receives AI-generated response

2. **Response flow**:
   - Agent processes AI response
   - Executes tool calls if needed
   - Persists message and tool calls to database
   - Returns response to Frontend

---

## Network Flow

### External Access (User → Application)

```
User Browser
    │
    │ HTTP Request
    │
    ▼
http://localhost:30030 (Frontend NodePort)
    │
    │ Minikube routes to Service
    │
    ▼
Service: todo-frontend (ClusterIP: 10.96.x.x, Port: 3000)
    │
    │ Service routes to Pod
    │
    ▼
Pod: todo-frontend-xxx (IP: 10.244.x.x, Port: 3000)
    │
    │ Next.js serves application
    │
    ▼
User receives HTML/JS/CSS
```

### Internal Communication (Frontend → Backend)

```
Frontend Pod (10.244.x.x:3000)
    │
    │ HTTP Request to API_URL
    │
    ▼
http://localhost:30080/api/chat (Backend NodePort)
    │
    │ Minikube routes to Service
    │
    ▼
Service: todo-backend (ClusterIP: 10.96.x.x, Port: 8000)
    │
    │ Service routes to Pod
    │
    ▼
Pod: todo-backend-xxx (IP: 10.244.x.x, Port: 8000)
    │
    │ FastAPI processes request
    │
    ▼
Backend returns JSON response
```

### External Database Connection (Backend → Neon)

```
Backend Pod (10.244.x.x:8000)
    │
    │ PostgreSQL connection
    │ DATABASE_URL from Secret
    │
    ▼
Minikube Node (NAT)
    │
    │ Outbound connection
    │
    ▼
Internet
    │
    │ TLS connection
    │
    ▼
Neon PostgreSQL (External)
    │
    │ Query execution
    │
    ▼
Backend receives query results
```

### External API Connection (Backend → OpenRouter)

```
Backend Pod (10.244.x.x:8000)
    │
    │ HTTPS request
    │ OPENROUTER_API_KEY from Secret
    │
    ▼
Minikube Node (NAT)
    │
    │ Outbound connection
    │
    ▼
Internet
    │
    │ TLS connection
    │
    ▼
OpenRouter API (External)
    │
    │ Routes to Gemini
    │
    ▼
Backend receives AI response
```

---

## Resource Organization

### Namespace: `todo`

All application resources deployed to dedicated namespace for isolation and easy cleanup.

**Benefits**:
- Logical separation from other Minikube resources
- Easy cleanup: `kubectl delete namespace todo`
- Resource quotas can be applied at namespace level
- RBAC policies can be scoped to namespace

### Labels

**Frontend Resources**:
```yaml
labels:
  app: todo-frontend
  component: frontend
  tier: presentation
  version: v1.0.0
```

**Backend Resources**:
```yaml
labels:
  app: todo-backend
  component: backend
  tier: application
  version: v1.0.0
```

**Selectors**:
- Services use `app` label for pod selection
- Deployments use `app` label for replica management
- kubectl commands can filter by labels: `kubectl get pods -l app=todo-backend`

---

## Health Checks

### Frontend Health Checks

**Liveness Probe**:
```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

**Readiness Probe**:
```yaml
readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Backend Health Checks

**Liveness Probe**:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

**Readiness Probe**:
```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

**Health Check Behavior**:
- **Liveness**: Kubernetes restarts container if probe fails 3 times
- **Readiness**: Kubernetes removes pod from service endpoints if probe fails
- **Initial Delay**: Allows application to start before first probe
- **Period**: How often to perform probe
- **Timeout**: How long to wait for probe response
- **Failure Threshold**: How many failures before action taken

---

## Resource Limits

### Frontend Resources

```yaml
resources:
  requests:
    cpu: 50m        # 0.05 CPU cores
    memory: 64Mi    # 64 megabytes
  limits:
    cpu: 200m       # 0.2 CPU cores
    memory: 256Mi   # 256 megabytes
```

**Rationale**:
- Next.js is relatively lightweight
- Minimal CPU for serving static assets
- Memory sufficient for Node.js runtime

### Backend Resources

```yaml
resources:
  requests:
    cpu: 100m       # 0.1 CPU cores
    memory: 128Mi   # 128 megabytes
  limits:
    cpu: 500m       # 0.5 CPU cores
    memory: 512Mi   # 512 megabytes
```

**Rationale**:
- FastAPI + Agents SDK requires more resources
- CPU for AI agent processing
- Memory for conversation context and MCP operations

### Total Cluster Requirements

- **Minimum**: 2 CPU cores, 4GB RAM for Minikube
- **Application**: 150m CPU requests, 192Mi memory requests
- **Headroom**: Sufficient for Kubernetes system components

---

## Deployment Strategy

### Rolling Update Strategy

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

**Behavior**:
- New pod created before old pod terminated
- Zero downtime during updates
- Gradual rollout of changes
- Automatic rollback on failure

### Update Process

1. **Helm upgrade initiated**:
   ```bash
   helm upgrade todo-backend ./helm/todo-backend -n todo
   ```

2. **Kubernetes creates new pod**:
   - New pod with updated image/config
   - Health checks must pass before routing traffic

3. **Traffic shifted to new pod**:
   - Service routes traffic to new pod
   - Old pod continues serving existing requests

4. **Old pod terminated**:
   - Graceful shutdown (30s termination grace period)
   - Old pod removed from cluster

---

## Security Considerations

### Container Security

- **Non-root users**: Containers run as `nobody` (UID 65534)
- **Read-only root filesystem**: Not implemented (Phase IV scope)
- **Minimal base images**: Alpine/distroless for reduced attack surface
- **No privileged containers**: Default security context

### Secret Management

- **Kubernetes Secrets**: Sensitive data stored as Secrets
- **Base64 encoding**: Secrets encoded (not encrypted in manifests)
- **Environment variable injection**: Secrets mounted as env vars
- **No hardcoded secrets**: All secrets externalized

### Network Security

- **Namespace isolation**: Resources isolated in `todo` namespace
- **Service-to-service communication**: Internal ClusterIP communication
- **External access**: NodePort for local development only
- **TLS**: Not implemented (Phase IV scope, would use Ingress in production)

---

## Scalability Considerations

### Horizontal Scaling

**Current Configuration**:
- Frontend: 1 replica
- Backend: 1 replica

**Scaling Commands**:
```bash
# Scale frontend to 2 replicas
kubectl scale deployment todo-frontend --replicas=2 -n todo

# Scale backend to 3 replicas
kubectl scale deployment todo-backend --replicas=3 -n todo
```

**Scaling Limitations**:
- Stateless design supports horizontal scaling
- Database connection pooling may need adjustment
- OpenRouter API rate limits may apply
- Minikube resource constraints (local deployment)

### Vertical Scaling

**Adjusting Resource Limits**:
```yaml
# In values.yaml
resources:
  requests:
    cpu: 200m      # Increased from 100m
    memory: 256Mi  # Increased from 128Mi
  limits:
    cpu: 1000m     # Increased from 500m
    memory: 1Gi    # Increased from 512Mi
```

---

## Monitoring and Observability

### Pod Logs

```bash
# View backend logs
kubectl logs -n todo -l app=todo-backend --tail=50 -f

# View frontend logs
kubectl logs -n todo -l app=todo-frontend --tail=50 -f

# View logs for specific pod
kubectl logs -n todo <pod-name> -f
```

### Resource Usage

```bash
# View resource usage for all pods
kubectl top pods -n todo

# View resource usage for specific pod
kubectl top pod <pod-name> -n todo

# View node resource usage
kubectl top nodes
```

### Events

```bash
# View events in namespace
kubectl get events -n todo --sort-by='.lastTimestamp'

# View events for specific pod
kubectl describe pod <pod-name> -n todo
```

---

## Disaster Recovery

### Backup Strategy

**What to Backup**:
- Helm chart values (version-controlled in Git)
- Kubernetes Secrets (store securely, not in Git)
- Database backups (Neon handles automatically)

**What NOT to Backup**:
- Pod state (stateless, ephemeral)
- Container images (rebuil dable from source)
- ConfigMaps (version-controlled in Git)

### Recovery Procedure

1. **Recreate namespace**:
   ```bash
   kubectl create namespace todo
   ```

2. **Recreate Secrets**:
   ```bash
   kubectl create secret generic todo-secrets -n todo \
     --from-literal=database-url="..." \
     --from-literal=openrouter-api-key="..."
   ```

3. **Redeploy with Helm**:
   ```bash
   helm install todo-backend ./helm/todo-backend -n todo
   helm install todo-frontend ./helm/todo-frontend -n todo
   ```

4. **Verify deployment**:
   ```bash
   kubectl get pods -n todo
   kubectl get services -n todo
   ```

---

## Architecture Validation Checklist

- ✅ Frontend and backend deployed as separate pods
- ✅ Services expose pods via NodePort for local access
- ✅ ConfigMaps store non-sensitive configuration
- ✅ Secrets store sensitive data (database URL, API keys)
- ✅ Health checks configured for both services
- ✅ Resource limits defined for both services
- ✅ Namespace isolation implemented
- ✅ Labels and selectors properly configured
- ✅ External database connection (Neon PostgreSQL)
- ✅ External API connection (OpenRouter)
- ✅ Stateless design supports horizontal scaling
- ✅ Rolling update strategy for zero-downtime deployments

**Architecture Status**: ✅ COMPLETE - Ready for contract definition
