import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { sellers } from './seller';
import { stores } from './store';

export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),
    storeId: uuid('store_id').references(() => stores.id, { onDelete: 'cascade' }),
    action: varchar('action', { length: 100 }).notNull(), // 'store_created', 'product_added', 'store_published'
    resource: varchar('resource', { length: 100 }), // 'store', 'product', 'media'
    resourceId: varchar('resource_id', { length: 255 }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    sellerIdx: index('activity_logs_seller_id_idx').on(table.sellerId),
    storeIdx: index('activity_logs_store_id_idx').on(table.storeId),
    actionIdx: index('activity_logs_action_idx').on(table.action),
  })
);
