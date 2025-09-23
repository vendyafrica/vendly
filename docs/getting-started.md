# Vendly — Getting Started

Quick guide for cloning, syncing with dev, branching, and running apps with pnpm.

## Prerequisites
- Git
- Node.js 18+ installed
- pnpm 10+ installed

## 1. Clone the repo
```sh

cd vendly
pnpm install
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

## 5. Run the apps with pnpm

### Option A — run everything from the monorepo root
```sh
# from repository root
pnpm dev
```

### Option B — run a single app

Frontend (Next.js)
```sh
cd apps/frontend
pnpm dev
# http://localhost:3000
```

Backend (Express)
```sh
cd apps/backend
pnpm dev
# Server listens on http://localhost:4000
```

## 6. Lint, type-check, and tests

From the repo root:
```sh
pnpm lint
pnpm type-check
pnpm test
```

Backend tests only:
```sh
pnpm -C apps/backend test
```

## 7. Need help?
- Ask in the team channel `#vendly-dev` with context and screenshots.
- Or open a GitHub issue and tag the relevant owners.
- If blocked > 30 minutes, escalate to the team lead.

## Notes
- Never commit secrets. Use `.env` files locally and keep them out of git.
- Keep branches short-lived; rebase onto `dev` frequently to avoid conflicts.