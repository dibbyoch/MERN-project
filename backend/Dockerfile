# Use official Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the application
COPY . .

# Expose port
EXPOSE 8000

# Start the server
CMD ["node", "index.js"]
