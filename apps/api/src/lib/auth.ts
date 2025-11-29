import { auth } from "@vendly/auth";
import type { Request } from "express";

export const getSession = async (req: Request) => {
    return await auth.api.getSession({
        headers: req.headers
    });
};

// export const signUpWithEmailAndPassword = async (email: string, password: string) => {
//     return await auth.api.signUpWithEmailAndPassword({
//         email,
//         password
//     });
// }
