# Development stage
FROM node:20-alpine

WORKDIR /usr/app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Environment variables
ENV NODE_ENV=development
ENV REACT_APP_API_URL=http://backend:3000

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
