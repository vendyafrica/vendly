import { Router } from "express";
import { whatsAppWebhookController } from "./whatsapp-webhook-controller";
import { whatsAppController } from "./whatsapp-controller";

const router = Router();

// Webhooks
router.get("/webhooks/whatsapp", (req, res) => whatsAppWebhookController.verify(req, res));
router.post("/webhooks/whatsapp", (req, res) => whatsAppWebhookController.handleEvent(req, res));

// Business Configuration
router.post("/profile", (req, res) => whatsAppController.updateProfile(req, res));
router.post("/register", (req, res) => whatsAppController.registerPhone(req, res));
router.post("/welcome-message", (req, res) => whatsAppController.setWelcomeMessage(req, res));

export const whatsappRoutes = router;
