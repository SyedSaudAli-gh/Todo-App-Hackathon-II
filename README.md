# Todo Chatbot Application

A full-stack todo management application with AI chatbot integration, deployed on Local Kubernetes using Minikube with Helm charts.

## 📋 Project Overview

**Todo App with AI Chatbot** is a production-ready task management system featuring:

- 🎯 **Smart Todo Management**: Create, update, complete, and delete tasks through an intuitive web interface
- 🤖 **AI-Powered Chatbot**: Natural language interaction using Google Gemini for intelligent todo operations
- 🔐 **Secure Authentication**: User authentication with NextAuth and JWT tokens
- 🗄️ **Persistent Storage**: PostgreSQL database for reliable data persistence
- ☸️ **Cloud-Native Architecture**: Deployed on Kubernetes with high availability and scalability
- 🚀 **Modern Tech Stack**: Next.js frontend + FastAPI backend with RESTful APIs

## 🏗️ Project Phases

- **Phase I**: In-memory Python CLI todo app ✅
- **Phase II**: Web application with FastAPI backend and Next.js frontend ✅
- **Phase III**: AI chatbot integration with Gemini ✅
- **Phase IV**: Local Kubernetes deployment with Minikube ✅

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.9 (React 19)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: NextAuth.js with Better Auth
- **State Management**: React Hooks
- **API Client**: Fetch API with TypeScript

### Backend API
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLModel ORM
- **Authentication**: JWT (RS256) with python-jose
- **AI Integration**: Google Gemini API
- **CORS**: Configured for frontend communication

### Infrastructure
- **Container Orchestration**: Kubernetes (Minikube)
- **Package Manager**: Helm 3.x
- **Containerization**: Docker
- **Service Mesh**: Kubernetes Services (NodePort)
- **Configuration**: ConfigMaps and Secrets
- **High Availability**: 2 replicas per service with load balancing

### DevOps
- **Local Cluster**: Minikube
- **CLI Tools**: kubectl, helm, docker
- **Port Forwarding**: kubectl port-forward for local access

---

## 🚀 Phase IV: Kubernetes Deployment

### Prerequisites

Before deploying, ensure you have:

- ✅ **Docker Desktop** (Windows/Mac) or Docker Engine (Linux) - Running
- ✅ **Minikube** - Installed and configured
- ✅ **kubectl** - Kubernetes command-line tool
- ✅ **Helm 3.x** - Kubernetes package manager

### Deployment Steps

Follow these exact commands to deploy the Todo App on Minikube:

#### 1️⃣ Start Minikube

```bash
minikube start
```

**Expected Output**: Minikube cluster starts successfully

#### 2️⃣ Create Namespace

```bash
kubectl create namespace todo
```

**Note**: If namespace already exists, you'll see an error - this is safe to ignore.

#### 3️⃣ Apply Configuration Files

```bash
# Apply secrets (JWT keys, OAuth credentials, database URL)
kubectl apply -f helm/secrets.yaml

# Apply config maps (environment variables)
kubectl apply -f helm/configmap.yaml
```

**Expected Output**:
```
secret/todo-secrets created
configmap/todo-config created
```

#### 4️⃣ Deploy Backend with Helm

```bash
helm upgrade --install todo-backend helm/todo-backend -n todo
```

**Expected Output**:
```
Release "todo-backend" has been upgraded. Happy Helming!
NAME: todo-backend
NAMESPACE: todo
STATUS: deployed
```

#### 5️⃣ Deploy Frontend with Helm

```bash
helm upgrade --install todo-frontend helm/todo-frontend -n todo
```

**Expected Output**:
```
Release "todo-frontend" has been upgraded. Happy Helming!
NAME: todo-frontend
NAMESPACE: todo
STATUS: deployed
```

#### 6️⃣ Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n todo
```

**Expected Output**:
```
NAME                             READY   STATUS    RESTARTS   AGE
todo-backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
todo-backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
todo-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
todo-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
```

**All pods should show `Running` status with `1/1` ready.**

#### 7️⃣ Set Up Port Forwarding (IMPORTANT)

Open **two separate terminal windows** and run:

**Terminal 1 - Frontend:**
```bash
kubectl port-forward -n todo svc/todo-frontend 3000:3000
```

**Terminal 2 - Backend:**
```bash
kubectl port-forward -n todo svc/todo-backend 8001:8001
```

**⚠️ Important**: Keep both terminal windows open while using the application. Closing them will stop access to the services.

---

## 🌐 Access the Application

Once port forwarding is active, access the application at:

- **Frontend (Web UI)**: http://localhost:3000
- **Backend API**: http://localhost:8001/api/v1
- **API Documentation**: http://localhost:8001/api/v1/docs
- **Health Check**: http://localhost:8001/api/v1/health

### Testing the Deployment

1. **Open Frontend**: Navigate to http://localhost:3000
2. **Sign Up**: Create a new account
3. **Login**: Authenticate with your credentials
4. **Create Todos**: Add tasks via the UI
5. **Test Chatbot**: Use natural language to manage todos
6. **Verify API**: Check http://localhost:8001/api/v1/docs for API endpoints

---

## 📊 Monitoring & Management

### Check Deployment Status

```bash
# View all resources in todo namespace
kubectl get all -n todo

# Check pod status
kubectl get pods -n todo

# Check services
kubectl get svc -n todo

# View pod details
kubectl describe pod <pod-name> -n todo
```

### View Logs

```bash
# Frontend logs
kubectl logs -n todo -l app.kubernetes.io/name=todo-frontend --tail=50

# Backend logs
kubectl logs -n todo -l app.kubernetes.io/name=todo-backend --tail=50

# Follow logs in real-time
kubectl logs -n todo -l app.kubernetes.io/name=todo-backend -f
```

### Restart Deployments

```bash
# Restart frontend
kubectl rollout restart deployment/todo-frontend -n todo

# Restart backend
kubectl rollout restart deployment/todo-backend -n todo

# Check rollout status
kubectl rollout status deployment/todo-frontend -n todo
```

### Stop Port Forwarding

```bash
# Find port-forward processes
ps aux | grep "port-forward"

# Kill specific process
kill <process-id>

# Or kill all port-forward processes
pkill -f "port-forward"
```

---

## 🔧 Troubleshooting

### Issue: Pods Not Running

**Symptom**: Pods stuck in `Pending`, `CrashLoopBackOff`, or `Error` state

**Solution**:
```bash
# Check pod details
kubectl describe pod <pod-name> -n todo

# Check pod logs
kubectl logs <pod-name> -n todo

# Restart deployment
kubectl rollout restart deployment/<deployment-name> -n todo
```

### Issue: Port Forwarding Not Working

**Symptom**: Cannot access http://localhost:3000 or http://localhost:8001

**Solution**:
```bash
# Kill existing port-forward processes
pkill -f "port-forward"

# Restart port forwarding
kubectl port-forward -n todo svc/todo-frontend 3000:3000 &
kubectl port-forward -n todo svc/todo-backend 8001:8001 &
```

### Issue: Minikube Not Starting

**Symptom**: `minikube start` fails or times out

**Solution**:
```bash
# Delete and recreate cluster
minikube delete
minikube start --cpus=4 --memory=7g

# Redeploy application
kubectl create namespace todo
kubectl apply -f helm/secrets.yaml
kubectl apply -f helm/configmap.yaml
helm upgrade --install todo-backend helm/todo-backend -n todo
helm upgrade --install todo-frontend helm/todo-frontend -n todo
```

### Issue: 404 Errors on Todos Page

**Symptom**: Frontend shows 404 errors when loading todos

**Solution**: Verify frontend is using correct API URL (localhost:8001, not localhost:8000)
```bash
# Check frontend environment variables
kubectl exec -n todo <frontend-pod> -- printenv | grep API

# Should show: NEXT_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1
```

### Issue: 401 Unauthorized on Chatbot

**Symptom**: Chatbot returns 401 errors

**Solution**: Verify JWT configuration
```bash
# Check backend has JWT_PUBLIC_KEY
kubectl exec -n todo <backend-pod> -- printenv | grep JWT_PUBLIC_KEY

# Restart backend if missing
kubectl rollout restart deployment/todo-backend -n todo
```

---

## ✨ Features

- ✅ **Todo Management**: Add, view, complete, update, and delete todo items
- ✅ **AI Chatbot**: Natural language todo management with Google Gemini
- ✅ **User Authentication**: Secure login/signup with NextAuth and JWT
- ✅ **Persistent Storage**: PostgreSQL database for reliable data persistence
- ✅ **RESTful API**: FastAPI backend with comprehensive API documentation
- ✅ **Modern Web UI**: Next.js with Tailwind CSS and shadcn/ui components
- ✅ **Kubernetes Deployment**: High availability with Helm charts
- ✅ **Health Monitoring**: Liveness and readiness probes
- ✅ **Load Balancing**: Multiple replicas with automatic traffic distribution
- ✅ **OAuth Support**: Google, Facebook, LinkedIn social login (configurable)

---

## 📚 Additional Documentation

- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)**: Complete deployment guide with troubleshooting
- **[KUBERNETES_ACCESS.md](./KUBERNETES_ACCESS.md)**: Detailed Kubernetes access instructions
- **[OAUTH_TESTING_GUIDE.md](./OAUTH_TESTING_GUIDE.md)**: OAuth configuration guide
- **[HELM_FIX_SUMMARY.md](./HELM_FIX_SUMMARY.md)**: Helm configuration fixes and verification

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                    http://localhost:3000                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Port Forward (3000:3000)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Kubernetes Cluster                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Frontend Service (todo-frontend)                    │   │
│  │  ┌──────────────┐         ┌──────────────┐         │   │
│  │  │ Frontend Pod │         │ Frontend Pod │         │   │
│  │  │  Next.js     │         │  Next.js     │         │   │
│  │  │  (v1.0.7)    │         │  (v1.0.7)    │         │   │
│  │  └──────┬───────┘         └──────┬───────┘         │   │
│  └─────────┼────────────────────────┼──────────────────┘   │
│            │                        │                       │
│            │  API Calls (localhost:8001/api/v1)           │
│            │                        │                       │
│  ┌─────────▼────────────────────────▼──────────────────┐   │
│  │  Backend Service (todo-backend)                      │   │
│  │  ┌──────────────┐         ┌──────────────┐         │   │
│  │  │ Backend Pod  │         │ Backend Pod  │         │   │
│  │  │  FastAPI     │         │  FastAPI     │         │   │
│  │  │  (v1.0.4)    │         │  (v1.0.4)    │         │   │
│  │  └──────┬───────┘         └──────┬───────┘         │   │
│  └─────────┼────────────────────────┼──────────────────┘   │
│            │                        │                       │
└────────────┼────────────────────────┼───────────────────────┘
             │                        │
             │  Port Forward (8001:8001)
             │                        │
             ▼                        ▼
    ┌─────────────────┐      ┌──────────────────┐
    │   PostgreSQL    │      │  Google Gemini   │
    │   (Supabase)    │      │      API         │
    └─────────────────┘      └──────────────────┘
```

---

## 🤝 Contributing

This project follows Spec-Driven Development (SDD) principles. All changes must:

1. Have an approved specification in `specs/`
2. Follow the implementation plan in `specs/<feature>/plan.md`
3. Complete all tasks in `specs/<feature>/tasks.md`
4. Pass all tests and validation checks

---

## 📄 License

This project is part of a hackathon submission and is provided as-is for educational purposes.

---

## 🎯 Project Status

**Current Phase**: Phase IV - Kubernetes Deployment ✅

**Deployment Status**: Production-ready on Local Kubernetes (Minikube)

**Last Updated**: February 2026

---

**Built with ❤️ using Spec-Driven Development**