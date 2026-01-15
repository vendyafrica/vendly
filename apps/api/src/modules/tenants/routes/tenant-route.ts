import { Router } from "express";
import { tenantController } from "../controllers/tenant-controller";

export const createTenantRouter = (): Router => {
    const router = Router();

    /**
     * GET /api/tenants
     * Get all tenants for authenticated user
     */
    router.get("/", (req, res) => {
        tenantController.getUserTenants(req, res);
    });

    /**
     * GET /api/tenants/:tenantId
     * Get tenant by ID
     */
    router.get("/:tenantId", (req, res) => {
        tenantController.getTenant(req, res);
    });

    /**
     * PATCH /api/tenants/:tenantId
     * Update tenant
     */
    router.patch("/:tenantId", (req, res) => {
        tenantController.updateTenant(req, res);
    });

    return router;
};
