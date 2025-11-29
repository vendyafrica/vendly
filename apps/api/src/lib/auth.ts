import { auth } from "@vendly/auth";
import type { Request } from "express";

export const getSession = async (req: Request) => {
    return await auth.api.getSession({
        headers: req.headers
    });
};
