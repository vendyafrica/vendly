import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    boolean,
    integer,
    jsonb,
    index,
    unique,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { users } from "./auth-schema";

/**
 * Instagram Connections
 * Tracks Instagram account connections per tenant
 */
export const instagramConnections = pgTable(
    "instagram_connections",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        accountId: text("account_id").notNull(), // Instagram account ID
        username: text("username"),
        accountType: text("account_type"), // 'BUSINESS' or 'CREATOR'

        isActive: boolean("is_active").default(true).notNull(),
        lastSyncedAt: timestamp("last_synced_at"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("instagram_connections_tenant_account_unique").on(
            table.tenantId,
            table.accountId
        ),
        index("instagram_connections_tenant_idx").on(table.tenantId),
        index("instagram_connections_user_idx").on(table.userId),
    ]
);

/**
 * Instagram Sync Jobs
 * Tracks sync operations and their status
 */
export const instagramSyncJobs = pgTable(
    "instagram_sync_jobs",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        connectionId: uuid("connection_id")
            .notNull()
            .references(() => instagramConnections.id, { onDelete: "cascade" }),

        status: text("status").notNull().default("pending"), // 'pending', 'running', 'completed', 'failed'

        mediaFetched: integer("media_fetched").default(0).notNull(),
        productsCreated: integer("products_created").default(0).notNull(),
        productsSkipped: integer("products_skipped").default(0).notNull(),

        errors: jsonb("errors"), // Array of error messages

        startedAt: timestamp("started_at"),
        completedAt: timestamp("completed_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("instagram_sync_jobs_tenant_idx").on(table.tenantId),
        index("instagram_sync_jobs_connection_idx").on(table.connectionId),
        index("instagram_sync_jobs_status_idx").on(table.status),
        index("instagram_sync_jobs_created_idx").on(table.createdAt),
    ]
);

// Relations
export const instagramConnectionsRelations = relations(
    instagramConnections,
    ({ one, many }) => ({
        tenant: one(tenants, {
            fields: [instagramConnections.tenantId],
            references: [tenants.id],
        }),
        user: one(users, {
            fields: [instagramConnections.userId],
            references: [users.id],
        }),
        syncJobs: many(instagramSyncJobs),
    })
);

export const instagramSyncJobsRelations = relations(
    instagramSyncJobs,
    ({ one }) => ({
        tenant: one(tenants, {
            fields: [instagramSyncJobs.tenantId],
            references: [tenants.id],
        }),
        connection: one(instagramConnections, {
            fields: [instagramSyncJobs.connectionId],
            references: [instagramConnections.id],
        }),
    })
);

// Type exports
export type InstagramConnection = typeof instagramConnections.$inferSelect;
export type NewInstagramConnection = typeof instagramConnections.$inferInsert;

export type InstagramSyncJob = typeof instagramSyncJobs.$inferSelect;
export type NewInstagramSyncJob = typeof instagramSyncJobs.$inferInsert;
