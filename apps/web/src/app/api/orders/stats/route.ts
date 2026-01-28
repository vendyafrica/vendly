import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/order-service";
import { db } from "@vendly/db/db";
import { tenants } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/orders/stats
 * Get order statistics for the authenticated seller
 */
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.userId, session.user.id),
        });

        if (!tenant) {
            return NextResponse.json({ error: "No tenant found" }, { status: 404 });
        }

        const stats = await orderService.getOrderStats(tenant.id);
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching order stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
