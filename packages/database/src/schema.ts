export * from './schema/index';

import { relations } from 'drizzle-orm';
import {
  sellers,
  stores,
  products,
  mediaAssets,
  aiRequests,
  themes,
  activityLogs,
  sellerPaymentMethods,
  sellerDeliveryMethods,
  carts,
  orders,
  productVariants,
  brandPalettes,
} from './schema/index';

export const sellersRelations = relations(sellers, ({ many }) => ({
  stores: many(stores),
  activityLogs: many(activityLogs),
  paymentMethods: many(sellerPaymentMethods),
  deliveryMethods: many(sellerDeliveryMethods),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  seller: one(sellers, { fields: [stores.sellerId], references: [sellers.id] }),
  products: many(products),
  media: many(mediaAssets),
  brandPalette: one(brandPalettes),
  aiRequests: many(aiRequests),
  carts: many(carts),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  variants: many(productVariants),
  media: many(mediaAssets),
}));

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  store: one(stores, { fields: [mediaAssets.storeId], references: [stores.id] }),
  product: one(products, {
    fields: [mediaAssets.productId],
    references: [products.id],
  }),
}));

export const aiRequestsRelations = relations(aiRequests, ({ one }) => ({
  store: one(stores, { fields: [aiRequests.storeId], references: [stores.id] }),
}));

export const themesRelations = relations(themes, ({ many }) => ({})); // No direct relations, but can be linked via brandPalettes.theme

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  seller: one(sellers, { fields: [activityLogs.sellerId], references: [sellers.id] }),
  store: one(stores, { fields: [activityLogs.storeId], references: [stores.id] }),
}));

export const sellerPaymentMethodsRelations = relations(sellerPaymentMethods, ({ one }) => ({
  seller: one(sellers, { fields: [sellerPaymentMethods.sellerId], references: [sellers.id] }),
}));

export const sellerDeliveryMethodsRelations = relations(sellerDeliveryMethods, ({ one }) => ({
  seller: one(sellers, { fields: [sellerDeliveryMethods.sellerId], references: [sellers.id] }),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
  store: one(stores, { fields: [carts.storeId], references: [stores.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  store: one(stores, { fields: [orders.storeId], references: [stores.id] }),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
}));
