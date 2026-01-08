# Category Pages - Mock API Implementation

## Current State

The category pages (`/category/[category]`) are currently using **mock API calls** with skeleton loading states.

## Files Involved

### Mock Implementation
- `hooks/useMockCategoryStores.ts` - Mock hook with simulated API delay
- `app/(platform)/category/[category]/page.tsx` - Category page using mock data

### Real API (Ready for Implementation)
- `app/api/stores/[category]/route.ts` - Real API endpoint (already created)
- `hooks/useCategoryStores.ts` - Real API hook (already created)

## How to Switch to Real API

### Step 1: Update the Category Page

Replace the import in `app/(platform)/category/[category]/page.tsx`:

```tsx
// Replace this:
import { useMockCategoryStores } from "@/hooks/useMockCategoryStores";

// With this:
import { useCategoryStores } from "@/hooks/useCategoryStores";
```

### Step 2: Update the Hook Usage

Replace the hook call in the same file:

```tsx
// Replace this:
const { stores, loading, error } = useMockCategoryStores(category);

// With this:
const { stores, loading, error } = useCategoryStores(category);
```

### Step 3: Remove Mock Files (Optional)

Delete these files if no longer needed:
- `hooks/useMockCategoryStores.ts`

## What the Mock Does

- **Simulates 1.5s API delay** for testing loading states
- **Returns 3 mock stores** per category
- **Uses placeholder images** from `/api/placeholder/`
- **Handles error states** and loading states

## What the Real API Does

- **Fetches from `/api/stores/[category]`** endpoint
- **Returns actual store data** from your database
- **Filters stores by category** server-side
- **Includes proper error handling**

## Testing the Loading States

1. **Visit any category page**: `/category/women`, `/category/men`, etc.
2. **You'll see skeleton UI** for 1.5 seconds
3. **Then mock stores appear** with proper layout

## Adding the New "Accessories" Category

The new category is already configured:
- ✅ Added to `categories` array in `constants/stores.ts`
- ✅ Updated `Store` type to include "Accessories"
- ✅ Works with both mock and real API

Visit `/category/accessories` to test the new category page.

## Next Steps

When you're ready to implement real data:

1. **Connect your database** to the API endpoint
2. **Replace mock hook** with real hook
3. **Test with real data**
4. **Remove mock files** (optional)

The skeleton loading states will work seamlessly with real data!
