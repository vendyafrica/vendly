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
import { products } from "./product-schema";
import { mediaObjects } from "./media-schema";

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

        mediaId: uuid("media_id")
            .references(() => mediaObjects.id, { onDelete: "set null" }),

        caption: text("caption"),
        
        tone: text("tone").notNull(),
        stylePrompt: text("style_prompt"),

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

export type ContentVariant = typeof contentVariants.$inferSelect;
export type NewContentVariant = typeof contentVariants.$inferInsert;
