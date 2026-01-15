/**
 * Upload Controller
 * Handles HTTP requests and responses for upload operations
 */
import { Request, Response } from "express";
import { uploadService } from "./blob-service";
import {
    validateUploadOptions,
    validateFile,
    UploadFile,
    UploadOptions,
} from "./blob-model";

export class UploadController {
    /**
     * Upload a single file
     * POST /api/upload
     */
    async uploadSingle(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as UploadFile | undefined;
            const { tenantSlug, productId, size, processImage } = req.body;

            // Validate file
            const fileError = validateFile(file);
            if (fileError) {
                res.status(400).json({ error: fileError });
                return;
            }

            // Prepare options
            const options: UploadOptions = {
                tenantSlug,
                productId,
                size,
                processImage: processImage === "false" ? false : true,
            };

            // Validate options
            const optionsError = validateUploadOptions(options);
            if (optionsError) {
                res.status(400).json({ error: optionsError });
                return;
            }

            // Upload file
            const result = await uploadService.uploadSingle(file!, options);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("[UploadController] Upload error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Upload failed",
            });
        }
    }

    /**
     * Upload multiple files
     * POST /api/upload/multiple
     */
    async uploadMultiple(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as UploadFile[] | undefined;
            const { tenantSlug, productId, size, processImage } = req.body;

            // Validate files
            if (!files || files.length === 0) {
                res.status(400).json({ error: "No files provided" });
                return;
            }

            // Validate each file
            for (const file of files) {
                const fileError = validateFile(file);
                if (fileError) {
                    res.status(400).json({ error: fileError });
                    return;
                }
            }

            // Prepare options
            const options: UploadOptions = {
                tenantSlug,
                productId,
                size,
                processImage: processImage === "false" ? false : true,
            };

            // Validate options
            const optionsError = validateUploadOptions(options);
            if (optionsError) {
                res.status(400).json({ error: optionsError });
                return;
            }

            // Upload files
            const result = await uploadService.uploadMultiple(files, options);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("[UploadController] Multiple upload error:", error);
            res.status(500).json({
                error:
                    error instanceof Error ? error.message : "Multiple upload failed",
            });
        }
    }

    /**
     * Upload a product image
     * POST /api/upload/product
     */
    async uploadProduct(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as UploadFile | undefined;
            const { tenantSlug, productId, size } = req.body;

            // Validate file
            const fileError = validateFile(file);
            if (fileError) {
                res.status(400).json({ error: fileError });
                return;
            }

            // Validate productId
            if (!productId) {
                res.status(400).json({ error: "productId is required" });
                return;
            }

            // Prepare options
            const options: UploadOptions = {
                tenantSlug,
                productId,
                size: size || "product",
                processImage: true,
            };

            // Validate options
            const optionsError = validateUploadOptions(options);
            if (optionsError) {
                res.status(400).json({ error: optionsError });
                return;
            }

            // Upload file
            const result = await uploadService.uploadSingle(file!, options);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("[UploadController] Product upload error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Product upload failed",
            });
        }
    }

    /**
     * Delete a blob
     * DELETE /api/upload
     */
    async deleteBlob(req: Request, res: Response): Promise<void> {
        try {
            const { url } = req.body;

            if (!url) {
                res.status(400).json({ error: "url is required" });
                return;
            }

            await uploadService.deleteBlob(url);

            res.status(200).json({
                success: true,
                message: "Blob deleted successfully",
            });
        } catch (error) {
            console.error("[UploadController] Delete error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Delete failed",
            });
        }
    }

    /**
     * Delete multiple blobs
     * DELETE /api/upload/multiple
     */
    async deleteBlobs(req: Request, res: Response): Promise<void> {
        try {
            const { urls } = req.body;

            if (!urls || !Array.isArray(urls) || urls.length === 0) {
                res.status(400).json({ error: "urls array is required" });
                return;
            }

            await uploadService.deleteBlobs(urls);

            res.status(200).json({
                success: true,
                message: `${urls.length} blobs deleted successfully`,
            });
        } catch (error) {
            console.error("[UploadController] Bulk delete error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Bulk delete failed",
            });
        }
    }

    /**
     * List tenant blobs
     * GET /api/upload/list/:tenantSlug
     */
    async listTenantBlobs(req: Request, res: Response): Promise<void> {
        try {
            const { tenantSlug } = req.params;
            const { limit, cursor } = req.query;

            if (!tenantSlug) {
                res.status(400).json({ error: "tenantSlug is required" });
                return;
            }

            const result = await uploadService.listTenantBlobs(tenantSlug, {
                limit: limit ? parseInt(limit as string) : undefined,
                cursor: cursor as string | undefined,
            });

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("[UploadController] List error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "List failed",
            });
        }
    }

    /**
     * List product images
     * GET /api/upload/product/:tenantSlug/:productId
     */
    async listProductImages(req: Request, res: Response): Promise<void> {
        try {
            const { tenantSlug, productId } = req.params;
            const { limit, cursor } = req.query;

            if (!tenantSlug || !productId) {
                res.status(400).json({
                    error: "tenantSlug and productId are required",
                });
                return;
            }

            const result = await uploadService.listProductImages(
                tenantSlug,
                productId,
                {
                    limit: limit ? parseInt(limit as string) : undefined,
                    cursor: cursor as string | undefined,
                }
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("[UploadController] List product images error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "List failed",
            });
        }
    }
}

export const uploadController = new UploadController();