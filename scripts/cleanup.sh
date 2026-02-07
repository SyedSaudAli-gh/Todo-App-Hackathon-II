#!/bin/bash
# cleanup.sh - Cleanup orchestration script for Todo Chatbot
# This script removes Kubernetes resources and optionally Docker images

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
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse arguments
CLEANUP_SCOPE="${1:-kubernetes-only}"  # Default: kubernetes-only, Option: full

log_info "Starting cleanup (scope: $CLEANUP_SCOPE)..."
echo ""

# Step 1: Uninstall Helm releases
log_info "Step 1: Uninstalling Helm releases..."

if helm list -n todo | grep -q todo-frontend; then
    helm uninstall todo-frontend -n todo
    log_success "Frontend release uninstalled"
else
    log_warning "Frontend release not found"
fi

if helm list -n todo | grep -q todo-backend; then
    helm uninstall todo-backend -n todo
    log_success "Backend release uninstalled"
else
    log_warning "Backend release not found"
fi

# Verify releases uninstalled
REMAINING_RELEASES=$(helm list -n todo --short | wc -l)
if [ "$REMAINING_RELEASES" -eq 0 ]; then
    log_success "All Helm releases uninstalled"
else
    log_warning "$REMAINING_RELEASES Helm releases still present"
fi
echo ""

# Step 2: Delete namespace
log_info "Step 2: Deleting Kubernetes namespace..."

if kubectl get namespace todo &> /dev/null; then
    log_info "Deleting namespace 'todo' (this may take up to 2 minutes)..."
    kubectl delete namespace todo --wait=true --timeout=120s
    log_success "Namespace 'todo' deleted"
else
    log_warning "Namespace 'todo' not found"
fi
echo ""

# Step 3: Verify Kubernetes cleanup
log_info "Step 3: Verifying Kubernetes cleanup..."

if kubectl get namespace todo &> /dev/null; then
    log_error "Namespace 'todo' still exists"
    exit 1
else
    log_success "Namespace 'todo' successfully removed"
fi

# Check for any remaining resources
REMAINING_PODS=$(kubectl get pods -n todo 2>/dev/null | grep -v "No resources found" | wc -l)
if [ "$REMAINING_PODS" -eq 0 ]; then
    log_success "No pods remaining"
else
    log_warning "$REMAINING_PODS pods still present"
fi
echo ""

# Step 4: Docker image cleanup (optional)
if [ "$CLEANUP_SCOPE" = "full" ]; then
    log_info "Step 4: Removing Docker images..."

    if docker images | grep -q todo-frontend; then
        docker rmi todo-frontend:v1.0.0 || log_warning "Failed to remove frontend image (may be in use)"
        log_success "Frontend image removed"
    else
        log_warning "Frontend image not found"
    fi

    if docker images | grep -q todo-backend; then
        docker rmi todo-backend:v1.0.0 || log_warning "Failed to remove backend image (may be in use)"
        log_success "Backend image removed"
    else
        log_warning "Backend image not found"
    fi

    # Verify images removed
    REMAINING_IMAGES=$(docker images | grep -E "todo-frontend|todo-backend" | wc -l)
    if [ "$REMAINING_IMAGES" -eq 0 ]; then
        log_success "All Docker images removed"
    else
        log_warning "$REMAINING_IMAGES Docker images still present"
    fi
    echo ""
fi

echo ""
log_success "========================================="
log_success "Cleanup completed successfully!"
log_success "Scope: $CLEANUP_SCOPE"
log_success "========================================="
echo ""

if [ "$CLEANUP_SCOPE" = "kubernetes-only" ]; then
    log_info "Docker images preserved for faster redeployment"
    log_info "To remove Docker images, run: ./scripts/cleanup.sh full"
else
    log_info "Environment fully reset"
    log_info "To redeploy, run: ./scripts/deploy.sh"
fi
echo ""

log_info "Cleanup summary:"
log_info "  Helm releases: Uninstalled"
log_info "  Namespace: Deleted"
if [ "$CLEANUP_SCOPE" = "full" ]; then
    log_info "  Docker images: Removed"
else
    log_info "  Docker images: Preserved"
fi
echo ""
