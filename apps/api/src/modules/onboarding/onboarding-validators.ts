import { z } from "zod";

export const onboardingRequestSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().min(10, "Valid phone number required"),
    categories: z.array(z.string()).min(1, "Select at least one category"),
    storeName: z.string().min(1, "Store name is required"),
    description: z.string().optional(),
    tenantSlug: z.string().min(3, "Store URL must be at least 3 characters"),
    themeId: z.string().optional(),
    location: z.string().optional(),
    socialLinks: z.object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
    }).optional(),
});

export const validateOnboardingRequest = (data: unknown) => {
    return onboardingRequestSchema.parse(data);
};