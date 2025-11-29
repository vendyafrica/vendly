import { auth } from "@vendly/auth";
import type { Request } from "express";

export const getSession = async (req: Request) => {
    return await auth.api.getSession({
        headers: req.headers
    });
};

// export const signUpWithEmailAndPassword = async (email: string, password: string, name?: string) => {
//     return await auth.api.signUpEmail({
//         body: {
//             email,
//             password,
//             name: name || "",
//         }
//     });
// };

// export const signInWithEmailAndPassword = async (email: string, password: string) => {
//     return await auth.api.signInEmail({
//         body: {
//             email,
//             password,
//         },
//         headers: {} // Add headers if needed
//     });
// };

// export const signOut = async () => {
//     return await auth.api.signOut({
//         headers: {} // Add headers if needed
//     });
// };

// export const requestPasswordReset = async (email: string) => {
//     return await auth.api.requestPasswordReset({
//         body: {
//             email,
//         }
//     });
// };

// export const resetPassword = async (newPassword: string, token: string) => {
//     return await auth.api.resetPassword({
//         body: {
//             newPassword,
//             token,
//         }
//     });
// };

// export const changePassword = async (newPassword: string, currentPassword: string) => {
//     return await auth.api.changePassword({
//         body: {
//             newPassword,
//             currentPassword,
//         },
//         headers: {} // Add headers if needed
//     });
// };
