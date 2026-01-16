import { Request, Response } from "express";
import { instagramSyncService } from "./instagram-sync-service";
import { instagramConnectionRepository } from "./instagram-repository";
import { syncRequestSchema } from "./instagram-models";
import { z } from "zod";

export class InstagramController {

    /**
     * Trigger Sync
     */
    async sync(req: Request, res: Response) {
        try {
            const tenantId = req.headers["x-tenant-id"] as string;
            const tenantSlug = req.headers["x-tenant-slug"] as string;
            // Assuming we have user ID from auth middleware
            const userId = req.headers["x-user-id"] as string || "placeholder-user";

            if (!tenantId || !tenantSlug) {
                return res.status(400).json({ error: "Tenant context missing" });
            }

            const options = syncRequestSchema.parse(req.body);

            // Run in background? Or await?
            // Awaiting for now to return stats, but ideally should just return job ID
            const stats = await instagramSyncService.syncInstagramMedia(
                tenantId,
                tenantSlug,
                userId,
                options
            );

            return res.json({ success: true, data: stats });
        } catch (error) {
            console.error("Instagram sync failed:", error);
            return res.status(500).json({ error: error instanceof Error ? error.message : "Sync failed" });
        }
    }

    /**
     * Get Connection Status
     */
    async getConnection(req: Request, res: Response) {
        try {
            const tenantId = req.headers["x-tenant-id"] as string;
            const connection = await instagramConnectionRepository.getConnectionByTenant(tenantId);

            return res.json({
                success: true,
                data: connection ? {
                    isConnected: true,
                    username: connection.username,
                    lastSyncedAt: connection.lastSyncedAt
                } : {
                    isConnected: false
                }
            });
        } catch (error) {
            return res.status(500).json({ error: "Failed to get connection" });
        }
    }

    /**
     * Get Sync History
     */
    async getHistory(req: Request, res: Response) {
        try {
            const tenantId = req.headers["x-tenant-id"] as string;
            const history = await instagramConnectionRepository.getSyncHistory(tenantId);
            return res.json({ success: true, data: history });
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch history" });
        }
    }
}

export const instagramController = new InstagramController();
