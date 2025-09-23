# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
