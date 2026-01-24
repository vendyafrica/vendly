import { Request, Response } from "express";
import { cartService } from "./cart-service";

/**
 * GET /api/cart
 */
export async function getCart(req: Request, res: Response) {
    try {
        const userId = req.headers["x-user-id"] as string; // Ideally from auth middleware
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { items } = await cartService.getUserCart(userId);

        // Format for frontend
        const formattedItems = items.map((item: any) => ({
            id: item.productId, // Frontend uses product ID as item ID typically, or we can map logic
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.productName,
                price: item.product.priceAmount,
                currency: item.product.currency,
                image: item.product.media[0]?.media?.blobUrl,
                slug: item.product.productName.toLowerCase().replace(/\s+/g, "-"), // Simple slug gen, ideally from DB
            },
            store: {
                id: item.product.store.id,
                name: item.product.store.name,
                slug: item.product.store.slug,
            }
        }));

        return res.json(formattedItems);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ error: "Failed to fetch cart" });
    }
}

/**
 * POST /api/cart/items
 */
export async function updateCartItem(req: Request, res: Response) {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { productId, storeId, quantity } = req.body;

        if (!productId || !storeId || quantity === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const updated = await cartService.upsertItem(userId, productId, storeId, quantity);
        return res.json(updated);
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ error: "Failed to update cart" });
    }
}

/**
 * DELETE /api/cart/items/:productId
 */
export async function removeCartItem(req: Request, res: Response) {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { productId } = req.params;
        await cartService.removeItem(userId, productId);
        return res.json({ success: true });
    } catch (error) {
        console.error("Error removing item:", error);
        return res.status(500).json({ error: "Failed to remove item" });
    }
}

/**
 * DELETE /api/cart
 * Query param: storeId (optional)
 */
export async function clearCart(req: Request, res: Response) {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const storeId = req.query.storeId as string | undefined;
        await cartService.clearCart(userId, storeId);
        return res.json({ success: true });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({ error: "Failed to clear cart" });
    }
}
