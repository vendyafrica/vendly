import { z } from "zod";
import type {
    InstagramConnection,
    InstagramSyncJob,
} from "@vendly/db/schema";

/**
 * Instagram Media Item from Graph API
 */
export interface InstagramMediaItem {
    id: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url: string;
    permalink: string;
    caption?: string;
    timestamp: string;
    username?: string;
}

/**
 * Instagram Media Response
 */
export interface InstagramMediaResponse {
    data: InstagramMediaItem[];
    paging?: {
        cursors?: {
            before?: string;
            after?: string;
        };
        next?: string;
    };
}

/**
 * Sync statistics
 */
export interface SyncStats {
    mediaFetched: number;
    productsCreated: number;
    productsSkipped: number;
    errors: string[];
}

/**
 * Instagram connection creation input
 */
export const createInstagramConnectionSchema = z.object({
    accountId: z.string(),
    username: z.string().optional(),
    accountType: z.enum(["BUSINESS", "CREATOR"]).optional(),
});

export type CreateInstagramConnectionInput = z.infer<
    typeof createInstagramConnectionSchema
>;

/**
 * Sync request input
 */
export const syncRequestSchema = z.object({
    limit: z.number().int().min(1).max(100).default(50),
    skipExisting: z.boolean().default(true),
    defaultPrice: z.number().int().min(0).default(0),
    defaultCurrency: z.string().length(3).default("KES"),
});

export type SyncRequestInput = z.infer<typeof syncRequestSchema>;

/**
 * Connection with sync jobs
 */
export interface InstagramConnectionWithJobs extends InstagramConnection {
    syncJobs: InstagramSyncJob[];
}

/**
 * Sync job result
 */
export interface SyncJobResult {
    jobId: string;
    status: string;
    stats: SyncStats;
    startedAt: Date;
    completedAt?: Date;
}
