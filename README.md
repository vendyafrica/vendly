# 🏪 Vendly

> Transform social commerce: Turn Instagram/WhatsApp stores into real online businesses with AI-powered cataloging, payments, and delivery.

## Prerequisites

- Git
- Node.js 18+ installed
- pnpm 10.7.0+ installed

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/vendyafrica/vendly
cd vendly
pnpm install

# Start development environment
pnpm run dev

# Access applications
# 🏪 Seller Dashboard: http://localhost:3000
# 🏪 Admin Dashboard: http://localhost:5000
# 🛒 Storefront: http://localhost:4000
# 🔗 API Server: http://localhost:8000
```

## 📂 Codebase Structure

```
vendly-monorepo/
├── apps/                    # Main applications
│   ├── web/                 # Seller dashboard & marketing site (Next.js)
│   ├── admin/               # Admin dashboard (Next.js)
│   ├── storefront/          # Buyer storefront (Next.js)
│   └── api/                 # Backend API server (Express.js)
│
├── packages/                # Shared libraries
│   ├── ai-engine/           # AI-powered product extraction
│   ├── auth/                # Authentication utilities (Better Auth + Supabase)
│   ├── database/            # Drizzle schema & DB utilities (Neon PostgreSQL)
│   └── ui/                  # React component library
│
├── docs/                    # Documentation
└── docker-compose.yml       # Container configurations
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **AI/ML**: OpenAI GPT-4, Google Gemini, Vercel AI SDK
- **Authentication**: Better Auth with Supabase
- **Email**: Resend
- **Build**: Turborepo for monorepo orchestration
- **Deploy**: Docker, Vercel

## 📱 Applications

### 🏪 apps/web - Seller Dashboard & Marketing Site

- Seller registration & onboarding
- Store setup and configuration
- Product management with AI cataloging
- Instagram auto-catalog sync
- Marketing pages and landing site

### 🏪 apps/admin - Admin Dashboard

- Customer management
- Order management & tracking
- Product catalog oversight
- Sales analytics & insights
- Transaction monitoring

### 🛒 apps/storefront - Buyer Storefront

- Product discovery & search
- Seller store pages
- Shopping cart & checkout
- Order tracking

### 🔗 apps/api - Backend API

- User authentication & authorization
- Product & store management
- Instagram integration & AI cataloging
- Payment processing
- Order fulfillment
- Email notifications

## 📦 Key Packages

### 🤖 packages/ai-engine

AI-powered product extraction from Instagram posts using OpenAI GPT-4 and Google Gemini.

### 🔐 packages/auth

Authentication utilities using Better Auth.

### 🗄️ packages/database

Drizzle ORM schema and database utilities for Neon PostgreSQL.

### 🎨 packages/ui

Shared React component library with consistent design system.

## 🔧 Development Commands

```bash
# Development
pnpm run dev                    # Start all apps
pnpm run dev --filter=web       # Start seller dashboard only
pnpm run dev --filter=admin     # Start admin dashboard only
pnpm run dev --filter=storefront # Start storefront only
pnpm run dev --filter=api       # Start API server only

# Building
pnpm run build                  # Build all apps
pnpm run build --filter=web     # Build specific app

# Database
pnpm run db:generate             # Generate Drizzle migrations
pnpm run db:push                 # Push schema changes to database

# Testing
pnpm run test                    # Run all tests
pnpm run test --filter=api       # Test specific package

# Code Quality
pnpm run lint                    # Lint all code
pnpm run type-check              # TypeScript validation
```

### Package Dependencies

```json
// Internal packages use workspace: protocol
{
  "dependencies": {
    "@vendly/auth": "workspace:*", // Internal dependency
    "@vendly/database": "workspace:*", // Internal dependency
    "@vendly/ui": "workspace:*", // Internal dependency
    "next": "^15.5.3" // External dependency
  }
}
```
