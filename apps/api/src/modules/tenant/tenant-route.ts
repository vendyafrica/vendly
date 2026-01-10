import { Router } from "express";
import { tenantController } from "./tenant-controller";
import { authMiddleware } from "../../middlewares/auth";

const router: Router = Router();

/**
 * @route   POST /api/tenants
 * @desc    Create a new tenant
 * @access  Private
 */
router.post("/", authMiddleware, tenantController.create.bind(tenantController));

/**
 * @route   GET /api/tenants/me
 * @desc    List my tenants
 * @access  Private
 */
router.get("/me", authMiddleware, tenantController.listMyTenants.bind(tenantController));

/**
 * @route   GET /api/tenants/:slug
 * @desc    Get tenant details
 * @access  Private
 */
router.get("/:slug", authMiddleware, tenantController.getBySlug.bind(tenantController));

export default router;
