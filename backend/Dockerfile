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
RUN npm cache clean --force && rm -rf node_modules && pnpm install --frozen-lockfile --prod=false

# Build the NestJS project
RUN pnpm run build ${PROJECT_NAME}

# ============================
# Production Stage
# ============================
FROM node:22-alpine AS production

ARG PROJECT_NAME
ARG PORT_APP1
# Set working directory
WORKDIR /app

RUN npm install -g pnpm

# Copy only the built application and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Install prod dependencies
RUN pnpm install --frozen-lockfile --prod=true

EXPOSE $PORT_APP1

# Start the server
ENTRYPOINT ["npm", "run", "start:prod"]
