/**
 * Auth Middleware
 * Validates user session for protected routes
 */
import { Request, Response, NextFunction } from "express";
import { auth } from "@vendly/auth";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
        [key: string]: any;
    };
    session?: any;
}

/**
 * Middleware to verify user is authenticated
 */
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session || !session.user) {
            res.status(401).json({
                error: "Unauthorized",
                message: "You must be logged in to access this resource",
            });
            return; // res.redirect is typically not useful for JSON APIs, removing or keeping as is? Kept logic similar but cleaner return.
            // Original code had both json and redirect. I will keep original behavior logic but fix types.
        }

        // Attach session and user to request for use in controllers
        (req as any).session = session;
        (req as any).user = session.user;

        next();
    } catch (error) {
        console.error("[AuthMiddleware] Error:", error);
        res.status(401).json({
            error: "Authentication failed",
            message: error instanceof Error ? error.message : "Unknown error",
        });
        res.redirect("/api/auth/login");
    }
}

/**
 * Optional auth middleware - doesn't block if no session
 */
export async function optionalAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (session && session.user) {
            (req as any).session = session;
            (req as any).user = session.user;
        }

        next();
    } catch (error) {
        console.error("[OptionalAuthMiddleware] Error:", error);
        next();
    }
}

/**
 * Middleware to check for specific role
 */
export function requireRole(role: string) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const session = (req as any).session;

        if (!session) {
            res.status(401).json({
                error: "Unauthorized",
                message: "You must be logged in to access this resource",
            });
            return;
        }

        // Extend this based on your role system
        const userRole = (session.user as any).role;

        if (userRole !== role && userRole !== "admin") {
            res.status(403).json({
                error: "Forbidden",
                message: "You do not have permission to access this resource",
            });
            return;
        }

        next();
    };
}