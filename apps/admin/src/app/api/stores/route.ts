import { NextResponse } from "next/server";
import { adminService } from "@/lib/services/admin-service";

/**
 * GET /api/stores
 * Get all stores (super-admin only)
 */
export async function GET() {
    try {
        // TODO: Add super-admin auth check
        const result = await adminService.getAllStores();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching stores:", error);
        return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
    }
}
