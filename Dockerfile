# Multi-stage Dockerfile for building the Vite + TypeScript app and serving with nginx

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_COMPILER_API_BASE

# Convert build args to environment variables for the build process
ENV VITE_FIREBASE_API_KEY $VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN $VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID $VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET $VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID $VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID $VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID $VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_COMPILER_API_BASE $VITE_COMPILER_API_BASE

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application with environment variables
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
