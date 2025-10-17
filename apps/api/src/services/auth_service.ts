import { auth } from "@vendly/auth";
import { fromNodeHeaders } from "better-auth/node";
import { Request, Response } from "express";

class AuthService {
    async getSession(req: Request, res: Response) {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        return res.json(session);
    }
}

export const authService = new AuthService();