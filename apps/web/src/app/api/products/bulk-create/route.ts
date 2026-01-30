import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/product-service";
import { db } from "@vendly/db/db";
import { tenants, tenantMemberships } from "@vendly/db/schema";
import { eq } from "@vendly/db";
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

        // Process sequentially or in parallel? Parallel is fine for DB inserts usually.
        const createdProducts = await Promise.all(items.map(async (item) => {
            // Generate a title from filename
            const title = productService.generateTitleFromFilename(item.filename);

            return productService.createProduct(
                membership.tenantId,
                membership.tenant.slug,
                {
                    storeId,
                    title,
                    description: "", // Empty for now, user can edit later
                    priceAmount: 0,
                    currency: "KES",
                    status: "draft", // Start as draft
                    isFeatured: false,
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
