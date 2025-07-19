# Use Node.js 20 as the base image for the build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /frontend/app

RUN npm install -g pnpm
# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy all project files
COPY . .

ARG NEXT_PUBLIC_APP1_URL
RUN echo "NEXT_PUBLIC_APP1_URL=${NEXT_PUBLIC_APP1_URL}" >> .env.production

ENV NODE_ENV=production

# Build the Next.js application
RUN pnpm build

# Production image
FROM node:20-alpine AS runner

ARG PORT_FE
ARG NEXT_PUBLIC_APP1_URL
RUN echo "NEXT_PUBLIC_APP1_URL=${NEXT_PUBLIC_APP1_URL}" >> .env.production

# Set working directory
WORKDIR /frontend/app

# Copy Next.js build output and other required files
COPY --from=build /frontend/app/.next/standalone /frontend/app
COPY --from=build /frontend/app/.next/static /frontend/app/.next/static
COPY --from=build /frontend/app/public /frontend/app/public

# Expose the required port
EXPOSE $PORT_FE

# Start the Next.js application
CMD ["node", "server.js"]