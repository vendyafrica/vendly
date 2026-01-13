import { Router } from "express";
import { onboardingController } from "../controllers/onboarding.controller";

// Middleware placeholder
const authenticate = (req: any, res: any, next: any) => next();

export const createOnboardingRouter = (): Router => {
    const router = Router();

    // router.use(authenticate); // apply auth middleware

    router.post("/complete", onboardingController.complete.bind(onboardingController));

    return router;
};
