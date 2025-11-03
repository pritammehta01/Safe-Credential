# Stage 1
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
# Stage 2
FROM nginx:stable-alpine

#Copy the above stage as compressed
COPY --from=build /app/dist /usr/share/nginx/html

# Port
EXPOSE 80

# App
CMD ["nginx", "-g", "daemon off;"]
