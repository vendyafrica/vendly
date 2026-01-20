import { Router, type Router as RouterType } from "express";
import { onboardingController } from "./onboarding-controller";
import { requireAuth } from "../../middlewares/auth";

const router: RouterType = Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/onboarding/status - Get current onboarding state
router.get("/status", (req, res) => onboardingController.getStatus(req, res));

// POST /api/onboarding/personal - Save personal info
router.post("/personal", (req, res) => onboardingController.savePersonal(req, res));

// POST /api/onboarding/store - Save store info
router.post("/store", (req, res) => onboardingController.saveStore(req, res));

// POST /api/onboarding/business - Save business info
router.post("/business", (req, res) => onboardingController.saveBusiness(req, res));

// POST /api/onboarding/complete - Finalize onboarding
router.post("/complete", (req, res) => onboardingController.complete(req, res));

// POST /api/onboarding/back - Navigate to previous step
router.post("/back", (req, res) => onboardingController.goBack(req, res));

export default router;