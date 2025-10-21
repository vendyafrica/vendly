# 1. Base stage: Node 22 + pnpm
FROM node:22-alpine AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm i -g pnpm turbo

# 2. Pruner stage
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@vendly/api --docker

# 3. Installer stage
FROM base AS installer
WORKDIR /app

# Copy root workspace config FIRST (before pruned files)
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

# 4. Builder stage
FROM base AS builder
WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy full pruned source
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy installed deps
COPY --from=installer /app/node_modules ./node_modules

# Build only the api
RUN pnpm turbo build --filter=api

# 5. Prod-installer stage
FROM base AS prod-installer
WORKDIR /app

COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod --frozen-lockfile

# 6. Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production deps (includes shared packages from node_modules)
COPY --from=prod-installer /app/node_modules ./node_modules

# Copy built API
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 8080
CMD ["node", "dist/index.js"]