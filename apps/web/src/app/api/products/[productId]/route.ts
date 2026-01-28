import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/product-service";
import { updateProductSchema } from "@/lib/services/product-models";
import { db } from "@vendly/db/db";
import { tenants } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

type RouteParams = {
    params: Promise<{ productId: string }>;
};

/**
 * GET /api/products/[productId]
 * Get a single product by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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

        const { productId } = await params;
        const product = await productService.getProductWithMedia(productId, tenant.id);

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);

        if (error instanceof Error && error.message === "Product not found") {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

/**
 * PATCH /api/products/[productId]
 * Update a product
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

        const { productId } = await params;
        const body = await request.json();
        const input = updateProductSchema.parse(body);

        const updated = await productService.updateProduct(productId, tenant.id, input);
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating product:", error);

        if (error instanceof Error && error.message === "Product not found") {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

/**
 * DELETE /api/products/[productId]
 * Delete a product
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

        const { productId } = await params;
        await productService.deleteProduct(productId, tenant.id, tenant.slug);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);

        if (error instanceof Error && error.message === "Product not found") {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
