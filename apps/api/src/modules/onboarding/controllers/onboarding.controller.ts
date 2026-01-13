import type { Request, Response, NextFunction } from "express";
import { onboardingService } from "../services/onboarding.service";
import { z } from "zod";

const completeOnboardingSchema = z.object({
    businessName: z.string().min(1),
    storeName: z.string().min(1),
    storeSlug: z.string().regex(/^[a-z0-9-]+$/),
    templateId: z.string().optional(),
});

export class OnboardingController {
    async complete(req: Request, res: Response, next: NextFunction) {
        try {
            const session = res.locals.session; // Provided by auth middleware typically
            const user = res.locals.user;

            // If strictly using better-auth node handler, user info might be in req.headers or we need middleware to decode session
            // For now, assuming middleware populates `req.user` or we pass `userId` in body for dev (insecure for prod without auth check)

            let userId = user?.id; // From middleware

            // Fallback for dev/migration: check body
            if (!userId) {
                // throw new Error("User unauthorized"); // Uncomment in prod
                userId = req.body.userId; // Temporary allow
            }

            if (!userId) return res.status(401).json({ error: "Unauthorized" });

            const body = completeOnboardingSchema.parse(req.body);

            const result = await onboardingService.completeOnboarding({
                userId,
                ...body
            });

            return res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const onboardingController = new OnboardingController();
