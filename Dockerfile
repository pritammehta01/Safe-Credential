# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Accept the API URL during build time
ARG VITE_BACKEND_API
ENV VITE_BACKEND_API=$VITE_BACKEND_API

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM nginx:stable-alpine

# Copy the build output
COPY --from=build /app/dist /usr/share/nginx/html

# Fix for React Router: Redirect all 404s to index.html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
