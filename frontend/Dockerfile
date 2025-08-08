# ============================
# Base Stage
# ============================
FROM node:22-alpine AS base

FROM base AS deps
# ============================
# Dependencies Stage
# ============================
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile;

FROM base AS builder
# ============================
# Builder Stage
# ============================
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" >> .env.production

RUN corepack enable pnpm && pnpm run build;

FROM base AS runner
# ============================
# Runner Stage
# ============================
WORKDIR /app

ARG PORT_FE
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" >> .env.production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE $PORT_FE

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]