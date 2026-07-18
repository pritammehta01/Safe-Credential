# Safe Credential – Kubernetes Ingress Deployment

## 📖 KodeKloud Lab

Before following this project, complete or open the KodeKloud lab:

**🔗 Lab Link:** https://kodekloud.com/studio/labs/kubernetes/services-stable

This project is the solution implementation for the **Services & Ingress** Kubernetes lab using **Traefik Ingress Controller**.

---

## Project Overview

This project demonstrates how to deploy the **Safe Credential** application on Kubernetes using:

* **StatefulSet** for MongoDB
* **Deployment** for Backend (Express.js)
* **Deployment** for Frontend (React/Vite)
* **ClusterIP Services** for internal communication
* **Traefik Ingress** for external HTTP routing

The application routes traffic as follows:

* `/` → Frontend Service
* `/api` → Backend Service


---

# Architecture

```
                    Browser
                       │
                       ▼
              Traefik Ingress Controller
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
 safe-frontend-service      safe-backend-service
       (ClusterIP)              (ClusterIP)
          │                         │
          ▼                         ▼
     React/Vite App            Express API
                                     │
                                     ▼
                           mongo-service (ClusterIP)
                                     │
                                     ▼
                              MongoDB StatefulSet
```

# Project Structure

```
git clone -b dev https://github.com/pritammehta01/Safe-Credential.git

cd Safe-Credential/k8s
.
├── safe-app-ingress.yaml
├── ingress.yaml
└── README.md
```

---

# Deploy the Application

Apply the application manifests:

```bash
kubectl apply -f safe-app-ingress.yaml
```

Apply the ingress:

```bash
kubectl apply -f ingress.yaml
```

---

# Verify Resources

Pods

```bash
kubectl get pods
```

Services

```bash
kubectl get svc
```

Ingress

```bash
kubectl get ingress
```

Describe ingress

```bash
kubectl describe ingress safe-ingress
```

---

# Verification

Frontend

```bash
curl http://<INGRESS-IP>
```

Expected output:

```html
<!doctype html>
<html>
...
```

Backend

```bash
curl http://<INGRESS-IP>/api
```

Expected output:

```json
[]
```

The empty array indicates the API is working and MongoDB currently contains no records.

---

# Notes

* MongoDB is deployed using a **StatefulSet**.
* Backend and Frontend are exposed internally using **ClusterIP Services**.
* External traffic is handled by **Traefik Ingress Controller**.
* The frontend communicates with the backend using:

```javascript
fetch("/api")
```

The Ingress routes:

* `/` → Frontend Service
* `/api` → Backend Service

---

# Troubleshooting

Check pods

```bash
kubectl get pods
```

Check services

```bash
kubectl get svc
```

Check ingress

```bash
kubectl get ingress
```

Describe ingress

```bash
kubectl describe ingress safe-ingress
```

Test frontend

```UI
port:- 80
```

Test backend

```bash
curl http://<INGRESS-IP>/api
```

---

# Tech Stack

* Kubernetes
* Traefik Ingress Controller
* React (Vite)
* Node.js (Express)
* MongoDB
* Docker

---

# Outcome

Successfully deployed a full-stack application on Kubernetes using:

* StatefulSet
