import { Request, Response } from "express";
import { auth } from "@vendly/auth";
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
        if (!session?.user) {
            return sendError(res, 401, "Unauthorized");
        }

        // 2. Validation
        const validatedData = validateOnboardingRequest(req.body);

        // 3. Execute business logic
        const response = await completeOnboarding(
            session.user.id,
            session.user.email,
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
