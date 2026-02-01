import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";

export const adminAssets = pgTable(
    "admin_assets",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        key: text("key").notNull().unique(), // e.g., 'site_favicon', 'hero_image'
        url: text("url").notNull(),
        type: text("type").default("image"), // image, icon, video
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("admin_assets_key_idx").on(table.key)]
);

export type AdminAsset = typeof adminAssets.$inferSelect;
export type NewAdminAsset = typeof adminAssets.$inferInsert;
