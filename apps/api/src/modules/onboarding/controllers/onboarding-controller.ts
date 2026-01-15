import { Request, Response } from "express";
import { onboardingService } from "../services/onboarding-service";

export class OnboardingController {
    /**
     * Complete onboarding - create tenant, store, and Sanity content
     * POST /api/onboarding/complete
     */
    async completeOnboarding(req: Request, res: Response) {
        try {
            const userId = req.user?.id;  // From auth middleware

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized - user not authenticated"
                });
            }

            const {
                fullName,
                phone,
                businessType,
                categories,
                location,
                storeName,
                tenantSlug,
            } = req.body;

            // Validate required fields
            if (!fullName || !phone || !storeName || !tenantSlug) {
                return res.status(400).json({
                    success: false,
                    error: "Missing required fields: fullName, phone, storeName, tenantSlug"
                });
            }

            if (!businessType || businessType.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "At least one business type is required"
                });
            }

            if (!categories || categories.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "At least one category is required"
                });
            }

            // Call service to complete onboarding
            const result = await onboardingService.completeOnboarding({
                userId,
                fullName,
                phone,
                businessType,
                categories,
                location,
                storeName,
                tenantSlug,
            });

            return res.status(201).json(result);
        } catch (error: any) {
            console.error("Onboarding error:", error);

            // Handle specific errors
            if (error.message.includes("already taken")) {
                return res.status(409).json({
                    success: false,
                    error: error.message
                });
            }

            return res.status(500).json({
                success: false,
                error: "Failed to complete onboarding"
            });
        }
    }
}

export const onboardingController = new OnboardingController();
