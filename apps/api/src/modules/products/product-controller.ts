
import { Request, Response } from "express";
import { productService } from "./index";
import {
    createProductSchema,
    productQuerySchema,
    bulkUploadSchema,
} from "./product-models";
import { z } from "zod";

export class ProductController {

    /**
     * Create Product
     */
    async create(req: Request, res: Response) {
        try {
            // Parse Body (multipart form data usually has body as text/json parts)
            // But multer puts fields in body.
            // Zod coerce is helpful here for numbers/booleans from form-data strings

            // For now assuming JSON body if no files, or Form data
            const files = (req.files as Express.Multer.File[]) || [];

            // Convert plain object to types if needed (e.g. "priceAmount" string to number)
            // TODO: Add proper coercion schema or improved zod schema

            const rawBody = req.body;
            // Manual coercion for form-data
            if (rawBody.priceAmount) rawBody.priceAmount = Number(rawBody.priceAmount);
            if (rawBody.isFeatured) rawBody.isFeatured = rawBody.isFeatured === 'true';

            const data = createProductSchema.parse(rawBody);

            // Used from context/middleware
            // const tenantId = req.tenantId; 
            // const tenantSlug = req.tenantSlug;

            // MOCK for now since middleware might not be passed in prompt context
            const tenantId = req.headers["x-tenant-id"] as string;
            const tenantSlug = req.headers["x-tenant-slug"] as string;

            if (!tenantId || !tenantSlug) {
                return res.status(400).json({ error: "Tenant context missing" });
            }

            const formattedFiles = files.map(f => ({
                buffer: f.buffer,
                mimetype: f.mimetype,
                originalname: f.originalname,
                size: f.size
            }));

            const product = await productService.createProduct(
                tenantId,
                tenantSlug,
                data,
                formattedFiles
            );

            return res.status(201).json({ success: true, data: product });
        } catch (error) {
            console.error("Create product error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error.issues });
            }
            return res.status(500).json({ error: error instanceof Error ? error.message : "Internal error" });
        }
    }

    /**
     * Bulk Upload
     */
    async bulkUpload(req: Request, res: Response) {
        try {
            const files = (req.files as Express.Multer.File[]) || [];
            if (files.length === 0) {
                return res.status(400).json({ error: "No files provided" });
            }

            const rawBody = req.body;
            if (rawBody.defaultPrice) rawBody.defaultPrice = Number(rawBody.defaultPrice);
            if (rawBody.markAsFeatured) rawBody.markAsFeatured = rawBody.markAsFeatured === 'true';
            if (rawBody.generateTitles) rawBody.generateTitles = rawBody.generateTitles === 'true';

            const config = bulkUploadSchema.parse(rawBody);

            const tenantId = req.headers["x-tenant-id"] as string;
            const tenantSlug = req.headers["x-tenant-slug"] as string;

            if (!tenantId) return res.status(400).json({ error: "Tenant context missing" });

            const formattedFiles = files.map(f => ({
                buffer: f.buffer,
                mimetype: f.mimetype,
                originalname: f.originalname,
                size: f.size
            }));

            const result = await productService.bulkCreateProducts(
                tenantId,
                tenantSlug,
                config,
                formattedFiles
            );

            return res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error("Bulk upload error:", error);
            return res.status(500).json({ error: "Bulk upload failed" });
        }
    }

    /**
     * List Products
     */
    async list(req: Request, res: Response) {
        try {
            const filters = productQuerySchema.parse(req.query);
            const tenantId = req.headers["x-tenant-id"] as string;

            if (!tenantId) return res.status(400).json({ error: "Tenant context missing" });

            const result = await productService.listProducts(tenantId, filters);

            return res.json({ success: true, data: result });
        } catch (error) {
            return res.status(400).json({ error: "Invalid query parameters" });
        }
    }

    /**
     * Get Product
     */
    async get(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.headers["x-tenant-id"] as string;

            const product = await productService.getProductWithMedia(id, tenantId);
            return res.json({ success: true, data: product });
        } catch (error) {
            return res.status(404).json({ error: "Product not found" });
        }
    }

    /**
     * Delete Product
     */
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.headers["x-tenant-id"] as string;
            const tenantSlug = req.headers["x-tenant-slug"] as string;

            await productService.deleteProduct(id, tenantId, tenantSlug);
            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: "Delete failed" });
        }
    }
}

export const productController = new ProductController();
