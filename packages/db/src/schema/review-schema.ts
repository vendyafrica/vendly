import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    index,
} from "drizzle-orm/pg-core";
import { tenants, users } from "./core-schema";
import { stores } from "./storefront-schema";
import { products } from "./product-schema";

export const reviews = pgTable(
    "reviews",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        userId: text("user_id").references(() => users.id, { onDelete: "set null" }), // Optional for guest reviews if we allow them layer

        rating: integer("rating").notNull(), // 1-5
        comment: text("comment"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("reviews_tenant_idx").on(table.tenantId),
        index("reviews_store_idx").on(table.storeId),
        index("reviews_product_idx").on(table.productId),
    ]
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
    tenant: one(tenants, {
        fields: [reviews.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [reviews.storeId],
        references: [stores.id],
    }),
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
}));

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
