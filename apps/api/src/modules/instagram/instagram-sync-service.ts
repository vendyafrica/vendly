import { instagramMediaService } from "./instagram-media-service";
import { instagramConnectionRepository } from "./instagram-repository";
import { productService } from "../products";
import { mediaService } from "../media";
import {
    SyncRequestInput,
    InstagramMediaItem,
    SyncStats
} from "./instagram-models";

export class InstagramSyncService {
    async syncInstagramMedia(
        tenantId: string,
        tenantSlug: string,
        userId: string,
        options: SyncRequestInput
    ): Promise<SyncStats> {
        console.log(`[InstagramSyncService] Starting sync for tenant ${tenantSlug}`);

        const stats: SyncStats = {
            mediaFetched: 0,
            productsCreated: 0,
            productsSkipped: 0,
            errors: []
        };

        try {
            // 1. Get connection and token
            // We need to fetch the access token from the 'account' table using better-auth mechanisms
            // or by querying the table directly. Since better-auth handles auth, let's assume we can 
            // get the connected account from our tracking table + auth table join, 
            // BUT for simplicity in MVP, we'll fetch the account associated with the user.

            // First check if we have an active connection record
            const connection = await instagramConnectionRepository.getConnectionByTenant(tenantId);
            if (!connection) {
                throw new Error("No active Instagram connection found");
            }

            // We need the ACCESS TOKEN. In better-auth, it's in the 'account' table.
            // We'll query it via the user.
            // WARNING: This assumes the user triggering the sync is the one who connected the account.
            // In a real multi-user tenant, we might need to store the token in our connection table
            // or impersonate the connecting user.
            // For now, let's look up the account for the connection's user_id.

            /* 
            const userAccounts = await auth.api.listUserAccounts({
                headers: {} 
            }); 
            */

            // Direct DB approach since we are in API module
            // TODO: Import 'account' schema and query directly if auth helper fails
            // For now assuming we can proceed with the flow if we had the token.

            // Let's implement a direct token fetch helper in repository or just query here
            // const token = ...

            // PLACEHOLDER: effectively getting the token
            // In a real implementation this needs to query the `account` table 
            // where providerId = 'instagram' and userId = connection.userId
            // We'll throw if we can't find it.

            // NOTE: We need to implement `getAccessToken` in connection repo or similar
            // Let's assume passed in for now or we fetch it:
            const accessToken = await this.getAccessToken(connection.userId);

            // 2. Create Sync Job
            const job = await instagramConnectionRepository.createSyncJob({
                tenantId,
                connectionId: connection.id,
                status: "running",
                startedAt: new Date(),
            });

            // 3. Fetch Media
            const mediaResponse = await instagramMediaService.fetchUserMedia(
                accessToken,
                options.limit
            );

            stats.mediaFetched = mediaResponse.data.length;

            // 4. Process each media item
            for (const item of mediaResponse.data) {
                try {
                    // Check if product already exists from this Instagram post
                    if (options.skipExisting) {
                        // Check via product repository instead
                        // For now, we'll skip this check or implement it properly
                        // TODO: Add existsBySourceId to product service
                    }

                    // Process Item
                    await this.processMediaItem(
                        item,
                        tenantId,
                        tenantSlug,
                        options
                    );

                    stats.productsCreated++;

                } catch (error) {
                    console.error(`Failed to process media ${item.id}:`, error);
                    stats.errors.push(`Media ${item.id}: ${error instanceof Error ? error.message : "Unknown error"}`);
                }

                // Update job progress periodically?
            }

            // 5. Update Job Completion
            await instagramConnectionRepository.updateSyncJob(job.id, {
                status: stats.errors.length > 0 ? "completed_with_errors" : "completed",
                completedAt: new Date(),
                mediaFetched: stats.mediaFetched,
                productsCreated: stats.productsCreated,
                productsSkipped: stats.productsSkipped,
                errors: stats.errors,
            });

            // Update connection timestamp
            await instagramConnectionRepository.updateSyncTimestamp(connection.id);

        } catch (error) {
            console.error("[InstagramSyncService] Sync fatal error:", error);
            // Log fatal error to job if possible
            if (stats.errors.length === 0) {
                stats.errors.push(error instanceof Error ? error.message : "Fatal sync error");
            }
            throw error;
        }

        return stats;
    }

    /**
     * Helper to get access token (simulated for now, would query DB)
     */
    private async getAccessToken(userId: string): Promise<string> {
        // TODO: Query `account` table via drizzle
        // const account = await db.query.account.findFirst(...)
        // For MVP, we'll trust the auth flow put it there.
        // We need to import 'account' from schema and query it.
        // Let's assume we do this in a follow-up step to fix imports.
        return "placeholder_access_token";
    }

    /**
     * Process individual Instagram media item
     * Simplified to use centralized services
     */
    private async processMediaItem(
        item: InstagramMediaItem,
        tenantId: string,
        tenantSlug: string,
        options: SyncRequestInput
    ): Promise<void> {
        // 1. Skip videos or items without URLs
        const imageUrl = item.media_url;
        if (!imageUrl) return;
        if (item.media_type === "VIDEO") return; // TODO: Handle video thumbnails

        // 2. Parse caption for title and description
        const caption = item.caption || "Instagram Product";
        const title = caption.split("\n")[0].substring(0, 100);

        // 3. Create product using Product Service
        const product = await productService.createProduct(
            tenantId,
            tenantSlug,
            {
                storeId: options.storeId,
                title,
                description: caption,
                priceAmount: options.defaultPrice,
                currency: options.defaultCurrency,
                source: "instagram",
                sourceId: item.id,
                sourceUrl: item.permalink,
                isFeatured: false,
            },
            [] // No files - we'll add Instagram media separately
        );

        // 4. Add Instagram media using Media Service
        // This handles download, upload, and linking automatically
        await mediaService.createProductMediaFromUrl(
            tenantId,
            tenantSlug,
            product.id,
            imageUrl,
            {
                source: "instagram",
                sourceMediaId: item.id,
                sourceMetadata: {
                    permalink: item.permalink,
                    username: item.username,
                    timestamp: item.timestamp,
                },
            }
        );
    }
}

export const instagramSyncService = new InstagramSyncService();
