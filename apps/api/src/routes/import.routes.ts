// apps/api/src/routes/import.routes.ts
import { Router } from "express";
import { importController } from "../controllers/import.controller";

const router: Router = Router();

// Import from Instagram
router.post("/:storeId/instagram", (req, res) => importController.importFromInstagram(req, res));

// Import from WhatsApp
router.post("/:storeId/whatsapp", (req, res) => importController.importFromWhatsApp(req, res));

// Sync Instagram products
router.post("/:storeId/instagram/sync", (req, res) => importController.syncInstagramProducts(req, res));

// Sync WhatsApp products
router.post("/:storeId/whatsapp/sync", (req, res) => importController.syncWhatsAppProducts(req, res));

// Validate Instagram connection
router.post("/validate/instagram", (req, res) => importController.validateInstagramConnection(req, res));

// Validate WhatsApp connection
router.post("/validate/whatsapp", (req, res) => importController.validateWhatsAppConnection(req, res));

// Get import history
router.get("/history/:storeId", (req, res) => importController.getImportHistory(req, res));

// Schedule auto-sync
router.post("/:storeId/schedule", (req, res) => importController.scheduleAutoSync(req, res));

console.log("[import.routes] Import routes initialized");

export default router;