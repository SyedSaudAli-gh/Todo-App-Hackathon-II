#!/bin/bash
# validate.sh - Deployment validation script for Todo Chatbot
# This script validates that the deployment meets all requirements

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Validation counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Validation function
validate() {
    local description="$1"
    local command="$2"

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    if eval "$command" &> /dev/null; then
        log_success "$description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        log_error "$description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

log_info "Starting deployment validation..."
echo ""

# Section 1: Prerequisites
log_info "=== Section 1: Prerequisites ==="
validate "Docker is installed" "command -v docker"
validate "Minikube is installed" "command -v minikube"
validate "kubectl is installed" "command -v kubectl"
validate "Helm is installed" "command -v helm"
validate "Minikube is running" "minikube status"
validate "kubectl can connect to cluster" "kubectl cluster-info"
echo ""

# Section 2: Namespace and Resources
log_info "=== Section 2: Namespace and Resources ==="
validate "Namespace 'todo' exists" "kubectl get namespace todo"
validate "Frontend deployment exists" "kubectl get deployment todo-frontend -n todo"
validate "Backend deployment exists" "kubectl get deployment todo-backend -n todo"
validate "Frontend service exists" "kubectl get service todo-frontend -n todo"
validate "Backend service exists" "kubectl get service todo-backend -n todo"
echo ""

# Section 3: Pod Status
log_info "=== Section 3: Pod Status ==="
validate "Frontend pods are running" "[ \$(kubectl get pods -n todo -l app=todo-frontend --field-selector=status.phase=Running --no-headers | wc -l) -eq 2 ]"
validate "Backend pods are running" "[ \$(kubectl get pods -n todo -l app=todo-backend --field-selector=status.phase=Running --no-headers | wc -l) -eq 2 ]"
validate "All pods are ready" "[ \$(kubectl get pods -n todo --field-selector=status.phase=Running --no-headers | wc -l) -eq 4 ]"
validate "No pods are pending" "[ \$(kubectl get pods -n todo --field-selector=status.phase=Pending --no-headers | wc -l) -eq 0 ]"
validate "No pods are failed" "[ \$(kubectl get pods -n todo --field-selector=status.phase=Failed --no-headers | wc -l) -eq 0 ]"
echo ""

# Section 4: Replica Counts
log_info "=== Section 4: Replica Counts ==="
FRONTEND_REPLICAS=$(kubectl get deployment todo-frontend -n todo -o jsonpath='{.status.readyReplicas}')
BACKEND_REPLICAS=$(kubectl get deployment todo-backend -n todo -o jsonpath='{.status.readyReplicas}')

validate "Frontend has 2 ready replicas" "[ \"$FRONTEND_REPLICAS\" = \"2\" ]"
validate "Backend has 2 ready replicas" "[ \"$BACKEND_REPLICAS\" = \"2\" ]"
echo ""

# Section 5: Service Endpoints
log_info "=== Section 5: Service Endpoints ==="
validate "Frontend service has endpoints" "kubectl get endpoints todo-frontend -n todo -o jsonpath='{.subsets[*].addresses[*].ip}' | grep -q ."
validate "Backend service has endpoints" "kubectl get endpoints todo-backend -n todo -o jsonpath='{.subsets[*].addresses[*].ip}' | grep -q ."
validate "Frontend has 2 endpoints" "[ \$(kubectl get endpoints todo-frontend -n todo -o jsonpath='{.subsets[*].addresses[*].ip}' | wc -w) -eq 2 ]"
validate "Backend has 2 endpoints" "[ \$(kubectl get endpoints todo-backend -n todo -o jsonpath='{.subsets[*].addresses[*].ip}' | wc -w) -eq 2 ]"
echo ""

# Section 6: Health Checks
log_info "=== Section 6: Health Checks ==="
validate "Frontend liveness probes configured" "kubectl get deployment todo-frontend -n todo -o jsonpath='{.spec.template.spec.containers[0].livenessProbe}' | grep -q path"
validate "Backend liveness probes configured" "kubectl get deployment todo-backend -n todo -o jsonpath='{.spec.template.spec.containers[0].livenessProbe}' | grep -q path"
validate "Frontend readiness probes configured" "kubectl get deployment todo-frontend -n todo -o jsonpath='{.spec.template.spec.containers[0].readinessProbe}' | grep -q path"
validate "Backend readiness probes configured" "kubectl get deployment todo-backend -n todo -o jsonpath='{.spec.template.spec.containers[0].readinessProbe}' | grep -q path"
echo ""

# Section 7: Resource Limits
log_info "=== Section 7: Resource Limits ==="
validate "Frontend CPU requests configured" "kubectl get deployment todo-frontend -n todo -o jsonpath='{.spec.template.spec.containers[0].resources.requests.cpu}' | grep -q ."
validate "Frontend memory requests configured" "kubectl get deployment todo-frontend -n todo -o jsonpath='{.spec.template.spec.containers[0].resources.requests.memory}' | grep -q ."
validate "Backend CPU requests configured" "kubectl get deployment todo-backend -n todo -o jsonpath='{.spec.template.spec.containers[0].resources.requests.cpu}' | grep -q ."
validate "Backend memory requests configured" "kubectl get deployment todo-backend -n todo -o jsonpath='{.spec.template.spec.containers[0].resources.requests.memory}' | grep -q ."
validate "Frontend CPU limits configured" "kubectl get deployment todo-frontend -n todo -o jsonpath='{.spec.template.spec.containers[0].resources.limits.cpu}' | grep -q ."
validate "Backend memory limits configured" "kubectl get deployment todo-backend -n todo -o jsonpath='{.spec.template.spec.containers[0].resources.limits.memory}' | grep -q ."
echo ""

# Section 8: ConfigMaps and Secrets
log_info "=== Section 8: ConfigMaps and Secrets ==="
validate "Frontend ConfigMap exists" "kubectl get configmap -n todo | grep -q todo-frontend"
validate "Backend ConfigMap exists" "kubectl get configmap -n todo | grep -q todo-backend"
validate "Backend Secret exists" "kubectl get secret -n todo | grep -q todo-backend"
echo ""

# Section 9: Helm Releases
log_info "=== Section 9: Helm Releases ==="
validate "Frontend Helm release deployed" "helm list -n todo | grep -q todo-frontend"
validate "Backend Helm release deployed" "helm list -n todo | grep -q todo-backend"
validate "Frontend release status is deployed" "[ \"\$(helm list -n todo -o json | jq -r '.[] | select(.name==\"todo-frontend\") | .status')\" = \"deployed\" ]"
validate "Backend release status is deployed" "[ \"\$(helm list -n todo -o json | jq -r '.[] | select(.name==\"todo-backend\") | .status')\" = \"deployed\" ]"
echo ""

# Section 10: Docker Images
log_info "=== Section 10: Docker Images ==="
validate "Frontend Docker image exists" "docker images | grep -q todo-frontend"
validate "Backend Docker image exists" "docker images | grep -q todo-backend"
validate "Frontend image tagged v1.0.0" "docker images | grep todo-frontend | grep -q v1.0.0"
validate "Backend image tagged v1.0.0" "docker images | grep todo-backend | grep -q v1.0.0"
echo ""

# Summary
echo ""
log_info "========================================="
log_info "Validation Summary"
log_info "========================================="
log_info "Total checks: $TOTAL_CHECKS"
log_success "Passed: $PASSED_CHECKS"
if [ "$FAILED_CHECKS" -gt 0 ]; then
    log_error "Failed: $FAILED_CHECKS"
else
    log_info "Failed: $FAILED_CHECKS"
fi
echo ""

# Calculate success rate
SUCCESS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
log_info "Success rate: ${SUCCESS_RATE}%"
echo ""

# Final verdict
if [ "$FAILED_CHECKS" -eq 0 ]; then
    log_success "========================================="
    log_success "All validation checks passed!"
    log_success "Deployment is ready for demonstration"
    log_success "========================================="
    exit 0
else
    log_error "========================================="
    log_error "Some validation checks failed"
    log_error "Please review the errors above"
    log_error "========================================="
    exit 1
fi
