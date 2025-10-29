import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router: Router = Router();


router.get("/me", authController.getSession);

export default router;

