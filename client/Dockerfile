# Development stage
FROM node:20-alpine

WORKDIR /usr/app

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV REACT_APP_API_URL=http://backend:3000

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
CMD ["sh", "-c", "npm start"]
