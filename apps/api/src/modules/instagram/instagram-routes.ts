import { Router } from "express";
import { instagramController } from "./instagram-controller";
import { instagramWebhookController } from "./instagram-webhook-controller";

const router = Router();

// Webhook endpoints (must be registered in Meta App Dashboard)
router.get("/webhooks", instagramWebhookController.verify.bind(instagramWebhookController));
router.post("/webhooks", instagramWebhookController.handleEvent.bind(instagramWebhookController));

// Connections
router.get("/connection", instagramController.getConnection);

// Sync
router.post("/sync", instagramController.sync);
router.get("/sync-history", instagramController.getHistory);

export const instagramRoutes: Router = router;
