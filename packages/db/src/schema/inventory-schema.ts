import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    index,
    unique,
    primaryKey,
} from "drizzle-orm/pg-core";

import { tenants, users } from "./core-schema";
import { productVariants } from "./product-schema";
import { inventoryMovementType } from "../enums/inventory-enums";

export const stockLocations = pgTable(
    "stock_locations",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("stock_locations_tenant_name_unique").on(table.tenantId, table.name),
        index("stock_locations_tenant_idx").on(table.tenantId),
    ],
);

export const inventoryLevels = pgTable(
    "inventory_levels",
    {
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        variantId: uuid("variant_id")
            .notNull()
            .references(() => productVariants.id, { onDelete: "cascade" }),
        locationId: uuid("location_id")
            .notNull()
            .references(() => stockLocations.id, { onDelete: "cascade" }),
        onHand: integer("on_hand").notNull().default(0),
        reserved: integer("reserved").notNull().default(0),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.tenantId, table.variantId, table.locationId] }),
        index("inventory_levels_variant_idx").on(table.variantId),
        index("inventory_levels_location_idx").on(table.locationId),
    ],
);

export const inventoryMovements = pgTable(
    "inventory_movements",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        variantId: uuid("variant_id")
            .notNull()
            .references(() => productVariants.id, { onDelete: "cascade" }),
        locationId: uuid("location_id").references(() => stockLocations.id, { onDelete: "set null" }),

        type: inventoryMovementType("type").notNull(),
        quantityDelta: integer("quantity_delta").notNull(),

        referenceType: text("reference_type"),
        referenceId: text("reference_id"),

        createdByUserId: text("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("inventory_movements_tenant_idx").on(table.tenantId),
        index("inventory_movements_variant_idx").on(table.variantId),
        index("inventory_movements_created_at_idx").on(table.createdAt),
    ],
);

// Relations
export const stockLocationsRelations = relations(stockLocations, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [stockLocations.tenantId],
        references: [tenants.id],
    }),
    inventoryLevels: many(inventoryLevels),
    inventoryMovements: many(inventoryMovements),
}));

export const inventoryLevelsRelations = relations(inventoryLevels, ({ one }) => ({
    variant: one(productVariants, {
        fields: [inventoryLevels.variantId],
        references: [productVariants.id],
    }),
    location: one(stockLocations, {
        fields: [inventoryLevels.locationId],
        references: [stockLocations.id],
    }),
}));

export const inventoryMovementsRelations = relations(inventoryMovements, ({ one }) => ({
    variant: one(productVariants, {
        fields: [inventoryMovements.variantId],
        references: [productVariants.id],
    }),
    location: one(stockLocations, {
        fields: [inventoryMovements.locationId],
        references: [stockLocations.id],
    }),
    createdBy: one(users, {
        fields: [inventoryMovements.createdByUserId],
        references: [users.id],
    }),
}));

// Types
export type StockLocation = typeof stockLocations.$inferSelect;
