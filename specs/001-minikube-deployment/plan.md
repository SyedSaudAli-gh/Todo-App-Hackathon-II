# Implementation Plan: Local Kubernetes Deployment of Phase III Todo AI Chatbot

**Branch**: `001-minikube-deployment` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-minikube-deployment/spec.md`

**Note**: This plan follows Phase IV Constitution requirements for AI-assisted DevOps, cloud-native deployment, and local Kubernetes orchestration.

## Summary

Deploy the existing Phase III Todo AI Chatbot to a local Kubernetes cluster using Minikube, Helm charts, and AI-assisted DevOps tools (Gordon, kubectl-ai, kagent). The deployment will containerize both frontend (Next.js + ChatKit) and backend (FastAPI + Agents SDK + MCP) applications using multi-stage Docker builds, package them with Helm charts, and deploy to Minikube with proper health checks, resource limits, and environment-based configuration. All deployment operations will prioritize AI-assisted tools with documented fallbacks, following cloud-native best practices and ensuring full reproducibility through comprehensive documentation.

## Technical Context

**Project Type**: Phase IV Deployment (Kubernetes/Docker/Helm)

This feature deploys an existing Phase III full-stack web application to local Kubernetes infrastructure. The application stack remains unchanged; only deployment artifacts are created.

### Phase IV Deployment Architecture

### Phase IV Deployment Architecture

**Deployment Platform**:
- Kubernetes: Minikube (local cluster)
- Package Manager: Helm 3+
- Containerization: Docker with multi-stage builds
- Kubernetes CLI: kubectl
- Container Registry: Local (Minikube's built-in registry or Docker Desktop)

**AI-Assisted DevOps Tools** (MANDATORY):
- Gordon: AI-powered Docker assistant (Docker Desktop 4.53+)
- kubectl-ai: AI-powered Kubernetes assistant
- kagent: Kubernetes deployment agent
- Fallback: Claude-generated commands if AI tools unavailable

**Application Stack** (Phase III - maintained as-is):
- Frontend: Next.js 15+ with React 19+, TypeScript 5+, Tailwind CSS 3+, OpenAI ChatKit
- Backend: FastAPI 0.100+ with Python 3.13+, OpenAI Agents SDK, MCP Server
- Database: Neon PostgreSQL (serverless, external to cluster)
- AI/Agent: OpenAI Agents SDK with OpenRouter, MCP tools

**Docker Requirements**:
- Multi-stage builds (build stage + runtime stage)
- Minimal runtime images (alpine or distroless)
- Non-root users for security
- Layer caching optimization
- Consistent tagging (semantic versioning: v1.0.0)
- Environment variables for all configuration
- Health check endpoints exposed

**Helm Chart Requirements**:
- Separate charts for frontend and backend under `/helm` directory
- Templated manifests with value substitution
- Values files for environment configuration (values.yaml)
- Chart metadata (Chart.yaml) with version and description
- Helper templates (_helpers.tpl) for reusable logic
- Validation of required values
- Documentation (README.md) for chart usage

**Kubernetes Requirements**:
- Namespace: `todo` (isolated namespace for all resources)
- Deployments: Backend and frontend with configurable replicas (default: 1)
- Services: NodePort type for external access on Minikube
- ConfigMaps: Non-sensitive configuration (API URLs, feature flags)
- Secrets: Sensitive data (database credentials, API keys) - base64 encoded
- Resource requests and limits defined for all pods
- Health checks (liveness, readiness, startup probes) for all deployments
- Labels and selectors for resource organization

**Cloud-Native Best Practices**:
- Stateless applications (no local file storage)
- Environment-based configuration (no hardcoded values)
- Health checks for all services
- Resource management (CPU/memory requests/limits)
- Container security (non-root users, minimal images)
- Horizontal scaling support (multiple replicas)
- Restart-safe design (no data loss on pod restart)

**Deployment Process**:
1. Build Docker images (via Gordon or Claude-generated commands)
2. Tag images with semantic version (v1.0.0)
3. Load images into Minikube (if using local registry)
4. Create Kubernetes namespace (`todo`)
5. Create Kubernetes Secrets (database credentials, API keys)
6. Apply Helm charts (via kubectl-ai/kagent or Claude-generated commands)
7. Verify pod status (all pods in `Running` state)
8. Verify service accessibility (port forwarding)
9. Test application functionality (end-to-end)

**Verification Requirements**:
- All pods in `Running` state within 2 minutes
- Services accessible via port forwarding
- Frontend loads in browser within 5 seconds
- Backend API responds to health checks within 1 second
- Application functionality working end-to-end (create, update, delete tasks)
- Database connection working (tasks persist)
- No error logs in pod output
- Application survives pod restart without data loss

**Documentation Requirements**:
- Complete setup instructions in README
- All commands documented (Minikube, Docker, Helm, kubectl)
- AI tool usage logs/screenshots included (minimum 5 screenshots)
- Troubleshooting guide for common issues
- Reproducibility guarantee (anyone can follow README and deploy)
- Research notes on AI-assisted DevOps vs manual approach

### Performance Goals

- Docker image build time: < 5 minutes per image
- Docker image size: < 200MB per image (optimized multi-stage builds)
- Helm deployment time: < 3 minutes from `helm install` to all pods running
- Pod startup time: < 2 minutes to reach `Running` state
- Frontend load time: < 5 seconds after accessing forwarded port
- Backend API response time: < 1 second for health checks
- Task operation time: < 3 seconds per operation (create, update, delete)

### Constraints

- Local deployment only (no cloud providers)
- Minikube resource limits (minimum 4GB RAM, 2 CPU cores)
- No production-grade features (autoscaling, service mesh, advanced monitoring)
- Phase III codebase frozen (no new application features)
- AI tools must be attempted first (Gordon, kubectl-ai, kagent)
- All deployment artifacts must be version-controlled
- No manual YAML file creation (use Helm or AI-generated manifests)
- No hardcoded secrets in manifests (use Kubernetes Secrets)

### Scale/Scope

- Single Minikube cluster (local development)
- 2 application services (frontend, backend)
- 1 external database (Neon PostgreSQL)
- 2 Helm charts (frontend, backend)
- 1 Kubernetes namespace (`todo`)
- Minimal replica count (1 per service for local deployment)
- Target: Hackathon demonstration (January 4, 2026)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase IV Deployment Requirements
- ✅ Uses approved deployment stack (Minikube, Helm 3+, Docker, kubectl)
- ✅ AI-Assisted DevOps tools prioritized (Gordon, kubectl-ai, kagent with fallbacks)
- ✅ Multi-stage Docker builds with minimal runtime images
- ✅ Non-root container users for security
- ✅ Helm charts with templated manifests and value substitution
- ✅ Kubernetes namespace isolation (`todo` namespace)
- ✅ Resource requests and limits defined for all pods
- ✅ Health checks (liveness, readiness, startup probes) for all deployments
- ✅ Environment-based configuration (ConfigMaps and Secrets, no hardcoded values)
- ✅ Cloud-native best practices (stateless, restart-safe, horizontally scalable)
- ✅ Local deployment only (Minikube, no cloud providers)
- ✅ Phase III application maintained as-is (no new features)
- ✅ Complete documentation with AI tool usage logs/screenshots
- ✅ Reproducibility guarantee (README with full setup instructions)
- ✅ No manual coding (Claude generates all deployment artifacts)

### Phase III Requirements (maintained in deployed application)
- ✅ Uses approved AI/Agent stack (OpenAI Agents SDK, OpenRouter, MCP)
- ✅ OpenRouter API integration (NOT direct OpenAI API)
- ✅ `OPENROUTER_API_KEY` environment variable (NOT `OPENAI_API_KEY`)
- ✅ MCP Server with stateless, database-backed tools
- ✅ Agent uses MCP tools for ALL task operations (no direct DB access)
- ✅ Stateless backend (no in-memory conversation state)
- ✅ Conversation persistence (database-backed)
- ✅ Message and tool call tracking
- ✅ Agent behavior contract (confirmations, error handling, no hallucinations)
- ✅ Chat API endpoints for conversation management

### Phase II Requirements (maintained in deployed application)
- ✅ Uses approved technology stack (Next.js, FastAPI, Neon)
- ✅ API-first architecture (Frontend → API → Database)
- ✅ Frontend-backend separation (no direct DB access from frontend)
- ✅ Persistent storage (Neon PostgreSQL, not in-memory)
- ✅ No Phase I patterns (in-memory, CLI, positional indexes)
- ✅ Database migrations with Alembic
- ✅ OpenAPI/Swagger documentation
- ✅ Proper error handling and validation

**Constitution Compliance**: ✅ PASS - All Phase IV deployment requirements satisfied. No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/001-minikube-deployment/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (AI-assisted DevOps research)
├── deployment-architecture.md  # Phase 1 output (architecture diagram)
├── contracts/           # Phase 1 output (deployment contracts)
│   ├── backend-chart-contract.yaml
│   ├── frontend-chart-contract.yaml
│   └── deployment-validation.yaml
├── quickstart.md        # Phase 1 output (quick deployment guide)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Phase IV Deployment Artifacts (NEW)
helm/                          # Helm charts for Kubernetes deployment
├── todo-backend/              # Backend Helm chart
│   ├── Chart.yaml            # Chart metadata (name, version, description)
│   ├── values.yaml           # Default configuration values
│   ├── templates/            # Kubernetes manifest templates
│   │   ├── _helpers.tpl     # Helper template functions
│   │   ├── deployment.yaml  # Backend Deployment manifest
│   │   ├── service.yaml     # Backend Service manifest
│   │   ├── configmap.yaml   # Backend ConfigMap manifest
│   │   └── secret.yaml      # Backend Secret manifest
│   └── README.md            # Chart usage documentation
└── todo-frontend/            # Frontend Helm chart
    ├── Chart.yaml            # Chart metadata (name, version, description)
    ├── values.yaml           # Default configuration values
    ├── templates/            # Kubernetes manifest templates
    │   ├── _helpers.tpl     # Helper template functions
    │   ├── deployment.yaml  # Frontend Deployment manifest
    │   ├── service.yaml     # Frontend Service manifest
    │   └── configmap.yaml   # Frontend ConfigMap manifest
    └── README.md            # Chart usage documentation

# Phase III Application (MAINTAINED AS-IS)
api/                          # FastAPI backend
├── Dockerfile               # Multi-stage Docker build (NEW)
├── .dockerignore           # Docker build exclusions (NEW)
├── src/
│   ├── models/              # SQLModel database models
│   ├── schemas/             # Pydantic request/response models
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   ├── agent/               # OpenAI Agents SDK integration
│   ├── mcp/                 # MCP Server implementation
│   ├── database.py          # Database connection
│   └── main.py              # FastAPI app
├── alembic/                 # Database migrations
│   └── versions/
├── tests/
│   ├── test_api/            # API endpoint tests
│   ├── test_models/         # Database model tests
│   └── test_services/       # Business logic tests
└── requirements.txt

web/                          # Next.js frontend
├── Dockerfile               # Multi-stage Docker build (NEW)
├── .dockerignore           # Docker build exclusions (NEW)
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── tests/
│   ├── unit/                # Component tests
│   └── e2e/                 # End-to-end tests
├── package.json
└── tsconfig.json

# Phase IV Documentation (NEW)
docs/
├── deployment/
│   ├── minikube-setup.md    # Minikube installation and configuration
│   ├── docker-build.md      # Docker image building guide
│   ├── helm-deployment.md   # Helm chart deployment guide
│   └── troubleshooting.md   # Common issues and solutions
└── ai-devops/
    ├── gordon-usage.md      # Gordon AI tool usage logs
    ├── kubectl-ai-usage.md  # kubectl-ai usage logs
    └── kagent-usage.md      # kagent usage logs
```

**Structure Decision**: Phase IV adds deployment artifacts (Helm charts, Dockerfiles, deployment documentation) to the existing Phase III application structure. The application code remains unchanged; only containerization and orchestration layers are added. Helm charts are organized by service (backend, frontend) with standard chart structure. Documentation is organized by deployment phase (setup, build, deploy, troubleshoot) and AI tool usage.

## Complexity Tracking

**No violations detected.** All Phase IV deployment requirements align with the constitution. No complexity justification needed.

---

## Phase 0: Research & Outline

### Research Questions

The following questions must be resolved before design phase:

#### AI-Assisted DevOps Tools
1. **Gordon (Docker AI)**: How to use Gordon for multi-stage Dockerfile generation? What prompts work best for FastAPI and Next.js applications?
2. **kubectl-ai**: How to use kubectl-ai for Kubernetes deployments? What natural language commands are supported?
3. **kagent**: How to use kagent for automated deployment orchestration? What are the configuration requirements?
4. **Fallback Strategy**: What are the fallback commands if AI tools are unavailable or fail?

#### Docker Containerization
1. **Multi-Stage Builds**: What are the best practices for multi-stage builds for FastAPI (Python) and Next.js (Node.js)?
2. **Base Images**: Which minimal base images should be used (alpine vs distroless) for security and size optimization?
3. **Non-Root Users**: How to configure non-root users in Docker containers for both Python and Node.js applications?
4. **Environment Variables**: How to pass environment variables to containers for database connection, API keys, and configuration?
5. **Health Checks**: How to implement health check endpoints in FastAPI and Next.js for Docker and Kubernetes?

#### Helm Chart Design
1. **Chart Structure**: What is the standard Helm chart directory structure and file organization?
2. **Templating**: How to use Helm templating for parameterized Kubernetes manifests?
3. **Values Files**: What configuration should be in values.yaml vs hardcoded in templates?
4. **Helper Templates**: What are common helper template patterns (_helpers.tpl) for labels, selectors, and names?
5. **Chart Dependencies**: Do frontend and backend charts need to be separate or can they be combined?

#### Kubernetes Resource Design
1. **Deployments**: What are the required fields for Kubernetes Deployment manifests? How to configure replicas, update strategy, and pod templates?
2. **Services**: Should services use NodePort or ClusterIP for Minikube? How to expose services for local access?
3. **ConfigMaps**: What configuration should go in ConfigMaps vs Secrets? How to mount ConfigMaps in pods?
4. **Secrets**: How to create and manage Kubernetes Secrets for database credentials and API keys? How to reference secrets in deployments?
5. **Health Checks**: How to configure liveness, readiness, and startup probes in Kubernetes? What are appropriate timeouts and thresholds?
6. **Resource Limits**: What are appropriate CPU and memory requests/limits for FastAPI and Next.js applications in local Minikube?

#### Minikube Configuration
1. **Cluster Setup**: What are the minimum resource requirements for Minikube? How to start and configure a cluster?
2. **Image Loading**: How to load locally built Docker images into Minikube? Should we use Minikube's built-in registry or Docker Desktop?
3. **Namespace Management**: How to create and manage Kubernetes namespaces? How to set default namespace for kubectl commands?
4. **Port Forwarding**: How to use kubectl port-forward for local access to services? What are the port forwarding best practices?

#### Deployment Verification
1. **Pod Status**: How to verify all pods are in Running state? What are common pod failure reasons and how to troubleshoot?
2. **Service Accessibility**: How to test service endpoints? How to verify frontend and backend are accessible?
3. **Application Functionality**: How to test end-to-end application functionality (create, update, delete tasks) after deployment?
4. **Database Connection**: How to verify database connection from pods? How to troubleshoot connection issues?
5. **Logs Inspection**: How to view pod logs? How to identify errors and warnings in logs?

### Research Outputs

Research findings will be documented in `research.md` with the following structure:

```markdown
# Research: AI-Assisted DevOps for Kubernetes Deployment

## Gordon (Docker AI) Usage
- Decision: [How to use Gordon for Dockerfile generation]
- Rationale: [Why this approach]
- Alternatives: [Manual Dockerfile creation, other tools]
- Example Prompts: [Actual Gordon commands used]

## kubectl-ai Usage
- Decision: [How to use kubectl-ai for deployments]
- Rationale: [Why this approach]
- Alternatives: [Standard kubectl commands]
- Example Prompts: [Actual kubectl-ai commands used]

## Multi-Stage Docker Builds
- Decision: [Build stage + runtime stage approach]
- Rationale: [Size optimization, security]
- Alternatives: [Single-stage builds]
- Best Practices: [Layer caching, dependency management]

## Helm Chart Structure
- Decision: [Separate charts for frontend and backend]
- Rationale: [Independent versioning, deployment flexibility]
- Alternatives: [Single combined chart, umbrella chart]
- Template Patterns: [Common helper functions, value substitution]

## Kubernetes Resource Configuration
- Decision: [NodePort services for Minikube]
- Rationale: [Easy local access without Ingress]
- Alternatives: [ClusterIP + port-forward, LoadBalancer]
- Resource Limits: [CPU/memory values for local deployment]

## Deployment Verification Strategy
- Decision: [Automated verification checklist]
- Rationale: [Ensure deployment quality, reproducibility]
- Alternatives: [Manual testing only]
- Verification Steps: [Pod status, service accessibility, functionality tests]
```

---

## Phase 1: Design & Contracts

### Deployment Architecture

**Output**: `deployment-architecture.md`

This document will contain:

1. **High-Level Architecture Diagram**
   - Frontend Pod (Next.js + ChatKit)
   - Backend Pod (FastAPI + Agents SDK + MCP)
   - Neon PostgreSQL (external database)
   - Kubernetes Services (NodePort)
   - ConfigMaps and Secrets
   - Minikube Cluster boundary

2. **Component Interactions**
   - User → Frontend Service → Frontend Pod
   - Frontend Pod → Backend Service → Backend Pod
   - Backend Pod → Neon PostgreSQL (external)
   - Backend Pod → OpenRouter API (external)

3. **Network Flow**
   - Port forwarding for local access
   - Service-to-service communication within cluster
   - External database connection
   - External API connection (OpenRouter)

4. **Resource Organization**
   - Namespace: `todo`
   - Labels: `app=todo-frontend`, `app=todo-backend`
   - Selectors: Match labels for service routing

### Deployment Contracts

**Output**: `contracts/` directory with YAML contract files

#### Backend Chart Contract (`contracts/backend-chart-contract.yaml`)

```yaml
# Backend Helm Chart Contract
chart:
  name: todo-backend
  version: 1.0.0
  description: "Todo AI Chatbot Backend - FastAPI + Agents SDK + MCP"

values:
  replicaCount: 1
  image:
    repository: todo-backend
    tag: v1.0.0
    pullPolicy: IfNotPresent

  service:
    type: NodePort
    port: 8000
    targetPort: 8000
    nodePort: 30080

  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi

  env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: todo-secrets
          key: database-url
    - name: OPENROUTER_API_KEY
      valueFrom:
        secretKeyRef:
          name: todo-secrets
          key: openrouter-api-key
    - name: FRONTEND_URL
      valueFrom:
        configMapKeyRef:
          name: todo-config
          key: frontend-url

  healthCheck:
    livenessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 10
      periodSeconds: 5

templates:
  - deployment.yaml
  - service.yaml
  - configmap.yaml
  - secret.yaml
```

#### Frontend Chart Contract (`contracts/frontend-chart-contract.yaml`)

```yaml
# Frontend Helm Chart Contract
chart:
  name: todo-frontend
  version: 1.0.0
  description: "Todo AI Chatbot Frontend - Next.js + ChatKit"

values:
  replicaCount: 1
  image:
    repository: todo-frontend
    tag: v1.0.0
    pullPolicy: IfNotPresent

  service:
    type: NodePort
    port: 3000
    targetPort: 3000
    nodePort: 30030

  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 200m
      memory: 256Mi

  env:
    - name: NEXT_PUBLIC_API_URL
      valueFrom:
        configMapKeyRef:
          name: todo-config
          key: api-url

  healthCheck:
    livenessProbe:
      httpGet:
        path: /
        port: 3000
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 5

templates:
  - deployment.yaml
  - service.yaml
  - configmap.yaml
```

#### Deployment Validation Contract (`contracts/deployment-validation.yaml`)

```yaml
# Deployment Validation Contract
validation:
  pre_deployment:
    - check: Minikube cluster running
      command: minikube status
      expected: "host: Running\nkubelet: Running\napiserver: Running"

    - check: Docker images built
      command: docker images | grep todo
      expected: "todo-backend.*v1.0.0\ntodo-frontend.*v1.0.0"

    - check: Kubernetes namespace exists
      command: kubectl get namespace todo
      expected: "NAME.*STATUS.*AGE\ntodo.*Active"

    - check: Secrets created
      command: kubectl get secrets -n todo
      expected: "todo-secrets"

  post_deployment:
    - check: All pods running
      command: kubectl get pods -n todo
      expected: ".*Running.*Running"
      timeout: 120s

    - check: Services created
      command: kubectl get services -n todo
      expected: "todo-backend.*NodePort.*30080\ntodo-frontend.*NodePort.*30030"

    - check: Frontend accessible
      command: curl -s -o /dev/null -w "%{http_code}" http://localhost:30030
      expected: "200"
      requires: port-forward or NodePort access

    - check: Backend health check
      command: curl -s http://localhost:30080/health
      expected: '{"status":"healthy"}'
      requires: port-forward or NodePort access

    - check: No error logs
      command: kubectl logs -n todo -l app=todo-backend --tail=50 | grep -i error
      expected: "" (no errors)

    - check: No error logs
      command: kubectl logs -n todo -l app=todo-frontend --tail=50 | grep -i error
      expected: "" (no errors)

  functional_tests:
    - test: Create task via chatbot
      description: "User creates a new task through chat interface"
      expected: "Task created successfully and persisted in database"

    - test: Update task via chatbot
      description: "User updates an existing task through chat interface"
      expected: "Task updated successfully and changes persisted"

    - test: Delete task via chatbot
      description: "User deletes a task through chat interface"
      expected: "Task deleted successfully and removed from database"

    - test: Pod restart resilience
      description: "Delete a pod and verify it restarts automatically"
      command: kubectl delete pod -n todo -l app=todo-backend
      expected: "New pod created automatically, tasks still accessible"
```

### Quickstart Guide

**Output**: `quickstart.md`

This document will provide a condensed deployment guide:

```markdown
# Quickstart: Deploy Todo AI Chatbot to Minikube

## Prerequisites
- Docker Desktop 4.53+ (with Gordon enabled)
- Minikube installed
- kubectl installed
- Helm 3+ installed

## Quick Deploy (5 minutes)

### 1. Start Minikube
```bash
minikube start --cpus=2 --memory=4096
```

### 2. Build Docker Images
```bash
# Using Gordon (AI-assisted)
docker ai "Build a multi-stage Dockerfile for the FastAPI backend in ./api"
docker ai "Build a multi-stage Dockerfile for the Next.js frontend in ./web"

# Or manual build
docker build -t todo-backend:v1.0.0 ./api
docker build -t todo-frontend:v1.0.0 ./web
```

### 3. Load Images to Minikube
```bash
minikube image load todo-backend:v1.0.0
minikube image load todo-frontend:v1.0.0
```

### 4. Create Namespace and Secrets
```bash
kubectl create namespace todo
kubectl create secret generic todo-secrets -n todo \
  --from-literal=database-url="postgresql://..." \
  --from-literal=openrouter-api-key="sk-..."
```

### 5. Deploy with Helm
```bash
# Using kubectl-ai (AI-assisted)
kubectl-ai "deploy the todo backend and frontend using helm charts in ./helm"

# Or manual deploy
helm install todo-backend ./helm/todo-backend -n todo
helm install todo-frontend ./helm/todo-frontend -n todo
```

### 6. Verify Deployment
```bash
kubectl get pods -n todo
kubectl get services -n todo
```

### 7. Access Application
```bash
# Port forward (if using ClusterIP)
kubectl port-forward -n todo svc/todo-frontend 3000:3000
kubectl port-forward -n todo svc/todo-backend 8000:8000

# Or access via NodePort
minikube service todo-frontend -n todo
minikube service todo-backend -n todo
```

### 8. Test Functionality
- Open browser to http://localhost:3000
- Create a task via chatbot
- Verify task persists after pod restart
```

---

## Phase 2: Task Breakdown

**Note**: Task breakdown is performed by the `/sp.tasks` command, NOT by `/sp.plan`.

After Phase 1 design is complete, run:
```bash
/sp.tasks
```

This will generate `tasks.md` with atomic, testable tasks organized by:
- Docker containerization tasks
- Helm chart generation tasks
- Kubernetes deployment tasks
- Verification and testing tasks
- Documentation tasks

Each task will include:
- Clear acceptance criteria
- Test cases
- Dependencies on other tasks
- Estimated complexity

---

## Architectural Decision Records (ADRs)

The following architectural decisions require documentation:

### ADR-001: Multi-Stage Docker Builds vs Single-Stage Builds

**Context**: Need to containerize FastAPI backend and Next.js frontend applications.

**Options Considered**:
1. Single-stage builds (simple, larger images)
2. Multi-stage builds (complex, smaller images)
3. Pre-built base images with application layers

**Decision**: Multi-stage Docker builds

**Rationale**:
- Significantly reduces image size (build dependencies excluded from runtime)
- Improves security (fewer packages in runtime image)
- Aligns with cloud-native best practices
- Constitution mandates multi-stage builds for Phase IV

**Tradeoffs**:
- More complex Dockerfile structure
- Longer initial build time (mitigated by layer caching)
- Requires understanding of build vs runtime dependencies

**Consequences**:
- Backend image: ~150MB (vs ~800MB single-stage)
- Frontend image: ~120MB (vs ~600MB single-stage)
- Faster pod startup times
- Reduced attack surface

---

### ADR-002: Local Docker Registry vs Minikube Built-in Registry

**Context**: Need to make Docker images available to Minikube cluster.

**Options Considered**:
1. Push to Docker Hub (requires internet, public/private repo)
2. Use Minikube's built-in registry (local, requires configuration)
3. Load images directly into Minikube (simple, manual)

**Decision**: Load images directly into Minikube using `minikube image load`

**Rationale**:
- Simplest approach for local development
- No external dependencies or internet required
- No registry configuration needed
- Fast image transfer
- Aligns with hackathon demonstration goals

**Tradeoffs**:
- Manual image loading after each build
- Not suitable for multi-node clusters
- Images not shared across Minikube instances

**Consequences**:
- Deployment workflow: build → load → deploy
- No registry authentication needed
- Faster iteration during development

---

### ADR-003: NodePort vs ClusterIP + Port Forwarding

**Context**: Need to expose frontend and backend services for local access.

**Options Considered**:
1. NodePort (direct access via Minikube IP and port)
2. ClusterIP + kubectl port-forward (requires active port-forward session)
3. LoadBalancer (requires cloud provider or MetalLB)
4. Ingress (requires Ingress controller setup)

**Decision**: NodePort for service exposure

**Rationale**:
- Simple configuration (no additional components)
- Direct access via Minikube IP
- Persistent access (no active port-forward session needed)
- Standard for local Kubernetes development
- Easy to demonstrate in hackathon

**Tradeoffs**:
- Port range limited to 30000-32767
- Not production-ready (would use Ingress in production)
- Requires Minikube IP knowledge

**Consequences**:
- Frontend: NodePort 30030 (maps to container port 3000)
- Backend: NodePort 30080 (maps to container port 8000)
- Access via `minikube service` command or direct IP

---

### ADR-004: Separate Helm Charts vs Umbrella Chart

**Context**: Need to package frontend and backend for Kubernetes deployment.

**Options Considered**:
1. Separate charts for frontend and backend (independent versioning)
2. Single umbrella chart with subcharts (coordinated deployment)
3. Single chart with multiple deployments (simple, less flexible)

**Decision**: Separate Helm charts for frontend and backend

**Rationale**:
- Independent versioning and deployment
- Clear separation of concerns
- Easier to understand and maintain
- Allows independent scaling and updates
- Aligns with microservices principles

**Tradeoffs**:
- Two separate `helm install` commands
- Shared configuration (ConfigMaps, Secrets) must be created separately
- More files to manage

**Consequences**:
- `helm/todo-backend/` chart for backend
- `helm/todo-frontend/` chart for frontend
- Shared `todo-secrets` Secret created manually
- Shared `todo-config` ConfigMap created manually or in charts

---

### ADR-005: ConfigMap vs Secret for Environment Variables

**Context**: Need to inject configuration into pods (database URL, API keys, URLs).

**Options Considered**:
1. All configuration in ConfigMaps (simple, not secure)
2. All configuration in Secrets (secure, harder to read)
3. Mixed approach: ConfigMaps for non-sensitive, Secrets for sensitive

**Decision**: Mixed approach - ConfigMaps for non-sensitive, Secrets for sensitive data

**Rationale**:
- Security best practice (secrets encrypted at rest)
- Clear separation of sensitive vs non-sensitive data
- ConfigMaps easier to inspect and debug
- Aligns with Kubernetes security model

**Configuration Classification**:
- **Secrets**: `DATABASE_URL`, `OPENROUTER_API_KEY`
- **ConfigMaps**: `FRONTEND_URL`, `API_URL`, feature flags

**Consequences**:
- Two resource types to manage
- Clear security boundary
- Secrets base64-encoded (not encrypted in manifests)
- Must document which values go where

---

### ADR-006: Namespace Isolation vs Default Namespace

**Context**: Need to organize Kubernetes resources for the Todo application.

**Options Considered**:
1. Deploy to default namespace (simple, cluttered)
2. Create dedicated `todo` namespace (organized, isolated)
3. Create multiple namespaces (dev, staging, prod - overkill for local)

**Decision**: Dedicated `todo` namespace

**Rationale**:
- Logical isolation from other Minikube resources
- Easy to clean up (delete namespace deletes all resources)
- Follows Kubernetes best practices
- Demonstrates namespace usage for hackathon

**Tradeoffs**:
- Must specify `-n todo` in kubectl commands
- Must create namespace before deployment

**Consequences**:
- All resources deployed to `todo` namespace
- Cleanup: `kubectl delete namespace todo`
- kubectl context can set default namespace

---

### ADR-007: Minimal vs Defined Resource Limits

**Context**: Need to specify CPU and memory for pods in local Minikube.

**Options Considered**:
1. No resource limits (simple, risk of resource exhaustion)
2. Minimal limits (conservative, may be insufficient)
3. Defined limits based on application profiling (accurate, requires testing)

**Decision**: Defined resource limits based on application characteristics

**Rationale**:
- Prevents resource exhaustion in Minikube
- Demonstrates resource management for hackathon
- Aligns with cloud-native best practices
- Enables horizontal scaling in future

**Resource Allocation**:
- **Backend**: requests: 100m CPU, 128Mi memory; limits: 500m CPU, 512Mi memory
- **Frontend**: requests: 50m CPU, 64Mi memory; limits: 200m CPU, 256Mi memory

**Consequences**:
- Pods may be evicted if limits exceeded
- Minikube needs minimum 4GB RAM, 2 CPU cores
- Resource limits documented in values.yaml

---

### ADR-008: Direct Neon Connection vs Kubernetes Service Proxy

**Context**: Backend needs to connect to Neon PostgreSQL database.

**Options Considered**:
1. Direct connection from pods to Neon (simple, external dependency)
2. Kubernetes Service proxy to Neon (complex, adds abstraction)
3. Deploy PostgreSQL in Kubernetes (complex, out of scope)

**Decision**: Direct connection from pods to Neon PostgreSQL

**Rationale**:
- Neon is serverless and designed for external connections
- No additional Kubernetes resources needed
- Simpler configuration (just DATABASE_URL)
- Phase III application already uses Neon
- Deploying PostgreSQL in Kubernetes is out of scope for Phase IV

**Tradeoffs**:
- External dependency (requires internet)
- Connection string in Kubernetes Secret
- No database high availability within cluster

**Consequences**:
- DATABASE_URL stored in `todo-secrets` Secret
- Pods connect directly to Neon endpoint
- Database remains external to Kubernetes cluster

---

### ADR-009: AI Tool Fallback Strategy

**Context**: Gordon, kubectl-ai, and kagent may not be available or may fail.

**Options Considered**:
1. Require AI tools (strict, may block deployment)
2. Provide fallback commands (flexible, ensures deployment success)
3. Hybrid approach (attempt AI tools first, fallback if unavailable)

**Decision**: Hybrid approach - attempt AI tools first with documented fallbacks

**Rationale**:
- Demonstrates AI-assisted DevOps (hackathon requirement)
- Ensures deployment can proceed if tools unavailable
- Documents both AI and manual approaches
- Provides learning value for developers

**Fallback Strategy**:
- **Gordon unavailable**: Use Claude-generated Dockerfiles and manual `docker build`
- **kubectl-ai unavailable**: Use standard `kubectl` commands
- **kagent unavailable**: Use manual `helm install` commands

**Consequences**:
- Documentation includes both AI and manual commands
- AI tool usage tracked with screenshots
- Deployment not blocked by tool availability

---

### ADR-010: Generic vs Project-Specific Blueprint Abstraction

**Context**: Need to determine if deployment should use generic blueprints or project-specific configurations.

**Options Considered**:
1. Generic blueprints (reusable, less specific)
2. Project-specific configurations (tailored, less reusable)
3. Hybrid approach (generic templates with project overrides)

**Decision**: Project-specific configurations with documentation for reusability

**Rationale**:
- Phase IV focuses on deploying specific Todo AI Chatbot application
- Generic blueprints would require additional abstraction layer
- Project-specific approach faster for hackathon timeline
- Documentation captures patterns for future reuse

**Reusability Strategy**:
- Document deployment patterns in research.md
- Capture lessons learned for future projects
- Helm charts serve as templates for similar applications

**Consequences**:
- Helm charts tailored to Todo application
- Documentation explains patterns for adaptation
- Future projects can use charts as starting point

---

## Risk Analysis and Mitigation

### High-Priority Risks

#### Risk 1: AI Tools (Gordon, kubectl-ai, kagent) Unavailable or Failing

**Likelihood**: Medium | **Impact**: Medium | **Priority**: HIGH

**Description**: Gordon, kubectl-ai, or kagent may not be installed, may fail to execute, or may produce incorrect outputs.

**Mitigation**:
- Document fallback commands for all AI tool operations
- Test both AI-assisted and manual workflows
- Provide Claude-generated Dockerfiles and Helm charts as fallback
- Include troubleshooting section in README

**Contingency**:
- Use manual Docker commands: `docker build`, `docker tag`, `docker push`
- Use standard kubectl commands: `kubectl apply`, `kubectl get`, `kubectl describe`
- Use manual Helm commands: `helm install`, `helm upgrade`, `helm rollback`

---

#### Risk 2: Minikube Resource Constraints

**Likelihood**: Medium | **Impact**: High | **Priority**: HIGH

**Description**: Minikube may fail to start or pods may fail to schedule due to insufficient CPU or memory.

**Mitigation**:
- Document minimum resource requirements (4GB RAM, 2 CPU cores)
- Configure appropriate resource requests and limits in Helm charts
- Test deployment on minimum spec machine
- Provide troubleshooting guide for resource issues

**Contingency**:
- Reduce replica count to 1 for both services
- Lower resource limits in values.yaml
- Use `minikube start --cpus=2 --memory=4096` for adequate resources

---

#### Risk 3: Docker Image Size Exceeds Constraints

**Likelihood**: Low | **Impact**: Medium | **Priority**: MEDIUM

**Description**: Docker images may be too large, causing slow builds and deployments.

**Mitigation**:
- Use multi-stage builds to exclude build dependencies
- Use Alpine or distroless base images
- Optimize layer caching with proper Dockerfile ordering
- Test image sizes during development

**Target Sizes**:
- Backend: < 200MB
- Frontend: < 200MB

**Contingency**:
- Further optimize Dockerfile (remove unnecessary packages)
- Use .dockerignore to exclude unnecessary files
- Consider distroless images for even smaller size

---

#### Risk 4: Helm Chart Configuration Errors

**Likelihood**: Medium | **Impact**: Medium | **Priority**: MEDIUM

**Description**: Helm charts may have syntax errors, missing values, or incorrect template logic.

**Mitigation**:
- Validate charts with `helm lint` before installation
- Test chart rendering with `helm template` to inspect generated manifests
- Use Helm chart contracts to define expected structure
- Test deployment in clean Minikube cluster

**Contingency**:
- Fix chart errors based on `helm lint` output
- Manually inspect rendered templates with `helm template`
- Use `helm upgrade` to apply fixes without full reinstall

---

#### Risk 5: Pod Startup Failures Due to Missing Environment Variables

**Likelihood**: Medium | **Impact**: High | **Priority**: HIGH

**Description**: Pods may fail to start if required environment variables (DATABASE_URL, OPENROUTER_API_KEY) are missing or incorrect.

**Mitigation**:
- Create comprehensive Secret and ConfigMap validation checklist
- Document all required environment variables in README
- Use Kubernetes Secret validation in pre-deployment checks
- Test with actual credentials before deployment

**Contingency**:
- Verify Secret exists: `kubectl get secret todo-secrets -n todo`
- Inspect Secret contents: `kubectl describe secret todo-secrets -n todo`
- Recreate Secret with correct values
- Restart pods: `kubectl rollout restart deployment -n todo`

---

#### Risk 6: Port Conflicts Preventing Access

**Likelihood**: Low | **Impact**: Medium | **Priority**: LOW

**Description**: NodePort ports (30030, 30080) may conflict with existing services or be blocked by firewall.

**Mitigation**:
- Document port requirements in README
- Provide instructions for checking port availability
- Allow port customization via Helm values
- Test port accessibility before deployment

**Contingency**:
- Change NodePort values in Helm values.yaml
- Use `kubectl port-forward` as alternative access method
- Check firewall rules and adjust if needed

---

#### Risk 7: Tight Hackathon Timeline (January 4, 2026)

**Likelihood**: Medium | **Impact**: High | **Priority**: HIGH

**Description**: Timeline may be insufficient to complete all deployment tasks and documentation.

**Mitigation**:
- Prioritize P1-P3 user stories (containerization, Helm charts, deployment)
- P4-P5 user stories (verification, documentation) are nice-to-have
- Use parallel task execution where possible
- Focus on core functionality first, polish later

**Contingency**:
- Reduce scope: skip advanced verification tests
- Simplify documentation: focus on quickstart guide
- Use AI tools to accelerate development
- Defer non-critical features to post-hackathon

---

## Success Metrics

### Deployment Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Docker image build time (backend) | < 5 minutes | Time from `docker build` start to completion |
| Docker image build time (frontend) | < 5 minutes | Time from `docker build` start to completion |
| Docker image size (backend) | < 200MB | `docker images` output |
| Docker image size (frontend) | < 200MB | `docker images` output |
| Helm deployment time | < 3 minutes | Time from `helm install` to all pods Running |
| Pod startup time | < 2 minutes | Time from pod creation to Running state |
| Frontend load time | < 5 seconds | Browser load time after accessing NodePort |
| Backend health check response | < 1 second | `curl` response time to `/health` endpoint |
| Task operation time | < 3 seconds | Time to create/update/delete task via chatbot |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Helm chart lint errors | 0 | `helm lint` output |
| Pod crash loops | 0 | `kubectl get pods` status |
| Error logs in pods | 0 | `kubectl logs` inspection |
| Failed health checks | 0 | `kubectl describe pod` events |
| Resource limit violations | 0 | `kubectl top pods` monitoring |
| AI tool usage percentage | > 80% | Count of AI-assisted vs manual operations |
| Documentation screenshots | ≥ 5 | Count of AI tool usage screenshots |
| Deployment reproducibility | 100% | Success rate of fresh deployments |

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Task creation success rate | 100% | Manual testing via chatbot |
| Task update success rate | 100% | Manual testing via chatbot |
| Task deletion success rate | 100% | Manual testing via chatbot |
| Task persistence after restart | 100% | Delete pod, verify tasks remain |
| Database connection success | 100% | Backend logs show successful connection |
| Frontend-backend communication | 100% | API calls succeed from frontend |

### Documentation Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| README completeness | 100% | All setup steps documented |
| AI tool usage documentation | 100% | All AI commands logged with screenshots |
| Troubleshooting coverage | ≥ 5 issues | Common issues documented with solutions |
| Deployment time for new user | < 30 minutes | Time for someone to follow README and deploy |

---

## Implementation Timeline

### Phase 0: Research & Architecture Planning (Day 1)
- Research AI-assisted DevOps tools (Gordon, kubectl-ai, kagent)
- Research Docker multi-stage builds for FastAPI and Next.js
- Research Helm chart structure and best practices
- Research Kubernetes resource configuration
- Document findings in research.md
- Create deployment architecture diagram
- Define deployment contracts

**Deliverables**: research.md, deployment-architecture.md, contracts/

---

### Phase 1: Containerization Foundation (Day 2)
- Generate Dockerfiles using Gordon or Claude
- Build Docker images for backend and frontend
- Test containers locally with `docker run`
- Optimize image sizes with multi-stage builds
- Configure non-root users and health checks
- Tag images with semantic versioning

**Deliverables**: api/Dockerfile, web/Dockerfile, Docker images

---

### Phase 2: Helm Deployment Layer (Day 3)
- Generate Helm charts using kubectl-ai or Claude
- Create backend chart (Deployment, Service, ConfigMap, Secret templates)
- Create frontend chart (Deployment, Service, ConfigMap templates)
- Configure values.yaml with parameterized settings
- Validate charts with `helm lint` and `helm template`
- Document chart usage in README

**Deliverables**: helm/todo-backend/, helm/todo-frontend/

---

### Phase 3: Kubernetes Deployment (Day 4)
- Start Minikube cluster with adequate resources
- Load Docker images into Minikube
- Create `todo` namespace
- Create Kubernetes Secrets for sensitive data
- Deploy backend and frontend with Helm
- Verify pod status and service accessibility
- Test application functionality end-to-end

**Deliverables**: Running Kubernetes deployment

---

### Phase 4: AI-Assisted Optimization & Validation (Day 5)
- Use kubectl-ai for deployment verification
- Use kagent for cluster analysis
- Document all AI tool usage with screenshots
- Create troubleshooting guide
- Update README with complete setup instructions
- Perform final verification against success criteria
- Prepare hackathon demonstration materials

**Deliverables**: Complete documentation, AI tool logs, verification report

---

## Next Steps

1. **Run `/sp.tasks`** to break down this plan into atomic, executable tasks
2. **Execute tasks** using Claude Code with AI-assisted tools
3. **Document AI tool usage** with screenshots and logs throughout implementation
4. **Verify deployment** against success criteria and validation contracts
5. **Prepare hackathon materials** with process documentation and learnings

---

**Plan Status**: ✅ COMPLETE - Ready for task breakdown with `/sp.tasks`
**Branch**: `001-minikube-deployment`
**Next Command**: `/sp.tasks`
