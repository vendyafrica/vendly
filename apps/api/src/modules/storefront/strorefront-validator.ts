import { z } from "zod";

export const createStorefrontSchema = z.object({
    tenantId: z.string().uuid("Invalid tenant ID"),
    storeName: z.string().min(1, "Store name is required"),
    storeSlug: z.string().min(3, "Store slug must be at least 3 characters"),
    description: z.string().optional(),
    themeId: z.string().optional(),
    categories: z.array(z.string()).optional(),
    location: z.string().optional(),
    socialLinks: z.object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
    }).optional(),
});

export const updateStoreSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    theme: z.record(z.any()).optional(),
    content: z.record(z.any()).optional(),
});

export const validateCreateStorefront = (data: unknown) => {
    return createStorefrontSchema.parse(data);
};

export const validateUpdateStore = (data: unknown) => {
    return updateStoreSchema.parse(data);
};
