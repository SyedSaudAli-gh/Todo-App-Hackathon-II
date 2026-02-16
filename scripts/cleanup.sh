#!/bin/bash
# Cleanup script for Todo App Minikube deployment
# This script uninstalls Helm releases and deletes the Kubernetes namespace

set -e

echo "🧹 Starting cleanup of Todo App deployment..."

# Uninstall Helm releases
echo "📦 Uninstalling Helm releases..."
helm uninstall todo-backend -n todo 2>/dev/null || echo "Backend release not found or already uninstalled"
helm uninstall todo-frontend -n todo 2>/dev/null || echo "Frontend release not found or already uninstalled"

# Delete namespace (this will delete all resources in the namespace)
echo "🗑️  Deleting todo namespace..."
kubectl delete namespace todo 2>/dev/null || echo "Namespace not found or already deleted"

# Optional: Remove Docker images from Minikube
echo "🐳 Removing Docker images from Minikube..."
minikube image rm todo-backend:v1.0.2 2>/dev/null || echo "Backend image not found"
minikube image rm todo-frontend:v1.0.0 2>/dev/null || echo "Frontend image not found"

echo "✅ Cleanup complete!"
echo ""
echo "To redeploy, follow the instructions in README.md"
