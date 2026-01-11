## Changes Overview

We have refactored the Product Page to properly integrate with the Storefront's theme, layout, and global components.

### 1. Created `StorefrontProduct` Component
This new component (`apps/web/src/components/storefront/StorefrontProduct.tsx`) mirrors the architecture of `StorefrontHome`. It handles:
- **Data Fetching**: Fetches store settings and theme configuration.
- **Theme Injection**: Applies CSS variables (colors, fonts, radius) to the page root, identical to the homepage.
- **Layout Integration**: Uses `StoreLayout` to render the global **Header** and **Cart Drawer**.
- **Footer Integration**: Renders the global **Footer** with store-specific content.

### 2. Updated Product Page Route
We updated `apps/web/src/app/(storefront)/[subdomain]/product/[productId]/page.tsx` to use the new `StorefrontProduct` component instead of manually rendering `ProductDetail`.

### Result
The Product Page now:
- **Displays the correct Theme Colors** (Primary, Background, Foreground).
- **Shows the Store Header** with navigation tabs ("Men", "Women", etc.).
- **Shows the Store Footer**.
- **Maintains consistent styling** with the rest of the application.

## Verification
1. Navigate to a product page.
2. Verify the Header and Footer are present.
3. Verify the "Add to Cart" buttons and text match the store's primary colors.
