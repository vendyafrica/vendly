import type { Request, Response, NextFunction } from "express";
import { productService } from "../services/product-service";
import { z } from "zod";

const createProductSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0),
    currency: z.string().default("KES"),
    images: z.array(z.string().url()).optional(),
    tenantId: z.string().uuid(), // Temporary
});

export class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId } = req.params; // Assuming route is like /stores/:storeId/products ? Or standard query
            // If the route is /api/products?storeId=...

            const storeIdQuery = req.query.storeId as string;
            if (!storeIdQuery) return res.status(400).json({ error: "storeId required" });

            const products = await productService.getProducts(storeIdQuery);
            return res.json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const product = await productService.getProduct(productId);
            if (!product) return res.status(404).json({ error: "Product not found" });
            return res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId } = req.params; // If nested route
            // Or allow body to perform everything

            const body = createProductSchema.parse(req.body);
            // If storeId is in params, use it, else expect in body/query? 
            // Let's assume passed in body for now matching schema
            // But schema didn't have storeId. Let's assume route /stores/:storeId/products
            const storeIdParam = req.params.storeId;

            if (!storeIdParam) return res.status(400).json({ error: "Store ID required in path" });

            const product = await productService.createProduct({
                storeId: storeIdParam,
                title: body.title,
                description: body.description,
                priceAmount: body.price,
                currency: body.currency,
                images: body.images,
                tenantId: body.tenantId
            });

            return res.status(201).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            await productService.deleteProduct(productId);
            return res.json({ success: true, message: "Product deleted" });
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
