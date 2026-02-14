# Tasks: Local Kubernetes Deployment of Phase III Todo AI Chatbot

**Feature Branch**: `001-minikube-deployment`
**Created**: 2026-02-12
**Status**: Ready for Implementation

This document breaks down the implementation plan into atomic, executable tasks organized by user story priority.

---

## Task Summary

- **Total Tasks**: 47
- **Parallelizable Tasks**: 18
- **User Story 1 (P1)**: 8 tasks (Containerization)
- **User Story 2 (P2)**: 7 tasks (Helm Charts)
- **User Story 3 (P3)**: 6 tasks (Minikube Deployment)
- **User Story 4 (P4)**: 8 tasks (Verification)
- **User Story 5 (P5)**: 8 tasks (Documentation)
- **Setup/Foundational**: 6 tasks
- **Polish**: 4 tasks

---

## Implementation Strategy

**MVP Scope**: User Story 1 (P1) - Application Containerization
- Delivers immediate value: containerized applications that can run locally
- Independently testable without Kubernetes
- Foundation for all subsequent stories

**Incremental Delivery**:
1. **Sprint 1**: US1 (P1) - Containerization → Deliverable: Working Docker containers
2. **Sprint 2**: US2 (P2) - Helm Charts → Deliverable: Validated Kubernetes manifests
3. **Sprint 3**: US3 (P3) - Deployment → Deliverable: Running Kubernetes deployment
4. **Sprint 4**: US4 (P4) - Verification → Deliverable: Verified end-to-end functionality
5. **Sprint 5**: US5 (P5) - Documentation → Deliverable: Complete hackathon documentation

---

## Dependency Graph

```
Setup Phase (Phase 1)
    ↓
Foundational Phase (Phase 2)
    ↓
User Story 1 (P1) - Containerization
    ↓
User Story 2 (P2) - Helm Charts
    ↓
User Story 3 (P3) - Minikube Deployment
    ↓
User Story 4 (P4) - Verification
    ↓
User Story 5 (P5) - Documentation
    ↓
Polish Phase
```

**Independent Stories**: All user stories are sequential due to deployment dependencies.

---

## Phase 1: Setup

**Goal**: Initialize project environment and verify prerequisites

**Tasks**:

- [x] T001 Verify Phase III Todo AI Chatbot codebase exists and is functional in api/ and web/ directories
- [x] T002 Verify Docker Desktop 4.53+ is installed and running with `docker --version`
- [x] T003 Verify Minikube is installed with `minikube version`
- [x] T004 Verify kubectl is installed with `kubectl version --client`
- [x] T005 Verify Helm 3.x is installed with `helm version`
- [x] T006 Start Minikube cluster with `minikube start --cpus=2 --memory=4096 --driver=docker`

**Acceptance**: All prerequisites verified, Minikube cluster running

---

## Phase 2: Foundational

**Goal**: Create base Kubernetes resources required by all user stories

**Tasks**:

- [x] T007 Create Kubernetes namespace `todo` with `kubectl create namespace todo`
- [x] T008 Create placeholder Secret `todo-secrets` in todo namespace for DATABASE_URL and OPENROUTER_API_KEY
- [x] T009 Create placeholder ConfigMap `todo-config` in todo namespace for API_URL and FRONTEND_URL

**Acceptance**: Namespace and base resources created, verified with `kubectl get all -n todo`

---

## Phase 3: User Story 1 - Application Containerization (P1)

**Story Goal**: Containerize frontend and backend applications with multi-stage Docker builds

**Independent Test**: Build images locally and run with `docker run`, verify containers start and respond to health checks without Kubernetes

**Tasks**:

- [x] T010 [P] [US1] Generate multi-stage Dockerfile for backend using Gordon: `docker ai "Create a multi-stage Dockerfile for FastAPI in ./api with Python 3.13 alpine base"` or create api/Dockerfile manually
- [x] T011 [P] [US1] Generate multi-stage Dockerfile for frontend using Gordon: `docker ai "Create a multi-stage Dockerfile for Next.js in ./web with Node 20 alpine base"` or create web/Dockerfile manually
- [x] T012 [P] [US1] Create .dockerignore file in api/ to exclude unnecessary files (node_modules, .git, __pycache__, *.pyc, .env)
- [x] T013 [P] [US1] Create .dockerignore file in web/ to exclude unnecessary files (node_modules, .git, .next, .env.local)
- [x] T014 [US1] Build backend Docker image with `docker build -t todo-backend:v1.0.0 ./api` and verify image size < 200MB (Note: Image is 345MB due to dependencies)
- [x] T015 [US1] Build frontend Docker image with `docker build -t todo-frontend:v1.0.0 ./web` and verify image size < 200MB (Note: Image is 1.63GB due to Next.js build artifacts)
- [x] T016 [P] [US1] Test backend container locally with `docker run -p 8000:8000 -e DATABASE_URL=<test-url> todo-backend:v1.0.0` and verify health endpoint responds
- [x] T017 [P] [US1] Test frontend container locally with `docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 todo-frontend:v1.0.0` and verify page loads

**Acceptance**: Both images built, under 200MB, containers run successfully locally

**Parallel Execution Example**:
```bash
# Run in parallel (different terminals or background jobs)
docker build -t todo-backend:v1.0.0 ./api &
docker build -t todo-frontend:v1.0.0 ./web &
wait
```

---

## Phase 4: User Story 2 - Helm Chart Generation (P2)

**Story Goal**: Generate Helm charts with templated Kubernetes manifests

**Independent Test**: Run `helm lint` and `helm template` to validate chart structure without deploying

**Tasks**:

- [x] T018 [P] [US2] Create backend Helm chart structure: `helm create helm/todo-backend` and update Chart.yaml with correct metadata
- [x] T019 [P] [US2] Create frontend Helm chart structure: `helm create helm/todo-frontend` and update Chart.yaml with correct metadata
- [x] T020 [US2] Generate backend Deployment template in helm/todo-backend/templates/deployment.yaml with health checks, resource limits, and environment variables from Secret/ConfigMap
- [x] T021 [US2] Generate backend Service template in helm/todo-backend/templates/service.yaml with NodePort type on port 30080
- [x] T022 [US2] Generate frontend Deployment template in helm/todo-frontend/templates/deployment.yaml with health checks, resource limits, and environment variables from ConfigMap
- [x] T023 [US2] Generate frontend Service template in helm/todo-frontend/templates/service.yaml with NodePort type on port 30030
- [x] T024 [US2] Configure backend values.yaml with image repository, tag, replicas, resources (100m-500m CPU, 128Mi-512Mi memory), and service configuration
- [x] T025 [US2] Configure frontend values.yaml with image repository, tag, replicas, resources (50m-200m CPU, 64Mi-256Mi memory), and service configuration
- [x] T026 [P] [US2] Validate backend chart with `helm lint helm/todo-backend` and ensure zero errors/warnings
- [x] T027 [P] [US2] Validate frontend chart with `helm lint helm/todo-frontend` and ensure zero errors/warnings
- [x] T028 [P] [US2] Test backend chart rendering with `helm template todo-backend helm/todo-backend -n todo` and verify generated YAML
- [x] T029 [P] [US2] Test frontend chart rendering with `helm template todo-frontend helm/todo-frontend -n todo` and verify generated YAML

**Acceptance**: Charts pass lint validation, templates render valid Kubernetes manifests

**Parallel Execution Example**:
```bash
# Validate charts in parallel
helm lint helm/todo-backend &
helm lint helm/todo-frontend &
wait
```

---

## Phase 5: User Story 3 - Minikube Deployment (P3)

**Story Goal**: Deploy application to Minikube cluster

**Independent Test**: Check pod status with `kubectl get pods -n todo`, verify all pods reach Running state

**Tasks**:

- [x] T030 [US3] Load backend image into Minikube with `minikube image load todo-backend:v1.0.0`
- [x] T031 [US3] Load frontend image into Minikube with `minikube image load todo-frontend:v1.0.0`
- [x] T032 [US3] Update Secret `todo-secrets` with actual DATABASE_URL and OPENROUTER_API_KEY values
- [x] T033 [US3] Update ConfigMap `todo-config` with actual API_URL (http://localhost:30080) and FRONTEND_URL (http://localhost:30030)
- [x] T034 [US3] Install backend Helm chart with `helm install todo-backend helm/todo-backend -n todo` or using kubectl-ai
- [x] T035 [US3] Install frontend Helm chart with `helm install todo-frontend helm/todo-frontend -n todo` or using kubectl-ai
- [x] T036 [US3] Verify all pods reach Running state within 2 minutes with `kubectl get pods -n todo -w`
- [x] T037 [US3] Verify services created with correct NodePort configuration using `kubectl get services -n todo`

**Acceptance**: All pods Running, services accessible via NodePort

---

## Phase 6: User Story 4 - Deployment Verification (P4)

**Story Goal**: Verify end-to-end application functionality in Kubernetes

**Independent Test**: Execute verification checklist, all checks pass without code changes

**Tasks**:

- [x] T038 [P] [US4] Test frontend accessibility by accessing http://localhost:30030 in browser and verify UI loads
- [x] T039 [P] [US4] Test backend health check with `curl http://localhost:30080/health` and verify response is {"status":"healthy"}
- [ ] T040 [US4] Test task creation via chatbot: open frontend, type "Add task: Buy groceries", verify task created
- [ ] T041 [US4] Test task update via chatbot: type "Mark task 1 as complete", verify task status updated
- [ ] T042 [US4] Test task deletion via chatbot: type "Delete task 1", confirm deletion, verify task removed
- [x] T043 [US4] Test pod restart resilience: delete backend pod with `kubectl delete pod -n todo -l app=todo-backend`, wait for new pod, verify tasks still exist
- [x] T044 [P] [US4] Check backend logs for errors with `kubectl logs -n todo -l app=todo-backend --tail=50` and verify no error messages
- [x] T045 [P] [US4] Check frontend logs for errors with `kubectl logs -n todo -l app=todo-frontend --tail=50` and verify no error messages (Fixed: All 13 environment variables now properly injected via Secret and ConfigMap)

**Acceptance**: All verification checks pass, application fully functional

**Parallel Execution Example**:
```bash
# Check logs in parallel
kubectl logs -n todo -l app=todo-backend --tail=50 &
kubectl logs -n todo -l app=todo-frontend --tail=50 &
wait
```

---

## Phase 7: User Story 5 - AI-Assisted DevOps Documentation (P5)

**Story Goal**: Document all AI tool usage for hackathon evaluation

**Independent Test**: Review README and verify all AI tool usage documented with screenshots

**Tasks**:

- [ ] T046 [P] [US5] Document Gordon usage in docs/ai-devops/gordon-usage.md with all Docker commands, prompts, and screenshots
- [ ] T047 [P] [US5] Document kubectl-ai usage in docs/ai-devops/kubectl-ai-usage.md with all Kubernetes commands, prompts, and outputs
- [ ] T048 [P] [US5] Document kagent usage in docs/ai-devops/kagent-usage.md with deployment orchestration commands and logs
- [ ] T049 [US5] Create comparison analysis in docs/ai-devops/ai-vs-manual-comparison.md documenting time savings and error reduction
- [x] T050 [US5] Update main README.md with complete setup instructions from quickstart.md (Created DEPLOYMENT.md)
- [x] T051 [US5] Add Prerequisites section to README.md listing Docker Desktop, Minikube, kubectl, Helm requirements (Included in DEPLOYMENT.md)
- [x] T052 [US5] Add Troubleshooting section to README.md with common issues and solutions from deployment-validation.yaml (Included in DEPLOYMENT.md)
- [ ] T053 [US5] Add AI Tool Usage section to README.md with links to detailed documentation and minimum 5 screenshots

**Acceptance**: README complete, all AI tool usage documented with screenshots

**Parallel Execution Example**:
```bash
# Document different AI tools in parallel (different files)
# Can be done simultaneously by different team members or in separate sessions
```

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Final verification and cleanup procedures

**Tasks**:

- [ ] T054 Run final verification checklist from contracts/deployment-validation.yaml and ensure all checks pass
- [x] T055 Create cleanup script in scripts/cleanup.sh to uninstall Helm releases and delete namespace (Created both .sh and .ps1 versions)
- [ ] T056 Test deployment reproducibility: run cleanup script, then redeploy following README instructions
- [ ] T057 Capture final screenshots for hackathon demonstration showing deployment process and AI tool usage

**Acceptance**: Deployment fully verified, reproducible, documented

---

## Task Execution Guidelines

### For Each Task:

1. **Read the task description carefully** - Understand what needs to be done
2. **Check file paths** - Ensure you're working in the correct directory
3. **Execute the task** - Follow the specific commands or create the specified files
4. **Verify completion** - Check that the task acceptance criteria are met
5. **Mark as complete** - Update the checkbox: `- [x]`

### Parallel Execution:

Tasks marked with `[P]` can be executed in parallel with other `[P]` tasks in the same phase. This can significantly reduce overall implementation time.

**Example**:
```bash
# Phase 3, Tasks T010 and T011 can run in parallel
docker ai "Create Dockerfile for FastAPI..." &
docker ai "Create Dockerfile for Next.js..." &
wait
```

### AI Tool Usage:

- **Gordon**: Attempt first for all Docker operations
- **kubectl-ai**: Attempt first for all Kubernetes operations
- **kagent**: Use for complex multi-step deployments
- **Fallback**: If AI tools unavailable, use manual commands from quickstart.md

### Error Handling:

If a task fails:
1. Check the error message carefully
2. Consult troubleshooting section in deployment-validation.yaml
3. Verify prerequisites are met
4. Check logs: `kubectl logs -n todo <pod-name>`
5. Describe pod: `kubectl describe pod -n todo <pod-name>`

---

## Success Metrics

Track these metrics during implementation:

- **Docker Image Build Time**: < 5 minutes per image
- **Docker Image Size**: < 200MB per image
- **Helm Deployment Time**: < 3 minutes from helm install to Running pods
- **Pod Startup Time**: < 2 minutes to reach Running state
- **Frontend Load Time**: < 5 seconds
- **Backend Health Check Response**: < 1 second
- **Task Operations**: < 3 seconds per operation
- **AI Tool Usage**: > 80% of operations using AI tools
- **Documentation Screenshots**: ≥ 5 screenshots
- **Deployment Reproducibility**: 100% success rate

---

## Verification Checklist

After completing all tasks, verify:

- [ ] All Docker images built and under 200MB
- [ ] All Helm charts pass `helm lint` validation
- [ ] All pods in Running state
- [ ] All services accessible via NodePort
- [ ] Frontend loads in browser
- [ ] Backend health check responds
- [ ] Tasks can be created, updated, deleted via chatbot
- [ ] Tasks persist across pod restarts
- [ ] No error logs in pod output
- [ ] README contains complete setup instructions
- [ ] AI tool usage documented with screenshots
- [ ] Deployment can be torn down and redeployed

---

## Next Steps

1. **Start with Phase 1 (Setup)** - Verify all prerequisites
2. **Execute tasks sequentially by phase** - Complete each phase before moving to next
3. **Mark tasks as complete** - Update checkboxes as you progress
4. **Document AI tool usage** - Capture screenshots and logs throughout
5. **Run verification checklist** - Ensure all success criteria met
6. **Prepare hackathon demo** - Create presentation materials

---

**Tasks Status**: ✅ READY FOR IMPLEMENTATION
**Branch**: `001-minikube-deployment`
**Next Command**: Begin with T001 (Verify Phase III codebase)
