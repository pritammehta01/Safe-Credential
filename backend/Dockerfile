# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Copy from builder
COPY --from=builder /app .

# FIX: Match your updated server.js port
EXPOSE 5000

# Use non-root user for K8s security
USER node

ENV NODE_ENV=production
CMD ["node", "server.js"]
