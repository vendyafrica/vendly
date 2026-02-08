import { Request, Response, NextFunction } from "express";
import { auth } from "@vendly/auth";
import { AuthenticatedRequest,TenantRole,PlatformRole } from "../types/auth-types";
import { db } from "@vendly/db";
import { tenantMemberships, superAdmins } from "@vendly/db";
import { and, eq } from "drizzle-orm";


/**
 * Ensures the request is authenticated
 * Builds the base auth context (identity only)
 */
export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Authentication required",
            });
        }

        (req as AuthenticatedRequest).auth = {
            userId: session.user.id,
            email: session.user.email,
        };

        next();
    } catch (err) {
        console.error("[Auth] Session error:", err);
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired session",
        });
    }
}

//for public routes
export async function optionalAuth(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (session?.user) {
            (req as AuthenticatedRequest).auth = {
                userId: session.user.id,
                email: session.user.email,
            };
        }

        next();
    } catch {
        next();
    }
}

export function requireTenantRole(allowedRoles: TenantRole[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const auth = (req as AuthenticatedRequest).auth;
        const tenantId = req.params.tenantId;

        if (!auth || !tenantId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const membership = await db.query.tenantMemberships.findFirst({
            where: and(
                eq(tenantMemberships.userId, auth.userId),
                eq(tenantMemberships.tenantId, tenantId)
            ),
        });

        if (!membership || !allowedRoles.includes(membership.role as TenantRole)) {
            return res.status(403).json({
                error: "Forbidden",
                message: "Insufficient tenant permissions",
            });
        }

        auth.tenant = {
            tenantId,
            role: membership.role as TenantRole,
        };

        next();
    };
}

export function requirePlatformRole(allowed: PlatformRole[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const auth = (req as AuthenticatedRequest).auth;

        if (!auth) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const role = await db.query.superAdmins.findFirst({
            where: eq(superAdmins.userId, auth.userId),
        });

        if (!role || !allowed.includes(role.role as PlatformRole)) {
            return res.status(403).json({
                error: "Forbidden",
                message: "Platform access denied",
            });
        }

        auth.platformRole = role.role as PlatformRole;
        next();
    };
}
