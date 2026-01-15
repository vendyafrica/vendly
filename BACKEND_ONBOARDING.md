# Backend Implementation Guide for Onboarding

## API Endpoint to Implement

### `POST /api/onboarding/complete`

This endpoint should be implemented in your backend API (apps/api).

---

## Request Payload

```typescript
interface OnboardingRequest {
  fullName: string
  phone: string
  businessType: ('online' | 'in-person')[]
  categories: string[]
  location?: string
  storeName: string
  tenantSlug: string
}
```

**Example:**
```json
{
  "fullName": "John Doe",
  "phone": "0712345678",
  "businessType": ["online"],
  "categories": ["Men", "Women"],
  "location": "Nairobi, Kenya",
  "storeName": "My Awesome Store",
  "tenantSlug": "my-awesome-store"
}
```

---

## Implementation Steps

### 1. Create Tenant Record

```typescript
const tenant = await db.insert(tenants).values({
  slug: tenantSlug,
  name: storeName,
  ownerId: userId, // From session
  createdAt: new Date(),
}).returning();
```

### 2. Create Store Record

```typescript
const store = await db.insert(stores).values({
  tenantId: tenant.id,
  name: storeName,
  slug: tenantSlug,
  categories: categories,
  businessType: businessType,
  location: location,
  ownerName: fullName,
  ownerPhone: phone,
  status: 'active',
  createdAt: new Date(),
}).returning();
```

### 3. Create Sanity Content

```typescript
import { createStoreContent } from '@/sanity/lib/createStoreContent'

await createStoreContent({
  storeId: tenantSlug,
  storeName: storeName,
  designSystemId: 'design-system-modern', // Default to Modern
})
```

This creates:
- Store Settings document
- Homepage document with default sections
- Header document
- Footer document

### 4. Return Response

```typescript
return {
  success: true,
  tenantId: tenant.id,
  storeId: store.id,
  subdomain: tenantSlug,
  adminUrl: `${process.env.ADMIN_URL}/${tenantSlug}/studio`,
  storefrontUrl: `https://${tenantSlug}.${process.env.ROOT_DOMAIN}`,
}
```

---

## Complete Example Implementation

```typescript
// apps/api/src/routes/onboarding.ts

import { Router } from 'express'
import { db } from '../db'
import { tenants, stores } from '../db/schema'
import { createStoreContent } from '../sanity/lib/createStoreContent'

const router = Router()

router.post('/onboarding/complete', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      businessType,
      categories,
      location,
      storeName,
      tenantSlug,
    } = req.body

    // Get user from session
    const userId = req.session?.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Validate required fields
    if (!fullName || !phone || !storeName || !tenantSlug) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if slug is already taken
    const existingTenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, tenantSlug))
      .limit(1)

    if (existingTenant.length > 0) {
      return res.status(409).json({ error: 'Store URL already taken' })
    }

    // 1. Create tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        slug: tenantSlug,
        name: storeName,
        ownerId: userId,
        createdAt: new Date(),
      })
      .returning()

    // 2. Create store
    const [store] = await db
      .insert(stores)
      .values({
        tenantId: tenant.id,
        name: storeName,
        slug: tenantSlug,
        categories: categories,
        businessType: businessType,
        location: location,
        ownerName: fullName,
        ownerPhone: phone,
        status: 'active',
        createdAt: new Date(),
      })
      .returning()

    // 3. Create Sanity content
    await createStoreContent({
      storeId: tenantSlug,
      storeName: storeName,
      designSystemId: 'design-system-modern',
    })

    // 4. Return success response
    return res.json({
      success: true,
      tenantId: tenant.id,
      storeId: store.id,
      subdomain: tenantSlug,
      adminUrl: `${process.env.ADMIN_URL}/${tenantSlug}/studio`,
      storefrontUrl: `https://${tenantSlug}.${process.env.ROOT_DOMAIN}`,
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return res.status(500).json({ error: 'Failed to create store' })
  }
})

export default router
```

---

## Database Schema Requirements

### Tenants Table
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Stores Table
```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  categories TEXT[] NOT NULL,
  business_type TEXT[] NOT NULL,
  location VARCHAR(255),
  owner_name VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables

```env
# Backend API
ADMIN_URL=http://localhost:4000
ROOT_DOMAIN=vendlyafrica.store

# Sanity (for createStoreContent)
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-token
```

---

## Error Handling

### Possible Errors:

1. **Slug already taken**
   ```json
   {
     "error": "Store URL already taken",
     "code": "SLUG_EXISTS"
   }
   ```

2. **Sanity creation failed**
   ```json
   {
     "error": "Failed to create store content",
     "code": "SANITY_ERROR"
   }
   ```

3. **Database error**
   ```json
   {
     "error": "Database error",
     "code": "DB_ERROR"
   }
   ```

---

## Testing

### Using curl:

```bash
curl -X POST http://localhost:8000/api/onboarding/complete \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-cookie" \
  -d '{
    "fullName": "John Doe",
    "phone": "0712345678",
    "businessType": ["online"],
    "categories": ["Men", "Women"],
    "location": "Nairobi, Kenya",
    "storeName": "Test Store",
    "tenantSlug": "test-store"
  }'
```

### Expected Response:

```json
{
  "success": true,
  "tenantId": "uuid-here",
  "storeId": "uuid-here",
  "subdomain": "test-store",
  "adminUrl": "http://localhost:4000/test-store/studio",
  "storefrontUrl": "https://test-store.vendlyafrica.store"
}
```

---

## Sanity Helper Location

The `createStoreContent` helper should be copied to your backend:

```
apps/api/
└── src/
    └── sanity/
        ├── client.ts          # Sanity client config
        └── lib/
            └── createStoreContent.ts  # Helper function
```

Copy from: `apps/admin/src/sanity/lib/createStoreContent.ts`

---

## Next Steps

1. Implement the API endpoint in `apps/api`
2. Add database migrations for tenants and stores tables
3. Copy Sanity helper to backend
4. Test the endpoint with curl
5. Test the full onboarding flow from frontend
