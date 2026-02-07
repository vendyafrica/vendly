import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/product-service";
import { db } from "@vendly/db/db";
import { stores, tenantMemberships } from "@vendly/db/schema";
import { eq, and, isNull } from "@vendly/db";
import { z } from "zod";

const bulkCreateSchema = z.object({
    storeId: z.string(),
    items: z.array(z.object({
        url: z.string().url(),
        pathname: z.string(),
        contentType: z.string(),
        filename: z.string(),
    })),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const membership = await db.query.tenantMemberships.findFirst({
            where: eq(tenantMemberships.userId, session.user.id),
            with: { tenant: true }
        });

        if (!membership || !membership.tenant) {
            return NextResponse.json({ error: "No tenant found" }, { status: 404 });
        }

        const body = await request.json();
        const { storeId, items } = bulkCreateSchema.parse(body);

        const store = await db.query.stores.findFirst({
            where: and(eq(stores.id, storeId), eq(stores.tenantId, membership.tenantId), isNull(stores.deletedAt)),
            columns: { defaultCurrency: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        // Helper to generate a unique draft slug
        const generateDraftSlug = () => {
            const timestamp = Date.now().toString(36); // base36 timestamp
            const shortId = Math.random().toString(36).substring(2, 8); // 6-char random
            return `draft-${timestamp}-${shortId}`;
        };

        // Process sequentially or in parallel? Parallel is fine for DB inserts usually.
        const createdProducts = await Promise.all(items.map(async (item) => {
            // Dummy title for bulk-upload drafts
            const title = "Draft";

            return productService.createProduct(
                membership.tenantId,
                membership.tenant.slug,
                {
                    storeId,
                    title,
                    description: "", // Empty for now, user can edit later
                    priceAmount: 0,
                    currency: store.defaultCurrency || "UGX",
                    status: "draft",
                    source: "bulk-upload",
                    slug: generateDraftSlug(), // Guaranteed-unique slug
                },
                [], // No "files" to upload, we pass media directly
            ).then(async (product) => {
                // Attach media
                await productService.attachMediaUrls(
                    membership.tenantId,
                    product.id,
                    [{ url: item.url, pathname: item.pathname, contentType: item.contentType }]
                );
                return product;
            });
        }));

        return NextResponse.json({ count: createdProducts.length, products: createdProducts });
    } catch (error) {
        console.error("Bulk create failed:", error);
        return NextResponse.json({ error: "Bulk create failed" }, { status: 500 });
    }
}
