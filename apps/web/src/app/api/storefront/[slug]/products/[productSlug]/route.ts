import { NextRequest, NextResponse } from "next/server";
import { storefrontService } from "@/lib/services/storefront-service";

type RouteParams = {
    params: Promise<{ slug: string; productSlug: string }>;
};

/**
 * GET /api/storefront/[slug]/products/[productSlug]
 * Returns a single product by slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug, productSlug } = await params;
        const store = await storefrontService.findStoreBySlug(slug);

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const product = await storefrontService.getStoreProductBySlug(store.id, productSlug);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: product.id,
            slug: product.productName.toLowerCase().replace(/\s+/g, "-"),
            name: product.productName,
            description: product.description,
            price: product.priceAmount,
            currency: product.currency,
            images: product.media.map((m: any) => m.media?.blobUrl ?? null).filter(Boolean),
            rating: 0,
            store: {
                id: store.id,
                name: store.name,
                slug: store.slug,
            },
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}
