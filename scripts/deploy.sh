#!/bin/bash
# deploy.sh - Main deployment orchestration script for Todo Chatbot
# This script orchestrates the complete deployment process to Minikube

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

# Start timer
START_TIME=$(date +%s)

log_info "Starting Todo Chatbot deployment to Minikube..."
echo ""

# Step 1: Verify prerequisites
log_info "Step 1: Verifying prerequisites..."

if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker Desktop."
    exit 1
fi

if ! command -v minikube &> /dev/null; then
    log_error "Minikube not found. Please install Minikube."
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    log_error "kubectl not found. Please install kubectl."
    exit 1
fi

if ! command -v helm &> /dev/null; then
    log_error "Helm not found. Please install Helm 3+."
    exit 1
fi

log_success "All prerequisites verified"
echo ""

# Step 2: Verify environment variables
log_info "Step 2: Verifying environment variables..."

if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL environment variable not set"
    exit 1
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
    log_error "OPENROUTER_API_KEY environment variable not set"
    exit 1
fi

log_success "Environment variables verified"
echo ""

# Step 3: Verify Minikube is running
log_info "Step 3: Verifying Minikube cluster..."

if ! minikube status &> /dev/null; then
    log_warning "Minikube not running. Starting Minikube..."
    minikube start --cpus=4 --memory=8192 --driver=docker
    log_success "Minikube started"
else
    log_success "Minikube is running"
fi
echo ""

# Step 4: Build Docker images
log_info "Step 4: Building Docker images..."

log_info "Building frontend image..."
docker build -t todo-frontend:v1.0.0 -f web/Dockerfile web/
log_success "Frontend image built"

log_info "Building backend image..."
docker build -t todo-backend:v1.0.0 -f api/Dockerfile api/
log_success "Backend image built"

# Verify image sizes
FRONTEND_SIZE=$(docker images todo-frontend:v1.0.0 --format "{{.Size}}")
BACKEND_SIZE=$(docker images todo-backend:v1.0.0 --format "{{.Size}}")
log_info "Frontend image size: $FRONTEND_SIZE"
log_info "Backend image size: $BACKEND_SIZE"
echo ""

# Step 5: Create namespace
log_info "Step 5: Creating Kubernetes namespace..."

if kubectl get namespace todo &> /dev/null; then
    log_warning "Namespace 'todo' already exists"
else
    kubectl create namespace todo
    log_success "Namespace 'todo' created"
fi
echo ""

# Step 6: Deploy Helm charts
log_info "Step 6: Deploying Helm charts..."

log_info "Deploying frontend chart..."
helm upgrade --install todo-frontend ./helm/todo-frontend \
    --namespace todo \
    --wait \
    --timeout 5m
log_success "Frontend chart deployed"

log_info "Deploying backend chart..."
helm upgrade --install todo-backend ./helm/todo-backend \
    --namespace todo \
    --set secrets.databaseUrl="$DATABASE_URL" \
    --set secrets.openrouterApiKey="$OPENROUTER_API_KEY" \
    --wait \
    --timeout 5m
log_success "Backend chart deployed"
echo ""

# Step 7: Wait for pods to be ready
log_info "Step 7: Waiting for pods to be ready..."

log_info "Waiting for frontend pods..."
kubectl wait --for=condition=Ready pod -l app=todo-frontend -n todo --timeout=300s
log_success "Frontend pods ready"

log_info "Waiting for backend pods..."
kubectl wait --for=condition=Ready pod -l app=todo-backend -n todo --timeout=300s
log_success "Backend pods ready"
echo ""

# Step 8: Verify deployment
log_info "Step 8: Verifying deployment..."

FRONTEND_PODS=$(kubectl get pods -n todo -l app=todo-frontend --no-headers | wc -l)
BACKEND_PODS=$(kubectl get pods -n todo -l app=todo-backend --no-headers | wc -l)

log_info "Frontend pods running: $FRONTEND_PODS/2"
log_info "Backend pods running: $BACKEND_PODS/2"

if [ "$FRONTEND_PODS" -eq 2 ] && [ "$BACKEND_PODS" -eq 2 ]; then
    log_success "All pods running successfully"
else
    log_error "Expected 4 pods (2 frontend, 2 backend), found $((FRONTEND_PODS + BACKEND_PODS))"
    exit 1
fi
echo ""

# Calculate deployment time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
log_success "========================================="
log_success "Deployment completed successfully!"
log_success "Total time: ${MINUTES}m ${SECONDS}s"
log_success "========================================="
echo ""

log_info "Deployment summary:"
kubectl get all -n todo
echo ""

log_info "To access the application:"
log_info "  Frontend: kubectl port-forward -n todo svc/todo-frontend 3000:3000"
log_info "  Backend:  kubectl port-forward -n todo svc/todo-backend 8000:8000"
echo ""

log_info "To monitor the cluster:"
log_info "  kubectl get pods -n todo"
log_info "  kubectl top pods -n todo"
log_info "  kubectl logs -n todo -l app=todo-frontend"
echo ""
