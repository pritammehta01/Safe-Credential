#stage 1
FROM node:22 AS express
WORKDIR /app
COPY . .
RUN npm i

# Stage 2
FROM node:22-slim

# Setup the working directory
WORKDIR /app

# Copy the above stage as compressed
COPY --from=express /app . 

# Port
EXPOSE 3000

# App
CMD ["node", "server.js"]
