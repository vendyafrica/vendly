# 🏪 Vendly

> Transform social commerce: Turn Instagram/WhatsApp stores into real online businesses with AI-powered cataloging, payments, and delivery.

## Prerequisites
- Git
- Node.js 18+ installed
- pnpm 10+ installed


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
# 🛒 Marketplace: http://localhost:4000  
# 🔗 API Server: http://localhost:8000
```

## 📂 Codebase Structure

```
vendly-monorepo/
├── apps/                    # Main applications
│   ├── web/                 # Seller dashboard & storefronts (Next.js)
│   ├── marketplace/         # Buyer marketplace (Next.js)
│   └── api/                 # Backend API server (Express.js)
│
├── packages/                # Shared libraries
│   ├── ui/                  # React component library
│   ├── types/               # TypeScript definitions
│   ├── ai-catalog/          # AI product extraction
│   ├── payments/            # M-Pesa & banking integrations
│   ├── delivery/            # Courier API integrations
│   ├── auth/                # Authentication utilities
│   ├── database/            # drizzle schema & DB utilities
│   └── utils/               # Shared helper functions
│
├── services/                # Microservices
│   ├── image-processor/     # AI image analysis service
│   ├── notifications/       # Real-time notification service
│   └── analytics/           # Analytics & tracking service
│
├── libs/                    # External integrations
│   ├── instagram/           # Instagram API client
│   ├── whatsapp/           # WhatsApp Business API
│   └── social-scraper/      # Generic social media scraping
│
├── tools/                   # Development tools & scripts
├── docs/                    # Documentation
└── docker/                  # Container configurations
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI/ML**: OpenAI Vision API, Custom ML models
- **Payments**: M-Pesa API, Banking integrations
- **Build**: Turborepo for monorepo orchestration
- **Deploy**: Docker, AWS/Vercel

## 📱 Applications

### 🏪 apps/web - Seller Dashboard
- Seller registration & onboarding
- Product management with AI cataloging
- Store customization & branding
- Order management & tracking
- Analytics & insights

### 🛒 apps/marketplace - Buyer Platform  
- Product discovery & search
- Seller profiles & ratings
- Shopping cart & checkout
- Order tracking

### 🔗 apps/api - Backend API
- User authentication & authorization
- Product & store management
- Payment processing
- Order fulfillment
- AI catalog integration

## 📦 Key Packages

### 🎨 packages/ui
Shared React component library with consistent design system.

### 📋 packages/types  
TypeScript interfaces and types used across all applications.

### 🤖 packages/ai-catalog
AI-powered product extraction from Instagram posts and WhatsApp images.

### 💳 packages/payments
M-Pesa integration, bank APIs, and payment processing logic.

### 🚚 packages/delivery
Courier service integrations for order delivery and tracking.


## 🔧 Development Commands

```bash
# Development
pnpm run dev                    # Start all apps
pnpm run dev --filter=web       # Start seller dashboard only
pnpm run dev --filter=api       # Start API server only

# Building
npm run build                  # Build all apps
npm run build --filter=web     # Build specific app

# Testing
npm run test                   # Run all tests
npm run test --filter=api      # Test specific package

# Code Quality
npm run lint                   # Lint all code
npm run type-check             # TypeScript validation
```

### Package Dependencies
```json
// Internal packages use workspace: protocol
{
  "dependencies": {
    "@vendly/types": "workspace:*",     // Internal dependency
    "@vendly/ui": "workspace:*",        // Internal dependency
    "next": "^14.0.0"                   // External dependency
  }
}
```
## 2. Always sync with dev before you start
```sh
git fetch origin
git checkout dev
git pull --rebase origin dev
# Optional: set upstream once so 'git pull' works on dev by default
git branch --set-upstream-to=origin/dev dev
```

## 3. Create a sub-branch off dev
```sh
git checkout dev
git pull --rebase origin dev
git switch -c feature/short-desc
# or: git checkout -b fix/short-desc
```

## 4. Push work and open a PR into dev
- Commit regularly with small, descriptive messages.
```sh
git add -A
git commit -m "feat: short description"
git push -u origin feature/short-desc
```
- Open a Pull Request targeting `dev`.
- Do not push to `main`. Only `dev` and your feature branches are allowed.