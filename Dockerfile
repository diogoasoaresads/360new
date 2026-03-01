FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune the workspace for the specific app
FROM base AS builder
# ARG APP_NAME needs to be passed in docker build (e.g. --build-arg APP_NAME=web)
ARG APP_NAME
# Set working directory
WORKDIR /app
RUN apk update
RUN apk add --no-cache libc6-compat
# Install turbo
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=$APP_NAME --docker

# 2. Add dependencies and build the app
FROM base AS installer
ARG APP_NAME
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=$APP_NAME...

# 3. Production image, copy all the files and run next
FROM base AS runner
ARG APP_NAME
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public
COPY --from=installer /app/apps/${APP_NAME}/next.config.js ./apps/${APP_NAME}/next.config.js

# Set mode "standalone" traces automatically created
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static

# We assume by default standard next port 3000
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Note: standalone output creates a server.js in the specific app output
CMD node apps/${APP_NAME}/server.js
