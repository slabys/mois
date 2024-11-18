# ============================
# Builder Stage
# ============================
FROM node:22-alpine AS builder

ARG PROJECT_NAME
# Set working directory
WORKDIR /app

COPY . .

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN npm cache clean --force && rm -rf node_modules && pnpm install

# Build the NestJS project
RUN pnpm run build ${PROJECT_NAME}

# ============================
# Production Stage
# ============================
FROM node:22-alpine AS production

ARG PROJECT_NAME
# Set working directory
WORKDIR /app

# Install pnpm for running the application in production
RUN npm install -g pnpm

# Copy only the built application and necessary files from builder
# /app/dist
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

#RUN pnpm install

# Start the server
ENTRYPOINT ["pnpm", "start:prod"]
