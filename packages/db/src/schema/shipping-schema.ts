// import { relations } from "drizzle-orm";
// import {
//     pgTable,
//     text,
//     timestamp,
//     uuid,
//     integer,
//     boolean,
//     index,
//     primaryKey,
//     jsonb,
//     numeric,
// } from "drizzle-orm/pg-core";

// import { tenants } from "./tenant-schema";
// import { stores } from "./storefront-schema";
// import { orders, orderItems } from "./order-schema";
// import { users } from "./auth-schema";
// import { shipmentStatus } from "../enums/shipping-enums";

// /**
//  * Shipping Methods
//  * Available shipping options for each store
//  */
// export const shippingMethods = pgTable(
//     "shipping_methods",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         storeId: uuid("store_id")
//             .notNull()
//             .references(() => stores.id, { onDelete: "cascade" }),
        
//         name: text("name").notNull(), // "Standard Shipping", "Express", "Same Day"
//         description: text("description"),
        
//         // Carrier info
//         carrier: text("carrier"), // "DHL", "UPS", "FedEx", "Local Courier"
//         carrierCode: text("carrier_code"), // For API integration
        
//         // Pricing
//         priceAmount: integer("price_amount").notNull().default(0),
//         currency: text("currency").notNull().default("KES"),
//         freeShippingThreshold: integer("free_shipping_threshold"), // Free shipping above this amount
        
//         // Delivery estimates
//         minDeliveryDays: integer("min_delivery_days"),
//         maxDeliveryDays: integer("max_delivery_days"),
        
//         // Regional availability
//         availableRegions: jsonb("available_regions"), // ["Nairobi", "Mombasa", "Kisumu"]
        
//         isActive: boolean("is_active").notNull().default(true),
//         sortOrder: integer("sort_order").default(0),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         index("shipping_methods_tenant_idx").on(table.tenantId),
//         index("shipping_methods_store_idx").on(table.storeId),
//         index("shipping_methods_active_idx").on(table.isActive),
//     ]
// );

// /**
//  * Shipments
//  * Tracking shipments for orders
//  */
// export const shipments = pgTable(
//     "shipments",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         storeId: uuid("store_id")
//             .notNull()
//             .references(() => stores.id, { onDelete: "cascade" }),
//         orderId: uuid("order_id")
//             .notNull()
//             .references(() => orders.id, { onDelete: "cascade" }),
//         shippingMethodId: uuid("shipping_method_id")
//             .references(() => shippingMethods.id, { onDelete: "set null" }),
        
//         shipmentNumber: text("shipment_number").notNull(),
        
//         status: shipmentStatus("status").notNull().default("pending"),
        
//         // Carrier tracking
//         carrier: text("carrier"), // Carrier name at time of shipment
//         trackingNumber: text("tracking_number"),
//         trackingUrl: text("tracking_url"),
        
//         // Shipping details
//         weight: numeric("weight", { precision: 10, scale: 2 }), // in kg
//         dimensions: jsonb("dimensions"), // { length, width, height }
        
//         // Costs
//         shippingCost: integer("shipping_cost").default(0),
//         insuranceCost: integer("insurance_cost").default(0),
//         currency: text("currency").default("KES"),
        
//         // Addresses (snapshot at time of shipment)
//         fromAddress: jsonb("from_address"), // Store/warehouse address
//         toAddress: jsonb("to_address"), // Customer address
        
//         // Timestamps
//         labelCreatedAt: timestamp("label_created_at"),
//         pickedUpAt: timestamp("picked_up_at"),
//         inTransitAt: timestamp("in_transit_at"),
//         outForDeliveryAt: timestamp("out_for_delivery_at"),
//         deliveredAt: timestamp("delivered_at"),
//         cancelledAt: timestamp("cancelled_at"),
        
//         // Delivery info
//         deliveredToName: text("delivered_to_name"),
//         deliverySignature: text("delivery_signature"), // URL to signature image
//         deliveryNotes: text("delivery_notes"),
        
//         // Carrier integration
//         carrierShipmentId: text("carrier_shipment_id"), // External carrier reference
//         carrierLabelUrl: text("carrier_label_url"), // Shipping label PDF
//         carrierMetadata: jsonb("carrier_metadata"), // Additional carrier data
        
//         // Internal tracking
//         createdByUserId: text("created_by_user_id")
//             .references(() => users.id, { onDelete: "set null" }),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         index("shipments_tenant_idx").on(table.tenantId),
//         index("shipments_store_idx").on(table.storeId),
//         index("shipments_order_idx").on(table.orderId),
//         index("shipments_status_idx").on(table.status),
//         index("shipments_tracking_number_idx").on(table.trackingNumber),
//         index("shipments_created_at_idx").on(table.createdAt),
//     ]
// );

// /**
//  * Shipment Items
//  * Which order items are included in each shipment
//  */
// export const shipmentItems = pgTable(
//     "shipment_items",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         shipmentId: uuid("shipment_id")
//             .notNull()
//             .references(() => shipments.id, { onDelete: "cascade" }),
//         orderItemId: uuid("order_item_id")
//             .notNull()
//             .references(() => orderItems.id, { onDelete: "cascade" }),
        
//         quantity: integer("quantity").notNull(),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//     },
//     (table) => [
//         index("shipment_items_shipment_idx").on(table.shipmentId),
//         index("shipment_items_order_item_idx").on(table.orderItemId),
//         index("shipment_items_tenant_idx").on(table.tenantId),
//     ]
// );

// /**
//  * Shipment Events
//  * Tracking history and status updates for shipments
//  */
// export const shipmentEvents = pgTable(
//     "shipment_events",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         storeId: uuid("store_id")
//             .notNull()
//             .references(() => stores.id, { onDelete: "cascade" }),
//         shipmentId: uuid("shipment_id")
//             .notNull()
//             .references(() => shipments.id, { onDelete: "cascade" }),
        
//         eventType: text("event_type").notNull(), // 'status_change', 'location_update', 'delivery_attempt', etc.
//         status: shipmentStatus("status"),
        
//         location: text("location"), // City or facility
//         locationDetails: jsonb("location_details"), // Lat/long, address, etc.
        
//         description: text("description"),
//         note: text("note"),
        
//         // Tracking
//         isPublic: boolean("is_public").default(true), // Show to customer?
        
//         // Source
//         source: text("source").default("manual"), // 'manual', 'carrier_webhook', 'carrier_api'
//         carrierEventData: jsonb("carrier_event_data"), // Raw carrier event data
        
//         createdByUserId: text("created_by_user_id")
//             .references(() => users.id, { onDelete: "set null" }),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//     },
//     (table) => [
//         index("shipment_events_shipment_idx").on(table.shipmentId),
//         index("shipment_events_store_idx").on(table.storeId),
//         index("shipment_events_tenant_idx").on(table.tenantId),
//         index("shipment_events_created_at_idx").on(table.createdAt),
//         index("shipment_events_status_idx").on(table.status),
//     ]
// );

// /**
//  * Shipping Zones
//  * Geographic zones for calculating shipping rates
//  */
// export const shippingZones = pgTable(
//     "shipping_zones",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         storeId: uuid("store_id")
//             .notNull()
//             .references(() => stores.id, { onDelete: "cascade" }),
        
//         name: text("name").notNull(), // "Nairobi Metro", "Coast Region"
//         description: text("description"),
        
//         // Zone coverage
//         countries: jsonb("countries"), // ["KE"]
//         regions: jsonb("regions"), // ["Nairobi", "Kiambu"]
//         cities: jsonb("cities"),
//         postalCodes: jsonb("postal_codes"),
        
//         isActive: boolean("is_active").default(true),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         index("shipping_zones_tenant_idx").on(table.tenantId),
//         index("shipping_zones_store_idx").on(table.storeId),
//         index("shipping_zones_active_idx").on(table.isActive),
//     ]
// );

// /**
//  * Shipping Zone Rates
//  * Pricing rules for shipping zones
//  */
// export const shippingZoneRates = pgTable(
//     "shipping_zone_rates",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         shippingZoneId: uuid("shipping_zone_id")
//             .notNull()
//             .references(() => shippingZones.id, { onDelete: "cascade" }),
//         shippingMethodId: uuid("shipping_method_id")
//             .notNull()
//             .references(() => shippingMethods.id, { onDelete: "cascade" }),
        
//         // Rate calculation
//         rateType: text("rate_type").notNull(), // 'flat', 'per_weight', 'per_item'
//         baseRate: integer("base_rate").notNull(),
//         perWeightRate: integer("per_weight_rate"), // Additional per kg
//         perItemRate: integer("per_item_rate"), // Additional per item
        
//         // Conditions
//         minOrderAmount: integer("min_order_amount"),
//         maxOrderAmount: integer("max_order_amount"),
//         minWeight: numeric("min_weight", { precision: 10, scale: 2 }),
//         maxWeight: numeric("max_weight", { precision: 10, scale: 2 }),
        
//         currency: text("currency").default("KES"),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         index("shipping_zone_rates_zone_idx").on(table.shippingZoneId),
//         index("shipping_zone_rates_method_idx").on(table.shippingMethodId),
//         index("shipping_zone_rates_tenant_idx").on(table.tenantId),
//     ]
// );

// // Relations
// export const shippingMethodsRelations = relations(shippingMethods, ({ one, many }) => ({
//     tenant: one(tenants, {
//         fields: [shippingMethods.tenantId],
//         references: [tenants.id],
//     }),
//     store: one(stores, {
//         fields: [shippingMethods.storeId],
//         references: [stores.id],
//     }),
//     shipments: many(shipments),
//     zoneRates: many(shippingZoneRates),
// }));

// export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
//     tenant: one(tenants, {
//         fields: [shipments.tenantId],
//         references: [tenants.id],
//     }),
//     store: one(stores, {
//         fields: [shipments.storeId],
//         references: [stores.id],
//     }),
//     order: one(orders, {
//         fields: [shipments.orderId],
//         references: [orders.id],
//     }),
//     shippingMethod: one(shippingMethods, {
//         fields: [shipments.shippingMethodId],
//         references: [shippingMethods.id],
//     }),
//     createdBy: one(users, {
//         fields: [shipments.createdByUserId],
//         references: [users.id],
//     }),
//     items: many(shipmentItems),
//     events: many(shipmentEvents),
// }));

// export const shipmentItemsRelations = relations(shipmentItems, ({ one }) => ({
//     tenant: one(tenants, {
//         fields: [shipmentItems.tenantId],
//         references: [tenants.id],
//     }),
//     shipment: one(shipments, {
//         fields: [shipmentItems.shipmentId],
//         references: [shipments.id],
//     }),
//     orderItem: one(orderItems, {
//         fields: [shipmentItems.orderItemId],
//         references: [orderItems.id],
//     }),
// }));

// export const shipmentEventsRelations = relations(shipmentEvents, ({ one }) => ({
//     tenant: one(tenants, {
//         fields: [shipmentEvents.tenantId],
//         references: [tenants.id],
//     }),
//     store: one(stores, {
//         fields: [shipmentEvents.storeId],
//         references: [stores.id],
//     }),
//     shipment: one(shipments, {
//         fields: [shipmentEvents.shipmentId],
//         references: [shipments.id],
//     }),
//     createdBy: one(users, {
//         fields: [shipmentEvents.createdByUserId],
//         references: [users.id],
//     }),
// }));

// export const shippingZonesRelations = relations(shippingZones, ({ one, many }) => ({
//     tenant: one(tenants, {
//         fields: [shippingZones.tenantId],
//         references: [tenants.id],
//     }),
//     store: one(stores, {
//         fields: [shippingZones.storeId],
//         references: [stores.id],
//     }),
//     rates: many(shippingZoneRates),
// }));

// export const shippingZoneRatesRelations = relations(shippingZoneRates, ({ one }) => ({
//     tenant: one(tenants, {
//         fields: [shippingZoneRates.tenantId],
//         references: [tenants.id],
//     }),
//     zone: one(shippingZones, {
//         fields: [shippingZoneRates.shippingZoneId],
//         references: [shippingZones.id],
//     }),
//     method: one(shippingMethods, {
//         fields: [shippingZoneRates.shippingMethodId],
//         references: [shippingMethods.id],
//     }),
// }));

// // Type exports
// export type ShippingMethod = typeof shippingMethods.$inferSelect;
// export type NewShippingMethod = typeof shippingMethods.$inferInsert;

// export type Shipment = typeof shipments.$inferSelect;
// export type NewShipment = typeof shipments.$inferInsert;

// export type ShipmentItem = typeof shipmentItems.$inferSelect;
// export type NewShipmentItem = typeof shipmentItems.$inferInsert;

// export type ShipmentEvent = typeof shipmentEvents.$inferSelect;
// export type NewShipmentEvent = typeof shipmentEvents.$inferInsert;

// export type ShippingZone = typeof shippingZones.$inferSelect;
// export type NewShippingZone = typeof shippingZones.$inferInsert;

// export type ShippingZoneRate = typeof shippingZoneRates.$inferSelect;
// export type NewShippingZoneRate = typeof shippingZoneRates.$inferInsert;