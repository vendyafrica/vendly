import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/auth";
import { tenantService } from "../services/tenant-service";

export class TenantController {
    /**
     * Get tenant by ID
     * GET /api/tenants/:tenantId
     */
    async getTenant(req: AuthenticatedRequest, res: Response) {
        try {
            const { tenantId } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized"
                });
            }

            const tenant = await tenantService.getTenantById(tenantId, userId);

            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    error: "Tenant not found or access denied"
                });
            }

            return res.json({
                success: true,
                data: tenant
            });
        } catch (error: any) {
            console.error("Get tenant error:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to get tenant"
            });
        }
    }

    /**
     * Get user's tenants
     * GET /api/tenants
     */
    async getUserTenants(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized"
                });
            }

            const tenants = await tenantService.getUserTenants(userId);

            return res.json({
                success: true,
                data: tenants
            });
        } catch (error: any) {
            console.error("Get user tenants error:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to get tenants"
            });
        }
    }

    /**
     * Update tenant
     * PATCH /api/tenants/:tenantId
     */
    async updateTenant(req: AuthenticatedRequest, res: Response) {
        try {
            const { tenantId } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized"
                });
            }

            const updates = req.body;
            const tenant = await tenantService.updateTenant(tenantId, userId, updates);

            return res.json({
                success: true,
                data: tenant
            });
        } catch (error: any) {
            console.error("Update tenant error:", error);

            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            return res.status(500).json({
                success: false,
                error: "Failed to update tenant"
            });
        }
    }
}

export const tenantController = new TenantController();
