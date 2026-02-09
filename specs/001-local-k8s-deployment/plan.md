# Implementation Plan: Local Kubernetes Deployment

**Branch**: `001-local-k8s-deployment` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-local-k8s-deployment/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Automate the deployment of the Todo Chatbot (Phase II + Phase III) to a local Kubernetes cluster using Minikube, Helm charts, and AI-powered DevOps agents. The deployment must be fully automated via Claude Agents with dedicated SKILL.md files, support idempotent deployments, maintain resource constraints (4 CPUs, 8GB RAM), and complete in under 15 minutes. This phase demonstrates production-grade deployment automation for hackathon evaluation.

**Technical Approach**: Use Claude Agents to generate Docker images with multi-stage builds, create Helm charts with parameterized configuration, deploy to Minikube with 2 replicas per service, and provide AI-powered monitoring via kubectl-ai and Kagent. All deployment tasks are automated with no manual coding required.

## Technical Context

**Project Type**: Phase IV Deployment (extends Phase II Web Application + Phase III AI Agent Architecture)

### Phase IV Local Kubernetes Deployment

**Deployment Layer**:
- Container Runtime: Docker Desktop (Windows 10+)
- Orchestration: Minikube (local Kubernetes cluster)
- Package Manager: Helm 3+ (chart-based deployment)
- AI DevOps: kubectl-ai, Kagent, Gordon
- Automation: Claude Agents with Skills
- Environment: Windows 10+ (PowerShell or Bash)

**Deployment Requirements**:
- Dockerized frontend and backend applications
- Multi-stage Docker builds for optimized images
- Helm charts for deployment management
- Minimum 2 replicas for frontend and backend
- Resource limits (max 4 CPUs, 8GB RAM total)
- Health checks (liveness and readiness probes)
- Idempotent deployment (repeatable)
- Full automation via Claude Agents
- Deployment completes in under 15 minutes

**Kubernetes Requirements**:
- Minikube cluster setup
- Namespace isolation (todo namespace)
- Deployments with replica configuration
- Services for pod discovery (ClusterIP)
- ConfigMaps for non-sensitive configuration
- Secrets for sensitive data (API keys, credentials)
- Resource requests and limits defined
- Health check probes configured

**AI DevOps Automation**:
- docker-build-optimizer agent for image builds
- docker-container-runner agent for local testing
- helm-chart-generator agent for chart creation
- k8s-deploy-agent for Minikube deployment
- k8s-cleanup agent for resource cleanup
- cluster-health-monitor agent for observability

### Phase III AI Agent Architecture (maintained)

**AI/Agent Layer**:
- Agent Framework: OpenAI Agents SDK
- LLM Provider: OpenRouter (NOT OpenAI directly)
- Recommended Model: Gemini via OpenRouter
- Tool Protocol: MCP (Model Context Protocol)
- MCP SDK: Official Python MCP SDK
- Agent Configuration: OpenRouter-compatible base URL
- API Key: `OPENROUTER_API_KEY` environment variable

**Agent Requirements**:
- Stateless design (fetch conversation context from database)
- Tool-based reasoning (no direct database access)
- Natural language understanding for task operations
- Graceful error handling with user-friendly messages
- Confirmation prompts for destructive actions

**MCP Server Requirements**:
- Stateless tool design (no in-memory state)
- Database-backed operations (persist all changes)
- Structured input/output schemas
- Agent-only invocation (no direct frontend access)

**Chat API Requirements**:
- RESTful endpoints for conversation management
- Message persistence (user and agent messages)
- Tool call tracking
- Conversation history retrieval

### Phase II Full-Stack Web Application (maintained)

**Frontend**:
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+
- State Management: React hooks, Context API
- HTTP Client: fetch API or axios
- **Containerization**: Docker with multi-stage builds

**Backend**:
- Framework: FastAPI 0.100+
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Migrations: Alembic
- Documentation: OpenAPI/Swagger (auto-generated)
- **Containerization**: Docker with multi-stage builds

**Database**:
- Database: Neon PostgreSQL (serverless)
- ORM: SQLModel
- Migrations: Alembic
- Primary Keys: UUID or auto-increment integers
- Relationships: Foreign keys with CASCADE/RESTRICT

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, FastAPI TestClient
- E2E: Playwright or Cypress
- API: Contract tests with OpenAPI validation
- **Deployment**: Helm chart validation, pod health checks

### Performance Goals

- **Deployment Time**: Complete full deployment (build, chart generation, deployment, verification) in under 15 minutes
- **Image Build Time**: Frontend image builds in under 3 minutes, backend in under 5 minutes
- **Pod Startup Time**: All pods reach Running state within 5 minutes of deployment
- **Health Check Response**: Health endpoints respond within 5 seconds
- **Resource Efficiency**: Total cluster usage under 4 CPUs and 8GB RAM

### Constraints

- **Local Only**: No cloud infrastructure, Minikube only
- **Resource Limits**: Max 4 CPUs, 8GB RAM total across all pods
- **Image Size**: Frontend under 200MB, backend under 300MB
- **Replica Count**: Minimum 2 replicas per service (frontend, backend)
- **Environment**: Windows 10+ with PowerShell or Bash
- **Automation**: Zero manual coding, all tasks via Claude Agents

### Scale/Scope

- **Services**: 2 services (frontend, backend)
- **Pods**: 4 pods total (2 frontend replicas, 2 backend replicas)
- **Namespaces**: 1 namespace (todo)
- **Helm Charts**: 2 charts (todo-frontend, todo-backend)
- **Docker Images**: 2 images (frontend, backend)
- **Claude Agents**: 6 agents with dedicated SKILL.md files
- **Deployment Targets**: Local Minikube cluster only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase IV Requirements
- ✅ Docker images for frontend and backend (multi-stage builds)
- ✅ Dockerfiles with health checks and non-root users
- ✅ Helm charts for deployment management
- ✅ Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets)
- ✅ Minimum 2 replicas for frontend and backend
- ✅ Resource limits defined (max 4 CPUs, 8GB RAM total)
- ✅ Health checks configured (liveness and readiness probes)
- ✅ Minikube for local Kubernetes cluster
- ✅ AI DevOps automation (kubectl-ai, Kagent, Gordon)
- ✅ Claude Agents for deployment tasks (docker-build-optimizer, helm-chart-generator, k8s-deploy-agent, k8s-cleanup)
- ✅ Deployment idempotency (repeatable, declarative)
- ✅ Observability (logs, metrics, pod status monitoring)
- ✅ Deployment completes in under 15 minutes
- ✅ No manual deployment steps (full automation)
- ✅ Agent SKILL.md files for deployment tasks
- ✅ Windows 10+ environment support

### Phase III Requirements (maintained in Phase IV)
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
- ✅ No manual coding (Claude generates all code)

### Phase II Requirements (maintained in Phase IV)
- ✅ Uses approved technology stack (Next.js, FastAPI, Neon)
- ✅ API-first architecture (Frontend → API → Database)
- ✅ Frontend-backend separation (no direct DB access from frontend)
- ✅ Persistent storage (Neon PostgreSQL, not in-memory)
- ✅ No Phase I patterns (in-memory, CLI, positional indexes)
- ✅ Database migrations with Alembic
- ✅ OpenAPI/Swagger documentation
- ✅ Proper error handling and validation

**Constitution Check Result**: ✅ PASS - All Phase IV, Phase III, and Phase II requirements satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-local-k8s-deployment/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (deployment tool evaluation)
├── deployment-architecture.md  # Phase 1 output (Kubernetes architecture)
├── agent-skills.md      # Phase 1 output (SKILL.md specifications)
├── quickstart.md        # Phase 1 output (deployment guide)
├── contracts/           # Phase 1 output (Helm chart contracts)
│   ├── frontend-chart-contract.yaml
│   ├── backend-chart-contract.yaml
│   └── deployment-validation.yaml
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Phase IV Deployment Structure (NEW)
helm/                         # Helm charts for Kubernetes deployment
├── todo-frontend/
│   ├── Chart.yaml           # Chart metadata
│   ├── values.yaml          # Configuration values
│   └── templates/
│       ├── deployment.yaml  # Frontend deployment
│       ├── service.yaml     # Frontend service
│       ├── configmap.yaml   # Frontend config
│       └── hpa.yaml         # Horizontal Pod Autoscaler (optional)
└── todo-backend/
    ├── Chart.yaml           # Chart metadata
    ├── values.yaml          # Configuration values
    └── templates/
        ├── deployment.yaml  # Backend deployment
        ├── service.yaml     # Backend service
        ├── configmap.yaml   # Backend config
        └── secret.yaml      # Backend secrets

.claude/                      # Claude Agent configurations
├── agents/
│   ├── docker-build-optimizer.md      # Docker build agent
│   ├── docker-container-runner.md     # Container test agent
│   ├── helm-chart-generator.md        # Helm chart agent
│   ├── k8s-deploy-agent.md            # Deployment agent
│   ├── k8s-cleanup.md                 # Cleanup agent
│   └── cluster-health-monitor.md      # Monitoring agent
└── skills/
    ├── docker-build.skill.md          # Docker build skill
    ├── docker-run.skill.md            # Docker run skill
    ├── helm-generate.skill.md         # Helm generation skill
    ├── k8s-deploy.skill.md            # Deployment skill
    ├── k8s-cleanup.skill.md           # Cleanup skill
    └── cluster-monitor.skill.md       # Monitoring skill

# Phase II + Phase III Application (EXISTING)
api/                          # FastAPI backend
├── Dockerfile               # Backend container definition (NEW)
├── .dockerignore            # Docker ignore file (NEW)
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
│   ├── test_services/       # Business logic tests
│   ├── test_agent/          # Agent behavior tests
│   └── test_mcp/            # MCP tool tests
└── requirements.txt

web/                          # Next.js frontend
├── Dockerfile               # Frontend container definition (NEW)
├── .dockerignore            # Docker ignore file (NEW)
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

# Deployment Scripts (NEW)
scripts/
├── deploy.sh                # Main deployment orchestration
├── cleanup.sh               # Cleanup orchestration
└── validate.sh              # Deployment validation
```

**Structure Decision**: Phase IV extends the existing Phase II + Phase III structure by adding:
1. **helm/** directory for Kubernetes deployment charts
2. **.claude/** directory for agent configurations and skills
3. **Dockerfiles** in api/ and web/ for containerization
4. **scripts/** directory for deployment orchestration

The existing api/ and web/ directories remain unchanged except for the addition of Dockerfiles and .dockerignore files.

## Complexity Tracking

> **No violations** - All Phase IV requirements align with constitution

## Phase 0: Research & Tool Evaluation

**Objective**: Evaluate AI-assisted deployment tools and establish deployment architecture patterns

### Research Tasks

1. **Docker Build Strategy Evaluation**
   - **Question**: Should we use Gordon AI for Docker command generation or rely on standard Docker CLI with Claude-generated Dockerfiles?
   - **Research**: Compare Gordon AI capabilities vs. standard Docker CLI automation
   - **Decision Criteria**: Ease of integration, reliability, Windows compatibility
   - **Output**: Recommended Docker build approach with rationale

2. **Helm Chart Generation Approach**
   - **Question**: What level of parameterization should Helm charts support?
   - **Research**: Best practices for Helm chart structure, values.yaml organization, template patterns
   - **Decision Criteria**: Flexibility, maintainability, ease of modification
   - **Output**: Helm chart structure specification

3. **AI Agent Orchestration Strategy**
   - **Question**: Should agents run sequentially or support parallel execution where possible?
   - **Research**: Agent dependency analysis, parallel execution patterns
   - **Decision Criteria**: Deployment speed, error handling, resource efficiency
   - **Output**: Agent execution workflow diagram

4. **Resource Allocation Strategy**
   - **Question**: How should we distribute 4 CPUs and 8GB RAM across frontend (2 replicas) and backend (2 replicas)?
   - **Research**: Resource requirements for Next.js and FastAPI containers, Kubernetes overhead
   - **Decision Criteria**: Application performance, stability, resource efficiency
   - **Output**: Resource allocation table with requests and limits

5. **Observability Implementation**
   - **Question**: What metrics and logs should be collected for cluster health monitoring?
   - **Research**: kubectl-ai and Kagent capabilities, Kubernetes native monitoring
   - **Decision Criteria**: Debugging effectiveness, performance impact, ease of access
   - **Output**: Observability specification with metrics and log collection strategy

6. **Idempotency Guarantees**
   - **Question**: How do we ensure Helm deployments are truly idempotent?
   - **Research**: Helm upgrade behavior, Kubernetes declarative configuration patterns
   - **Decision Criteria**: Reliability, predictability, error recovery
   - **Output**: Idempotency implementation guide

### Research Output

**File**: `research.md` - Comprehensive research findings with decisions, rationale, and alternatives considered for each research task.

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete with all decisions documented

### Deployment Architecture Design

**File**: `deployment-architecture.md`

**Content**:
1. **Kubernetes Cluster Architecture**
   - Minikube cluster configuration
   - Namespace design (todo namespace)
   - Network topology (ClusterIP services, internal DNS)
   - Resource quotas and limits

2. **Docker Image Architecture**
   - Frontend multi-stage build design
   - Backend multi-stage build design
   - Base image selection rationale
   - Layer optimization strategy
   - Health check implementation

3. **Helm Chart Architecture**
   - Chart structure and organization
   - Values.yaml parameterization
   - Template design patterns
   - ConfigMap and Secret management
   - Deployment strategy (RollingUpdate)

4. **Agent Workflow Architecture**
   - Agent execution sequence
   - Agent dependencies and prerequisites
   - Error handling and rollback strategy
   - Parallel execution opportunities

### Agent Skills Specification

**File**: `agent-skills.md`

**Content**: Detailed SKILL.md specifications for each of the 6 Claude Agents:

1. **docker-build-optimizer**
   - **Purpose**: Build optimized Docker images for frontend and backend
   - **Inputs**: Source code directories, version tags
   - **Outputs**: Docker images with tags, build logs
   - **Success Criteria**: Images under size targets, builds complete in time limits
   - **Error Handling**: Docker daemon not running, build failures, disk space issues

2. **docker-container-runner**
   - **Purpose**: Test Docker containers locally before deployment
   - **Inputs**: Docker image names and tags
   - **Outputs**: Container health status, logs, test results
   - **Success Criteria**: Containers start, health checks pass, no errors
   - **Error Handling**: Port conflicts, image not found, health check failures

3. **helm-chart-generator**
   - **Purpose**: Generate Helm charts with validated templates
   - **Inputs**: Application configuration, resource requirements
   - **Outputs**: Helm chart directories with Chart.yaml, values.yaml, templates
   - **Success Criteria**: Charts pass `helm lint`, templates render correctly
   - **Error Handling**: Template syntax errors, invalid values, missing dependencies

4. **k8s-deploy-agent**
   - **Purpose**: Deploy Helm charts to Minikube cluster
   - **Inputs**: Helm chart paths, namespace, release name
   - **Outputs**: Deployment status, pod status, service endpoints
   - **Success Criteria**: All pods Running, health checks pass, services accessible
   - **Error Handling**: Minikube not running, resource limits exceeded, image pull errors

5. **k8s-cleanup**
   - **Purpose**: Remove all Kubernetes resources and optionally Docker images
   - **Inputs**: Namespace, release names, cleanup scope
   - **Outputs**: Cleanup status, removed resources list
   - **Success Criteria**: All resources deleted, namespace removed, no orphaned resources
   - **Error Handling**: Resources in use, deletion failures, namespace stuck in terminating

6. **cluster-health-monitor**
   - **Purpose**: Monitor cluster health, pod status, and resource usage
   - **Inputs**: Namespace, monitoring interval
   - **Outputs**: Pod status report, resource usage metrics, health check results
   - **Success Criteria**: Accurate status reporting, resource usage under limits
   - **Error Handling**: kubectl connection failures, metric collection errors

### Deployment Contracts

**Directory**: `contracts/`

**Files**:

1. **frontend-chart-contract.yaml**
   - Helm chart structure specification
   - Required values.yaml fields
   - Template requirements
   - Resource limits and requests
   - Health probe configuration

2. **backend-chart-contract.yaml**
   - Helm chart structure specification
   - Required values.yaml fields
   - Template requirements
   - Resource limits and requests
   - Health probe configuration
   - Secret management

3. **deployment-validation.yaml**
   - Validation criteria for successful deployment
   - Pod readiness checks
   - Service accessibility tests
   - Resource usage thresholds
   - Health check success rates

### Quickstart Guide

**File**: `quickstart.md`

**Content**:
1. **Prerequisites**
   - Minikube installation and setup
   - Docker Desktop installation
   - Helm 3+ installation
   - kubectl installation
   - kubectl-ai and Kagent setup

2. **Deployment Steps**
   - Step 1: Run docker-build-optimizer agent
   - Step 2: Run docker-container-runner agent
   - Step 3: Run helm-chart-generator agent
   - Step 4: Run k8s-deploy-agent
   - Step 5: Run cluster-health-monitor agent

3. **Verification**
   - Check pod status
   - Verify health checks
   - Test service endpoints
   - Monitor resource usage

4. **Cleanup**
   - Run k8s-cleanup agent
   - Verify resource removal

5. **Troubleshooting**
   - Common issues and solutions
   - Log access commands
   - Debug procedures

### Agent Context Update

After Phase 1 design completion, run:

```bash
.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude
```

This updates the Claude agent context with Phase IV deployment technologies:
- Docker containerization
- Helm chart management
- Kubernetes orchestration
- Minikube local cluster
- kubectl-ai and Kagent integration

## Phase 2: Task Breakdown

**Note**: Task breakdown is generated by the `/sp.tasks` command, NOT by `/sp.plan`.

The `/sp.tasks` command will create `tasks.md` with atomic, executable tasks organized by user story priority:
- **P1 Tasks**: Automated Container Build and Deployment
- **P2 Tasks**: Cluster Health Monitoring and Resource Optimization
- **P3 Tasks**: Idempotent Deployment and Clean Reset

## Architectural Decisions Requiring ADRs

The following decisions should be documented as Architecture Decision Records (ADRs):

1. **ADR-001: Docker Build Strategy**
   - **Decision**: Use Claude-generated Dockerfiles with standard Docker CLI vs. Gordon AI
   - **Context**: Need reliable, reproducible container builds on Windows 10+
   - **Consequences**: Build automation approach, error handling, Windows compatibility

2. **ADR-002: Resource Allocation Strategy**
   - **Decision**: Frontend 0.75 CPU/1.5GB per pod, Backend 1 CPU/2GB per pod
   - **Context**: Must stay under 4 CPUs and 8GB RAM total with 2 replicas each
   - **Consequences**: Application performance, scaling limitations, resource efficiency

3. **ADR-003: Helm Chart Parameterization**
   - **Decision**: Level of values.yaml parameterization and template complexity
   - **Context**: Balance between flexibility and maintainability
   - **Consequences**: Chart reusability, configuration complexity, error surface

4. **ADR-004: Agent Orchestration Workflow**
   - **Decision**: Sequential vs. parallel agent execution
   - **Context**: Deployment speed vs. error handling complexity
   - **Consequences**: Deployment time, error recovery, resource usage

5. **ADR-005: Observability Implementation**
   - **Decision**: kubectl-ai + Kagent vs. native kubectl for monitoring
   - **Context**: AI-powered monitoring vs. traditional approaches
   - **Consequences**: Monitoring capabilities, learning curve, reliability

## Risk Analysis

### High-Priority Risks

1. **Resource Exhaustion**
   - **Risk**: Pods exceed 4 CPU / 8GB RAM limits
   - **Mitigation**: Resource requests and limits enforced, monitoring alerts
   - **Contingency**: Reduce replica counts or resource allocations

2. **Deployment Time Overrun**
   - **Risk**: Deployment exceeds 15-minute constraint
   - **Mitigation**: Optimize Docker builds, parallel agent execution
   - **Contingency**: Log warning, continue deployment, investigate bottlenecks

3. **Image Build Failures**
   - **Risk**: Docker builds fail due to dependency issues or disk space
   - **Mitigation**: Multi-stage builds, layer caching, disk space checks
   - **Contingency**: Clear error messages, retry logic, manual intervention guide

4. **Minikube Instability**
   - **Risk**: Minikube cluster crashes or becomes unresponsive
   - **Mitigation**: Resource limits, health monitoring, restart procedures
   - **Contingency**: Cluster reset, redeployment from scratch

5. **Agent Execution Failures**
   - **Risk**: Claude Agents fail to generate correct configurations
   - **Mitigation**: Validation steps, error handling, rollback procedures
   - **Contingency**: Manual review, agent retry, fallback to manual deployment

### Medium-Priority Risks

6. **Windows Compatibility Issues**
   - **Risk**: Scripts fail on Windows 10+ environment
   - **Mitigation**: PowerShell and Bash compatibility, path handling
   - **Contingency**: Environment-specific scripts, compatibility testing

7. **Network Connectivity Loss**
   - **Risk**: Internet connection lost during image pulls
   - **Mitigation**: Local image caching, retry logic
   - **Contingency**: Use cached images, offline deployment mode

8. **Helm Chart Syntax Errors**
   - **Risk**: Generated Helm charts have template errors
   - **Mitigation**: `helm lint` validation, template testing
   - **Contingency**: Error reporting, chart regeneration, manual fixes

## Success Metrics

### Deployment Success Metrics

- ✅ All Docker images build successfully (frontend < 200MB, backend < 300MB)
- ✅ All containers pass local health checks
- ✅ Helm charts pass validation (`helm lint`)
- ✅ All pods reach Running state within 5 minutes
- ✅ Health checks pass with 100% success rate
- ✅ Total deployment time under 15 minutes
- ✅ Resource usage under 4 CPUs and 8GB RAM

### Automation Success Metrics

- ✅ Zero manual coding required
- ✅ All 6 Claude Agents execute successfully
- ✅ Agent SKILL.md files complete and accurate
- ✅ Deployment reproducible (3 successful runs with identical state)
- ✅ Cleanup removes 100% of resources

### Quality Success Metrics

- ✅ No pod crashes or restarts during demonstration
- ✅ Services accessible within cluster
- ✅ Logs and metrics accessible via kubectl-ai/Kagent
- ✅ Idempotency verified (re-run produces same state)
- ✅ Hackathon judges can reproduce deployment

## Next Steps

After `/sp.plan` completion:

1. **Review Generated Artifacts**
   - research.md - Deployment tool evaluation and decisions
   - deployment-architecture.md - Kubernetes architecture design
   - agent-skills.md - SKILL.md specifications for all agents
   - contracts/ - Helm chart contracts and validation criteria
   - quickstart.md - Deployment guide

2. **Run `/sp.tasks`**
   - Generate atomic, executable tasks organized by user story
   - Tasks will reference architecture and contracts from Phase 1

3. **Implement Phase IV**
   - Execute tasks in priority order (P1 → P2 → P3)
   - Use Claude Agents for all deployment automation
   - Validate against success criteria

4. **Create ADRs**
   - Document architectural decisions with `/sp.adr` command
   - Capture rationale, alternatives, and consequences
