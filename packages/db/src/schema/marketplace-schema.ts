import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  index,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const tenantRole = pgEnum("tenant_role", ["owner", "admin", "member"]);
export const storeRole = pgEnum("store_role", [
  "store_owner",
  "manager",
  "seller",
  "viewer",
]);
export const storeStatus = pgEnum("store_status", ["active", "suspended", "draft"]);
export const productStatus = pgEnum("product_status", ["active", "archived", "draft"]);
export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);
export const addressType = pgEnum("address_type", ["shipping", "billing"]);
export const paymentProvider = pgEnum("payment_provider", [
  "paystack",
  "flutterwave",
  "stripe",
  "manual",
]);
export const paymentStatus = pgEnum("payment_status", [
  "initiated",
  "authorized",
  "captured",
  "failed",
  "refunded",
]);
export const fulfillmentStatus = pgEnum("fulfillment_status", [
  "pending",
  "packed",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
]);

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [unique("tenants_slug_unique").on(table.slug)],
);

export const tenantMemberships = pgTable(
  "tenant_memberships",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: tenantRole("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("tenant_memberships_tenant_user_unique").on(
      table.tenantId,
      table.userId,
    ),
    index("tenant_memberships_tenant_idx").on(table.tenantId),
    index("tenant_memberships_user_idx").on(table.userId),
  ],
);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: storeStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("stores_tenant_slug_unique").on(table.tenantId, table.slug),
    index("stores_tenant_idx").on(table.tenantId),
  ],
);

export const storeMemberships = pgTable(
  "store_memberships",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: storeRole("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("store_memberships_store_user_unique").on(table.storeId, table.userId),
    index("store_memberships_store_idx").on(table.storeId),
    index("store_memberships_user_idx").on(table.userId),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: productStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("products_store_idx").on(table.storeId)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text("sku").notNull(),
    title: text("title"),
    priceAmount: integer("price_amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("product_variants_product_sku_unique").on(table.productId, table.sku),
    index("product_variants_product_idx").on(table.productId),
    index("product_variants_sku_idx").on(table.sku),
  ],
);

export const inventoryItems = pgTable(
  "inventory_items",
  {
    variantId: uuid("variant_id")
      .primaryKey()
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantityOnHand: integer("quantity_on_hand").notNull().default(0),
    reservedQuantity: integer("reserved_quantity").notNull().default(0),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("inventory_items_variant_idx").on(table.variantId)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("product_images_product_idx").on(table.productId)],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("categories_store_name_unique").on(table.storeId, table.name),
    index("categories_store_idx").on(table.storeId),
  ],
);

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.categoryId] }),
    index("product_categories_product_idx").on(table.productId),
    index("product_categories_category_idx").on(table.categoryId),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    email: text("email").notNull(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("customers_email_unique").on(table.email),
    index("customers_user_idx").on(table.userId),
  ],
);

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "cascade",
    }),
    name: text("name"),
    phone: text("phone"),
    line1: text("line1"),
    line2: text("line2"),
    city: text("city"),
    region: text("region"),
    postalCode: text("postal_code"),
    country: text("country"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("addresses_customer_idx").on(table.customerId)],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "restrict" }),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    status: orderStatus("status").notNull().default("pending"),
    currency: varchar("currency", { length: 3 }).notNull(),
    subtotalAmount: integer("subtotal_amount").notNull().default(0),
    shippingAmount: integer("shipping_amount").notNull().default(0),
    taxAmount: integer("tax_amount").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    totalAmount: integer("total_amount").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("orders_store_idx").on(table.storeId),
    index("orders_customer_idx").on(table.customerId),
    index("orders_status_idx").on(table.status),
  ],
);

export const orderAddresses = pgTable(
  "order_addresses",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    type: addressType("type").notNull(),
    name: text("name"),
    phone: text("phone"),
    line1: text("line1"),
    line2: text("line2"),
    city: text("city"),
    region: text("region"),
    postalCode: text("postal_code"),
    country: text("country"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("order_addresses_order_type_unique").on(table.orderId, table.type),
    index("order_addresses_order_idx").on(table.orderId),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    productTitle: text("product_title").notNull(),
    variantTitle: text("variant_title"),
    sku: text("sku"),
    unitPriceAmount: integer("unit_price_amount").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotalAmount: integer("line_total_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_variant_idx").on(table.variantId),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    provider: paymentProvider("provider").notNull(),
    status: paymentStatus("status").notNull().default("initiated"),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    providerReference: text("provider_reference"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("payments_provider_reference_unique").on(table.providerReference),
    index("payments_order_idx").on(table.orderId),
    index("payments_status_idx").on(table.status),
  ],
);

export const fulfillments = pgTable(
  "fulfillments",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    status: fulfillmentStatus("status").notNull().default("pending"),
    carrier: text("carrier"),
    trackingNumber: text("tracking_number"),
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("fulfillments_order_idx").on(table.orderId),
    index("fulfillments_status_idx").on(table.status),
  ],
);

export const fulfillmentItems = pgTable(
  "fulfillment_items",
  {
    fulfillmentId: uuid("fulfillment_id")
      .notNull()
      .references(() => fulfillments.id, { onDelete: "cascade" }),
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.fulfillmentId, table.orderItemId] }),
    index("fulfillment_items_fulfillment_idx").on(table.fulfillmentId),
    index("fulfillment_items_order_item_idx").on(table.orderItemId),
  ],
);

export const tenantsRelations = relations(tenants, ({ many }) => ({
  memberships: many(tenantMemberships),
  stores: many(stores),
}));

export const tenantMembershipsRelations = relations(
  tenantMemberships,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [tenantMemberships.tenantId],
      references: [tenants.id],
    }),
    user: one(user, {
      fields: [tenantMemberships.userId],
      references: [user.id],
    }),
  }),
);

export const storesRelations = relations(stores, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [stores.tenantId],
    references: [tenants.id],
  }),
  memberships: many(storeMemberships),
  products: many(products),
  categories: many(categories),
  orders: many(orders),
}));

export const storeMembershipsRelations = relations(
  storeMemberships,
  ({ one }) => ({
    store: one(stores, {
      fields: [storeMemberships.storeId],
      references: [stores.id],
    }),
    user: one(user, {
      fields: [storeMemberships.userId],
      references: [user.id],
    }),
  }),
);

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  productCategories: many(productCategories),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    inventory: one(inventoryItems, {
      fields: [productVariants.id],
      references: [inventoryItems.variantId],
    }),
  }),
);

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  variant: one(productVariants, {
    fields: [inventoryItems.variantId],
    references: [productVariants.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  productCategories: many(productCategories),
}));

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(user, {
    fields: [customers.userId],
    references: [user.id],
  }),
  addresses: many(addresses),
  orders: many(orders),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  addresses: many(orderAddresses),
  payments: many(payments),
  fulfillments: many(fulfillments),
}));

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [orderAddresses.orderId],
    references: [orders.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
  fulfillmentItems: many(fulfillmentItems),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const fulfillmentsRelations = relations(fulfillments, ({ one, many }) => ({
  order: one(orders, {
    fields: [fulfillments.orderId],
    references: [orders.id],
  }),
  items: many(fulfillmentItems),
}));

export const fulfillmentItemsRelations = relations(fulfillmentItems, ({ one }) => ({
  fulfillment: one(fulfillments, {
    fields: [fulfillmentItems.fulfillmentId],
    references: [fulfillments.id],
  }),
  orderItem: one(orderItems, {
    fields: [fulfillmentItems.orderItemId],
    references: [orderItems.id],
  }),
}));
