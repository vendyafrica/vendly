import { Router } from "express";
import { onboardingController } from "../controllers/onboarding-controller";

export const createOnboardingRouter = (): Router => {
    const router = Router();

    /**
     * POST /api/onboarding/complete
     * Complete onboarding and create tenant + store
     */
    router.post("/complete", (req, res) => {
        onboardingController.completeOnboarding(req, res);
    });

    return router;
};
