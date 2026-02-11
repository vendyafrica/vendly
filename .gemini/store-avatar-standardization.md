# Store Avatar Standardization - Implementation Summary

## Overview
Standardized the fallback avatar logos for all stores across the Vendly marketplace to display store name initials on an off-white background when no Instagram profile picture or custom logo is available.

## Changes Made

### 1. Created Reusable Store Avatar Component
**File:** `apps/web/src/components/store-avatar.tsx`

Created two variants:
- **StoreAvatar**: Full-featured component using shadcn Avatar component (for larger displays)
- **StoreAvatarSimple**: Lightweight version for performance-critical areas (marketplace cards, shelves)

**Features:**
- Displays Instagram profile picture if available
- Falls back to store logo if available
- Falls back to store name initials (up to 2 characters) on `bg-neutral-100` (off-white) background
- Supports three sizes: `sm` (24px), `md` (32px), `lg` (48px)
- Consistent styling across all use cases

**Initials Logic:**
- Single word store names: First 2 characters (e.g., "Vendly" → "VE")
- Multi-word store names: First letter of first 2 words (e.g., "Princess Polly" → "PP")

### 2. Updated Components

#### Marketplace Components
1. **StoreCard** (`apps/web/src/app/(m)/components/store-card.tsx`)
   - Replaced custom avatar implementation with `StoreAvatarSimple`
   - Size: 24px

2. **FeaturedStoresShelf** (`apps/web/src/app/(m)/components/home/FeaturedStoresShelf.tsx`)
   - Replaced custom avatar implementation with `StoreAvatarSimple`
   - Size: 40px
   - Maintains overlay styling with border and backdrop blur

3. **CategoryShelf** (`apps/web/src/app/(m)/components/home/CategoryShelf.tsx`)
   - Replaced custom avatar implementation with `StoreAvatarSimple`
   - Size: 36px

4. **Cart Page** (`apps/web/src/app/(m)/cart/page.tsx`)
   - Replaced Avatar component with `StoreAvatar`
   - Size: lg (48px)

#### Product Components
5. **ProductDetails** (`apps/web/src/app/[s]/components/product-details.tsx`)
   - Replaced Avatar component with `StoreAvatar`
   - Size: md (32px)

## Before vs After

### Before
- **Inconsistent fallbacks**: Some components showed single character (e.g., "P"), others showed emoji (🏬)
- **Different background colors**: Some used `bg-muted`, others used `bg-primary`, `bg-primary/10`
- **Duplicated code**: Each component had its own avatar implementation
- **No standardization**: Different logic for extracting initials

### After
- **Consistent fallbacks**: All stores without logos show 2-character initials on off-white background
- **Unified styling**: `bg-neutral-100` with `text-neutral-700` across all components
- **Reusable component**: Single source of truth for store avatars
- **Better UX**: More professional and recognizable store identifiers

## Design Decisions

1. **Off-white background** (`bg-neutral-100`): Subtle, professional, doesn't compete with content
2. **Dark gray text** (`text-neutral-700`): Good contrast, readable
3. **2-character initials**: More recognizable than single character, fits well in circular avatars
4. **Two component variants**: Performance optimization for high-frequency renders (marketplace grids)

## Testing Recommendations

1. Test stores with Instagram profiles (should show Instagram avatar)
2. Test stores with custom logos (should show custom logo)
3. Test stores without any logo (should show initials on off-white)
4. Test various store name formats:
   - Single word: "Vendly"
   - Two words: "Princess Polly"
   - Three+ words: "MOCO Boutique Store"
   - Special characters: "Woo!&"

## Future Enhancements

1. Consider adding color variations based on store category
2. Add hover effects for interactive avatars
3. Consider lazy loading for avatar images
4. Add accessibility improvements (aria-labels, etc.)
