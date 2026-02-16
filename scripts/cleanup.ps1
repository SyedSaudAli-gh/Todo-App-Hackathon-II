# Cleanup script for Todo App Minikube deployment (PowerShell)
# This script uninstalls Helm releases and deletes the Kubernetes namespace

Write-Host "🧹 Starting cleanup of Todo App deployment..." -ForegroundColor Cyan

# Uninstall Helm releases
Write-Host "📦 Uninstalling Helm releases..." -ForegroundColor Yellow
try {
    helm uninstall todo-backend -n todo 2>$null
    Write-Host "✓ Backend release uninstalled" -ForegroundColor Green
} catch {
    Write-Host "Backend release not found or already uninstalled" -ForegroundColor Gray
}

try {
    helm uninstall todo-frontend -n todo 2>$null
    Write-Host "✓ Frontend release uninstalled" -ForegroundColor Green
} catch {
    Write-Host "Frontend release not found or already uninstalled" -ForegroundColor Gray
}

# Delete namespace (this will delete all resources in the namespace)
Write-Host "🗑️  Deleting todo namespace..." -ForegroundColor Yellow
try {
    kubectl delete namespace todo 2>$null
    Write-Host "✓ Namespace deleted" -ForegroundColor Green
} catch {
    Write-Host "Namespace not found or already deleted" -ForegroundColor Gray
}

# Optional: Remove Docker images from Minikube
Write-Host "🐳 Removing Docker images from Minikube..." -ForegroundColor Yellow
try {
    minikube image rm todo-backend:v1.0.2 2>$null
    Write-Host "✓ Backend image removed" -ForegroundColor Green
} catch {
    Write-Host "Backend image not found" -ForegroundColor Gray
}

try {
    minikube image rm todo-frontend:v1.0.0 2>$null
    Write-Host "✓ Frontend image removed" -ForegroundColor Green
} catch {
    Write-Host "Frontend image not found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To redeploy, follow the instructions in README.md" -ForegroundColor Cyan
