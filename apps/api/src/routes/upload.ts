import { Router, Request, Response } from "express";
import multer from "multer";
import { blobStorageService } from "../services/blob-storage-service";

const router: Router = Router();

// Use memory storage for multer - files will be in memory as Buffer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4.5 * 1024 * 1024, // 4.5MB limit (Vercel Functions limit)
    },
    fileFilter: (_req, file, cb) => {
        // Only allow images
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

/**
 * POST /api/upload
 * Upload a single image to Vercel Blob storage
 * Body: multipart/form-data with 'file' and 'tenantSlug'
 */
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const tenantSlug = req.body.tenantSlug as string;

        if (!file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        if (!tenantSlug) {
            res.status(400).json({ error: "tenantSlug is required" });
            return;
        }

        const result = await blobStorageService.uploadImage(
            file.buffer,
            file.originalname,
            tenantSlug,
            file.mimetype
        );

        res.json({
            success: true,
            url: result.url,
            pathname: result.pathname,
            contentType: result.contentType,
        });
    } catch (error) {
        console.error("[Upload] Error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Upload failed",
        });
    }
});

/**
 * POST /api/upload/product
 * Upload a product image to Vercel Blob storage
 * Body: multipart/form-data with 'file', 'tenantSlug', and 'productId'
 */
router.post("/product", upload.single("file"), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const tenantSlug = req.body.tenantSlug as string;
        const productId = req.body.productId as string;

        if (!file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        if (!tenantSlug || !productId) {
            res.status(400).json({ error: "tenantSlug and productId are required" });
            return;
        }

        const result = await blobStorageService.uploadProductImage(
            file.buffer,
            file.originalname,
            tenantSlug,
            productId,
            file.mimetype
        );

        res.json({
            success: true,
            url: result.url,
            pathname: result.pathname,
            contentType: result.contentType,
        });
    } catch (error) {
        console.error("[Upload] Error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Upload failed",
        });
    }
});

/**
 * DELETE /api/upload
 * Delete a blob by URL
 * Body: { url: string }
 */
router.delete("/", async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        if (!url) {
            res.status(400).json({ error: "url is required" });
            return;
        }

        await blobStorageService.deleteBlob(url);

        res.json({ success: true });
    } catch (error) {
        console.error("[Upload] Delete error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Delete failed",
        });
    }
});

/**
 * GET /api/upload/list/:tenantSlug
 * List all blobs for a tenant
 */
router.get("/list/:tenantSlug", async (req: Request, res: Response) => {
    try {
        const { tenantSlug } = req.params;
        const { limit, cursor } = req.query;

        const result = await blobStorageService.listTenantBlobs(tenantSlug, {
            limit: limit ? parseInt(limit as string) : undefined,
            cursor: cursor as string | undefined,
        });

        res.json(result);
    } catch (error) {
        console.error("[Upload] List error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "List failed",
        });
    }
});

export default router;
