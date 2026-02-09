# Vendly Monorepo

Modern commerce platform monorepo managed with Turborepo. Apps and packages share a single workspace for frontend, backend, tooling, and shared config.

## Contents

### Apps
- **web**: Storefront (Next.js) for shoppers and sellers.
- **marketing**: Public marketing site (Next.js on port 5000 in dev).
- **admin**: Admin dashboard.
- **api**: REST API (Express).

### Packages
- **@vendly/db**: Drizzle schema and migrations.
- **@vendly/auth**: Auth helpers.
- **@vendly/config-eslint**: Shared ESLint config.
- **@vendly/config-typescript**: Shared TS configs.

## Prerequisites
- Node.js 20.x (<=22)
- pnpm 8.x

## Setup
Install dependencies (monorepo root):

```sh
pnpm install
```

Copy env template and fill values:

```sh
cp .env.example .env
```

## Common Scripts (root)
- `pnpm dev` — run all dev servers via Turborepo.
- `pnpm build` — build all apps/packages.
- `pnpm lint` — lint all workspaces.
- `pnpm test` — run test suites.
- `pnpm e2e` — Playwright e2e tests.
- `pnpm check-types` — type-check.
- `pnpm format` — format with Prettier.

## App-specific scripts
From each app directory (e.g., `apps/marketing`):
- `pnpm dev` — start the app locally.
- `pnpm build` / `pnpm start` — production build & serve.
- `pnpm lint` — lint the app.
- `pnpm check-types` — generate types and type-check (where applicable).

## Development Notes
- Uses Turborepo pipelines (see `turbo.json`).
- Playwright config lives at `playwright.config.ts`; e2e specs in `e2e/`.
- Shared TypeScript settings in `packages/config-typescript`.
- Shared lint rules in `packages/config-eslint`.

## Repository Structure
```
apps/
  web/          # Storefront
  marketing/    # Marketing site
  admin/        # Admin dashboard
  api/          # Express API
packages/
  db/           # Database schema/migrations
  auth/         # Auth helpers
  config-eslint/
  config-typescript/
docs/           # Plans and API docs
```

## Testing & QA
- Unit/integration: `pnpm test`
- E2E: `pnpm e2e` (UI: `pnpm e2e:ui`, headed: `pnpm e2e:headed`, report: `pnpm e2e:report`)

## Linting & Formatting
- Lint: `pnpm lint`
- Format: `pnpm format`

## Deployment
Build artifacts are produced per app (`pnpm build`). Deploy each app according to its target environment; API and frontend apps output standard Node/Next/Vite builds.
