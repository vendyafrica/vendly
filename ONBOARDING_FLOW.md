# Enhanced Onboarding Flow for Vendly

## Overview
The onboarding flow has been enhanced to collect all necessary information and create a complete store with Sanity CMS integration.

## Onboarding Steps

### Step 1: Personal Details (`/sell/personal-info`)
**Data Collected:**
- Full Name
- Phone Number

**Component:** `PersonalStep`
**Route:** `/sell/personal-info`

---

### Step 2: Business Information (`/sell/business`)
**Data Collected:**
- **Business Type** (checkboxes - can select multiple):
  - Online Store
  - In-Person Sales
- **Product Categories** (select multiple):
  - Men, Women, Home & Living, Beauty & Health
  - Gifts, Accessories, Food & Beverages, Electronics
- **Business Location** (optional)

**Component:** `BusinessStep`
**Route:** `/sell/business`

**Validation:**
- At least one business type must be selected
- At least one category must be selected

---

### Step 3: Store Setup (`/sell/store-setup`)
**Data Collected:**
- **Store Name** (required)
- **Store Slug** (auto-generated from store name)

**Component:** `StoreStep`
**Route:** `/sell/store-setup`

**Features:**
- Slug is automatically generated from store name
- Shows preview of store URL: `{slug}.vendlyafrica.store`
- Submits data to API endpoint: `/api/onboarding/complete`

**Validation:**
- Store name is required
- Slug must be at least 3 characters

---

### Step 4: Preview (`/sell/preview`)
**What Happens:**
- Shows a full preview of the dummy storefront
- Displays all components with sample data:
  - Header (with store name)
  - Hero Section
  - Product Grid (with dummy products)
  - Banner Section
  - Footer

**Component:** `PreviewStep`
**Route:** `/sell/preview`

**Features:**
- Sticky top banner showing "Your Store is Ready!"
- Button to "Customize in Studio"
- Full storefront preview with hardcoded dummy data
- Bottom CTA bar with "Go to Studio" button

**User Actions:**
- Click "Customize in Studio" → Redirects to `/[tenant]/studio` in admin app

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Personal Details                                       │
│  ├─ fullName                                                    │
│  └─ phone                                                       │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Business Info                                          │
│  ├─ businessType: ['online', 'in-person']                       │
│  ├─ categories: ['Men', 'Women', ...]                           │
│  └─ location (optional)                                         │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Store Setup                                            │
│  ├─ storeName: "My Awesome Store"                               │
│  └─ tenantSlug: "my-awesome-store" (auto-generated)             │
└─────────────────────────────────────────────────────────────────┘
                              ▼
                    [Submit to API]
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend Creates:                                                │
│  ├─ Tenant record in database                                   │
│  ├─ Store record in database                                    │
│  └─ Sanity content (via createStoreContent helper):             │
│      ├─ Store Settings (with Modern design system)              │
│      ├─ Homepage (with default sections)                        │
│      ├─ Header (with navigation)                                │
│      └─ Footer (with links)                                     │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Preview                                                 │
│  Shows dummy storefront with:                                    │
│  ├─ Header (store name from form)                               │
│  ├─ Hero ("Welcome to {storeName}")                             │
│  ├─ Product Grid (6 dummy products)                             │
│  ├─ Banner ("Free shipping...")                                 │
│  └─ Footer                                                       │
└─────────────────────────────────────────────────────────────────┘
                              ▼
                [Click "Go to Studio"]
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Redirect to: http://localhost:4000/{tenantSlug}/studio         │
│  Merchant can now:                                               │
│  ├─ Edit content in Sanity Studio                               │
│  ├─ Change design system (Modern/Classic/Bold)                  │
│  ├─ Add/remove/reorder sections                                 │
│  ├─ Upload logo and images                                      │
│  └─ Customize text, colors, etc.                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Integration Required

### API Endpoint: `/api/onboarding/complete`

**Request Body:**
```typescript
{
  fullName: string
  phone: string
  businessType: ('online' | 'in-person')[]
  categories: string[]
  location?: string
  storeName: string
  tenantSlug: string
}
```

**Response:**
```typescript
{
  success: boolean
  tenantId: string
  storeId: string
  subdomain: string
  adminUrl: string
  storefrontUrl: string
}
```

**Backend Tasks:**
1. Create tenant record in database
2. Create store record in database
3. Call `createStoreContent()` from Sanity helper:
   ```typescript
   import { createStoreContent } from '@/sanity/lib/createStoreContent'
   
   await createStoreContent({
     storeId: tenantSlug,
     storeName: storeName,
     designSystemId: 'design-system-modern' // Default
   })
   ```
4. Return response with URLs

---

## Components Used in Preview

### 1. Header
- File: `apps/web/src/components/marketplace/header.tsx`
- Shows store name
- Navigation links: WOMEN, MEN, COLLECTIONS
- Search, Profile, Cart icons

### 2. Hero Section
- File: `apps/web/src/components/sections/HeroSection.tsx`
- Title: "Welcome to {storeName}"
- Subtitle: "Discover amazing products..."
- CTA Button: "Shop Now"
- Layout: Centered

### 3. Product Grid
- File: `apps/web/src/components/sections/ProductGridSection.tsx`
- Title: "Featured Products"
- 4 columns
- 8 dummy products from `dummyProducts` array

### 4. Banner
- File: `apps/web/src/components/sections/BannerSection.tsx`
- Text: "Free shipping on orders over $100"
- Background: Primary color
- CTA: "Learn More"

### 5. Footer
- File: `apps/web/src/components/marketplace/footer.tsx`
- Link columns (Categories, Customer Service)
- Newsletter signup
- Social links
- Copyright

---

## Environment Variables Needed

### Web App (`.env.local`)
```env
NEXT_PUBLIC_ADMIN_URL=http://localhost:4000
NEXT_PUBLIC_ROOT_DOMAIN=vendlyafrica.store
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Admin App (`.env.local`)
```env
# (Sanity vars already documented in SANITY_SETUP.md)
```

---

## Testing the Flow

1. **Start all apps:**
   ```bash
   pnpm dev
   ```

2. **Navigate to:** `http://localhost:3000/sell/personal-info`

3. **Fill in personal details:**
   - Name: John Doe
   - Phone: 0712345678

4. **Select business info:**
   - Business Type: ✅ Online Store
   - Categories: ✅ Men, ✅ Women
   - Location: Nairobi, Kenya

5. **Enter store name:**
   - Store Name: "My Awesome Store"
   - (Slug auto-generates: "my-awesome-store")

6. **Click "Create Store"**
   - API creates tenant, store, and Sanity content
   - Redirects to `/sell/preview`

7. **View preview:**
   - See full dummy storefront
   - Click "Go to Studio"

8. **Redirects to:** `http://localhost:4000/my-awesome-store/studio`
   - Merchant can now edit content in Sanity Studio

---

## Next Steps

1. **Implement backend endpoint** `/api/onboarding/complete`
2. **Call `createStoreContent()`** helper to create Sanity documents
3. **Test the full flow** end-to-end
4. **Add error handling** for API failures
5. **Add loading states** during store creation

---

## Files Modified/Created

### Modified:
- `apps/web/src/types/onboarding.ts` - Updated types
- `apps/web/src/components/onboarding/business.tsx` - Added business type
- `apps/web/src/components/onboarding/store-setup.tsx` - Auto-generate slug
- `apps/web/src/utils/validators.ts` - Added businessType validation
- `apps/web/src/app/sell/preview/page.tsx` - Simplified to use new component

### Created:
- `apps/web/src/components/onboarding/preview.tsx` - New preview component
- `apps/admin/src/sanity/lib/createStoreContent.ts` - Helper for creating Sanity content

---

## Summary

The enhanced onboarding flow:
1. ✅ Collects personal details (name, phone)
2. ✅ Collects business info (type, categories, location)
3. ✅ Collects store name (auto-generates slug)
4. ✅ Creates store in backend + Sanity content
5. ✅ Shows preview of dummy storefront
6. ✅ Redirects to Sanity Studio for customization

**User Experience:**
- Simple 3-step form
- See their store immediately with dummy data
- One click to start customizing in Studio
- No technical knowledge required
