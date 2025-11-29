import {
    pgTable,
    uuid,
    varchar,
    text,
    jsonb,
    integer,
    timestamp,
    index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { aiRequestStatusEnum } from './shared/shared.schema.enums';
import { stores } from './stores/store.schema';

export const aiRequests = pgTable(
    'ai_requests',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        storeId: uuid('store_id')
            .notNull()
            .references(() => stores.id, { onDelete: 'cascade' }),
        requestType: varchar('request_type', { length: 100 }).notNull(), // 'brand_analysis', 'store_generation', 'product_description'
        status: aiRequestStatusEnum('status').default('pending'),
        input: jsonb('input').notNull(), // { images: [...], instagramHandle, etc }
        output: jsonb('output'), // Result from AI
        error: text('error'),
        tokenUsage: jsonb('token_usage'), // { prompt_tokens, completion_tokens }
        v0ProjectId: varchar('v0_project_id', { length: 255 }),
        model: varchar('model', { length: 100 }), // 'gpt-4-vision', 'claude-3', etc
        processingTimeMs: integer('processing_time_ms'),
        createdAt: timestamp('created_at').defaultNow(),
        completedAt: timestamp('completed_at'),
    },
    (table) => ({
        storeIdx: index('ai_requests_store_id_idx').on(table.storeId),
        statusIdx: index('ai_requests_status_idx').on(table.status),
        requestTypeIdx: index('ai_requests_type_idx').on(table.requestType),
    })
);

export const aiRequestsRelations = relations(aiRequests, ({ one }) => ({
    store: one(stores, { fields: [aiRequests.storeId], references: [stores.id] }),
}));