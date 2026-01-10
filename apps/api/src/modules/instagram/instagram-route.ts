/**
 * Instagram Routes
 * Defines API endpoints for Instagram integration
 */
import { Router } from "express";
import { instagramController } from "./instagram-controller";
import { authMiddleware } from "../../middlewares/auth";

const router: Router = Router();

/**
 * @route   GET /api/instagram/webhook
 * @desc    Webhook verification challenge (Instagram setup)
 * @access  Public
 */
router.get("/webhook", instagramController.verifyWebhook.bind(instagramController));

/**
 * @route   POST /api/instagram/webhook
 * @desc    Receive Instagram webhook events
 * @access  Public (verified by signature)
 */
router.post("/webhook", instagramController.handleWebhook.bind(instagramController));

/**
 * @route   POST /api/instagram/sync
 * @desc    Manually sync Instagram media for a tenant
 * @access  Private (requires authentication)
 * @body    { tenantSlug: string, forceRefresh?: boolean }
 */
router.post(
    "/sync",
    authMiddleware,
    instagramController.syncMedia.bind(instagramController)
);

/**
 * @route   GET /api/instagram/:tenantSlug/media
 * @desc    Get list of synced Instagram media
 * @access  Private (requires authentication)
 * @query   { showAll?: boolean }
 */
router.get(
    "/:tenantSlug/media",
    authMiddleware,
    instagramController.getMediaList.bind(instagramController)
);

/**
 * @route   POST /api/instagram/import
 * @desc    Import Instagram media as a product
 * @access  Private (requires authentication)
 * @body    { tenantSlug: string, mediaId: string, price?: number, name?: string }
 */
router.post(
    "/import",
    authMiddleware,
    instagramController.importMedia.bind(instagramController)
);

export default router;