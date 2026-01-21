import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    boolean,
    index,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { products, mediaObjects } from "./product-schema";

/**
 * Content Variants - AI-generated content representations of products
 * These are NOT SKU variants (size/color). They represent different
 * visual/content styles of the same product for storefront display.
 */
export const contentVariants = pgTable(
    "content_variants",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),

        // Link to the generated image stored in blob
        mediaId: uuid("media_id")
            .references(() => mediaObjects.id, { onDelete: "set null" }),

        // AI-generated content
        caption: text("caption"),

        // Variant metadata
        tone: text("tone").notNull(), // 'minimal', 'bold', 'lifestyle', 'editorial'
        stylePrompt: text("style_prompt"), // The prompt used to generate

        // Status
        isActive: boolean("is_active").default(true).notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("content_variants_tenant_idx").on(table.tenantId),
        index("content_variants_product_idx").on(table.productId),
        index("content_variants_tone_idx").on(table.tone),
    ]
);

// Relations
export const contentVariantsRelations = relations(contentVariants, ({ one }) => ({
    tenant: one(tenants, {
        fields: [contentVariants.tenantId],
        references: [tenants.id],
    }),
    product: one(products, {
        fields: [contentVariants.productId],
        references: [products.id],
    }),
    media: one(mediaObjects, {
        fields: [contentVariants.mediaId],
        references: [mediaObjects.id],
    }),
}));

// Type exports
export type ContentVariant = typeof contentVariants.$inferSelect;
export type NewContentVariant = typeof contentVariants.$inferInsert;
