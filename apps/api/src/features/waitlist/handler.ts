import { Request, Response } from "express";
import { validateWaitlistInput } from "./validator";
import { joinWaitlistService } from "./service";

export async function joinWaitlistHandler(req: Request, res: Response) {
    try {
        const input = validateWaitlistInput(req.body);

        const result = await joinWaitlistService(input);

        res.status(200).json(result);
    } catch (error: any) {

        console.error("Waitlist error:", error);

        const statusCode = error.message.includes("already exists") ? 409 : 400;

        res.status(statusCode).json({
            message: error.message,
            error: true,
        });

    }
}