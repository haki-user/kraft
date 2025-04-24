ARG NODE_VERSION=20
ARG PROJECT=api

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
# Add OpenSSL explicitly to address Prisma's requirements
RUN apk add --no-cache libc6-compat openssl

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Prune projects
FROM base AS pruner
ARG PROJECT

WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# Build the project
FROM base AS builder
ARG PROJECT

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

# Navigate to the API directory where the prisma schema should be
WORKDIR /app/apps/api

# Generate Prisma client with the updated schema
RUN pnpm dlx prisma generate --schema=./prisma/schema.prisma

# Return to the app directory for the rest of the build
WORKDIR /app

RUN turbo build --filter=${PROJECT}
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# Final image
FROM alpine AS runner
ARG PROJECT

## Make sure we also have OpenSSL in the final image
#RUN apk add --no-cache libc6-compat openssl
# Add Python support
RUN apk add --no-cache python3 py3-pip libc6-compat openssl
RUN apk add --no-cache procps
RUN apk add --no-cache bash

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/apps/${PROJECT}

ARG PORT=8080
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

# Use JSON format for CMD to prevent OS signal issues
CMD ["node", "dist/index.js"]