<!--
Sync Impact Report:
- Version change: 3.0.0 → 4.0.0 (MAJOR - Phase IV Local Kubernetes Deployment)
- Modified principles:
  - Title: "Phase III Constitution" → "Phase IV Constitution" (Kubernetes deployment focus)
  - Principle II: "Phase III Integrity" → "Phase IV Integrity" (deployment architecture)
  - Added AI-Assisted DevOps requirement (Gordon, kubectl-ai, kagent)
  - Added Cloud-Native Best Practices principle
  - Added Local Kubernetes Deployment principle
- Added sections:
  - AI-Assisted DevOps Primacy (new Principle XVI)
  - Cloud-Native Best Practices (new Principle XVII)
  - Local Kubernetes Deployment (new Principle XVIII)
  - Phase IV Objective (deployment focus)
  - Phase IV Technology Stack (Kubernetes, Minikube, Helm, Docker)
  - Phase IV Documentation Requirements (deployment guides, AI tool logs)
- Removed sections:
  - None (Phase IV builds on Phase III)
- Templates requiring updates:
  - .specify/templates/spec-template.md ✅ updated (added deployment, Kubernetes, Helm sections)
  - .specify/templates/plan-template.md ✅ updated (added Phase IV deployment architecture)
  - .specify/templates/tasks-template.md ✅ updated (added Phase IV task categories: deployment, Kubernetes, Docker)
  - .specify/templates/commands/*.md ⚠ pending (update for Phase IV context)
- Follow-up TODOs:
  - Create Phase IV implementation guidelines for Kubernetes deployment
  - Document Gordon, kubectl-ai, kagent usage patterns
  - Create deployment verification checklist
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
Phase IV focuses on **local Kubernetes deployment** of the Phase III Todo AI Chatbot. The application MUST be deployed using:

**Deployment Platform** (Phase IV - NEW):
- Minikube (local Kubernetes cluster)
- Helm 3+ (package manager for Kubernetes)
- Docker (containerization)
- kubectl (Kubernetes CLI)

**AI-Assisted DevOps Tools** (Phase IV - MANDATORY):
- Gordon (AI-powered Docker assistant)
- kubectl-ai (AI-powered Kubernetes assistant)
- kagent (Kubernetes agent for deployment automation)

**Application Stack** (Phase III - maintained as-is):
- Frontend: Next.js 15+ with React 19+, TypeScript 5+, Tailwind CSS 3+, OpenAI ChatKit
- Backend: FastAPI 0.100+ with Python 3.13+, OpenAI Agents SDK, MCP Server
- Database: Neon PostgreSQL (serverless)
- AI/Agent: OpenAI Agents SDK with OpenRouter, MCP tools

Phase IV explicitly **FORBIDS**:
- Manual coding by humans (Claude generates ALL code and configs)
- Manual Docker commands without Gordon (use Gordon or Claude-generated fallbacks)
- Manual kubectl commands without kubectl-ai/kagent (use AI tools or Claude-generated fallbacks)
- Cloud provider deployments (AWS, GCP, Azure) - local Minikube only
- New application features (use Phase III codebase as-is)
- Production-grade elements (autoscaling, advanced security, monitoring)
- Hardcoded values in Kubernetes manifests (use environment variables)

### III. Reusability and Extension
Design must support future phases (Phase V+) through:
- Helm chart templates for easy customization
- Environment-based configuration (dev, staging, prod)
- Modular Kubernetes manifests
- Clear deployment documentation for reproducibility
- Blueprint automation for repeated deployments
- Version-controlled deployment artifacts
- Extensible architecture for cloud migration (Phase V+)

### IV. Determinism and Testability
All deployment components must be predictable and testable:
- **Docker Images**: Multi-stage builds with consistent tagging
- **Helm Charts**: Templated manifests with value validation
- **Kubernetes Manifests**: Declarative configuration with health checks
- **Deployment Process**: Idempotent operations with rollback support
- **Verification**: Automated checks for pod status, service accessibility, chatbot functionality
- All deployment steps must have clear, testable acceptance criteria

### V. Test-First Development (NON-NEGOTIABLE)
TDD remains mandatory for deployment artifacts:
- **Docker**: Write Dockerfile → Build image → Test container → Optimize → Refactor
- **Helm**: Write chart templates → Validate syntax → Test deployment → Verify → Refactor
- **Kubernetes**: Write manifests → Apply to cluster → Verify pods → Test services → Refactor
- **End-to-End**: Write deployment tests → Deploy application → Verify functionality → Refactor
- Red-Green-Refactor cycle strictly enforced for all deployment artifacts

### VI. Technology Stack Compliance
Phase IV requires specific technologies for deployment:

**Approved Deployment Stack** (Phase IV - NEW):
- Minikube (local Kubernetes cluster)
- Helm 3+ (Kubernetes package manager)
- Docker (containerization platform)
- kubectl (Kubernetes CLI)
- Gordon (AI Docker assistant)
- kubectl-ai (AI Kubernetes assistant)
- kagent (Kubernetes deployment agent)

**Approved Application Stack** (Phase III - maintained):
- Frontend: Next.js 15+, React 19+, TypeScript 5+, Tailwind CSS 3+, OpenAI ChatKit
- Backend: FastAPI 0.100+, Python 3.13+, OpenAI Agents SDK, MCP Server
- Database: Neon PostgreSQL (serverless)
- AI/Agent: OpenAI Agents SDK with OpenRouter, MCP tools

**Prohibited**:
- Manual coding by humans (Claude generates ALL code and configs)
- Manual Docker commands without Gordon (unless Gordon unavailable)
- Manual kubectl commands without kubectl-ai/kagent (unless tools unavailable)
- Cloud provider deployments (AWS EKS, GCP GKE, Azure AKS)
- New application features (Phase III codebase is frozen)
- Production-grade elements (autoscaling, advanced monitoring, service mesh)
- Hardcoded secrets in manifests (use Kubernetes Secrets)

### VII. API-First Architecture
All data operations MUST go through the REST API layer (Phase III maintained):
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
Clear separation of concerns between layers (Phase III maintained):
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
Phase IV maintains Phase III security with additional deployment-specific requirements:

**Data Integrity**:
- All data persisted to Neon PostgreSQL
- Foreign key constraints enforced
- Database migrations version-controlled with Alembic
- Transactional operations with rollback on error
- Data survives application restarts
- Conversation history persisted across sessions
- Tool call history tracked for debugging

**Security**:
- Environment variables for secrets (never commit .env files)
- Kubernetes Secrets for sensitive data (API keys, database credentials)
- `OPENROUTER_API_KEY` for AI agent (NOT `OPENAI_API_KEY`)
- CORS configuration for API (restrict origins in production)
- Input validation on frontend, backend, and MCP tools
- SQL injection prevention through ORM usage (SQLModel)
- XSS prevention through React auto-escaping
- Proper error handling (no sensitive data in error messages)
- Agent prompt injection prevention
- Tool access control (agent-only invocation)
- Container security (non-root users, minimal base images)

### X. AI Framework & API Key Constraint
**Framework**: OpenAI Agents SDK (MANDATORY)
**API Provider**: OpenRouter (NOT OpenAI directly)

Claude MUST:
- Configure Agents SDK to use OpenRouter-compatible base URL
- Accept OpenRouter API key via `OPENROUTER_API_KEY` environment variable
- Never assume OpenAI-paid API key exists
- Use Gemini models via OpenRouter (recommended)
- Document API key configuration in setup guides
- Pass API keys via Kubernetes Secrets (not hardcoded)

**Prohibited**:
- ❌ `OPENAI_API_KEY` environment variable
- ❌ Direct OpenAI API usage
- ❌ Hardcoded API keys in manifests or code
- ✅ **Use instead**: `OPENROUTER_API_KEY` with OpenRouter base URL via Kubernetes Secrets

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

### XIV. Folder Ownership & Review Policy
Claude MUST respect project boundaries:

**`/api` (Backend)**:
- FastAPI application
- OpenAI Agents SDK integration
- MCP Server implementation
- Database models (SQLModel)
- Chat API endpoints
- Conversation and message persistence
- Dockerfile for backend containerization

**`/web` (Frontend)**:
- Next.js application
- OpenAI ChatKit UI
- Stateless chat client
- Auth integration
- Todo UI components
- Dockerfile for frontend containerization

**`/helm` (Deployment - Phase IV NEW)**:
- Helm charts for backend and frontend
- Kubernetes manifests (Deployment, Service, ConfigMap, Secret)
- Values files for environment configuration
- Chart metadata and templates

**Review Requirements**:
Claude MUST:
- Review existing backend + frontend code before Phase IV deployment
- Identify deployment blockers or configuration issues
- Fix issues ONLY through generated code/configs (no advice-only answers)
- Ensure Phase III application remains functional
- Validate Phase IV deployment artifacts align with constitution

### XV. Spec-First Documentation Requirement
All Phase IV work MUST produce:

**Required Specifications**:
- `/specs/phase-iv/deployment.md` - Deployment architecture and process
- `/specs/phase-iv/docker.md` - Docker image specifications
- `/specs/phase-iv/helm.md` - Helm chart specifications
- `/specs/phase-iv/kubernetes.md` - Kubernetes manifest specifications
- `/specs/phase-iv/verification.md` - Deployment verification procedures

**Code/Config without matching spec = INVALID**.

Each specification MUST include:
- Deployment requirements and acceptance criteria
- Configuration contracts (environment variables, secrets)
- Resource specifications (CPU, memory, replicas)
- Health check strategies
- Rollback procedures
- Test scenarios

### XVI. AI-Assisted DevOps Primacy
Phase IV mandates **AI-first DevOps** using specialized tools:

**Gordon (AI Docker Assistant)** - MANDATORY for Docker operations:
- Use Gordon for all Docker commands: `docker ai "What can you do?"`
- Generate Dockerfiles via Gordon: `docker ai "Create a multi-stage Dockerfile for FastAPI"`
- Build images via Gordon: `docker ai "Build the backend image with tag v1.0"`
- Troubleshoot via Gordon: `docker ai "Why is my container failing?"`
- Fallback: If Gordon unavailable, Claude generates Docker commands directly

**kubectl-ai (AI Kubernetes Assistant)** - MANDATORY for Kubernetes operations:
- Use kubectl-ai for deployments: `kubectl-ai "deploy the todo frontend with 2 replicas"`
- Generate manifests via kubectl-ai: `kubectl-ai "create a service for the backend"`
- Troubleshoot via kubectl-ai: `kubectl-ai "why are my pods not running?"`
- Fallback: If kubectl-ai unavailable, Claude generates kubectl commands directly

**kagent (Kubernetes Agent)** - MANDATORY for deployment automation:
- Use kagent for complex deployments: `kagent deploy --app todo-chatbot --env local`
- Automate Helm operations via kagent
- Orchestrate multi-component deployments
- Fallback: If kagent unavailable, Claude generates Helm commands directly

**AI Tool Usage Requirements**:
- ALL Docker operations MUST attempt Gordon first
- ALL Kubernetes operations MUST attempt kubectl-ai/kagent first
- Document AI tool usage with logs/screenshots in repo
- Include AI tool prompts and responses in deployment documentation
- Demonstrate iterative refinement with AI tools (show prompt evolution)

**Prohibited**:
- ❌ Manual Docker commands without attempting Gordon first
- ❌ Manual kubectl commands without attempting kubectl-ai/kagent first
- ❌ Undocumented AI tool usage (must show logs/screenshots)
- ✅ **Use instead**: AI tools first, Claude-generated fallbacks if unavailable

### XVII. Cloud-Native Best Practices
Phase IV deployment MUST follow cloud-native principles:

**Stateless Applications**:
- No local file storage (use database or external storage)
- No in-memory session state (use database-backed sessions)
- Horizontal scaling support (multiple replicas)
- Restart-safe design (no data loss on pod restart)

**Environment-Based Configuration**:
- All configuration via environment variables
- No hardcoded values in code or manifests
- Kubernetes ConfigMaps for non-sensitive config
- Kubernetes Secrets for sensitive data (API keys, credentials)

**Health Checks**:
- Liveness probes (is container alive?)
- Readiness probes (is container ready to serve traffic?)
- Startup probes (has container finished initialization?)

**Resource Management**:
- CPU and memory requests defined
- CPU and memory limits defined
- Appropriate resource allocation for workload

**Multi-Stage Docker Builds**:
- Separate build and runtime stages
- Minimal runtime images (alpine, distroless)
- Layer caching optimization
- Security scanning for vulnerabilities

**Prohibited**:
- ❌ Stateful applications with local storage
- ❌ Hardcoded configuration values
- ❌ Missing health checks
- ❌ Undefined resource limits
- ❌ Single-stage Docker builds with bloated images
- ✅ **Use instead**: Stateless design, environment variables, health checks, resource limits, multi-stage builds

### XVIII. Local Kubernetes Deployment
Phase IV focuses on **local-only deployment** with Minikube:

**Minikube Requirements**:
- Local Kubernetes cluster (Minikube)
- No cloud provider dependencies (AWS, GCP, Azure)
- Local Docker registry or Minikube's built-in registry
- Port forwarding for local access

**Helm Deployment**:
- Helm 3+ for package management
- Separate charts for frontend and backend
- Values files for environment configuration
- Chart versioning and metadata

**Deployment Process**:
1. Build Docker images (via Gordon or Claude)
2. Load images into Minikube (if using local registry)
3. Create Kubernetes namespace (`todo`)
4. Apply Helm charts (via kubectl-ai/kagent or Claude)
5. Verify pod status (Running)
6. Verify service accessibility (port forwarding)
7. Test chatbot functionality (add/delete/update tasks)

**Verification Requirements**:
- All pods in `Running` state
- Services accessible via port forwarding
- Frontend loads in browser
- Backend API responds to health checks
- Chatbot can add, delete, and update tasks
- Database connection working
- No error logs in pod output

**Documentation Requirements**:
- Complete setup instructions in README
- All commands documented (Minikube, Docker, Helm, kubectl)
- AI tool usage logs/screenshots included
- Troubleshooting guide for common issues
- Reproducibility guarantee (anyone can follow README and deploy)

**Prohibited**:
- ❌ Cloud provider deployments (EKS, GKE, AKS)
- ❌ Production-grade elements (autoscaling, service mesh, advanced monitoring)
- ❌ New application features (Phase III codebase is frozen)
- ❌ Incomplete documentation (must be fully reproducible)
- ✅ **Use instead**: Local Minikube, basic deployment, Phase III codebase as-is, complete README

## Phase IV Objective

Deploy the **Phase III Todo AI Chatbot** to a **local Kubernetes cluster (Minikube)** using:

- AI-Assisted DevOps tools (Gordon, kubectl-ai, kagent)
- Docker containerization with multi-stage builds
- Helm charts for Kubernetes deployment
- Cloud-native best practices (stateless, environment variables, health checks)
- Complete documentation for reproducibility

The deployment must demonstrate **AI-first DevOps**, **cloud-native architecture**, and **hackathon-ready documentation** with logs/screenshots of AI tool usage.

## Phase IV Technology Stack

### Deployment Platform (Phase IV - NEW)
- **Kubernetes**: Minikube (local cluster)
- **Package Manager**: Helm 3+
- **Containerization**: Docker
- **Kubernetes CLI**: kubectl
- **AI Docker Assistant**: Gordon
- **AI Kubernetes Assistant**: kubectl-ai
- **Kubernetes Agent**: kagent

### Application Stack (Phase III - maintained as-is)
- **Frontend**: Next.js 15+, React 19+, TypeScript 5+, Tailwind CSS 3+, OpenAI ChatKit
- **Backend**: FastAPI 0.100+, Python 3.13+, OpenAI Agents SDK, MCP Server
- **Database**: Neon PostgreSQL (serverless)
- **AI/Agent**: OpenAI Agents SDK with OpenRouter, MCP tools

### Deployment Artifacts (Phase IV - NEW)
- **Dockerfiles**: Multi-stage builds for frontend and backend
- **Helm Charts**: Templates for Deployment, Service, ConfigMap, Secret
- **Values Files**: Environment-specific configuration
- **Kubernetes Manifests**: Declarative resource definitions
- **Documentation**: README with complete setup instructions

## Phase IV Quality Standards

### Docker Standards
- Multi-stage builds (build stage + runtime stage)
- Minimal runtime images (alpine, distroless)
- Non-root users for security
- Layer caching optimization
- Security scanning for vulnerabilities
- Consistent tagging (semantic versioning)

### Helm Standards
- Templated manifests with value substitution
- Values files for environment configuration
- Chart metadata (Chart.yaml) with version and description
- Helper templates for reusable logic
- Validation of required values
- Documentation (README.md) for chart usage

### Kubernetes Standards
- Declarative manifests (YAML)
- Resource requests and limits defined
- Health checks (liveness, readiness, startup probes)
- Environment variables via ConfigMaps and Secrets
- Labels and selectors for resource organization
- Namespace isolation (`todo` namespace)

### Deployment Standards
- Idempotent operations (can be run multiple times safely)
- Rollback support (Helm rollback capability)
- Verification procedures (automated checks)
- Documentation (complete setup instructions)
- AI tool usage logs/screenshots
- Reproducibility guarantee

### Security Standards (Phase IV)
- Kubernetes Secrets for sensitive data
- Non-root container users
- Minimal base images (reduced attack surface)
- No hardcoded credentials in manifests
- CORS properly configured
- Input validation maintained from Phase III
- Container security scanning

## Phase III Foundations (Maintained)

Phase IV deploys Phase III application without modifications. All Phase III principles remain in effect:

### Phase III Architecture (Maintained)
- AI-powered chatbot for task management
- Natural language task operations (create, read, update, delete, list)
- OpenAI Agents SDK integration with OpenRouter
- MCP Server with stateless, database-backed tools
- Conversation persistence across sessions
- Message history tracking
- Tool call logging
- Chat API endpoints
- ChatKit UI integration

### Phase III Constraints (Still Enforced)
- OpenAI Agents SDK (MANDATORY framework)
- OpenRouter API (NOT OpenAI directly)
- MCP Server for tool exposure
- Stateless backend (no in-memory state)
- Database-backed conversations
- Agent uses MCP tools (no direct database access)
- No manual coding (Claude generates all code)

## Phase II Foundations (Maintained)

Phase IV maintains Phase II foundations. All Phase II principles remain in effect:

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
- Local Kubernetes deployment (Minikube)
- Docker containerization (multi-stage builds)
- Helm chart creation (frontend and backend)
- AI-Assisted DevOps (Gordon, kubectl-ai, kagent)
- Cloud-native best practices (stateless, environment variables, health checks)
- Deployment verification (pods running, services accessible, chatbot functional)
- Complete documentation (README with setup instructions)
- AI tool usage logs/screenshots
- Reproducibility guarantee

### Phase IV Boundaries (Out of Scope)
- Cloud provider deployments (AWS, GCP, Azure) → Phase V+
- Production-grade elements (autoscaling, service mesh, advanced monitoring) → Phase V+
- New application features (Phase III codebase is frozen) → Future phases
- CI/CD pipelines (GitHub Actions, GitLab CI) → Phase V+
- Multi-cluster deployments → Phase V+
- Advanced security (network policies, pod security policies) → Phase V+
- Performance optimization (caching, CDN) → Phase V+
- Database migration to Kubernetes (Neon remains external) → Phase V+

## Success Criteria

### Phase IV Completion Requires
- ✅ Minikube cluster running locally
- ✅ Docker images built for frontend and backend (via Gordon or Claude)
- ✅ Helm charts created for frontend and backend
- ✅ Kubernetes manifests applied to `todo` namespace
- ✅ All pods in `Running` state
- ✅ Services accessible via port forwarding
- ✅ Frontend loads in browser
- ✅ Backend API responds to health checks
- ✅ Chatbot functional (add/delete/update tasks via UI/chat)
- ✅ Database connection working (Neon PostgreSQL)
- ✅ AI tool usage documented (Gordon, kubectl-ai, kagent logs/screenshots)
- ✅ README updated with complete setup instructions
- ✅ Deployment reproducible (anyone can follow README and deploy)
- ✅ No manual coding (Claude generated all configs and code)
- ✅ Hackathon requirements met (process, prompts, iterations documented)

### Quality Gates
- All Docker images use multi-stage builds
- All Kubernetes manifests have resource limits
- All pods have health checks (liveness, readiness)
- All secrets managed via Kubernetes Secrets
- No hardcoded values in manifests
- AI tool usage demonstrated with logs/screenshots
- README includes all commands and troubleshooting
- Deployment passes verification checklist
- Phase III application functionality maintained

## No Manual Coding Policy

**Human (developer) will NOT write code or configs**.

Claude generates ALL:
- Specs
- Plans
- Tasks
- Code
- Dockerfiles
- Helm charts
- Kubernetes manifests
- Configuration files
- Documentation
- Fixes
- Tests

Any instruction that implies manual coding/config MUST be rejected.

**Rationale**: This ensures consistency, traceability, and adherence to Spec-Driven Development methodology. All artifacts are generated from approved specifications, maintaining full audit trail from requirement to implementation.

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
- Phase IV governance agent reviews all specifications and plans
- No implementation proceeds without passing boundary checks
- Deployment must use AI-Assisted DevOps tools (Gordon, kubectl-ai, kagent)
- All deployment artifacts must follow cloud-native best practices
- Documentation must be complete and reproducible

### Phase IV Enforcement
The constitution ensures focus on Phase IV objectives:
- Local Kubernetes deployment (Minikube)
- AI-Assisted DevOps (Gordon, kubectl-ai, kagent)
- Cloud-native best practices (stateless, environment variables, health checks)
- Complete documentation with AI tool logs/screenshots
- Reproducibility guarantee
- No manual coding/config (Claude generates all artifacts)

All changes must maintain alignment with Spec-Driven Development methodology, Phase II architectural foundations, Phase III AI agent principles, and Phase IV deployment requirements.

**Version**: 4.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-02-12
