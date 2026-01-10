import { Request, Response } from "express";
import { tenantService } from "./tenant-service";
import { CreateTenantRequest } from "./tenant-model";

export class TenantController {
    /**
     * Create a new tenant
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const data: CreateTenantRequest = req.body;

            // Simple validation
            if (!data.name || !data.slug) {
                res.status(400).json({ error: "Name and Slug are required" });
                return;
            }

            const tenant = await tenantService.createTenant(session.user.id, data);

            res.status(201).json({
                success: true,
                data: tenant
            });
        } catch (error) {
            console.error("[TenantController] Create error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to create tenant"
            });
        }
    }

    /**
     * Get tenant by slug
     */
    async getBySlug(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const { slug } = req.params;
            const tenant = await tenantService.getTenantBySlug(slug, session.user.id);

            if (!tenant) {
                res.status(404).json({ error: "Tenant not found or access denied" });
                return;
            }

            res.status(200).json({
                success: true,
                data: tenant
            });
        } catch (error) {
            console.error("[TenantController] Get error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to get tenant"
            });
        }
    }

    /**
     * List user's tenants
     */
    async listMyTenants(req: Request, res: Response): Promise<void> {
        try {
            const session = (req as any).session;
            if (!session) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const tenants = await tenantService.listUserTenants(session.user.id);

            res.status(200).json({
                success: true,
                data: tenants
            });
        } catch (error) {
            console.error("[TenantController] List error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to list tenants"
            });
        }
    }
}

export const tenantController = new TenantController();
