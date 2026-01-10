import { eq, and, desc, sql } from "drizzle-orm";
import { edgeDb } from "../db";
import {
    carts,
    cartItems,
    savedItems,
    type Cart,
    type CartItem,
    type SavedItem
} from "../schema/cart-schema";
import { products, productVariants } from "../schema/product-schema";

export class CartQueries {
    constructor(private db: typeof edgeDb) { }

    /**
     * Get cart by ID
     */
    async getCartById(cartId: string) {
        const [cart] = await this.db
            .select()
            .from(carts)
            .where(eq(carts.id, cartId))
            .limit(1);

        return cart || null;
    }

    /**
     * Get active cart by User ID
     */
    async getActiveCartByUserId(userId: string) {
        const [cart] = await this.db
            .select()
            .from(carts)
            .where(
                and(
                    eq(carts.userId, userId),
                    eq(carts.status, "active")
                )
            )
            .orderBy(desc(carts.createdAt)) // Get most recent if multiple (shouldn't happen with correct logic)
            .limit(1);

        return cart || null;
    }

    /**
     * Get active cart by Session ID (guest)
     */
    async getActiveCartBySessionId(sessionId: string) {
        const [cart] = await this.db
            .select()
            .from(carts)
            .where(
                and(
                    eq(carts.sessionId, sessionId),
                    eq(carts.status, "active")
                )
            )
            .orderBy(desc(carts.createdAt))
            .limit(1);

        return cart || null;
    }

    /**
     * Create new cart
     */
    async createCart(data: {
        userId?: string;
        sessionId?: string;
        currency?: string;
        guestEmail?: string;
    }) {
        const [cart] = await this.db
            .insert(carts)
            .values({
                userId: data.userId,
                sessionId: data.sessionId,
                currency: data.currency || "KES",
                guestEmail: data.guestEmail,
                status: "active"
            })
            .returning();

        return cart;
    }

    /**
     * Get cart items with product details
     */
    async getCartItems(cartId: string) {
        // Need to join with products and variants to get live details
        const items = await this.db
            .select({
                id: cartItems.id,
                cartId: cartItems.cartId,
                productId: cartItems.productId,
                variantId: cartItems.variantId,
                quantity: cartItems.quantity,
                priceAmount: cartItems.priceAtAdd, // Snapshot price
                currency: cartItems.currency, // Snapshot currency
                addedAt: cartItems.createdAt,
                // Product details
                productTitle: products.title,
                productSlug: products.slug,
                storeId: products.storeId, // Important for grouping
                // Variant details
                variantTitle: productVariants.title,
                variantSku: productVariants.sku,
            })
            .from(cartItems)
            .innerJoin(products, eq(cartItems.productId, products.id))
            .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
            .where(eq(cartItems.cartId, cartId))
            .orderBy(desc(cartItems.createdAt));

        return items;
    }

    /**
     * Add item to cart
     */
    async addItemToCart(data: {
        cartId: string;
        productId: string;
        variantId?: string;
        quantity: number;
        priceAmount: number; // Should be verified by service layer
        currency: string;
    }) {
        // Check if item exists to update quantity instead
        const existingConditions = [
            eq(cartItems.cartId, data.cartId),
            eq(cartItems.productId, data.productId)
        ];

        if (data.variantId) {
            existingConditions.push(eq(cartItems.variantId, data.variantId));
        } else {
            // Explicitly verify null variantId if not provided, to differentiate
            existingConditions.push(sql`${cartItems.variantId} IS NULL`);
        }

        const [existing] = await this.db
            .select()
            .from(cartItems)
            .where(and(...existingConditions))
            .limit(1);

        if (existing) {
            const [updated] = await this.db
                .update(cartItems)
                .set({
                    quantity: existing.quantity + data.quantity,
                    priceAtAdd: data.priceAmount
                })
                .where(eq(cartItems.id, existing.id))
                .returning();
            return updated;
        }

        // Fetch storeId from product
        const [product] = await this.db
            .select({ storeId: products.storeId })
            .from(products)
            .where(eq(products.id, data.productId))
            .limit(1);

        if (!product) throw new Error("Product not found");

        const [item] = await this.db
            .insert(cartItems)
            .values({
                cartId: data.cartId,
                productId: data.productId,
                storeId: product.storeId,
                variantId: data.variantId,
                quantity: data.quantity,
                priceAtAdd: data.priceAmount,
                currency: data.currency
            })
            .returning();

        return item;
    }

    /**
     * Update cart item quantity
     */
    async updateItemQuantity(itemId: string, quantity: number) {
        if (quantity <= 0) {
            return this.removeItem(itemId);
        }

        const [updated] = await this.db
            .update(cartItems)
            .set({ quantity })
            .where(eq(cartItems.id, itemId))
            .returning();

        return updated;
    }

    /**
     * Remove item from cart
     */
    async removeItem(itemId: string) {
        const [deleted] = await this.db
            .delete(cartItems)
            .where(eq(cartItems.id, itemId))
            .returning();

        return deleted;
    }

    /**
     * Clear all items from cart
     */
    async clearCart(cartId: string) {
        await this.db
            .delete(cartItems)
            .where(eq(cartItems.cartId, cartId));
    }

    /**
     * Archive cart (e.g. after checkout)
     */
    async archiveCart(cartId: string) {
        const [updated] = await this.db
            .update(carts)
            .set({
                status: "converted",
                convertedToOrderAt: new Date()
            })
            .where(eq(carts.id, cartId))
            .returning();

        return updated;
    }

    /**
     * Merge guest cart into user cart
     */
    async mergeCarts(guestCartId: string, userCartId: string) {
        // Move all items from guest cart to user cart
        // This is complex because of duplicates. 
        // For simplicity, we just update the cartId of items where no collision.
        // But for collision we must sum up.
        // It's safer to read guest items and "add" them to user cart using addItem logic.

        const guestItems = await this.db
            .select()
            .from(cartItems)
            .where(eq(cartItems.cartId, guestCartId));

        for (const item of guestItems) {
            await this.addItemToCart({
                cartId: userCartId,
                productId: item.productId,
                variantId: item.variantId || undefined,
                quantity: item.quantity,
                priceAmount: item.priceAtAdd,
                currency: item.currency
            });
        }

        // Delete/Archive guest cart
        await this.db
            .update(carts)
            .set({ status: "merged" })
            .where(eq(carts.id, guestCartId));
    }
}

export function createCartQueries(db: typeof edgeDb) {
    return new CartQueries(db);
}
