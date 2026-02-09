# Todo Chatbot Application

A full-stack todo management application with AI chatbot integration, deployed on Kubernetes.

## Project Phases

- **Phase I**: In-memory Python CLI todo app ✅
- **Phase II**: Web application with FastAPI backend and Next.js frontend ✅
- **Phase III**: AI chatbot integration with Gemini ✅
- **Phase IV**: Local Kubernetes deployment with Minikube ✅

## Current Deployment: Phase IV (Kubernetes)

The application is deployed on Kubernetes using Minikube with:
- **Frontend**: Next.js web application (2 replicas)
- **Backend**: FastAPI REST API (2 replicas)
- **Services**: NodePort for external access
- **Health Checks**: Liveness and readiness probes
- **High Availability**: Multiple replicas with load balancing

### Quick Start (Kubernetes)

1. **Start Minikube**:
   ```bash
   minikube start
   ```

2. **Access Frontend** (Web UI):
   ```bash
   minikube service todo-frontend -n todo
   ```

3. **Access Backend** (API):
   ```bash
   minikube service todo-backend -n todo
   ```

**Important**: Keep terminal windows open while using the application.

For detailed access instructions, troubleshooting, and deployment management, see [KUBERNETES_ACCESS.md](./KUBERNETES_ACCESS.md).

### Deployment Status

```bash
# Check deployment status
kubectl get all -n todo

# View logs
kubectl logs -n todo -l app=todo-frontend --tail=50
kubectl logs -n todo -l app=todo-backend --tail=50
```

## Features

- ✅ Add, view, complete, update, and delete todo items
- ✅ AI chatbot for natural language todo management
- ✅ Persistent storage with PostgreSQL
- ✅ User authentication with NextAuth
- ✅ RESTful API with FastAPI
- ✅ Modern web UI with Next.js and Tailwind CSS
- ✅ Kubernetes deployment with Helm charts
- ✅ Health checks and monitoring
- ✅ High availability with multiple replicas

## Prerequisites

### For Kubernetes Deployment (Phase IV)
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Minikube
- kubectl
- Helm 3.x

## Installation

No installation required. The application runs directly from the source code.

## Usage

Run the application from the command line with one of the following commands:

### Add a new todo item
```bash
python todo_app.py add "Your todo description here"
```

### List all todo items
```bash
python todo_app.py list
```

### Mark a todo item as complete
```bash
python todo_app.py complete 1
```
Replace `1` with the position number of the item you want to mark complete.

### Delete a todo item
```bash
python todo_app.py delete 1
```
Replace `1` with the position number of the item you want to delete.

### Update a todo item
```bash
python todo_app.py update 1 "Your new description here"
```
Replace `1` with the position number of the item you want to update.

### Get help
```bash
python todo_app.py help
```

## Example Workflow

1. Add a new todo: `python todo_app.py add "Buy groceries"`
2. View your todos: `python todo_app.py list`
3. Mark as complete: `python todo_app.py complete 1`
4. Add another todo: `python todo_app.py add "Walk the dog"`
5. View updated list: `python todo_app.py list`

## Notes

- All data is stored in memory only and will be lost when the application exits
- Item positions are 1-based (first item is position 1, not 0)
- The application uses only Python standard library modules
- No external dependencies required