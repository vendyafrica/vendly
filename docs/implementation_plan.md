# Marketplace MVP Implementation Plan

## Overview

Complete implementation of the marketplace browsing experience, multi-store cart, checkout, and seller onboarding flows.

---

## Phase 1: Fix TypeScript Errors (Priority: Critical)

### Files to Fix:
- [apps/web/src/app/api/products/[productId]/route.ts](file:///c:/Users/Jeremiah%20Sentomero/Desktop/vendly-monorepo/apps/web/src/app/api/products/%5BproductId%5D/route.ts) - Missing `userId` property
- [apps/web/src/api/onboarding.ts](file:///c:/Users/Jeremiah%20Sentomero/Desktop/vendly-monorepo/apps/web/src/api/onboarding.ts) - Missing types import
- [apps/web/src/app/(m)/checkout/page.tsx](file:///c:/Users/Jeremiah%20Sentomero/Desktop/vendly-monorepo/apps/web/src/app/%28m%29/checkout/page.tsx) - Missing auth import
- [apps/web/src/app/[s]/components/checkout.tsx](file:///c:/Users/Jeremiah%20Sentomero/Desktop/vendly-monorepo/apps/web/src/app/%5Bs%5D/components/checkout.tsx) - SelectValue placeholder issue

---

## Phase 2: Marketplace Homepage

### Goal
Replace hardcoded data with real stores grouped by categories.

### Changes

#### [NEW] `/api/marketplace/stores/route.ts`
- GET endpoint returning all active stores with their categories
- Returns: `{ stores: Store[], storesByCategory: Record<string, Store[]> }`

#### [MODIFY] [apps/web/src/app/page.tsx](file:///c:/Users/Jeremiah%20Sentomero/Desktop/vendly-monorepo/apps/web/src/app/page.tsx)
- Fetch stores from `/api/marketplace/stores`
- Display stores grouped by their registered categories
- Add skeleton loading states

#### [NEW] `apps/web/src/app/(m)/components/store-card.tsx`
- Reusable store card component
- Click → navigates to `/[storeSlug]`

#### [NEW] `apps/web/src/app/(m)/components/store-grid-skeleton.tsx`
- Loading skeleton for store grids

---

### Hydration and UI Fixes

#### [MODIFY] [UserMenu.tsx](file:///c:/Users/Jeremiah%20Sentomero/Desktop/vendly-monorepo/apps/web/src/app/(m)/components/header/UserMenu.tsx)
Fix hydration mismatch in DropdownMenu:
- Use `useId` to provide a stable ID to the dropdown or its trigger.
- Add a `mounted` state to defer rendering of the dropdown trigger until after hydration, or use `suppressHydrationWarning` on the specific element if necessary.
- Ensure structure is consistent between server and client.

## Phase 3: Category Pages

### Goal
Dedicated pages for each category showing stores in that category.

### Changes

#### [MODIFY] `apps/web/src/app/(m)/category/[slug]/page.tsx`
- Fetch stores filtered by category
- Display store cards for that category

#### [NEW] `/api/marketplace/categories/[slug]/stores/route.ts`
- GET stores for a specific category

---

## Phase 4: Store Routing (MVP)

### Decision
**MVP approach**: Path-based routing instead of subdomains.

| Environment | URL Pattern |
|-------------|-------------|
| Development | `localhost:3000/[storeName]` |
| Production | `vendlyafrica.store/[storeName]` |

### Current State ✅
- `apps/web/src/app/[s]` already handles `localhost:3000/[storeSlug]`
- No changes needed for MVP routing

---

## Phase 5: Store Browsing Flow

### Current State ✅
The storefront is already implemented in `apps/web/src/app/[s]/`:
- `page.tsx` - Store homepage with products
- `components/hero.tsx` - Store hero section
- `components/product-grid.tsx` - Products list
- `components/categories.tsx` - Store categories

### Missing: Product Details Page

#### [MODIFY] `apps/web/src/app/[s]/products/[slug]/page.tsx`
- Product details page
- "Add to Cart" and "Buy Now" buttons
- Image gallery, description, price

---

## Phase 6: Multi-Store Cart

### Current State
Cart context exists at `apps/web/src/contexts/cart-context.tsx` with:
- `itemsByStore` - Items grouped by store
- `clearStoreFromCart(storeId)` - Clear items for one store

### Changes

#### [MODIFY] `apps/web/src/app/(m)/cart/page.tsx`
- Display items grouped by store
- "Checkout" button per store
- Link to `/checkout?storeId=[id]`

---

## Phase 7: Checkout Flow

### Current State
Checkout exists at:
- `apps/web/src/app/(m)/checkout/page.tsx`
- `apps/web/src/app/[s]/components/checkout.tsx`

### Changes

#### [MODIFY] `apps/web/src/app/(m)/checkout/page.tsx`
- Ensure it uses new `/api/storefront/[slug]/orders` endpoint
- Collect: name, email, phone, address
- Display order summary per store
- **Stop point**: Before payment implementation

---

## Phase 8: Seller Onboarding Flow

### Current Flow
```
/c (login page) → /c/personal → /c/store → /c/business → /c/complete
```

### Changes

#### [MODIFY] `apps/web/src/app/c/page.tsx`
Already checks if logged in and redirects to `/c/personal` ✅

#### [MODIFY] `apps/web/src/app/(m)/components/header.tsx`
- "Sell Now" button should link to `/c`
- Already exists, just verify

#### [MODIFY] `apps/web/src/app/c/complete/page.tsx`
- Redirect after completion:
  - Dev: `http://localhost:4000/[storeName]`
  - Prod: `https://admin.vendlyafrica.store/[storeName]`

---

## Phase 9: Admin Access from Storefront

### Changes

#### [MODIFY] `apps/web/src/app/[s]/components/header.tsx`
- "Admin" button redirects to admin app auth page
- Dev URL: `http://localhost:4000/auth?store=[storeSlug]`
- Prod URL: `https://admin.vendlyafrica.store/auth?store=[storeSlug]`

---

## Implementation Order

1. **Phase 1**: Set up Upstash Redis (dependency for other phases)
2. **Phase 2**: Database indexes and query optimization
3. **Phase 4**: Skeleton loading components
4. **Hydration fix**: Fix the Header component hydration error
5. **Phase 3**: React Query setup and optimistic mutations
6. **Phase 5**: Apply caching to services

---

## Verification

1. Browse marketplace → see stores grouped by category
2. Click category → see category page with stores
3. Click store → redirect to `/[storeName]`
4. Browse products → click product → product details
5. Add to cart → cart shows items grouped by store
6. Checkout per store → order created
7. "Sell Now" → onboarding → admin dashboard
8. Storefront "Admin" button → admin login
