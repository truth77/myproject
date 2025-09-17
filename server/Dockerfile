# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache --virtual .build-deps make g++ python3

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Remove build dependencies
RUN apk del .build-deps

# Runtime stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy installed dependencies from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy application code
COPY . .

# Install production dependencies only
RUN npm install --only=production --legacy-peer-deps

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV DISABLE_MEMORY_MONITORING=true

# Expose port
EXPOSE 3000

# Health check - check if Node.js process is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "server.js"]
