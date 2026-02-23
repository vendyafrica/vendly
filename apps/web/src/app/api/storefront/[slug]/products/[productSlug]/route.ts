import { NextRequest, NextResponse } from "next/server";
import { storefrontService } from "@/lib/services/storefront-service";

type RouteParams = {
    params: Promise<{ slug: string; productSlug: string }>;
};

type ProductMedia = {
    media?: { url?: string | null; blobUrl?: string | null; contentType?: string | null } | null;
};

type StorefrontProduct = {
    id: string;
    slug: string | null;
    productName: string;
    description: string | null;
    priceAmount: unknown;
    currency: string;
    media?: ProductMedia[];
    styleGuideEnabled?: boolean | null;
    styleGuideType?: string | null;
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

        const product = await storefrontService.getStoreProductBySlug(store.id, productSlug) as StorefrontProduct | undefined;

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: product.id,
            slug: product.slug || product.productName.toLowerCase().replace(/\s+/g, "-"),
            name: product.productName,
            description: product.description,
            price: Number(product.priceAmount || 0),
            currency: product.currency,
            styleGuideEnabled: Boolean(product.styleGuideEnabled),
            styleGuideType: product.styleGuideType ?? "clothes",
            images: (product.media ?? [])
                .map((m) => m.media?.url ?? m.media?.blobUrl ?? null)
                .filter(Boolean),
            mediaItems: (product.media ?? [])
                .map((m) => ({
                    url: m.media?.url ?? m.media?.blobUrl ?? null,
                    contentType: m.media?.contentType ?? null,
                }))
                .filter((m) => Boolean(m.url)),
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
