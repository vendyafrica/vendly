# Vendly API — Human-Friendly Reference

This document covers all HTTP endpoints currently implemented across the monorepo:
- **Express API** (mounted at `${API_BASE}/api`) — `apps/api`
- **Next.js Route Handlers** (at `${WEB_BASE}/api`) — `apps/web/src/app/api`

It summarizes methods, paths, auth, inputs, outputs, and notable behaviors.

---
## 1) Common Behavior
- **CORS** (Express): Origins include localhost (3000/4000/any port), `.vercel.app`, `.vendlyafrica.store`, `.ngrok` (@apps/api/src/app.ts#12-32).
- **Content-Type**: `application/json` unless noted (multipart accepted for product create; form data for uploads handled by Vercel Blob route).
- **Errors**: JSON with `error`/`message`; 401 for unauthenticated, 403 for forbidden, 404 for missing records.
- **Auth primitives (Express)**: `requireAuth`, `requireTenantRole([...])`, `requirePlatformRole([...])` (@apps/api/src/middlewares/auth.ts#13-119).
- **Auth primitives (Next.js)**: `auth.api.getSession({ headers })`; most seller/admin routes require a session and tenant membership lookup.
- **Internal key**: `x-internal-api-key` must match `INTERNAL_API_KEY` for template sync.
- **Webhooks**: WhatsApp signature via `x-hub-signature-256` + `WHATSAPP_APP_SECRET`; MTN MoMo webhooks refresh status by `x-reference-id`.

---
## 2) Express API (`${API_BASE}/api`)
Mounted in @apps/api/src/routes/index.ts#1-17.

### Storefront Orders (public)
- **POST /storefront/:slug/orders** — Create order from storefront checkout.
  - Body: `createOrderSchema` (customer info, items[], paymentMethod enum). If `paymentMethod="mtn_momo"`, `customerPhone` required.
  - Side effects: If MoMo, triggers `requestToPay`, inserts `payments` row; fire-and-forget WhatsApp notify to seller.
  - Response: `201 { order, momo?: { referenceId } }`.

### Tenant Orders (auth + tenant role: owner|admin|support|staff)
- **GET /tenants/:tenantId/orders** — List tenant orders.
- **PATCH /tenants/:tenantId/orders/:orderId** — Body `updateOrderStatusSchema` (`status`, `paymentStatus`); returns updated order.

### Order Simulations (auth + tenant role: owner|admin)
- **POST /tenants/:tenantId/orders/:orderId/simulate-paid** — Marks order `paymentStatus=paid`, `status=processing`; notifies seller.

### MTN MoMo Payments
- **POST /storefront/:slug/payments/mtn-momo/request-to-pay** — Body: `requestToPayInputSchema` + `orderId`; returns `202 { referenceId }`; records payment.
- **POST /storefront/:slug/payments/mtn-momo/initiate** — Body: `{ orderId, payerMsisdn?, payerMessage?, payeeNote?, callbackUrl? }`; derives amount/currency/externalId from order; returns `202 { referenceId, orderId, paymentStatus: "pending" }`.
- **GET /storefront/:slug/payments/mtn-momo/request-to-pay/:referenceId** — Refreshes payment + order status from MoMo; returns status with `normalizedPaymentStatus`.
- **GET /storefront/:slug/payments/mtn-momo/by-order/:orderId** — Lists MoMo payments for an order.
- **POST /webhooks/mtn-momo** and **PUT /webhooks/mtn-momo** — Accept callbacks (logs + best-effort status refresh via `x-reference-id`); respond `{ ok: true }`.

### WhatsApp Webhooks
- **GET /webhooks/whatsapp** — Meta verification using `hub.mode`, `hub.verify_token`, `hub.challenge`; compares `WHATSAPP_VERIFY_TOKEN`.
- **POST /webhooks/whatsapp** — Validates `x-hub-signature-256` if `WHATSAPP_APP_SECRET` set; logs inbound events; returns 200 quickly.

### WhatsApp Templates (internal)
- **POST /internal/whatsapp/templates/sync** — Header `x-internal-api-key` must equal `INTERNAL_API_KEY`; syncs predefined templates; returns `{ ok: true, results }`.

---
## 3) Next.js API Routes (`${WEB_BASE}/api`)
All paths below are relative to the Next.js frontend domain. Most seller/admin routes require a session (`auth.api.getSession`) and tenant membership lookup; 401 if missing session, 404 if no membership.

### Auth
- **ALL /api/auth/[...all]** — NextAuth handler via `@vendly/auth` (standard provider/session endpoints).

### Cart (requires session)
- **GET /api/cart** — Current user cart items (products + store info).
- **POST /api/cart** — Body `{ productId, storeId, quantity }`; upsert item.
- **DELETE /api/cart** — Optional query `storeId`; clear cart (store-specific or all).
- **DELETE /api/cart/items/[productId]** — Remove specific item.

### Products (tenant-scoped)
- **GET /api/products** — Filters: `storeId, source, isFeatured, page, limit, search`; lists tenant products.
- **POST /api/products** — Multipart or JSON; `createProductSchema`; optional file uploads or media URLs; creates product (attaches media if provided).
- **GET /api/products/[productId]** — Fetch product with media (tenant-scoped).
- **PATCH /api/products/[productId]** — Body `updateProductSchema` (+ optional media passthrough); updates product.
- **DELETE /api/products/[productId]** — Delete product.
- **POST /api/products/bulk** — Body `{ ids: string[], action: "publish"|"archive"|"delete" }`; supports publish→active, delete→soft delete; archive not implemented (400).
- **POST /api/products/bulk-create** — Body `{ storeId, items: [{ url, pathname, contentType, filename }] }`; creates draft products and attaches media URLs.

### Stores (tenant-scoped)
- **GET /api/stores** — List stores for tenant.
- **POST /api/stores** — Create store (`name, slug, description?, phone?, address?, categories?`); rejects duplicate slug.
- **GET /api/stores/[storeId]** — Fetch store by ID.
- **PATCH /api/stores/[storeId]** — Update store (name/description/phone/address/categories/status).
- **DELETE /api/stores/[storeId]** — Delete store.

### Orders (tenant-scoped)
- **GET /api/orders** — Filters: `status, paymentStatus, page, limit, search`; list tenant orders.
- **GET /api/orders/[orderId]** — Get order by ID.
- **PATCH /api/orders/[orderId]** — Body `updateOrderStatusSchema`; update order.
- **GET /api/orders/stats** — Tenant order statistics.

### Storefront (public data + proxies)
- **GET /api/storefront/[slug]** — Store hero/header data.
- **GET /api/storefront/[slug]/products** — Public product list for store.
- **GET /api/storefront/[slug]/products/[productSlug]** — Public product detail.
- **GET /api/storefront/[slug]/categories** — Categories for store.
- **GET /api/storefront/[slug]/hero** — Hero media for store.
- **GET /api/storefront/[slug]/track** — Tracking endpoint (logs page events).
- **POST /api/storefront/[slug]/orders** — Proxy to Express `POST /api/storefront/:slug/orders`; requires `NEXT_PUBLIC_API_URL`; validates body with shared `createOrderSchema`.
- **GET /api/storefront/[slug]/payments/mtn-momo/request-to-pay/[referenceId]** — Proxies MoMo payment status (wraps Express status endpoint).

### Uploads (tenant-scoped, Vercel Blob)
- **POST /api/upload** — Uses `handleUpload` from `@vercel/blob/client`.
  - Auth: session required.
  - Pathname must include `tenants/{tenantId}/...`; verifies user membership before issuing upload token.
  - Env: `VERCEL_BLOB_CALLBACK_URL` optional (fallback to request origin).

### Onboarding
- **POST /api/onboarding** — Body `{ data: OnboardingData }`; requires session; creates tenant + related records via `onboardingService.createFullTenant`.

### Marketplace (public)
- **GET /api/marketplace/stores** — Returns `{ stores, storesByCategory }`.
- **GET /api/marketplace/categories/[slug]/stores** — Stores for a category.

### Admin (likely protected via auth middleware in app shell)
- **GET /api/admin/bootstrap** — Admin bootstrap data.
- **GET /api/admin/analytics/overview** — Admin analytics overview.

### Integrations — Instagram
- **GET /api/integrations/instagram/status** — Status check.
- **POST /api/integrations/instagram/import** — Trigger import.
- **POST /api/integrations/instagram/sync** — Trigger sync.
- **POST /api/integrations/instagram/webhook** — Webhook endpoint.

### Other
- **GET /api/user/status** — Returns auth status for current session.

---
## 4) Key Schemas (high level)
- **Orders**: `createOrderSchema` (customer + items + paymentMethod + optional shipping/notes); `updateOrderStatusSchema` (`status` enum: pending|processing|completed|cancelled|refunded; `paymentStatus` enum: pending|paid|failed|refunded`).
- **Products**: `createProductSchema`, `updateProductSchema`, `productQuerySchema` (filters paginate/search).
- **Stores**: `createStoreSchema`, `updateStoreSchema` (partial).
- **Payments (MoMo)**: `requestToPayInputSchema` (amount, currency, externalId, payerMsisdn, optional payerMessage/payeeNote/callbackUrl/referenceId).
- **Cart**: `{ productId, storeId, quantity }`.
- **Onboarding**: `OnboardingData` (full tenant + store setup) via onboarding service.

---
## 5) Environment Notes
- **NEXT_PUBLIC_API_URL** — Required for web → Express proxying of storefront orders.
- **INTERNAL_API_KEY** — Required for `/api/internal/whatsapp/templates/sync`.
- **WHATSAPP_VERIFY_TOKEN**, **WHATSAPP_APP_SECRET** — WhatsApp verification + signature check.
- **MTN_MOMO_COLLECTION_* / MTN_MOMO_TARGET_ENV / MTN_MOMO_CALLBACK_URL** — MoMo configuration; `MTN_MOMO_COLLECTION_CURRENCY` overrides currency used in requests.
- **VERCEL_BLOB_CALLBACK_URL** — Optional override for upload callback.

---
## 6) Quick Testing Examples (curl)
- Create storefront order (public):
  ```bash
  curl -X POST "$API_BASE/api/storefront/my-store/orders" \
    -H "Content-Type: application/json" \
    -d '{"customerName":"Jane","customerEmail":"jane@example.com","items":[{"productId":"<uuid>","quantity":1}]}'
  ```
- MoMo status check:
  ```bash
  curl "$API_BASE/api/storefront/my-store/payments/mtn-momo/request-to-pay/<referenceId>"
  ```
- Tenant orders (requires session cookie from Vendly auth):
  ```bash
  curl -b "<session-cookie>" "$WEB_BASE/api/orders?page=1&limit=20"
  ```

---
## 7) Coverage Checklist
- Express: storefront orders, tenant orders, simulations, MoMo, WhatsApp webhooks, template sync ✅
- Next.js: auth, cart, products, stores, orders, storefront public, uploads, onboarding, marketplace, admin, Instagram integrations, user status ✅

If you want deeper per-field tables or more sample payloads, let me know and I’ll expand this doc.
