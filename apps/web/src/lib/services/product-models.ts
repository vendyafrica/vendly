import { z } from "zod";
import type { Product, MediaObject } from "@vendly/db/schema";

/**
 * Product creation input
 */
export const createProductSchema = z.object({
    storeId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    priceAmount: z.number().int().min(0).default(0),
    currency: z.string().length(3).default("KES"),
    source: z.enum(["manual", "instagram", "bulk-upload"]).default("manual"),
    sourceId: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    isFeatured: z.boolean().default(false),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

/**
 * Bulk upload configuration
 */
export const bulkUploadSchema = z.object({
    storeId: z.string().uuid(),
    defaultCurrency: z.string().length(3).default("KES"),
    defaultPrice: z.number().int().min(0).default(0),
    generateTitles: z.boolean().default(true),
    markAsFeatured: z.boolean().default(false),
    status: z.enum(["draft", "ready", "active", "sold-out"]).default("draft"),
});

export type BulkUploadInput = z.infer<typeof bulkUploadSchema>;

/**
 * Product with media populated
 */
export interface ProductWithMedia extends Product {
    media: Array<MediaObject & { sortOrder: number; isFeatured: boolean }>;
}

/**
 * Product query filters
 */
export const productQuerySchema = z.object({
    storeId: z.string().uuid().optional(),
    source: z.enum(["manual", "instagram", "bulk-upload"]).optional(),
    isFeatured: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
});

export type ProductFilters = z.infer<typeof productQuerySchema>;

/**
 * Product update input
 */
export const updateProductSchema = z.object({
    productName: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    priceAmount: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
    quantity: z.number().int().min(0).optional(),
    status: z.enum(["draft", "ready", "active", "sold-out"]).optional(),
    isFeatured: z.boolean().optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
