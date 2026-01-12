import { Router } from "express";
import { handleOnboardingComplete } from "./onboarding-handler";

export const createOnboardingRouter = (): Router => {
    const router = Router();
    router.post("/complete", handleOnboardingComplete);
    return router;
};