import { NextRequest, NextResponse } from "next/server";
import { storefrontService } from "@/lib/services/storefront-service";

type RouteParams = {
    params: Promise<{ slug: string }>;
};

/**
 * GET /api/storefront/[slug]/products
 * Returns store products list
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const store = await storefrontService.findStoreBySlug(slug);

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const productList = await storefrontService.getStoreProducts(store.id);

        return NextResponse.json(
            productList.map((p: any) => ({
                id: p.id,
                slug: p.productName.toLowerCase().replace(/\s+/g, "-"),
                name: p.productName,
                price: p.priceAmount,
                currency: p.currency,
                image: p.media?.[0]?.media?.blobUrl ?? null,
                rating: 0,
            }))
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
