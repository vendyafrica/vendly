import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/lib/services/cart-service";

/**
 * GET /api/cart
 * Fetch the current user's cart
 */
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { items } = await cartService.getUserCart(session.user.id);

        // Format for frontend
        const formattedItems = items.map((item: any) => ({
            id: item.productId,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.productName,
                price: item.product.priceAmount,
                currency: item.product.currency,
                image: item.product.media?.[0]?.media?.blobUrl ?? null,
                slug: item.product.productName.toLowerCase().replace(/\s+/g, "-"),
            },
            store: {
                id: item.product.store?.id,
                name: item.product.store?.name,
                slug: item.product.store?.slug,
            }
        }));

        return NextResponse.json(formattedItems);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}

/**
 * POST /api/cart
 * Add or update an item in the cart
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, storeId, quantity } = await request.json();

        if (!productId || !storeId || quantity === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updated = await cartService.upsertItem(session.user.id, productId, storeId, quantity);
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }
}

/**
 * DELETE /api/cart
 * Clear the cart (optionally for a specific store)
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get("storeId") ?? undefined;

        await cartService.clearCart(session.user.id, storeId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
    }
}
