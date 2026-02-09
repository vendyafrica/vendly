import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getTenantMembership } from "@/lib/services/tenant-membership";
import { db } from "@vendly/db/db";
import { products } from "@vendly/db/schema";
import { eq, inArray, and } from "@vendly/db";
import { z } from "zod";

const bulkUpdateSchema = z.object({
    ids: z.array(z.string()),
    action: z.enum(["publish", "archive", "delete"]),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const membership = await getTenantMembership(session.user.id);

        if (!membership) {
            return NextResponse.json({ error: "No tenant found" }, { status: 404 });
        }

        const body = await request.json();
        const { ids, action } = bulkUpdateSchema.parse(body);

        if (ids.length === 0) {
            return NextResponse.json({ count: 0 });
        }

        if (action === "publish") {
            await db.update(products)
                .set({ status: "active", updatedAt: new Date() })
                .where(and(
                    inArray(products.id, ids),
                    eq(products.tenantId, membership.tenantId)
                ));
        } else if (action === "archive") {
            // Assuming we have an archive status? Or draft? Schema says: "draft", "ready", "active", "sold-out"
            // Let's use "draft" for now as archive equivalent or "sold-out" if specifically requested.
            // But typical "archive" usually means "draft" or soft delete.
            // Let's assume publish -> active.
            // For now only publish is requested.
            return NextResponse.json({ error: "Action not implemented" }, { status: 400 });
        } else if (action === "delete") {
            await db.update(products)
                .set({ deletedAt: new Date(), updatedAt: new Date() })
                .where(and(
                    inArray(products.id, ids),
                    eq(products.tenantId, membership.tenantId)
                ));
        }

        return NextResponse.json({ success: true, count: ids.length });
    } catch (error) {
        console.error("Bulk update failed:", error);
        return NextResponse.json({ error: "Bulk update failed" }, { status: 500 });
    }
}
