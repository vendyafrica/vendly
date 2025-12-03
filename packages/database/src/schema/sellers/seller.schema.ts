// import {
//   pgTable,
//   uuid,
//   text,
//   varchar,
//   boolean,
//   timestamp,
//   index,
// } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';
// import { roleEnum } from '../shared/shared.schema.enums';
// import { stores } from '../stores/store.schema';
// import { activityLogs } from '../activity-logs';
// import { sellerPaymentMethods, sellerDeliveryMethods } from '../stores/store.schema';

// export const sellers = pgTable(
//   'sellers',
//   {
//     id: uuid('id').primaryKey().defaultRandom(),
//     email: varchar('email', { length: 255 }).unique().notNull(),
//     phone: varchar('phone', { length: 20 }).notNull(),
//     businessName: varchar('business_name', { length: 255 }).notNull(),
//     bio: text('bio'),
//     avatar: varchar('avatar', { length: 512 }),
//     instagramHandle: varchar('instagram_handle', { length: 255 }).unique(),
//     instagramAccessToken: text('instagram_access_token'), // encrypted
//     instagramTokenExpiry: timestamp('instagram_token_expiry'),
//     role: roleEnum('role').default('seller'),
//     isVerified: boolean('is_verified').default(false),
//     createdAt: timestamp('created_at').defaultNow(),
//     updatedAt: timestamp('updated_at').defaultNow(),
//   },
//   (table) => ({
//     emailIdx: index('sellers_email_idx').on(table.email),
//     phoneIdx: index('sellers_phone_idx').on(table.phone),
//     igHandleIdx: index('sellers_ig_handle_idx').on(table.instagramHandle),
//   })
// );

// export const sellersRelations = relations(sellers, ({ many }) => ({
//   stores: many(stores),
//   activityLogs: many(activityLogs),
//   paymentMethods: many(sellerPaymentMethods),
//   deliveryMethods: many(sellerDeliveryMethods),
// }));
