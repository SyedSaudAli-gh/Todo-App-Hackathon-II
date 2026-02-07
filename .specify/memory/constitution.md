<!--
Sync Impact Report:
- Version change: 3.0.0 → 4.0.0 (MAJOR - Phase IV Local Kubernetes Deployment)
- Modified principles:
  - Principle II: "Phase III Integrity" → "Phase IV Integrity" (Kubernetes deployment architecture)
  - Principle VI: "Technology Stack Compliance" → expanded with Kubernetes/Docker/Helm requirements
- Added sections:
  - Kubernetes Deployment Architecture (new Principle XIV)
  - Docker Containerization Standards (new Principle XV)
  - Helm Chart Requirements (new Principle XVI)
  - AI DevOps Automation (new Principle XVII)
  - Deployment Idempotency Rule (new Principle XVIII)
  - Phase IV Objective (new section)
  - Phase IV Technology Stack (Kubernetes/Docker/Helm/AI DevOps layer)
  - Phase IV Documentation Requirements (helm charts, deployment scripts, cluster configs)
  - Phase IV Quality Standards (deployment, observability, resource management)
- Removed sections:
  - None (Phase IV builds on Phase II and Phase III)
- Templates requiring updates:
  - .specify/templates/spec-template.md ⚠ pending (add Kubernetes deployment sections)
  - .specify/templates/plan-template.md ⚠ pending (add Phase IV deployment architecture sections)
  - .specify/templates/tasks-template.md ⚠ pending (add Phase IV task categories: docker, helm, k8s-deploy, cluster-health)
  - .specify/templates/commands/*.md ⚠ pending (update for Phase IV context)
- Follow-up TODOs:
  - Update all templates to reflect Phase IV requirements
  - Create Phase IV implementation guidelines
  - Create agent SKILL.md files for deployment tasks
  - Validate Helm charts and Kubernetes manifests against constitution
-->
# Phase IV Constitution - Todo AI Chatbot (Local Kubernetes Deployment)

## Core Principles

### I. Spec-Driven Development
All implementation must strictly follow approved specifications. No implementation without proper specification and planning. This ensures traceability and prevents scope creep. Every feature must have a complete specification (spec.md), implementation plan (plan.md), and task breakdown (tasks.md) before any code is written.

**Agentic Dev Stack Enforcement**: Claude MUST follow this order strictly:
1. Write **formal specifications**
2. Generate **implementation plan**
3. Break plan into **atomic tasks**
4. Implement tasks via **Claude Code**
5. Review outputs against spec

⚠️ Skipping or merging steps is NOT allowed.

### II. Phase IV Integrity
Phase IV introduces **Local Kubernetes Deployment** with AI-driven DevOps automation. The application MUST use:

**Frontend** (Phase II - maintained):
- Next.js 15+ with React 19+, TypeScript 5+, and Tailwind CSS 3+
- OpenAI ChatKit UI for chat interface
- Stateless chat client with auth integration
- **Dockerized** for Kubernetes deployment

**Backend** (Phase II + Phase III - maintained):
- FastAPI 0.100+ with Python 3.13+, Pydantic v2, and SQLModel
- OpenAI Agents SDK (MANDATORY framework for AI agent)
- MCP (Model Context Protocol) Server for tool exposure
- Stateless architecture with database-backed conversation memory
- **Dockerized** for Kubernetes deployment

**Database** (Phase II - maintained):
- Neon PostgreSQL (serverless) for all persistent storage
- Conversation and message persistence
- Tool call history tracking

**AI/Agent Layer** (Phase III - maintained):
- OpenAI Agents SDK configured for OpenRouter API
- MCP Server exposing stateless, database-backed task tools
- Natural language task management via AI agent
- Tool-based reasoning and agent orchestration

**Deployment Layer** (Phase IV - NEW):
- **Kubernetes**: Minikube for local cluster orchestration
- **Helm**: Chart-based deployment management
- **Docker**: Containerization with Gordon AI assistance
- **kubectl-ai**: AI-powered Kubernetes operations
- **Kagent**: AI agent for cluster health and optimization
- **AI DevOps**: Fully automated deployment via Claude Agents and Skills

Phase IV explicitly **FORBIDS**:
- Manual deployment steps (Claude Agents automate ALL deployment)
- Cloud deployments (local Minikube only)
- Manual Helm chart creation (use helm-chart-generator agent)
- Manual Docker commands (use docker-build-optimizer and docker-container-runner agents)
- Cluster resource limits exceeded (max 4 CPUs, 8GB RAM)
- Non-idempotent deployments (must be repeatable)
- Deployments without health checks
- Missing observability (logs, metrics, pod status)

### III. Reusability and Extension
Design must support future phases (Phase V+) through:
- API versioning strategy (v1, v2, etc.)
- Database migration support with Alembic
- Modular architecture enabling feature additions
- Clear contracts between layers (frontend ↔ API ↔ agent ↔ MCP ↔ database)
- Backward compatibility within major API versions
- Agent behavior extensibility through MCP tool additions
- **Deployment modularity** through Helm charts and reusable agents
- **Infrastructure as Code** for reproducible environments

### IV. Determinism and Testability
All components must be predictable and testable:
- **API**: Contract tests for all endpoints with OpenAPI/Swagger documentation
- **Database**: Transactional operations with rollback support
- **Frontend**: Unit tests for components, integration tests for user flows
- **Agent**: Behavior tests for tool invocation and error handling
- **MCP Server**: Tool contract tests with stateless guarantees
- **End-to-End**: Critical user journeys tested across all layers including AI agent
- **Deployment**: Helm chart validation, Docker image verification, cluster health checks
- **Infrastructure**: Kubernetes manifest validation, resource limit verification
- All features must have clear, testable acceptance criteria

### V. Test-First Development (NON-NEGOTIABLE)
TDD remains mandatory across all layers:
- **API**: Write OpenAPI spec → Write tests → Implement endpoints → Tests pass → Refactor
- **Frontend**: Write component tests → Implement components → Tests pass → Refactor
- **Database**: Write schema tests → Create migrations → Tests pass → Refactor
- **Agent**: Write behavior tests → Implement agent logic → Tests pass → Refactor
- **MCP Server**: Write tool contract tests → Implement tools → Tests pass → Refactor
- **Deployment**: Write deployment validation → Create Helm charts → Validation passes → Refactor
- Red-Green-Refactor cycle strictly enforced at every layer

### VI. Technology Stack Compliance
Phase IV requires specific technologies to ensure consistency and quality:

**Approved Frontend Stack** (Phase II - maintained):
- Next.js 15+ (React framework with SSR/SSG)
- React 19+ (UI library)
- TypeScript 5+ (type safety)
- Tailwind CSS 3+ (styling)
- OpenAI ChatKit (chat UI components)

**Approved Backend Stack** (Phase II + Phase III - maintained):
- FastAPI 0.100+ (Python web framework)
- Python 3.13+ (language)
- Pydantic v2 (validation)
- SQLModel (ORM combining SQLAlchemy + Pydantic)
- OpenAI Agents SDK (AI agent framework)
- MCP SDK (Model Context Protocol server)

**Approved Database** (Phase II - maintained):
- Neon PostgreSQL (serverless, managed)
- Alembic (migrations)

**Approved AI/Agent Stack** (Phase III - maintained):
- OpenAI Agents SDK (agent orchestration framework)
- OpenRouter API (LLM provider - NOT OpenAI directly)
- MCP SDK (tool protocol implementation)
- Gemini models via OpenRouter (recommended LLM)

**Approved Deployment Stack** (Phase IV - NEW):
- **Container Runtime**: Docker Desktop (Windows 10+)
- **Orchestration**: Minikube (local Kubernetes cluster)
- **Package Manager**: Helm 3+ (chart-based deployment)
- **AI DevOps Tools**: kubectl-ai, Kagent, Gordon
- **Deployment Automation**: Claude Agents with dedicated Skills
- **Environment**: Windows 10+ with PowerShell or Bash

**Prohibited**:
- Manual deployment steps (Claude Agents automate ALL)
- Cloud Kubernetes services (AWS EKS, GKE, AKS)
- Manual Helm chart creation without helm-chart-generator agent
- Manual Docker builds without docker-build-optimizer agent
- Direct kubectl commands without kubectl-ai or k8s-deploy-agent
- Cluster resources exceeding 4 CPUs and 8GB RAM
- Non-idempotent deployment scripts
- Deployments without health checks or observability

### VII. API-First Architecture
All data operations MUST go through the REST API layer:
- **Frontend → API → Database** (never Frontend → Database)
- **Frontend → Chat API → Agent → MCP Server → Database** (Phase III chat flow)
- RESTful conventions (resource-based URLs, proper HTTP methods)
- JSON-only communication for all requests and responses
- Proper HTTP status codes (200, 201, 400, 404, 422, 500)
- Request/response validation with Pydantic models
- OpenAPI/Swagger documentation auto-generated
- Framework-agnostic design (no frontend coupling)
- Stateless communication (no server-side sessions)

### VIII. Frontend-Backend Separation
Clear separation of concerns between layers:
- **Frontend**: Presentation, user interaction, client-side state, chat UI
- **Backend**: Business logic, data validation, database operations, agent orchestration
- **Agent**: Natural language understanding, tool invocation, conversation management
- **MCP Server**: Tool exposure, stateless operations, database interaction
- **Database**: Data persistence, integrity constraints, relationships

**Frontend MUST**:
- Communicate with backend exclusively via REST API
- Use ChatKit for chat interface
- Handle loading, error, and success states for all operations
- Validate user input before API submission
- Never import database models, agent logic, or MCP code

**Backend MUST**:
- Expose REST API endpoints for all data operations
- Expose chat API for agent interactions
- Validate all inputs with Pydantic models
- Handle database transactions and error recovery
- Orchestrate agent via OpenAI Agents SDK
- Never render HTML or frontend-specific responses

**Agent MUST**:
- Use MCP tools for ALL task operations
- Never access database directly
- Handle errors gracefully with user-friendly messages
- Confirm user actions before execution
- Never hallucinate task state

**MCP Server MUST**:
- Expose stateless, database-backed tools
- Be callable by AI agent only
- Validate all tool inputs
- Return structured responses
- Handle database operations transactionally

**Database MUST**:
- Enforce data integrity with constraints and foreign keys
- Use migrations for all schema changes
- Support concurrent access with proper locking
- Persist conversations, messages, and tool calls

### IX. Data Integrity and Security
Phase IV maintains Phase II and Phase III security with additional deployment-specific requirements:

**Data Integrity**:
- All data persisted to Neon PostgreSQL
- Foreign key constraints enforced
- Database migrations version-controlled with Alembic
- Transactional operations with rollback on error
- Data survives application restarts
- Conversation history persisted across sessions
- Tool call history tracked for debugging
- **Persistent volumes** for stateful data in Kubernetes

**Security**:
- Environment variables for secrets (never commit .env files)
- `OPENROUTER_API_KEY` for AI agent (NOT `OPENAI_API_KEY`)
- CORS configuration for API (restrict origins in production)
- Input validation on frontend, backend, and MCP tools
- SQL injection prevention through ORM usage (SQLModel)
- XSS prevention through React auto-escaping
- Proper error handling (no sensitive data in error messages)
- Agent prompt injection prevention
- Tool access control (agent-only invocation)
- **Kubernetes Secrets** for sensitive configuration
- **Network Policies** for pod-to-pod communication
- **Resource Quotas** to prevent resource exhaustion

### X. AI Framework & API Key Constraint

**Framework**: OpenAI Agents SDK (MANDATORY)
**API Provider**: OpenRouter (NOT OpenAI directly)

Claude MUST:
- Configure Agents SDK to use OpenRouter-compatible base URL
- Accept OpenRouter API key via `OPENROUTER_API_KEY` environment variable
- Never assume OpenAI-paid API key exists
- Use Gemini models via OpenRouter (recommended)
- Document API key configuration in setup guides

**Prohibited**:
- ❌ `OPENAI_API_KEY` environment variable
- ❌ Direct OpenAI API usage
- ❌ Hardcoded API keys
- ✅ **Use instead**: `OPENROUTER_API_KEY` with OpenRouter base URL

### XI. MCP Architecture Requirement

Claude MUST implement:
- Official MCP SDK for Python
- MCP Server exposing task management tools
- Stateless tool design (no in-memory state)
- Database-backed tool operations
- Agent-only tool invocation (no direct frontend access)

**MCP Tools MUST be**:
- Stateless (fetch state from database on every call)
- Database-backed (persist all changes)
- Callable by AI agent only (not exposed to frontend)
- Well-documented with input/output schemas
- Error-handling with structured responses

**Direct DB access by agent logic is FORBIDDEN**. All database operations MUST go through MCP tools.

### XII. Stateless Backend Rule

FastAPI server MUST:
- Hold **no in-memory state** for conversations or agent context
- Fetch conversation history from database on every request
- Persist all data to database:
  - Conversations (user sessions)
  - Messages (user and agent messages)
  - Tool calls (agent tool invocations)
- Be restart-safe without data loss
- Support horizontal scaling (multiple instances)

**Prohibited**:
- ❌ In-memory conversation storage
- ❌ Session-based agent state
- ❌ Cached conversation history
- ✅ **Use instead**: Database queries for all state retrieval

### XIII. Agent Behavior Contract

AI Agent MUST:
- Use MCP tools for ALL task operations (create, read, update, delete, list)
- NEVER hallucinate task state or make up task data
- Always confirm user actions before execution (e.g., "Delete task X?")
- Handle errors gracefully with user-friendly messages
- Provide clear feedback for successful operations
- Handle edge cases (task not found, invalid input, database errors)
- Maintain conversation context across messages
- Follow natural language conventions (friendly, helpful tone)

**Prohibited Agent Behaviors**:
- ❌ Direct database access
- ❌ Hallucinating task data
- ❌ Executing destructive actions without confirmation
- ❌ Exposing technical error details to users
- ❌ Ignoring tool errors

### XIV. Kubernetes Deployment Architecture

Claude MUST implement:
- **Minikube** for local Kubernetes cluster
- **Helm Charts** for deployment management
- **Minimum 2 replicas** for frontend and backend services
- **Resource limits** (max 4 CPUs, 8GB RAM total)
- **Health checks** (liveness and readiness probes)
- **Service discovery** (ClusterIP services)
- **Ingress** for external access (if applicable)
- **Namespace isolation** (todo namespace recommended)

**Kubernetes Manifests MUST include**:
- Deployments with replica configuration
- Services for pod discovery
- ConfigMaps for non-sensitive configuration
- Secrets for sensitive data (API keys, database credentials)
- Resource requests and limits
- Health check probes
- Labels and selectors for pod management

**Deployment Requirements**:
- Idempotent (can be run multiple times safely)
- Complete in under 15 minutes on standard machines
- No manual intervention required
- Automated via Claude Agents and Skills
- Full observability (logs, metrics, pod status)

### XV. Docker Containerization Standards

Claude MUST implement:
- **Multi-stage builds** for optimized image sizes
- **Non-root users** for security
- **Health checks** in Dockerfiles
- **Environment variable** configuration
- **Layer caching** optimization
- **Gordon AI assistance** for Docker commands

**Dockerfile Requirements**:
- Frontend: Node.js base image, Next.js build, production server
- Backend: Python base image, FastAPI dependencies, production server
- Minimal image size (use alpine or slim variants)
- No secrets in image layers
- Proper .dockerignore files

**Docker Image Management**:
- Version tagging (e.g., v1.0.0, latest)
- Local registry or Minikube image loading
- Image verification before deployment
- Automated builds via docker-build-optimizer agent

### XVI. Helm Chart Requirements

Claude MUST implement:
- **Helm 3+** chart structure
- **Values.yaml** for configuration
- **Templates** for Kubernetes manifests
- **Chart.yaml** with metadata
- **Dependencies** management (if applicable)

**Helm Chart Structure**:
```
helm/
├── todo-frontend/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── configmap.yaml
│       └── ingress.yaml (optional)
└── todo-backend/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment.yaml
        ├── service.yaml
        ├── configmap.yaml
        └── secret.yaml
```

**Helm Chart Requirements**:
- Parameterized configuration via values.yaml
- Resource limits configurable
- Replica count configurable
- Image tags configurable
- Environment variables configurable
- Generated via helm-chart-generator agent

### XVII. AI DevOps Automation

Claude MUST use:
- **Claude Agents** for all deployment tasks
- **Skills** (SKILL.md) for each agent defining precise tasks
- **kubectl-ai** for AI-powered Kubernetes operations
- **Kagent** for cluster health monitoring and optimization
- **Gordon** for Docker command assistance

**Required Agents and Skills**:
- **docker-build-optimizer**: Build and optimize Docker images
- **docker-container-runner**: Run and test containers locally
- **helm-chart-generator**: Generate Helm charts for services
- **k8s-deploy-agent**: Deploy to Minikube using Helm
- **k8s-cleanup**: Clean up Kubernetes resources before redeployment
- **cluster-health-monitor**: Monitor pod status, logs, and metrics

**Agent Requirements**:
- Each agent has dedicated SKILL.md file
- Agents run independently or chained
- No manual coding required
- Full automation from build to deployment
- Error handling and retry logic
- Observability and logging

### XVIII. Deployment Idempotency Rule

All deployment operations MUST be idempotent:
- Running deployment twice produces same result
- No residual state from previous deployments
- Clean environment reset capability
- Reproducible deployments across machines

**Idempotency Requirements**:
- Helm upgrades use `--install` flag (install if not exists)
- Kubernetes resources use declarative configuration
- Docker images use consistent tags
- Database migrations are idempotent
- Cleanup scripts remove all resources completely
- Environment can be reset to clean state

**Prohibited**:
- ❌ Imperative kubectl commands that fail on re-run
- ❌ Stateful deployment scripts
- ❌ Manual cleanup steps
- ✅ **Use instead**: Declarative Helm charts and automated cleanup agents

## Phase IV Objective

Deploy the **Todo AI Chatbot** (Phase II + Phase III) to a **local Kubernetes cluster** using:

- **Minikube** for orchestration
- **Helm Charts** for deployment management
- **Docker** for containerization
- **AI DevOps** tools (kubectl-ai, Kagent, Gordon)
- **Claude Agents** for full automation

The deployment must be:
- **Fully automated** (no manual steps)
- **Idempotent** (repeatable)
- **Observable** (logs, metrics, health checks)
- **Resource-efficient** (max 4 CPUs, 8GB RAM)
- **Fast** (under 15 minutes)

## Phase IV Technology Stack

### Deployment Layer (NEW)
- **Container Runtime**: Docker Desktop (Windows 10+)
- **Orchestration**: Minikube (local Kubernetes)
- **Package Manager**: Helm 3+
- **AI DevOps**: kubectl-ai, Kagent, Gordon
- **Automation**: Claude Agents with Skills
- **Environment**: Windows 10+ (PowerShell or Bash)

### AI/Agent Layer (Phase III - maintained)
- **Agent Framework**: OpenAI Agents SDK
- **LLM Provider**: OpenRouter (NOT OpenAI directly)
- **Recommended Model**: Gemini via OpenRouter
- **Tool Protocol**: MCP (Model Context Protocol)
- **MCP SDK**: Official Python MCP SDK
- **Agent Configuration**: OpenRouter-compatible base URL
- **API Key**: `OPENROUTER_API_KEY` environment variable

### Backend (Phase II + Phase III - maintained)
- **Framework**: FastAPI 0.100+
- **Language**: Python 3.13+
- **Validation**: Pydantic v2
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Migrations**: Alembic
- **Agent SDK**: OpenAI Agents SDK
- **MCP Server**: Official MCP SDK
- **Documentation**: OpenAPI/Swagger (auto-generated)
- **Containerization**: Docker

### Frontend (Phase II - maintained)
- **Framework**: Next.js 15+ with App Router
- **UI Library**: React 19+ with hooks
- **Chat UI**: OpenAI ChatKit
- **Language**: TypeScript 5+ (strict mode enabled)
- **Styling**: Tailwind CSS 3+ (utility-first)
- **State Management**: React hooks, Context API
- **HTTP Client**: fetch API or axios
- **Containerization**: Docker

### Database (Phase II - maintained)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: SQLModel
- **Migrations**: Alembic
- **Primary Keys**: UUID or auto-increment integers
- **Relationships**: Foreign keys with CASCADE/RESTRICT
- **Indexes**: Strategic indexing for query performance
- **Phase III Tables**: Conversations, Messages, ToolCalls

## Phase IV Quality Standards

### Deployment Standards
- Helm charts syntactically correct and validated
- Kubernetes manifests pass validation
- Docker images build successfully
- Containers start without errors
- Health checks pass for all pods
- Services accessible within cluster
- Resource limits respected (4 CPUs, 8GB RAM)
- Deployment completes in under 15 minutes

### Observability Standards
- Pod logs accessible via kubectl or Kagent
- Pod status monitored (Running, Pending, Failed)
- Resource usage tracked (CPU, memory)
- Health check endpoints responding
- Cluster events logged
- Deployment history tracked

### Automation Standards
- All deployment tasks automated via Claude Agents
- Each agent has dedicated SKILL.md file
- Agents run without manual intervention
- Error handling and retry logic implemented
- Deployment scripts idempotent
- Cleanup scripts remove all resources

### Resource Management Standards
- Frontend: max 1 CPU, 2GB RAM per replica
- Backend: max 1.5 CPU, 3GB RAM per replica
- Total cluster: max 4 CPUs, 8GB RAM
- Minimum 2 replicas for frontend and backend
- Resource requests and limits defined
- No resource exhaustion

### Documentation Standards
- Helm charts documented with README
- Deployment scripts documented
- Agent SKILL.md files complete
- Kubernetes architecture documented
- Troubleshooting guide provided
- Rollback procedures documented

## Phase III Foundations (Maintained)

Phase IV builds on Phase III foundations. All Phase III principles remain in effect:

### Phase III Architecture (Maintained)
- AI-powered chatbot with natural language interface
- OpenAI Agents SDK with OpenRouter integration
- MCP Server with stateless, database-backed tools
- Conversation persistence and message tracking
- Agent behavior contract compliance
- No manual coding (Claude generates all code)

### Phase III Quality Standards (Maintained)
- Agent uses MCP tools for all task operations
- No direct database access from agent logic
- Stateless backend (restart-safe)
- Conversation persistence working
- ChatKit UI integrated
- Natural language task operations functional
- Agent behavior meets contract

## Phase II Foundations (Maintained)

Phase IV builds on Phase II foundations. All Phase II principles remain in effect:

### Phase II Architecture (Maintained)
- Full-stack web application (Next.js + FastAPI + Neon)
- Persistent database storage
- REST API for all data operations
- Responsive web UI (mobile, tablet, desktop)
- CRUD operations for todos
- Filtering, sorting, pagination
- Error handling and loading states
- Basic security (input validation, CORS)

### Phase II Deprecations (Still Enforced)
The following Phase I constraints remain **DEPRECATED** and MUST NOT be used:

**Deprecated Storage Patterns**:
- ❌ In-memory lists: `todos = []`
- ❌ In-memory dictionaries: `todos = {}`
- ❌ Session-based storage
- ❌ Data lost on restart
- ✅ **Use instead**: Neon PostgreSQL with SQLModel

**Deprecated Indexing Patterns**:
- ❌ Positional indexes: `todos[0]`, `todos[1]`
- ❌ List-based indexing
- ❌ Manual ID assignment based on list length
- ✅ **Use instead**: UUID or auto-increment primary keys

**Deprecated Interface Patterns**:
- ❌ CLI-only interfaces: `input()`, `print()`
- ❌ Terminal menus
- ❌ Console-based UI
- ✅ **Use instead**: Next.js web interface + ChatKit chat UI

## Phase IV Scope

### Phase IV Scope (In Scope)
- Local Kubernetes deployment with Minikube
- Docker containerization for frontend and backend
- Helm chart creation and deployment
- AI DevOps automation (kubectl-ai, Kagent, Gordon)
- Claude Agents for deployment tasks
- Cluster health monitoring and optimization
- Resource management and limits
- Deployment idempotency
- Observability (logs, metrics, pod status)
- Cleanup and reset automation
- Windows 10+ environment support

### Phase IV Boundaries (Out of Scope)
- Cloud Kubernetes deployments (AWS EKS, GKE, AKS) → Phase V+
- Production-grade monitoring (Prometheus, Grafana) → Phase V+
- CI/CD pipelines (GitHub Actions, Jenkins) → Phase V+
- Multi-cluster deployments → Phase V+
- Service mesh (Istio, Linkerd) → Phase V+
- Advanced networking (Ingress controllers, load balancers) → Phase V+
- Database clustering and replication → Phase V+
- Disaster recovery and backup → Phase V+

## Success Criteria

### Phase IV Completion Requires
- ✅ Docker images built for frontend and backend
- ✅ Docker containers run successfully locally
- ✅ Helm charts generated for frontend and backend
- ✅ Helm charts deployed to Minikube
- ✅ Minimum 2 replicas running for each service
- ✅ All pods in Running state
- ✅ Health checks passing for all pods
- ✅ Services accessible within cluster
- ✅ Resource limits respected (4 CPUs, 8GB RAM)
- ✅ Deployment completes in under 15 minutes
- ✅ Deployment is idempotent (can be re-run)
- ✅ Cleanup scripts remove all resources
- ✅ All deployment tasks automated via Claude Agents
- ✅ Agent SKILL.md files complete
- ✅ kubectl-ai and Kagent functional
- ✅ Cluster health monitored and optimized
- ✅ Logs and metrics accessible
- ✅ No manual deployment steps required
- ✅ Full reproducibility across machines

### Quality Gates
- All Helm charts validated
- All Kubernetes manifests validated
- All Docker images verified
- All pods healthy and running
- All services responding
- Resource usage within limits
- Deployment time under 15 minutes
- Idempotency verified (re-run successful)
- Cleanup verified (all resources removed)
- Agent automation verified (no manual steps)
- Observability verified (logs, metrics accessible)

## No Manual Coding Policy

**Human (developer) will NOT write code**.

Claude generates ALL:
- Specs
- Plans
- Tasks
- Code
- Fixes
- Tests
- Documentation
- **Dockerfiles**
- **Helm Charts**
- **Deployment Scripts**
- **Agent Skills**

Any instruction that implies manual coding MUST be rejected.

**Rationale**: This ensures consistency, traceability, and adherence to Spec-Driven Development methodology. All code is generated from approved specifications, maintaining full audit trail from requirement to implementation.

## Governance

This constitution supersedes all other practices and requirements. Any deviation requires explicit amendment with proper approval through the `/sp.constitution` command.

### Amendment Procedure
1. Propose changes with clear rationale
2. Document impact on existing artifacts
3. Update constitution with version bump
4. Propagate changes to all dependent templates
5. Create ADR for significant architectural decisions

### Versioning Policy
- **MAJOR**: Backward incompatible changes (e.g., Phase III → Phase IV)
- **MINOR**: New principles or expanded guidance
- **PATCH**: Clarifications, wording fixes, non-semantic changes

### Compliance Review
- All pull requests must verify compliance with Phase IV principles
- Phase IV governance agent reviews all deployment specifications
- No deployment proceeds without passing validation checks
- Kubernetes manifests must pass validation
- Helm charts must be syntactically correct
- Docker images must build successfully
- Resource limits must be respected

### Phase IV Enforcement
The constitution ensures focus on Phase IV objectives:
- Local Kubernetes deployment with Minikube
- Docker containerization with optimization
- Helm chart-based deployment management
- AI DevOps automation (kubectl-ai, Kagent, Gordon)
- Claude Agents for full deployment automation
- Deployment idempotency and reproducibility
- Observability and resource management
- No manual deployment steps

All changes must maintain alignment with Spec-Driven Development methodology, Phase II architectural foundations, Phase III AI agent principles, and Phase IV deployment standards.

**Version**: 4.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-02-07
