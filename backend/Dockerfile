ARG PROJECT_NAME=api

# ***************
# * BUILD IMAGE *
# ***************
FROM node:22-alpine AS builder

ARG PROJECT_NAME
ARG PROJECT_DIST="dist/apps/${PROJECT_NAME}"

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dev dependencies
RUN apk add --no-cache python3 make g++

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy all files
COPY . .

# Build the apps
RUN pnpm build ${PROJECT_NAME}

# Copy package.json and pnpm-lock.yaml
RUN \cp -f ./package.json ${PROJECT_DIST}
RUN \cp -f ./pnpm-lock.yaml ${PROJECT_DIST}

# Clear images that are not necessary

# Switch to dist
WORKDIR ${PROJECT_DIST}

# Reinstall modules
RUN pnpm install

# Go back to /app
WORKDIR /app

# **********************
# * # PRODUCTION IMAGE *
# **********************
FROM node:22-alpine AS production

ARG PROJECT_NAME
ARG PROJECT_DIST="dist/apps/${PROJECT_NAME}"

# Set working directory
WORKDIR /app

# Copy the built apps from the builder stage
COPY --from=builder /app/${PROJECT_DIST} .

# Entrypoint
ENTRYPOINT node main.js