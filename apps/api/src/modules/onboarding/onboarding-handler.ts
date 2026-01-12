import { Request, Response } from "express";
import { auth } from "@vendly/auth";
import { db, users, eq } from "@vendly/db";
import { randomUUID } from "node:crypto";
import { validateOnboardingRequest } from "./onboarding-validators";
import { completeOnboarding } from "./onboarding-service";

const sendError = (res: Response, status: number, message: string) => {
    res.status(status).json({ error: message });
};

const getSession = async (headers: Request['headers']) => {
    return await auth.api.getSession({ headers });
};

export const handleOnboardingComplete = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // 1. Authentication
        const session = await getSession(req.headers);
        let userId = session?.user?.id;
        let userEmail = session?.user?.email;

        // [DEV] Bypass authentication if missing
        if (!userId) {
            console.warn("⚠️ [DEV] Authentication missing. Using fallback user.");
            const fallbackEmail = "dev@vendly.local";

            // Try fetch existing fallback user
            const [existing] = await db.select().from(users).where(eq(users.email, fallbackEmail));

            if (existing) {
                userId = existing.id;
                userEmail = existing.email;
            } else {
                // Create fallback user
                const newId = `dev_${randomUUID()}`;
                await db.insert(users).values({
                    id: newId,
                    name: "Developer",
                    email: fallbackEmail,
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                userId = newId;
                userEmail = fallbackEmail;
            }
        }

        // 2. Validation
        const validatedData = validateOnboardingRequest(req.body);

        // 3. Execute business logic
        const response = await completeOnboarding(
            userId!,
            userEmail!,
            validatedData
        );

        // 4. Send response
        res.status(200).json({
            success: true,
            ...response
        });

    } catch (error) {
        console.error("Onboarding Error:", error);

        if (error instanceof Error && error.message === "Store URL already taken") {
            return sendError(res, 409, error.message);
        }

        return sendError(res, 500, "Internal Server Error");
    }
};
