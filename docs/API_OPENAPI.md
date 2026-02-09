# Vendly API — OpenAPI 3.0 (YAML in Markdown)

```yaml
openapi: 3.0.3
info:
  title: Vendly API
  version: 1.0.0
  description: |
    Combined surface of Express API (${API_BASE}/api) and Next.js route handlers (${WEB_BASE}/api).
servers:
  - url: ${API_BASE}/api
    description: Express API base
  - url: ${WEB_BASE}/api
    description: Next.js API base

components:
  securitySchemes:
    sessionCookie:
      type: apiKey
      in: cookie
      name: next-auth.session-token
      description: Vendly session cookie (set by @vendly/auth)
    internalApiKey:
      type: apiKey
      in: header
      name: x-internal-api-key
  parameters:
    SlugParam:
      in: path
      name: slug
      required: true
      schema: { type: string }
    TenantIdParam:
      in: path
      name: tenantId
      required: true
      schema: { type: string, format: uuid }
    OrderIdParam:
      in: path
      name: orderId
      required: true
      schema: { type: string, format: uuid }
    ProductIdParam:
      in: path
      name: productId
      required: true
      schema: { type: string, format: uuid }
    StoreIdParam:
      in: path
      name: storeId
      required: true
      schema: { type: string, format: uuid }
    ReferenceIdParam:
      in: path
      name: referenceId
      required: true
      schema: { type: string }
  schemas:
    OrderItemInput:
      type: object
      required: [productId, quantity]
      properties:
        productId: { type: string, format: uuid }
        quantity: { type: integer, minimum: 1 }
    CreateOrderInput:
      type: object
      required: [customerName, customerEmail, items]
      properties:
        customerName: { type: string }
        customerEmail: { type: string, format: email }
        customerPhone: { type: string, nullable: true }
        paymentMethod:
          type: string
          enum: [card, mpesa, mtn_momo, paypal, cash_on_delivery]
          default: cash_on_delivery
        shippingAddress:
          type: object
          properties:
            street: { type: string }
            city: { type: string }
            state: { type: string }
            postalCode: { type: string }
            country: { type: string }
        notes: { type: string }
        items:
          type: array
          items: { $ref: '#/components/schemas/OrderItemInput' }
    UpdateOrderStatus:
      type: object
      properties:
        status: { type: string, enum: [pending, processing, completed, cancelled, refunded] }
        paymentStatus: { type: string, enum: [pending, paid, failed, refunded] }
    RequestToPayInput:
      type: object
      required: [amount, currency, externalId, payerMsisdn]
      properties:
        amount: { type: string }
        currency: { type: string }
        externalId: { type: string }
        payerMsisdn: { type: string }
        payerMessage: { type: string }
        payeeNote: { type: string }
        callbackUrl: { type: string, format: uri }
        referenceId: { type: string, format: uuid }
    CreateStore:
      type: object
      required: [name, slug]
      properties:
        name: { type: string }
        slug: { type: string }
        description: { type: string }
        storeContactPhone: { type: string }
        storeAddress: { type: string }
        categories:
          type: array
          items: { type: string }
    UpdateStore:
      allOf:
        - $ref: '#/components/schemas/CreateStore'
        - type: object
          properties:
            status: { type: string, enum: [draft, active, suspended] }
    CreateProduct:
      type: object
      required: [storeId, title, priceAmount, currency]
      properties:
        storeId: { type: string, format: uuid }
        title: { type: string }
        description: { type: string }
        priceAmount: { type: number }
        currency: { type: string }
        isFeatured: { type: boolean }
        media:
          type: array
          items:
            type: object
            properties:
              url: { type: string, format: uri }
              pathname: { type: string }
              contentType: { type: string }
    UpdateProduct:
      type: object
      properties:
        title: { type: string }
        description: { type: string }
        priceAmount: { type: number }
        currency: { type: string }
        isFeatured: { type: boolean }
        status: { type: string, enum: [draft, ready, active, sold-out] }
        media: { $ref: '#/components/schemas/CreateProduct/properties/media' }

paths:
  # Express — Storefront Orders
  /storefront/{slug}/orders:
    post:
      summary: Create storefront order
      tags: [Storefront]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateOrderInput' }
      responses:
        '201': { description: Created order with optional MoMo ref }
      security: []

  # Express — Tenant Orders
  /tenants/{tenantId}/orders:
    get:
      summary: List tenant orders
      tags: [Tenant Orders]
      parameters: [ { $ref: '#/components/parameters/TenantIdParam' } ]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Orders list }
  /tenants/{tenantId}/orders/{orderId}:
    patch:
      summary: Update tenant order status
      tags: [Tenant Orders]
      parameters:
        - { $ref: '#/components/parameters/TenantIdParam' }
        - { $ref: '#/components/parameters/OrderIdParam' }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/UpdateOrderStatus' }
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Updated order }

  # Express — Order Simulation
  /tenants/{tenantId}/orders/{orderId}/simulate-paid:
    post:
      summary: Simulate payment (testing)
      tags: [Tenant Orders]
      parameters:
        - { $ref: '#/components/parameters/TenantIdParam' }
        - { $ref: '#/components/parameters/OrderIdParam' }
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Marked paid }

  # Express — MTN MoMo
  /storefront/{slug}/payments/mtn-momo/request-to-pay:
    post:
      summary: MTN MoMo request-to-pay (explicit)
      tags: [Payments]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              allOf:
                - $ref: '#/components/schemas/RequestToPayInput'
                - type: object
                  required: [orderId]
                  properties:
                    orderId: { type: string, format: uuid }
      responses:
        '202': { description: Accepted, returns referenceId }
      security: []
  /storefront/{slug}/payments/mtn-momo/initiate:
    post:
      summary: MTN MoMo initiate using order defaults
      tags: [Payments]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [orderId]
              properties:
                orderId: { type: string, format: uuid }
                payerMsisdn: { type: string }
                payerMessage: { type: string }
                payeeNote: { type: string }
                callbackUrl: { type: string, format: uri }
      responses:
        '202': { description: Accepted, pending payment }
      security: []
  /storefront/{slug}/payments/mtn-momo/request-to-pay/{referenceId}:
    get:
      summary: Get MTN MoMo request status
      tags: [Payments]
      parameters:
        - { $ref: '#/components/parameters/SlugParam' }
        - { $ref: '#/components/parameters/ReferenceIdParam' }
      responses:
        '200': { description: MoMo status + normalizedPaymentStatus }
      security: []
  /storefront/{slug}/payments/mtn-momo/by-order/{orderId}:
    get:
      summary: List MoMo payments by order
      tags: [Payments]
      parameters:
        - { $ref: '#/components/parameters/SlugParam' }
        - { $ref: '#/components/parameters/OrderIdParam' }
      responses:
        '200': { description: Payments list }
      security: []
  /webhooks/mtn-momo:
    post:
      summary: MTN MoMo webhook (v1)
      tags: [Webhooks]
      responses:
        '200': { description: OK }
      security: []
    put:
      summary: MTN MoMo webhook (v2)
      tags: [Webhooks]
      responses:
        '200': { description: OK }
      security: []

  # Express — WhatsApp
  /webhooks/whatsapp:
    get:
      summary: WhatsApp verification
      tags: [Webhooks]
      parameters:
        - in: query
          name: hub.mode
          schema: { type: string }
        - in: query
          name: hub.verify_token
          schema: { type: string }
        - in: query
          name: hub.challenge
          schema: { type: string }
      responses:
        '200': { description: Challenge echoed }
        '403': { description: Verification failed }
    post:
      summary: WhatsApp inbound webhook
      tags: [Webhooks]
      responses:
        '200': { description: OK }
      security: []

  # Express — Internal WhatsApp Template Sync
  /internal/whatsapp/templates/sync:
    post:
      summary: Sync WhatsApp templates (internal)
      tags: [Internal]
      security: [ { internalApiKey: [] } ]
      responses:
        '200': { description: Synced }

  # Next.js — Cart
  /cart:
    get:
      summary: Get current cart
      tags: [Cart]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Cart items }
    post:
      summary: Upsert cart item
      tags: [Cart]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [productId, storeId, quantity]
              properties:
                productId: { type: string }
                storeId: { type: string }
                quantity: { type: integer }
      responses:
        '200': { description: Updated cart }
    delete:
      summary: Clear cart (optional storeId)
      tags: [Cart]
      security: [ { sessionCookie: [] } ]
      parameters:
        - in: query
          name: storeId
          schema: { type: string }
      responses:
        '200': { description: Cleared }
  /cart/items/{productId}:
    delete:
      summary: Remove item from cart
      tags: [Cart]
      parameters: [ { $ref: '#/components/parameters/ProductIdParam' } ]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Removed }

  # Next.js — Products
  /products:
    get:
      summary: List products (tenant)
      tags: [Products]
      security: [ { sessionCookie: [] } ]
      parameters:
        - in: query
          name: storeId
          schema: { type: string }
        - in: query
          name: source
          schema: { type: string }
        - in: query
          name: isFeatured
          schema: { type: string }
        - in: query
          name: page
          schema: { type: integer, default: 1 }
        - in: query
          name: limit
          schema: { type: integer, default: 20 }
        - in: query
          name: search
          schema: { type: string }
      responses:
        '200': { description: Products list }
    post:
      summary: Create product
      tags: [Products]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateProduct' }
          multipart/form-data:
            schema: { $ref: '#/components/schemas/CreateProduct' }
      responses:
        '201': { description: Created }
  /products/{productId}:
    get:
      summary: Get product
      tags: [Products]
      parameters: [ { $ref: '#/components/parameters/ProductIdParam' } ]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Product }
    patch:
      summary: Update product
      tags: [Products]
      parameters: [ { $ref: '#/components/parameters/ProductIdParam' } ]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/UpdateProduct' }
      responses:
        '200': { description: Updated }
    delete:
      summary: Delete product
      tags: [Products]
      parameters: [ { $ref: '#/components/parameters/ProductIdParam' } ]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Deleted }
  /products/bulk:
    post:
      summary: Bulk publish/delete products
      tags: [Products]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [ids, action]
              properties:
                ids:
                  type: array
                  items: { type: string }
                action:
                  type: string
                  enum: [publish, archive, delete]
      responses:
        '200': { description: Bulk result }
  /products/bulk-create:
    post:
      summary: Bulk create draft products with media URLs
      tags: [Products]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [storeId, items]
              properties:
                storeId: { type: string }
                items:
                  type: array
                  items:
                    type: object
                    required: [url, pathname, contentType, filename]
                    properties:
                      url: { type: string, format: uri }
                      pathname: { type: string }
                      contentType: { type: string }
                      filename: { type: string }
      responses:
        '200': { description: Created }

  # Next.js — Stores
  /stores:
    get:
      summary: List stores (tenant)
      tags: [Stores]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Store list }
    post:
      summary: Create store
      tags: [Stores]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateStore' }
      responses:
        '201': { description: Created }
  /stores/{storeId}:
    get:
      summary: Get store
      tags: [Stores]
      parameters: [ { $ref: '#/components/parameters/StoreIdParam' } ]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Store }
    patch:
      summary: Update store
      tags: [Stores]
      parameters: [ { $ref: '#/components/parameters/StoreIdParam' } ]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/UpdateStore' }
      responses:
        '200': { description: Updated }
    delete:
      summary: Delete store
      tags: [Stores]
      parameters: [ { $ref: '#/components/parameters/StoreIdParam' } ]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Deleted }

  # Next.js — Orders (tenant)
  /orders:
    get:
      summary: List orders
      tags: [Orders]
      security: [ { sessionCookie: [] } ]
      parameters:
        - in: query
          name: status
          schema: { type: string }
        - in: query
          name: paymentStatus
          schema: { type: string }
        - in: query
          name: page
          schema: { type: integer, default: 1 }
        - in: query
          name: limit
          schema: { type: integer, default: 20 }
        - in: query
          name: search
          schema: { type: string }
      responses:
        '200': { description: Orders list }
  /orders/{orderId}:
    get:
      summary: Get order
      tags: [Orders]
      parameters: [ { $ref: '#/components/parameters/OrderIdParam' } ]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Order }
    patch:
      summary: Update order
      tags: [Orders]
      parameters: [ { $ref: '#/components/parameters/OrderIdParam' } ]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/UpdateOrderStatus' }
      responses:
        '200': { description: Updated }
  /orders/stats:
    get:
      summary: Order statistics
      tags: [Orders]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Stats }

  # Next.js — Storefront (public + proxies)
  /storefront/{slug}:
    get:
      summary: Public storefront hero/header
      tags: [Storefront]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      security: []
      responses:
        '200': { description: Store info }
  /storefront/{slug}/products:
    get:
      summary: Public products for store
      tags: [Storefront]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      security: []
      responses:
        '200': { description: Products }
  /storefront/{slug}/products/{productSlug}:
    get:
      summary: Public product detail
      tags: [Storefront]
      parameters:
        - { $ref: '#/components/parameters/SlugParam' }
        - in: path
          name: productSlug
          required: true
          schema: { type: string }
      security: []
      responses:
        '200': { description: Product detail }
  /storefront/{slug}/categories:
    get:
      summary: Store categories
      tags: [Storefront]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      security: []
      responses:
        '200': { description: Categories }
  /storefront/{slug}/hero:
    get:
      summary: Store hero media
      tags: [Storefront]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      security: []
      responses:
        '200': { description: Hero }
  /storefront/{slug}/track:
    get:
      summary: Track storefront event (public)
      tags: [Storefront]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      security: []
      responses:
        '200': { description: Tracked }
  /storefront/{slug}/orders:
    post:
      summary: Proxy to Express order create
      tags: [Storefront]
      parameters: [ { $ref: '#/components/parameters/SlugParam' } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateOrderInput' }
      responses:
        '201': { description: Created via proxy }
      security: []
  /storefront/{slug}/payments/mtn-momo/request-to-pay/{referenceId}:
    get:
      summary: Proxy MoMo status
      tags: [Storefront]
      parameters:
        - { $ref: '#/components/parameters/SlugParam' }
        - { $ref: '#/components/parameters/ReferenceIdParam' }
      security: []
      responses:
        '200': { description: Status }

  # Next.js — Uploads
  /upload:
    post:
      summary: Issue Vercel Blob upload token (tenant-scoped)
      tags: [Uploads]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              description: HandleUploadBody (see @vercel/blob/client)
      responses:
        '200': { description: Upload token/config }

  # Next.js — Onboarding
  /onboarding:
    post:
      summary: Complete onboarding (create tenant)
      tags: [Onboarding]
      security: [ { sessionCookie: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [data]
              properties:
                data:
                  type: object
                  description: OnboardingData (business, personal, store setup)
      responses:
        '200': { description: Onboarding result }

  # Next.js — Marketplace
  /marketplace/stores:
    get:
      summary: Marketplace stores
      tags: [Marketplace]
      security: []
      responses:
        '200': { description: Stores and storesByCategory }
  /marketplace/categories/{slug}/stores:
    get:
      summary: Stores by category
      tags: [Marketplace]
      parameters:
        - in: path
          name: slug
          required: true
          schema: { type: string }
      security: []
      responses:
        '200': { description: Stores list }

  # Next.js — Admin
  /admin/bootstrap:
    get:
      summary: Admin bootstrap
      tags: [Admin]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Bootstrap data }
  /admin/analytics/overview:
    get:
      summary: Admin analytics overview
      tags: [Admin]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Overview }

  # Next.js — Instagram Integrations
  /integrations/instagram/status:
    get:
      summary: Instagram status
      tags: [Integrations]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Status }
  /integrations/instagram/import:
    post:
      summary: Instagram import
      tags: [Integrations]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Import started }
  /integrations/instagram/sync:
    post:
      summary: Instagram sync
      tags: [Integrations]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Sync started }
  /integrations/instagram/webhook:
    post:
      summary: Instagram webhook
      tags: [Integrations, Webhooks]
      security: []
      responses:
        '200': { description: OK }

  # Next.js — User
  /user/status:
    get:
      summary: Auth status
      tags: [User]
      security: [ { sessionCookie: [] } ]
      responses:
        '200': { description: Session status }
```
