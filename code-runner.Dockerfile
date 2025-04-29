ARG NODE_VERSION=20
ARG PROJECT=code-runner

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
# # Add OpenSSL explicitly to address Prisma's requirements
# RUN apk add --no-cache libc6-compat openssl

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

# Return to the app directory for the rest of the build
WORKDIR /app

RUN turbo build --filter=${PROJECT}
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# Final image
FROM alpine AS runner
ARG PROJECT
ARG CA_CERT=aiven-ca.pem

# ## Make sure we also have OpenSSL in the final image
# RUN apk add --no-cache libc6-compat openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
COPY --chown=nodejs:nodejs apps/code-runner/${CA_CERT} apps/code-runner/${CA_CERT}
WORKDIR /app/apps/${PROJECT}

ARG PORT=8080
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

# Use JSON format for CMD to prevent OS signal issues
CMD ["node", "dist/index.js"]
