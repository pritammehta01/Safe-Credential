# Safe Credential – Kubernetes Ingress Deployment

This project demonstrates how to deploy the **Safe Credential** application on Kubernetes using **Deployments**, **StatefulSets**, **Services**, and **Ingress (Traefik)**.

The deployment was completed as part of the KodeKloud lab:

**Lab:** [Use a Service to Access an Application in a Cluster](https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/?utm_source=chatgpt.com)

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

---

# Kubernetes Resources

| Resource          | Purpose                   |
| ----------------- | ------------------------- |
| StatefulSet       | Deploy MongoDB            |
| Deployment        | Deploy Backend            |
| Deployment        | Deploy Frontend           |
| ClusterIP Service | Internal Backend Access   |
| ClusterIP Service | Internal Frontend Access  |
| ClusterIP Service | MongoDB Service Discovery |
| Ingress (Traefik) | Route HTTP traffic        |

---

# Project Structure

```
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

# Ingress Configuration

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: safe-ingress
spec:
  ingressClassName: traefik

  rules:
  - http:
      paths:

      - path: /
        pathType: Prefix
        backend:
          service:
            name: safe-frontend-service
            port:
              number: 80

      - path: /api
        pathType: Prefix
        backend:
          service:
            name: safe-backend-service
            port:
              number: 5000
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

```bash
curl http://<INGRESS-IP>
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
