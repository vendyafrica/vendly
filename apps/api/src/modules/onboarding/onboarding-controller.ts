import { Request, Response } from "express";
import { onboardingService } from "./onboarding-service";
import type { AuthenticatedRequest } from "../../types/auth-types";

class OnboardingController {
    /**
     * Extract auth context from request
     */
    private getAuth(req: Request): { userId: string; email: string } {
        const auth = (req as AuthenticatedRequest).auth;
        if (!auth?.userId) {
            throw new Error("User not authenticated");
        }
        return {
            userId: auth.userId,
            email: auth.email || "",
        };
    }

    /**
     * Extract userId from authenticated request (for backward compatibility)
     */
    private getUserId(req: Request): string {
        return this.getAuth(req).userId;
    }

    /**
     * GET /onboarding/status
     * Get current onboarding status and saved data
     */
    async getStatus(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req);
            const status = await onboardingService.getStatus(userId);
            res.json(status);
        } catch (error) {
            this.handleError(res, error, "Failed to get onboarding status");
        }
    }

    /**
     * POST /onboarding/personal
     * Save personal info step
     */
    async savePersonal(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req);
            const result = await onboardingService.savePersonalInfo(userId, req.body);
            res.json(result);
        } catch (error) {
            this.handleError(res, error, "Failed to save personal info");
        }
    }

    /**
     * POST /onboarding/store
     * Save store info step
     */
    async saveStore(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req);
            const result = await onboardingService.saveStoreInfo(userId, req.body);
            res.json(result);
        } catch (error) {
            this.handleError(res, error, "Failed to save store info");
        }
    }

    /**
     * POST /onboarding/business
     * Save business info step
     */
    async saveBusiness(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req);
            const result = await onboardingService.saveBusinessInfo(userId, req.body);
            res.json(result);
        } catch (error) {
            this.handleError(res, error, "Failed to save business info");
        }
    }

    /**
     * POST /onboarding/complete
     * Finalize onboarding and create store
     */
    async complete(req: Request, res: Response): Promise<void> {
        try {
            const { userId, email } = this.getAuth(req);
            const result = await onboardingService.completeOnboarding(userId, email);
            res.json(result);
        } catch (error) {
            this.handleError(res, error, "Failed to complete onboarding");
        }
    }

    /**
     * POST /onboarding/back
     * Navigate to previous step
     */
    async goBack(req: Request, res: Response): Promise<void> {
        try {
            const userId = this.getUserId(req);
            const result = await onboardingService.goBack(userId);
            res.json(result);
        } catch (error) {
            this.handleError(res, error, "Failed to navigate back");
        }
    }

    /**
     * Centralized error handler
     */
    private handleError(res: Response, error: unknown, fallbackMsg: string): void {
        const message = error instanceof Error ? error.message : fallbackMsg;
        console.error(`[Onboarding] Error: ${message}`);
        res.status(400).json({
            success: false,
            error: message
        });
    }
}

export const onboardingController = new OnboardingController();
