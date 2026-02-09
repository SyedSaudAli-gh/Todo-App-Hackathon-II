# Accessing Todo App on Minikube

## Service Configuration

The Todo application is deployed with NodePort services for external access:

- **Frontend**: NodePort 30000 → Container Port 3000
- **Backend**: NodePort 30001 → Container Port 8000

## Access Methods

### Method 1: Minikube Service Command (Recommended for Windows/Docker)

Since you're using Docker driver on Windows, use Minikube's built-in tunneling:

```bash
# Access Frontend (opens in browser)
minikube service todo-frontend -n todo

# Access Backend API (opens in browser)
minikube service todo-backend -n todo

# Get URLs without opening browser
minikube service todo-frontend -n todo --url
minikube service todo-backend -n todo --url
```

**Note**: Keep the terminal windows open while accessing the services. Minikube creates port-forwarding tunnels that require the terminal to remain active.

### Method 2: Direct NodePort Access (Linux/macOS)

If you're on Linux or macOS with direct network access to Minikube:

```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Access services directly
echo "Frontend: http://$MINIKUBE_IP:30000"
echo "Backend: http://$MINIKUBE_IP:8000"
```

### Method 3: kubectl Port Forward

Alternative method that works on all platforms:

```bash
# Forward frontend port
kubectl port-forward -n todo svc/todo-frontend 3000:3000

# Forward backend port (in another terminal)
kubectl port-forward -n todo svc/todo-backend 8000:8000
```

Then access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Verification

### Check Service Status

```bash
# View services
kubectl get svc -n todo

# Expected output:
# NAME            TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
# todo-backend    NodePort   10.107.115.234   <none>        8000:30001/TCP   1h
# todo-frontend   NodePort   10.97.108.101    <none>        3000:30000/TCP   1h
```

### Check Pod Health

```bash
# View pods
kubectl get pods -n todo

# All pods should show READY 1/1 and STATUS Running
```

### Test Backend Health

```bash
# Using Minikube IP (Linux/macOS)
curl http://$(minikube ip):30001/health

# Using port-forward
curl http://localhost:8000/health

# Expected: {"status":"healthy"}
```

## Troubleshooting

### Services Not Accessible

1. **Verify pods are running**:
   ```bash
   kubectl get pods -n todo
   ```

2. **Check service endpoints**:
   ```bash
   kubectl get endpoints -n todo
   ```

3. **View pod logs**:
   ```bash
   kubectl logs -n todo -l app=todo-frontend --tail=50
   kubectl logs -n todo -l app=todo-backend --tail=50
   ```

4. **Restart Minikube tunnel** (if using Method 1):
   - Close existing terminal windows
   - Run `minikube service` commands again

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using the port (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

## Architecture Notes

- **Frontend** communicates with backend using internal Kubernetes DNS: `http://todo-backend:8000`
- **External users** access frontend via NodePort 30000
- **Backend API** is exposed on NodePort 30001 for direct API testing
- Both services have 2 replicas for high availability
- Health checks ensure zero-downtime deployments
