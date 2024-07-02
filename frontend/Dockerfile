

# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build your application
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
