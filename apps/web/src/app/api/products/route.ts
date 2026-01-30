import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/product-service";
import { productQuerySchema, createProductSchema } from "@/lib/services/product-models";
import { db } from "@vendly/db/db";
import { tenants, tenantMemberships } from "@vendly/db/schema";
import { eq } from "@vendly/db";

/**
 * GET /api/products
 * List products for the authenticated seller
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const membership = await db.query.tenantMemberships.findFirst({
            where: eq(tenantMemberships.userId, session.user.id),
        });

        if (!membership) {
            return NextResponse.json({ error: "No tenant found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const filters = productQuerySchema.parse({
            storeId: searchParams.get("storeId") || undefined,
            source: searchParams.get("source") || undefined,
            isFeatured: searchParams.get("isFeatured") || undefined,
            page: searchParams.get("page") || 1,
            limit: searchParams.get("limit") || 20,
            search: searchParams.get("search") || undefined,
        });

        const result = await productService.listProducts(membership.tenantId, filters);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error listing products:", error);
        return NextResponse.json({ error: "Failed to list products" }, { status: 500 });
    }
}

/**
 * POST /api/products
 * Create a new product (form data with optional files)
 */
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

        // Check if it's multipart form data or JSON
        const contentType = request.headers.get("content-type") || "";

        let input: any;
        let files: any[] = [];

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            input = createProductSchema.parse({
                storeId: formData.get("storeId"),
                title: formData.get("title"),
                description: formData.get("description") || undefined,
                priceAmount: Number(formData.get("priceAmount")) || 0,
                currency: formData.get("currency") || "KES",
                isFeatured: formData.get("isFeatured") === "true",
            });

            // Get files
            const fileEntries = formData.getAll("files");
            for (const entry of fileEntries) {
                if (entry instanceof File) {
                    const buffer = Buffer.from(await entry.arrayBuffer());
                    files.push({
                        buffer,
                        originalname: entry.name,
                        mimetype: entry.type,
                    });
                }
            }
        } else {
            const body = await request.json();
            input = createProductSchema.parse(body);
        }

        const product = await productService.createProduct(
            membership.tenantId,
            membership.tenant.slug,
            input,
            files
        );

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
