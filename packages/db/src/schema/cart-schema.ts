import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    index,
    unique,
} from "drizzle-orm/pg-core";

import { users } from "./auth-schema";
import { stores } from "./storefront-schema";
import { products, productVariants } from "./product-schema";
import { cartStatus } from "../enums/cart-enums";

/**
 * Carts
 * User shopping carts - can contain items from multiple stores
 */
export const carts = pgTable(
    "carts",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: text("user_id")
            .references(() => users.id, { onDelete: "cascade" }),

        // For guest checkouts
        sessionId: text("session_id"),
        guestEmail: text("guest_email"),

        currency: text("currency").notNull().default("KES"),
        status: cartStatus("status").notNull().default("active"),

        // Converted to order
        convertedToOrderAt: timestamp("converted_to_order_at"),

        // Expiry for abandoned carts
        expiresAt: timestamp("expires_at"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("carts_user_idx").on(table.userId),
        index("carts_session_idx").on(table.sessionId),
        index("carts_status_idx").on(table.status),
        index("carts_expires_at_idx").on(table.expiresAt),
    ]
);

/**
 * Cart Items
 * Individual products in cart - store-aware for multi-store checkout
 */
export const cartItems = pgTable(
    "cart_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        cartId: uuid("cart_id")
            .notNull()
            .references(() => carts.id, { onDelete: "cascade" }),

        // Store reference - critical for multi-store checkout
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),

        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "restrict" }),
        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "restrict" }),

        quantity: integer("quantity").notNull().default(1),

        // Price snapshot (in case price changes)
        priceAtAdd: integer("price_at_add").notNull(),
        currency: text("currency").notNull().default("KES"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("cart_items_cart_variant_unique").on(table.cartId, table.variantId),
        index("cart_items_cart_idx").on(table.cartId),
        index("cart_items_store_idx").on(table.storeId),
        index("cart_items_variant_idx").on(table.variantId),
        index("cart_items_cart_store_idx").on(table.cartId, table.storeId),
    ]
);

/**
 * Saved Items (Wishlist)
 * Products users want to buy later
 */
export const savedItems = pgTable(
    "saved_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),

        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "cascade" }),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        unique("saved_items_user_variant_unique").on(table.userId, table.variantId),
        index("saved_items_user_idx").on(table.userId),
        index("saved_items_store_idx").on(table.storeId),
        index("saved_items_product_idx").on(table.productId),
    ]
);

// Relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(users, {
        fields: [carts.userId],
        references: [users.id],
    }),
    items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    store: one(stores, {
        fields: [cartItems.storeId],
        references: [stores.id],
    }),
    product: one(products, {
        fields: [cartItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [cartItems.variantId],
        references: [productVariants.id],
    }),
}));

export const savedItemsRelations = relations(savedItems, ({ one }) => ({
    user: one(users, {
        fields: [savedItems.userId],
        references: [users.id],
    }),
    store: one(stores, {
        fields: [savedItems.storeId],
        references: [stores.id],
    }),
    product: one(products, {
        fields: [savedItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [savedItems.variantId],
        references: [productVariants.id],
    }),
}));

// Type exports
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;

export type SavedItem = typeof savedItems.$inferSelect;
export type NewSavedItem = typeof savedItems.$inferInsert;