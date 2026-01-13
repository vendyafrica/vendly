import type { Request, Response, NextFunction } from "express";
import { onboardingService } from "../services/onboarding.service";
import { z } from "zod";

const completeOnboardingSchema = z.object({
    businessName: z.string().min(1),
    storeName: z.string().min(1),
    storeSlug: z.string().regex(/^[a-z0-9-]+$/),
    templateId: z.string().optional(),
    skipProductImport: z.boolean().optional(),
    cssVariables: z.record(z.string()).optional(),
});

export class OnboardingController {
    async complete(req: Request, res: Response, next: NextFunction) {
        try {
            const session = res.locals.session;
            const user = res.locals.user;
            let userId = user?.id;

            if (!userId) {
                userId = req.body.userId;
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
