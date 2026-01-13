import { Request, Response } from "express";
import { validateCreateStorefront, validateUpdateStore } from "./strorefront-validator";
import {
    createStorefront,
    getStorefrontBySlug,
    getStorefrontById,
    updateStorefrontTheme,
    updateStorefrontContent,
    publishStorefront,
    getStorefrontProducts,
} from "./storefront-service";

const sendError = (res: Response, status: number, message: string) => {
    res.status(status).json({ error: message });
};

const getSession = (req: Request) => {
    return (req as any).session;
};

// Create storefront
export const handleCreateStorefront = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const session = getSession(req);
        if (!session) {
            return sendError(res, 401, "Unauthorized");
        }

        const validatedData = validateCreateStorefront(req.body);
        const storefront = await createStorefront(validatedData);

        res.status(201).json({
            success: true,
            data: storefront,
        });
    } catch (error) {
        console.error("[Storefront] Create error:", error);

        if (error instanceof Error && error.message === "Store slug already exists") {
            return sendError(res, 409, error.message);
        }

        return sendError(res, 500, "Failed to create storefront");
    }
};

// Get storefront by slug (public)
export const handleGetStorefrontBySlug = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { slug } = req.params;
        const storefront = await getStorefrontBySlug(slug);

        if (!storefront) {
            return sendError(res, 404, "Store not found");
        }

        res.status(200).json({
            success: true,
            data: storefront,
        });
    } catch (error) {
        console.error("[Storefront] Get by slug error:", error);
        return sendError(res, 500, "Failed to get storefront");
    }
};

// Get storefront by ID
export const handleGetStorefrontById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const session = getSession(req);
        if (!session) {
            return sendError(res, 401, "Unauthorized");
        }

        const { id } = req.params;
        const storefront = await getStorefrontById(id);

        if (!storefront) {
            return sendError(res, 404, "Store not found");
        }

        res.status(200).json({
            success: true,
            data: storefront,
        });
    } catch (error) {
        console.error("[Storefront] Get by ID error:", error);
        return sendError(res, 500, "Failed to get storefront");
    }
};

// Update storefront
export const handleUpdateStorefront = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const session = getSession(req);
        if (!session) {
            return sendError(res, 401, "Unauthorized");
        }

        const { id } = req.params;
        const validatedData = validateUpdateStore(req.body);

        // Update theme if provided
        if (validatedData.theme) {
            await updateStorefrontTheme(id, validatedData.theme);
        }

        // Update content if provided
        if (validatedData.content) {
            await updateStorefrontContent(id, validatedData.content);
        }

        res.status(200).json({
            success: true,
            message: "Storefront updated successfully",
        });
    } catch (error) {
        console.error("[Storefront] Update error:", error);
        return sendError(res, 500, "Failed to update storefront");
    }
};

// Publish storefront
export const handlePublishStorefront = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const session = getSession(req);
        if (!session) {
            return sendError(res, 401, "Unauthorized");
        }

        const { id } = req.params;
        await publishStorefront(id);

        res.status(200).json({
            success: true,
            message: "Storefront published successfully",
        });
    } catch (error) {
        console.error("[Storefront] Publish error:", error);
        return sendError(res, 500, "Failed to publish storefront");
    }
};

// Get storefront products (public)
export const handleGetStorefrontProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { slug } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;

        const products = await getStorefrontProducts(slug, limit);

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("[Storefront] Get products error:", error);
        return sendError(res, 500, "Failed to get storefront products");
    }
};