# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Vendly is a social commerce platform that transforms Instagram/WhatsApp stores into full-featured online businesses with AI-powered cataloging, payments, and delivery integrations. It's built as a TypeScript monorepo using Turborepo orchestration.

## Development Commands

### Quick Start
```bash
# Install dependencies and start all applications
pnpm install
pnpm run dev

# Access points:
# Seller Dashboard: http://localhost:3000
# Marketplace: http://localhost:4000
# API Server: http://localhost:8000
```

### Focused Development
```bash
# Start specific applications
pnpm run dev --filter=web           # Seller dashboard only (port 3000)
pnpm run dev --filter=marketplace   # Marketplace only (port 4000) 
pnpm run dev --filter=api           # API server only (port 8000)

# Work with packages
pnpm run dev --filter=@vendly/ui     # UI component library
pnpm run dev --filter=@vendly/auth   # Authentication package
```

### Building & Testing
```bash
# Build all or specific components
pnpm run build                      # Build everything
pnpm run build --filter=web         # Build seller dashboard
pnpm run build --filter=api         # Build API server

# Testing
pnpm run test                       # Run all tests
pnpm run test --filter=api          # Test specific package
pnpm run test:watch --filter=web    # Watch mode for web app

# Code Quality
pnpm run lint                       # Lint all code
pnpm run type-check                 # TypeScript validation across monorepo
pnpm run clean                      # Clean all build artifacts
```

### Database Operations
```bash
# From packages/database directory or with filter
pnpm run db:generate --filter=@vendly/database  # Generate Drizzle migrations
pnpm run db:push --filter=@vendly/database      # Push schema to database
```

### Single Test Execution
```bash
# Run specific test files
pnpm run test --filter=api -- src/routes/auth.test.ts
pnpm run test --filter=web -- --testNamePattern="ProductCard"
```

## Architecture Overview

### Monorepo Structure
- **Turborepo orchestration**: All build tasks, dev servers, and deployments coordinated through turbo.json
- **PNPM workspaces**: Efficient dependency management with `workspace:*` protocol for internal packages
- **TypeScript paths**: Centralized path mapping in tsconfig.base.json for seamless cross-package imports

### Application Layer (`apps/`)
- **apps/web** (Next.js 15): Seller dashboard with AI cataloging, store management, and analytics
- **apps/marketplace** (Next.js 15): Buyer platform for product discovery and shopping 
- **apps/api** (Express.js): Backend services handling auth, payments, orders, and AI integration

### Shared Package Layer (`packages/`)
- **@vendly/auth**: Authentication utilities using better-auth and Supabase integration
- **@vendly/database**: Drizzle ORM schemas and database utilities for PostgreSQL
- **@vendly/ui**: React component library with Tailwind CSS and Radix UI primitives
- **@vendly/types**: Shared TypeScript definitions across all applications
- **@vendly/catalog**: AI-powered product extraction from social media posts
- **@vendly/payments**: M-Pesa and banking API integrations
- **@vendly/delivery**: Courier service integrations and tracking
- **@vendly/config**: Shared configuration files and constants

### Key Integration Points
1. **Authentication Flow**: Shared auth package provides consistent session management across web, marketplace, and API
2. **Database Schema**: Single source of truth in @vendly/database with Drizzle migrations
3. **Type Safety**: @vendly/types ensures consistent interfaces between frontend and backend
4. **AI Workflows**: @vendly/catalog handles social media scraping and product extraction across apps

### Development Patterns
- **Workspace Dependencies**: Internal packages use `"workspace:*"` for automatic version resolution
- **Path Aliases**: Use `@vendly/package-name` imports instead of relative paths
- **Shared Components**: UI components are consumed from @vendly/ui across web and marketplace apps
- **API Integration**: Both frontend apps communicate with the Express API using shared types

## Git Workflow
- **Main branch**: `dev` (not `main`) - all PRs target this branch
- **Feature branches**: Create from `dev` with prefixes like `feature/` or `fix/`
- **Before starting**: Always sync with dev using `git pull --rebase origin dev`
- **No direct pushes**: Never push directly to `main` or `dev`

## Environment Setup
- **Node.js 18+** required
- **PNPM 10+** package manager (configured in package.json)
- **PostgreSQL** database for local development
- **Environment variables**: Each app has its own .env file, check app-specific README files

## Development Notes
- **Turbopack**: Both Next.js apps use Turbopack for faster dev builds
- **Port allocation**: Web (3000), Marketplace (4000), API (8000) - consistent across environments
- **Cross-app dependencies**: Web and Marketplace apps both depend on @vendly/auth and can share user sessions
- **Database-first**: Schema changes should be made in @vendly/database first, then consumed by apps