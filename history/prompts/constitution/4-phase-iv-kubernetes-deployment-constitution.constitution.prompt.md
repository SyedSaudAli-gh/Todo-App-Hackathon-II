---
id: 4
title: Update constitution to Phase IV Kubernetes deployment
stage: constitution
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5
feature: none
branch: main
user: system
command: /sp.constitution
labels: ["phase-iv", "kubernetes", "deployment", "docker", "helm", "ai-devops"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
tests:
  - None (constitution update)
---

## Prompt

```text
Project: Hackathon II - Phase IV: Local Kubernetes Deployment (Minikube, Helm, kubectl-ai, Kagent, Docker Desktop, Gordon)

Core principles:
- Automation: All deployment tasks should be AI-driven using Claude Agents and Skills; no manual coding.
- Reusability: Agents and Skills must be modular for repeated deployments.
- Accuracy: Deployment scripts, Helm charts, and Kubernetes configurations must be syntactically correct and validated.
- Observability: Cluster health, pod status, and logs must be monitored and optimized by AI agents.
- Stateless design: Each deployment should be idempotent; environment can be reset without residual state.

Key standards:
- Containerization: Frontend and Backend must be Dockerized with Gordon AI-assisted commands.
- Orchestration: Kubernetes deployments via Minikube using Helm Charts.
- AI DevOps: kubectl-ai and Kagent should assist in scaling, health checks, and resource optimization.
- Skills & Agents: Each agent has dedicated SKILL.md describing precise tasks (docker-build, docker-run, helm-chart, k8s-deploy, cluster-health, cleanup/reset).
- Environment consistency: Scripts must work on Windows 10+ with PowerShell or Bash (depending on user OS).
- Documentation: All commands, scripts, and Helm charts must be clearly documented.

Constraints:
- Local deployment only; no cloud resources.
- Minimum 2 replicas for frontend and backend services.
- Deployment should complete in under 15 minutes on standard local machines.
- All agents should run independently or chained without errors.
- Cluster resources must not exceed 4 CPUs and 8GB RAM.

Success criteria:
- Docker containers build and run correctly.
- Helm charts deployed successfully to Minikube.
- kubectl-ai / Kagent agents correctly manage scaling and cluster health.
- No errors in pods, services, or deployments.
- Full reproducibility: redeploying environment results in same cluster state.
- Phase IV deployment fully automated via Claude Agents and Skills.
```

## Response snapshot

Updated constitution from version 3.0.0 (Phase III) to 4.0.0 (Phase IV) with comprehensive Kubernetes deployment architecture.

**Major Changes**:
- Added 5 new principles (XIV-XVIII) covering Kubernetes, Docker, Helm, AI DevOps, and deployment idempotency
- Expanded technology stack with deployment layer (Docker Desktop, Minikube, Helm 3+, kubectl-ai, Kagent, Gordon)
- Added Phase IV objective, scope, and success criteria
- Added deployment quality standards (deployment, observability, automation, resource management, documentation)
- Maintained all Phase II and Phase III foundations

**Template Updates**:
- Updated plan-template.md with Phase IV deployment architecture section and constitution checks
- Updated spec-template.md with Phase IV deployment configuration section
- Updated tasks-template.md with Phase IV deployment setup tasks

**Key Principles Added**:
- Principle XIV: Kubernetes Deployment Architecture (Minikube, Helm, replicas, resource limits, health checks)
- Principle XV: Docker Containerization Standards (multi-stage builds, security, optimization)
- Principle XVI: Helm Chart Requirements (chart structure, parameterization, templates)
- Principle XVII: AI DevOps Automation (Claude Agents, Skills, kubectl-ai, Kagent, Gordon)
- Principle XVIII: Deployment Idempotency Rule (repeatable, declarative, clean reset)

## Outcome

- ✅ Impact: Constitution successfully upgraded to Phase IV with Kubernetes deployment architecture. All deployment requirements, constraints, and automation standards documented.
- 🧪 Tests: None (constitution document update)
- 📁 Files: Updated constitution.md (v4.0.0), plan-template.md, spec-template.md, tasks-template.md
- 🔁 Next prompts: Create Phase IV deployment specifications, generate agent SKILL.md files, implement Docker and Helm configurations
- 🧠 Reflection: Phase IV constitution maintains backward compatibility with Phase II and Phase III while adding comprehensive deployment layer. All deployment tasks must be automated via Claude Agents with no manual steps.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - Constitution follows semantic versioning (MAJOR bump 3.0.0 → 4.0.0), all placeholders filled, templates updated
- Prompt variant (if applicable): Standard constitution update workflow
- Next experiment (smallest change to try): Validate Helm chart structure against constitution requirements, create first deployment agent SKILL.md
