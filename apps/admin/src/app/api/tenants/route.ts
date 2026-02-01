import { NextResponse } from "next/server";
import { adminService } from "@/lib/services/admin-service";

/**
 * GET /api/tenants
 * Get all tenants (super-admin only)
 */
export async function GET() {
    try {
        // TODO: Add super-admin auth check
        const result = await adminService.getAllTenants();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching tenants:", error);
        return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 });
    }
}
