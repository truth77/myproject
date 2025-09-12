# Build stage
FROM node:20-alpine as build
WORKDIR /usr/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /usr/app

# Copy built assets from build stage
COPY --from=build /usr/app/build ./build
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/package*.json ./

# Install serve to run the app
RUN npm install -g serve

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3002

# Start the app using serve
CMD ["serve", "-s", "build", "-l", "3002"]