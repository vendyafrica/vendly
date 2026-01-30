import { NextResponse } from "next/server";
import { marketplaceService } from "@/lib/services/marketplace-service";

/**
 * GET /api/marketplace/stores
 * Get all active stores with their categories
 */
export async function GET() {
    try {
        const stores = await marketplaceService.getAllStores();
        const storesByCategory = await marketplaceService.getStoresByCategory();

        return NextResponse.json({
            stores,
            storesByCategory,
        });
    } catch (error) {
        console.error("Error fetching marketplace stores:", error);
        return NextResponse.json(
            { error: "Failed to fetch stores" },
            { status: 500 }
        );
    }
}
