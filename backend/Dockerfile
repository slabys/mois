# ============================
# Builder Stage
# ============================
FROM node:22-alpine AS builder

ARG PROJECT_NAME
# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
#COPY package.json pnpm-lock.yaml ./
COPY . .
# Remove node_modules to avoid conflicts when copying all files
#RUN rm -rf node_modules

# Install pnpm and dependencies
RUN npm install -g pnpm
#    && pnpm install --frozen-lock
RUN npm cache clean --force && rm -rf node_modules && pnpm install


# Copy the rest of the backend files
#COPY . .

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

RUN pnpm install

#EXPOSE 4000
# Start the server
#ENV APP_MAIN_FILE=./dist/apps/${PROJECT_NAME}/main
#CMD node ${APP_MAIN_FILE}
ENTRYPOINT ["pnpm", "start:prod"]
