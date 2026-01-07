
# Instagram Media Feature Implementation Report

This guide documents the implementation of the Instagram Media linking and importing feature.

## 1. Problem
- Instagram media was stored in the database but lacked a direct link to created products (`productId` was missing).
- The `/import` API endpoint referenced non-existent columns (`imageUrl`, `price`, `stock`) instead of `priceAmount`, `inventoryQuantity`, and the separate `productImages` table.
- Users could not easily view or import synced media in the dashboard.

## 2. Solution Implemented

### Database Schema Updates
- **File**: `packages/db/src/schema/storefront-schema.ts`
- **Changes**:
  - Added `productId` column to `instagramMedia` table.
  - Added relations: `stores` <-> `instagramMedia`, `products` <-> `instagramMedia`.
  - Ran `drizzle-kit push` to apply changes.

### API Updates
- **File**: `apps/api/src/routes/instagram.ts`
- **Changes**:
  - Updated `/import` endpoint to use `productImages` table for images.
  - Corrected field mapping:
    - `price` -> `priceAmount` (converted to cents)
    - `stock` -> `inventoryQuantity`
    - `mediaUrl` -> `productImages` entry

### Dashboard UI Updates
- **File**: `apps/admin/src/app/[tenant]/(dashboard)/products/products-client.tsx`
- **Features**:
  - Added **Instagram Media Gallery Dialog**:
    - Displays synced media in a grid.
    - Allows multi-selection.
    - Visual indicators for already-imported posts.
  - **Auto-Open on Sync**: Clicking "Sync Media" now automatically opens the gallery upon success.
  - **Removed Manual Button**: Removed the explicit "View Media" button as per request.

## 3. Workflow
1.  **Connect**: User connects Instagram account.
2.  **Sync**: Click "Sync Media".
    - Backend fetches new media.
    - Frontend automatically opens the Media Gallery Dialog.
3.  **Import**: Select posts and click "Import".
    - Products are created with correct price/stock/images.
    - Media items are marked as imported.
4.  **View**: New products appear in the standard Products table (and Storefront).
