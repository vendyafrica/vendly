import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
    handleCreateStorefront,
    handleGetStorefrontBySlug,
    handleGetStorefrontById,
    handleUpdateStorefront,
    handlePublishStorefront,
    handleGetStorefrontProducts,
} from "./storefront-handler";

export const createStorefrontRouter = (): Router => {
    const router = Router();

    // Public routes
    router.get("/:slug", handleGetStorefrontBySlug);
    router.get("/:slug/products", handleGetStorefrontProducts);

    // Protected routes
    router.post("/", authMiddleware, handleCreateStorefront);
    router.get("/id/:id", authMiddleware, handleGetStorefrontById);
    router.put("/:id", authMiddleware, handleUpdateStorefront);
    router.post("/:id/publish", authMiddleware, handlePublishStorefront);

    return router;
};
