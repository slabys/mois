# Use official Node.js image as a base
FROM node:20-alpine

# Set working directory
WORKDIR /backend/app

# Install dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Start backend server
CMD ["yarn", "start"]
