import { Request, Response } from "express";
import { storefrontService } from "./storefront-service";
import { CreateStoreRequest, UpdateStoreRequest } from "./storefront-model";

export class StorefrontController {
    /**
     * Create a new store
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const data: CreateStoreRequest = req.body;

            // Validation
            if (!data.tenantSlug || !data.name || !data.slug) {
                res.status(400).json({ error: "Tenant Slug, Name, and Store Slug are required" });
                return;
            }

            const store = await storefrontService.createStore(data);

            res.status(201).json({
                success: true,
                data: store
            });
        } catch (error) {
            console.error("[StorefrontController] Create error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to create store"
            });
        }
    }

    /**
     * Get store by slug (Public Access)
     */
    async getBySlug(req: Request, res: Response): Promise<void> {
        try {
            const { slug } = req.params;
            const store = await storefrontService.getStoreBySlug(slug);

            if (!store) {
                res.status(404).json({ error: "Store not found" });
                return;
            }

            res.status(200).json({
                success: true,
                data: store
            });
        } catch (error) {
            console.error("[StorefrontController] Get error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to get store"
            });
        }
    }

    /**
     * Update store
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const { id } = req.params;
            const data: UpdateStoreRequest = req.body;

            await storefrontService.updateStore(id, data);

            res.status(200).json({
                success: true,
                message: "Store updated successfully"
            });
        } catch (error) {
            console.error("[StorefrontController] Update error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to update store"
            });
        }
    }

    /**
     * Publish store (Deploy)
     */
    async publish(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const { id } = req.params;
            await storefrontService.publishStore(id);

            res.status(200).json({
                success: true,
                message: "Store published and deploying"
            });
        } catch (error) {
            console.error("[StorefrontController] Publish error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to publish store"
            });
        }
    }
}

export const storefrontController = new StorefrontController();
