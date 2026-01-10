import express, { Router } from "express";
import { z } from "zod";
import { db } from "@vendly/db";
import {
    tenants,
    tenantMemberships,
    stores,
    storeMemberships,
    templates,
    eq
} from "@vendly/db";
import { auth } from "@vendly/auth";

const router: Router = Router();

const onboardingSchema = z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    categories: z.array(z.string()).min(1),
    storeName: z.string().min(1),
    description: z.string().optional(),
    tenantSlug: z.string().min(1),
    themeId: z.string().optional(),
    socialLinks: z.record(z.string()).optional(), // e.g., { instagram: "...", tiktok: "..." }
    location: z.string().optional(),
});

router.post("/complete", async (req, res) => {
    try {
        // 1. Verify Authentication
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // 2. Validate Input
        const result = onboardingSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        const {
            fullName,
            phone,
            categories,
            storeName,
            description,
            tenantSlug,
            themeId,
            socialLinks,
            location
        } = result.data;

        // 3. Create Tenant
        // Check if tenant slug exists
        const existingTenant = await db.query.tenants.findFirst({
            where: eq(tenants.slug, tenantSlug)
        });

        if (existingTenant) {
            return res.status(409).json({ error: "Store URL already taken" });
        }

        const [newTenant] = await db.insert(tenants).values({
            name: storeName, // Identifying tenant by store name mainly
            slug: tenantSlug,
            phoneNumber: phone,
            status: "active", // Or "onboarding" if verify email steps etc needed
        }).returning();

        // 4. Create Tenant Membership (Owner)
        await db.insert(tenantMemberships).values({
            tenantId: newTenant.id,
            userId: session.user.id,
            role: "owner",
        });

        // 5. Create Store
        // Find template if themeId provided
        let templateId = null;
        if (themeId) {
            const tmpl = await db.query.templates.findFirst({
                where: eq(templates.slug, themeId)
            });
            if (tmpl) templateId = tmpl.id;
        }

        const [newStore] = await db.insert(stores).values({
            tenantId: newTenant.id,
            name: storeName,
            slug: tenantSlug, // Default store slug same as tenant slug for main store
            description: description,
            status: "active",
            defaultCurrency: "KES",
        }).returning();

        // 6. Create Store Membership
        await db.insert(storeMemberships).values({
            tenantId: newTenant.id,
            storeId: newStore.id,
            userId: session.user.id,
            role: "store_owner",
        });

        // 7. Store additional data (Socials, Location)
        await db.update(stores).set({
            instagramUrl: socialLinks?.instagram,
            facebookUrl: socialLinks?.facebook,
            twitterUrl: socialLinks?.twitter,
            address: location,
        }).where(eq(stores.id, newStore.id));


        // 8. Return success with redirection URL
        return res.status(200).json({
            success: true,
            tenantId: newTenant.id,
            storeId: newStore.id,
            subdomain: tenantSlug,
            adminUrl: `http://admin.localhost:3000/${tenantSlug}/store` // Directing to the Store Preview Page
        });

    } catch (error) {
        console.error("Onboarding Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
