import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { sellers } from "./sellers/seller.schema";
import { stores } from "./stores/store.schema";

export const activityLogs = pgTable("activity_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => sellers.id, { onDelete: "cascade" }),
    storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }),
    action: text("action").notNull(), // 'login', 'store_created', 'product_added', etc
    details: jsonb("details"), // Additional context
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
    seller: one(sellers, { fields: [activityLogs.sellerId], references: [sellers.id] }),
    store: one(stores, { fields: [activityLogs.storeId], references: [stores.id] }),
}));