# Storefront Template

This is a locked storefront template that v0 will use as a starting point. All data-fetching components are locked and cannot be modified by v0.

## Components

### Locked Components (Cannot be modified by v0)
- `Header` - Store navigation with cart
- `HeroSection` - Dynamic hero with store data
- `CategoryTabs` - Category navigation
- `ProductGrid` - Fetches and displays products
- `ProductCard` - Individual product display
- `CartProvider` - Cart state management
- `CartDrawer` - Shopping cart sidebar

### Design System

Clean, minimal design with:
- No gradients
- Pure white backgrounds
- Black primary buttons
- Subtle gray borders
- Semantic color tokens

### Environment Variables

v0 will have access to:
- `NEXT_PUBLIC_STORE_SLUG` - The store's unique identifier
- `NEXT_PUBLIC_STORE_NAME` - The store's name
- `NEXT_PUBLIC_API_URL` - Base URL for API calls

### Data Flow

1. Components fetch data from `/api/storefront/${storeSlug}/...`
2. Real products, categories, and store info from database
3. Cart managed via localStorage context
4. v0 can only modify layout, spacing, and non-functional styling

## Usage

This template is initialized via `v0.chats.init()` with all components locked. v0 can then be asked to:
- Adjust spacing and layout
- Add non-functional sections
- Modify colors within the design system
- Add promotional content

v0 CANNOT:
- Remove data fetching
- Break API connections
- Modify locked components
