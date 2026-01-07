import type { InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  unique,
} from 'drizzle-orm/pg-core'
import { users as user, account } from './core-schema'


export const chat_ownerships = pgTable(
  'chat_ownerships',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    v0_chat_id: varchar('v0_chat_id', { length: 255 }).notNull(),
    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => user.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    unique_v0_chat: unique().on(table.v0_chat_id),
  }),
)

export type ChatOwnership = InferSelectModel<typeof chat_ownerships>

export const anonymous_chat_logs = pgTable('anonymous_chat_logs', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  ip_address: varchar('ip_address', { length: 45 }).notNull(),
  v0_chat_id: varchar('v0_chat_id', { length: 255 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export type AnonymousChatLog = InferSelectModel<typeof anonymous_chat_logs>
