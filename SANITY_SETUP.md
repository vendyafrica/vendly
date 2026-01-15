# Sanity CMS Integration for Vendly

This document explains how to set up and use Sanity CMS for content management in Vendly.

## 🎯 Overview

Vendly now uses Sanity CMS for content management, replacing Puck. Merchants can:
- Choose from 3 predefined design systems (Modern, Classic, Bold)
- Edit content (text, images, sections) through Sanity Studio
- Preview changes in real-time using visual editing

## 📋 Prerequisites

1. Create a Sanity account at [sanity.io](https://sanity.io)
2. Create a new Sanity project

## 🚀 Setup Instructions

### Step 1: Create Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Click "Create Project"
3. Name it "Vendly" (or your preferred name)
4. Choose a dataset name (e.g., "production")
5. Copy your **Project ID**

### Step 2: Configure CORS

1. In Sanity Manage, go to your project settings
2. Navigate to **API** → **CORS Origins**
3. Add the following origins:
   - `http://localhost:3000` (web app)
   - `http://localhost:4000` (admin app)
   - Your production domains when deploying

4. Enable **Allow credentials** for each origin

### Step 3: Create API Token

1. In Sanity Manage, go to **API** → **Tokens**
2. Click "Add API token"
3. Name it "Vendly API Token"
4. Set permissions to **Viewer** (read access)
5. Copy the token

### Step 4: Set Environment Variables

#### Admin App (`.env.local` in `apps/admin/`)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-15"
SANITY_API_TOKEN="your-api-token"
SANITY_STUDIO_PREVIEW_URL="http://localhost:3000"
```

#### Web App (`.env.local` in `apps/web/`)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-15"
SANITY_API_TOKEN="your-api-token"
NEXT_PUBLIC_SANITY_STUDIO_URL="http://localhost:4000/studio"
```

### Step 5: Seed Design Systems

Run the seed script to create the 3 design systems:

```bash
cd apps/admin
pnpm tsx scripts/seed-design-systems.ts
```

You should see:
```
🌱 Seeding design systems...
Creating Modern design system...
✅ Modern created
Creating Classic design system...
✅ Classic created
Creating Bold design system...
✅ Bold created

✨ All design systems seeded successfully!
```

### Step 6: Start Development Servers

```bash
# From monorepo root
pnpm dev
```

This starts:
- Admin app on `http://localhost:4000`
- Web app on `http://localhost:3000`

## 🎨 Using Sanity Studio

### Access the Studio

Navigate to: `http://localhost:4000/[tenant-id]/studio`

Replace `[tenant-id]` with your store's tenant ID.

### Create Store Content

1. **Store Settings**
   - Click "Store Settings" in the sidebar
   - Create a new document
   - Set `storeId` to match your tenant ID
   - Choose a design system (Modern, Classic, or Bold)
   - Upload logo and favicon
   - Fill in SEO settings

2. **Homepage**
   - Click "Homepage" in the sidebar
   - Create a new document
   - Set `storeId` to match your tenant ID
   - Add sections:
     - **Hero Section**: Main banner with title, subtitle, image, and CTA
     - **Product Grid**: Display products in a grid
     - **Banner**: Promotional banner
   - Drag to reorder sections

3. **Header**
   - Click "Header" in the sidebar
   - Create a new document
   - Set `storeId` to match your tenant ID
   - Configure navigation links
   - Optional: Enable announcement bar

4. **Footer**
   - Click "Footer" in the sidebar
   - Create a new document
   - Set `storeId` to match your tenant ID
   - Add link columns
   - Configure newsletter section
   - Add social media links

## 🎨 Design Systems

### Modern
- **Colors**: Neutral grays with blue accent
- **Typography**: Inter (sans-serif)
- **Radius**: Medium (0.5rem)
- **Character**: Clean, minimal, contemporary

### Classic
- **Colors**: Warm neutrals with gold accent
- **Typography**: Playfair Display (headings) + Lato (body)
- **Radius**: Small (0.2rem)
- **Character**: Elegant, timeless, luxury

### Bold
- **Colors**: High contrast with vibrant red accent
- **Typography**: Outfit (headings) + DM Sans (body)
- **Radius**: Full (pill-shaped)
- **Character**: Energetic, youthful, dynamic

## 📝 Content Schema

### Store Settings
```typescript
{
  storeId: string          // Tenant identifier
  storeName: string        // Display name
  designSystem: reference  // Link to design system
  logo: image             // Store logo
  favicon: image          // Browser icon
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}
```

### Homepage
```typescript
{
  storeId: string
  sections: [
    {
      _type: 'heroSection'
      title: string
      subtitle: string
      backgroundImage: image
      ctaText: string
      ctaLink: string
      layout: 'centered' | 'split' | 'fullwidth'
    },
    {
      _type: 'productGridSection'
      title: string
      columns: 2 | 3 | 4 | 6
      productSource: 'featured' | 'new' | 'bestsellers' | 'all'
      limit: number
    },
    {
      _type: 'bannerSection'
      text: string
      backgroundColor: 'primary' | 'accent' | 'muted'
      ctaText: string
      ctaLink: string
    }
  ]
}
```

## 🔄 Onboarding Flow

When a merchant signs up:

1. Create Sanity documents with their `storeId`:
   ```typescript
   // Store Settings
   await client.create({
     _type: 'storeSettings',
     storeId: merchantId,
     storeName: shopName,
     designSystem: { _ref: 'design-system-modern' }, // Default to Modern
   })
   
   // Homepage with default sections
   await client.create({
     _type: 'homepage',
     storeId: merchantId,
     sections: [
       {
         _type: 'heroSection',
         title: `Welcome to ${shopName}`,
         subtitle: 'Discover amazing products',
         layout: 'centered',
       },
       {
         _type: 'productGridSection',
         title: 'Featured Products',
         columns: 4,
         productSource: 'featured',
         limit: 8,
       },
     ],
   })
   
   // Header
   await client.create({
     _type: 'header',
     storeId: merchantId,
     storeName: shopName,
     navigationLinks: [
       { label: 'WOMEN', url: '/women' },
       { label: 'MEN', url: '/men' },
       { label: 'COLLECTIONS', url: '/collections' },
     ],
   })
   
   // Footer
   await client.create({
     _type: 'footer',
     storeId: merchantId,
     linkColumns: [
       {
         title: 'Categories',
         links: [
           { label: 'Women', url: '/women' },
           { label: 'Men', url: '/men' },
         ],
       },
     ],
   })
   ```

2. Merchant can then customize through Studio

## 🐛 Troubleshooting

### "Missing environment variable" error
- Ensure all environment variables are set in `.env.local`
- Restart development servers after adding env vars

### "Store not found" on storefront
- Verify `storeId` in Sanity documents matches tenant ID
- Check that Store Settings document exists

### CORS errors
- Add your domain to CORS origins in Sanity Manage
- Enable "Allow credentials"

### Images not loading
- Ensure Sanity project ID is correct
- Check that images are uploaded in Sanity Studio

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Visual Editing Guide](https://www.sanity.io/docs/visual-editing)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
