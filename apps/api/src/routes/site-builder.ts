import { Router } from "express";
import { siteBuilderController } from "../controllers/site-builder-controller";

const router: Router = Router();

router.post("/start", (req, res) => siteBuilderController.start(req, res));
router.get("/status", (req, res) => siteBuilderController.status(req, res));

export default router;
