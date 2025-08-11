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

ENV NEXT_TELEMETRY_DISABLED=1

# RUN echo "API_DOMAIN=${API_DOMAIN}" >> .env.production

RUN corepack enable pnpm && pnpm run build;

FROM base AS runner
# ============================
# Runner Stage
# ============================
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ARG PORT_FE
ARG API_DOMAIN

#RUN echo "NEXT_PUBLIC_API_DOMAIN=${NEXT_PUBLIC_API_DOMAIN}" >> .env.production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE $PORT_FE

CMD ["node", "server.js"]