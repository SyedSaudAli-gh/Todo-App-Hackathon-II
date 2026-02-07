# Phase 0 Research: Deployment Tool Evaluation & Architecture Decisions

**Feature**: Local Kubernetes Deployment
**Date**: 2026-02-07
**Status**: Complete

## Executive Summary

This research evaluates AI-assisted deployment tools and establishes architectural patterns for Phase IV local Kubernetes deployment. Key decisions include using Claude-generated Dockerfiles with standard Docker CLI, sequential agent execution with validation gates, and resource allocation optimized for 4 CPU / 8GB RAM constraints.

## Research Task 1: Docker Build Strategy Evaluation

### Question
Should we use Gordon AI for Docker command generation or rely on standard Docker CLI with Claude-generated Dockerfiles?

### Research Findings

**Gordon AI Approach**:
- **Pros**: AI-assisted Docker command generation, potentially simpler syntax
- **Cons**: Additional dependency, less mature tooling, potential reliability issues, Windows compatibility unknown
- **Availability**: Gordon AI is mentioned in Phase IV requirements but actual integration and reliability unclear

**Standard Docker CLI with Claude-Generated Dockerfiles**:
- **Pros**: Mature, well-documented, reliable, excellent Windows support, Claude can generate optimized Dockerfiles
- **Cons**: Requires Claude to generate Dockerfile content (but this is within Claude's capabilities)
- **Availability**: Docker Desktop for Windows 10+ is widely available and stable

### Decision

**Use Standard Docker CLI with Claude-Generated Dockerfiles**

### Rationale

1. **Reliability**: Docker CLI is mature, stable, and has excellent Windows 10+ support
2. **Predictability**: Standard Docker commands are well-documented and behavior is consistent
3. **Claude Capability**: Claude can generate optimized multi-stage Dockerfiles with health checks, non-root users, and layer caching
4. **Reduced Dependencies**: Eliminates dependency on Gordon AI which may have unknown reliability
5. **Debugging**: Standard Docker CLI provides clear error messages and extensive troubleshooting resources

### Alternatives Considered

- **Gordon AI**: Rejected due to unknown reliability and Windows compatibility
- **Buildah/Podman**: Rejected due to Windows compatibility issues and additional complexity
- **Docker Compose**: Considered but Helm charts provide better Kubernetes integration

### Implementation Approach

1. Claude generates Dockerfiles for frontend (Next.js) and backend (FastAPI)
2. docker-build-optimizer agent executes standard Docker CLI commands:
   - `docker build -t todo-frontend:v1.0.0 -f web/Dockerfile web/`
   - `docker build -t todo-backend:v1.0.0 -f api/Dockerfile api/`
3. Multi-stage builds optimize image sizes
4. Health checks embedded in Dockerfiles
5. Non-root users configured for security

---

## Research Task 2: Helm Chart Generation Approach

### Question
What level of parameterization should Helm charts support?

### Research Findings

**High Parameterization (Many values.yaml options)**:
- **Pros**: Maximum flexibility, easy to customize without template changes
- **Cons**: Complex values.yaml, harder to understand, more error-prone

**Moderate Parameterization (Essential options only)**:
- **Pros**: Balance of flexibility and simplicity, easier to maintain
- **Cons**: May require template changes for some customizations

**Low Parameterization (Minimal values.yaml)**:
- **Pros**: Simple, easy to understand
- **Cons**: Inflexible, requires template modifications for changes

### Decision

**Moderate Parameterization with Essential Options**

### Rationale

1. **Hackathon Focus**: Need flexibility for demonstration but not production-grade complexity
2. **Maintainability**: Easier for judges to understand and modify
3. **Essential Parameters**: Replica count, resource limits, image tags, ports, environment variables
4. **Simplicity**: Avoid over-engineering for local deployment use case

### Alternatives Considered

- **High Parameterization**: Rejected as over-engineering for local deployment
- **Low Parameterization**: Rejected as too inflexible for demonstration needs

### Implementation Approach

**values.yaml Structure**:
```yaml
replicaCount: 2
image:
  repository: todo-frontend
  tag: v1.0.0
  pullPolicy: IfNotPresent
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 750m
    memory: 1.5Gi
service:
  type: ClusterIP
  port: 3000
healthCheck:
  enabled: true
  path: /api/health
  initialDelaySeconds: 10
  periodSeconds: 30
```

**Template Organization**:
- deployment.yaml: Pod specification, replicas, resources
- service.yaml: Service definition, port mapping
- configmap.yaml: Non-sensitive configuration
- secret.yaml: Sensitive data (backend only)

---

## Research Task 3: AI Agent Orchestration Strategy

### Question
Should agents run sequentially or support parallel execution where possible?

### Research Findings

**Sequential Execution**:
- **Pros**: Simple error handling, clear dependencies, easier debugging
- **Cons**: Slower deployment time

**Parallel Execution**:
- **Pros**: Faster deployment, efficient resource usage
- **Cons**: Complex error handling, race conditions, harder debugging

**Hybrid Approach (Sequential with validation gates)**:
- **Pros**: Balance of speed and reliability, clear validation points
- **Cons**: Moderate complexity

### Decision

**Sequential Execution with Validation Gates**

### Rationale

1. **Reliability**: Clear dependencies ensure each step completes before next begins
2. **Error Handling**: Easier to identify and handle failures at each stage
3. **Deployment Time**: 15-minute constraint is achievable with sequential execution
4. **Debugging**: Clear execution order simplifies troubleshooting
5. **Hackathon Context**: Reliability more important than maximum speed

### Alternatives Considered

- **Full Parallel Execution**: Rejected due to complexity and error handling challenges
- **Pure Sequential**: Accepted as optimal for reliability and debugging

### Implementation Approach

**Agent Execution Sequence**:
1. **docker-build-optimizer** → Build frontend and backend images
   - **Validation Gate**: Images exist, sizes under targets
2. **docker-container-runner** → Test containers locally
   - **Validation Gate**: Containers start, health checks pass
3. **helm-chart-generator** → Generate Helm charts
   - **Validation Gate**: Charts pass `helm lint`, templates valid
4. **k8s-deploy-agent** → Deploy to Minikube
   - **Validation Gate**: Pods Running, health checks pass
5. **cluster-health-monitor** → Monitor cluster health
   - **Validation Gate**: Resource usage under limits, no errors

**Error Handling**: If any validation gate fails, stop execution and report error with remediation steps.

---

## Research Task 4: Resource Allocation Strategy

### Question
How should we distribute 4 CPUs and 8GB RAM across frontend (2 replicas) and backend (2 replicas)?

### Research Findings

**Resource Requirements Analysis**:

**Frontend (Next.js)**:
- **Baseline**: ~200-300MB RAM, 0.1-0.2 CPU at idle
- **Under Load**: ~500MB-1GB RAM, 0.5-1 CPU
- **Build Time**: Requires more resources during build, less at runtime

**Backend (FastAPI + AI Agent)**:
- **Baseline**: ~300-500MB RAM, 0.2-0.3 CPU at idle
- **Under Load**: ~1-2GB RAM, 0.5-1.5 CPU (AI agent increases usage)
- **Database Connections**: Minimal overhead with connection pooling

**Kubernetes Overhead**:
- **System Pods**: ~0.5 CPU, ~500MB RAM
- **Networking**: Minimal overhead for ClusterIP services

### Decision

**Resource Allocation**:
- **Frontend**: 0.5 CPU request / 0.75 CPU limit, 1GB request / 1.5GB limit per pod
- **Backend**: 0.75 CPU request / 1 CPU limit, 1.5GB request / 2GB limit per pod
- **Total Requests**: 2.5 CPUs, 5GB RAM (leaves headroom for system)
- **Total Limits**: 3.5 CPUs, 7GB RAM (under 4 CPU / 8GB constraint)

### Rationale

1. **Headroom**: Leaves 1.5 CPUs and 3GB RAM for Kubernetes system components
2. **Backend Priority**: Backend gets more resources due to AI agent and database operations
3. **Burst Capacity**: Limits allow temporary bursts without hitting hard constraint
4. **Stability**: Requests ensure minimum resources always available

### Alternatives Considered

- **Equal Distribution**: Rejected as backend needs more resources for AI agent
- **Higher Limits**: Rejected as would exceed 4 CPU / 8GB constraint
- **Single Replica**: Rejected as violates minimum 2 replicas requirement

### Implementation Approach

**Helm values.yaml**:
```yaml
# Frontend
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 750m
    memory: 1.5Gi

# Backend
resources:
  requests:
    cpu: 750m
    memory: 1.5Gi
  limits:
    cpu: 1000m
    memory: 2Gi
```

**Monitoring**: cluster-health-monitor agent tracks actual usage and alerts if approaching limits.

---

## Research Task 5: Observability Implementation

### Question
What metrics and logs should be collected for cluster health monitoring?

### Research Findings

**kubectl-ai Capabilities**:
- Natural language queries for cluster status
- Pod status and events
- Log retrieval with filtering
- Resource usage reporting

**Kagent Capabilities**:
- AI-powered cluster analysis
- Resource optimization recommendations
- Anomaly detection
- Performance insights

**Native kubectl**:
- `kubectl get pods` - Pod status
- `kubectl top pods` - Resource usage
- `kubectl logs` - Container logs
- `kubectl describe` - Detailed resource info
- `kubectl get events` - Cluster events

### Decision

**Hybrid Approach: kubectl-ai for queries, native kubectl for metrics**

### Rationale

1. **Reliability**: Native kubectl provides guaranteed accurate metrics
2. **User Experience**: kubectl-ai provides natural language interface for judges
3. **Comprehensive**: Combination covers all observability needs
4. **Fallback**: If kubectl-ai fails, native kubectl still works

### Alternatives Considered

- **kubectl-ai Only**: Rejected due to potential reliability concerns
- **Native kubectl Only**: Rejected as misses AI-powered demonstration value
- **Kagent Only**: Rejected as may not cover all basic monitoring needs

### Implementation Approach

**Metrics to Collect**:
1. **Pod Status**: Running, Pending, Failed, CrashLoopBackOff
2. **Resource Usage**: CPU and memory per pod, total cluster usage
3. **Health Checks**: Liveness and readiness probe success rates
4. **Events**: Cluster events (warnings, errors)
5. **Logs**: Container logs for debugging

**Monitoring Commands**:
```bash
# Pod status
kubectl get pods -n todo

# Resource usage
kubectl top pods -n todo

# Health check status
kubectl describe pods -n todo | grep -A 5 "Liveness\|Readiness"

# Events
kubectl get events -n todo --sort-by='.lastTimestamp'

# Logs
kubectl logs -n todo <pod-name>
```

**kubectl-ai Integration**:
- "Show me the status of all pods in the todo namespace"
- "What's the resource usage of the backend pods?"
- "Are there any errors in the cluster?"

---

## Research Task 6: Idempotency Guarantees

### Question
How do we ensure Helm deployments are truly idempotent?

### Research Findings

**Helm Upgrade Behavior**:
- `helm upgrade --install` installs if not exists, upgrades if exists
- Uses declarative configuration (desired state)
- Kubernetes reconciles actual state to desired state
- Supports rollback on failure

**Kubernetes Declarative Configuration**:
- Resources defined by YAML manifests
- Kubernetes ensures actual state matches desired state
- Idempotent by design (applying same manifest multiple times produces same result)

**Potential Non-Idempotent Issues**:
- Secrets regeneration (if using random values)
- Timestamps in annotations
- Resource UID changes on delete/recreate

### Decision

**Use Helm upgrade --install with declarative configuration**

### Rationale

1. **Helm Native**: `--install` flag provides built-in idempotency
2. **Kubernetes Design**: Declarative configuration is inherently idempotent
3. **Predictable**: Same input always produces same output
4. **Rollback Support**: Can revert to previous state if needed

### Alternatives Considered

- **Manual kubectl apply**: Rejected as Helm provides better management
- **Helm install only**: Rejected as fails on re-run (already exists)
- **Delete then install**: Rejected as causes downtime and loses state

### Implementation Approach

**Deployment Command**:
```bash
helm upgrade --install todo-frontend ./helm/todo-frontend \
  --namespace todo \
  --create-namespace \
  --wait \
  --timeout 5m
```

**Idempotency Guarantees**:
1. **Deterministic Values**: All values.yaml fields are deterministic (no random generation)
2. **Consistent Tags**: Docker image tags are version-based (v1.0.0), not "latest"
3. **Declarative Secrets**: Secrets use fixed values from environment variables
4. **No Timestamps**: Avoid timestamp annotations that change on each run

**Validation**:
- Run deployment 3 times
- Compare final cluster state after each run
- Verify identical pod counts, resource allocations, and configurations

---

## Summary of Decisions

| Research Task | Decision | Rationale |
|---------------|----------|-----------|
| Docker Build Strategy | Standard Docker CLI with Claude-generated Dockerfiles | Reliability, Windows compatibility, mature tooling |
| Helm Chart Parameterization | Moderate parameterization (essential options) | Balance of flexibility and simplicity |
| Agent Orchestration | Sequential execution with validation gates | Reliability, clear error handling, easier debugging |
| Resource Allocation | Frontend: 0.75 CPU/1.5GB, Backend: 1 CPU/2GB per pod | Optimized for 4 CPU/8GB constraint with headroom |
| Observability | Hybrid: kubectl-ai for queries, native kubectl for metrics | Reliability with AI-powered user experience |
| Idempotency | Helm upgrade --install with declarative configuration | Native Helm support, Kubernetes design principles |

## Implementation Readiness

All research tasks complete. Ready to proceed to Phase 1: Design & Contracts.

**Next Steps**:
1. Create deployment-architecture.md with detailed Kubernetes architecture
2. Create agent-skills.md with SKILL.md specifications for all 6 agents
3. Create contracts/ directory with Helm chart contracts
4. Create quickstart.md with deployment guide
5. Update agent context with Phase IV technologies
