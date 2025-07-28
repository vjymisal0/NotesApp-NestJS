# Simple Dockerfile for React frontend
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve the built files
RUN npm install -g serve

# Expose port 3001
EXPOSE 3001

# Start the application using serve
CMD ["serve", "-s", "dist", "-l", "3001"]
