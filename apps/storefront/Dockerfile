# Change the scope and filter
FROM node:22-alpine AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm i -g pnpm turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@vendly/storefront --docker

FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=installer /app/node_modules ./node_modules

RUN pnpm turbo build --filter=storefront

FROM base AS prod-installer
WORKDIR /app

COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod --frozen-lockfile

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-installer /app/node_modules ./node_modules
COPY --from=builder /app/apps/storefront/package.json ./apps/storefront/package.json
COPY --from=builder /app/apps/storefront/.next ./apps/storefront/.next
COPY --from=builder /app/apps/storefront/public ./apps/storefront/public

WORKDIR /app/apps/storefront
EXPOSE 4000
CMD ["pnpm", "start"]