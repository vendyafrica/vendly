import { Router } from "express";
import { instagramController } from "../controllers/instagram-controller";

const router = Router();

// Connections
router.get("/connection", instagramController.getConnection);

// Sync
router.post("/sync", instagramController.sync);
router.get("/sync-history", instagramController.getHistory);

export const instagramRoutes: Router = router;
