# Development stage
FROM node:20-alpine

WORKDIR /usr/app

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0
# Removed hardcoded REACT_APP_API_URL to allow override from docker-compose

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
