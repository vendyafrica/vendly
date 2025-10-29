import { Router } from "express";
import { waitlistController } from "../controllers/waitlist.controller";

const router: Router = Router();

router.post("/join-waitlist", (req, res) => waitlistController.joinWaitlist(req, res));

export default router;
