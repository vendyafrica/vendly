import { Router, Request, Response } from "express";
import { list } from "@vercel/blob";
import { db, tenants, stores, storeThemes, storeContent } from "@vendly/db";
import { eq } from "drizzle-orm";

const router: Router = Router();

/**
 * Get demo products from Vercel Blob "demo" folder
 */
router.get("/:slug/products", async (req: Request, res: Response) => {
    try {
        const { limit = "12" } = req.query;
        const limitNum = parseInt(limit as string);

        console.log(`[Demo Products] Fetching products from demo folder`);

        // List all blobs in the "demo" folder
        const result = await list({
            prefix: "demo/",
            limit: limitNum || 100,
        });

        console.log(`[Demo Products] Found ${result.blobs.length} blobs`);

        // Transform blobs into product format
        const products = result.blobs
            .filter((blob) => {
                // Only include image files
                const ext = blob.pathname.toLowerCase();
                return (
                    ext.endsWith(".jpg") ||
                    ext.endsWith(".jpeg") ||
                    ext.endsWith(".png") ||
                    ext.endsWith(".webp")
                );
            })
            .map((blob, index) => {
                // Extract filename without extension for the product name
                const filename = blob.pathname.split("/").pop() || `Product ${index + 1}`;
                const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");

                // Format the name nicely (remove dashes/underscores, capitalize)
                const formattedName = nameWithoutExt
                    .replace(/[-_]/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return {
                    id: `demo-${index}`,
                    name: formattedName || `Product ${index + 1}`,
                    description: `Demo product from Vercel Blob`,
                    basePriceAmount: Math.floor(Math.random() * 50000) + 10000, // Random price between 10k-60k
                    baseCurrency: "UGX",
                    status: "active",
                    imageUrl: blob.url,
                };
            })
            .slice(0, limitNum);

        console.log(`[Demo Products] Returning ${products.length} products`);

        res.json(products);
    } catch (error) {
        console.error("[Demo Products] Error fetching demo products:", error);
        res.status(500).json({
            error: true,
            message: "Failed to fetch demo products",
        });
    }
});

/**
 * Create a demo store with custom theme
 * POST /api/storefront/create-demo
 */
router.post("/create-demo", async (req: Request, res: Response) => {
    try {
        const { slug, name, theme } = req.body;

        if (!slug || !name) {
            return res.status(400).json({ error: true, message: "slug and name are required" });
        }

        console.log(`[Create Demo] Creating store: ${name} (${slug})`);

        // Check if tenant exists
        const [existingTenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.slug, slug))
            .limit(1);

        // Use existing tenant or create new one
        let tenantId = existingTenant?.id;

        if (!existingTenant) {
            const [newTenant] = await db.insert(tenants).values({
                name: name,
                slug: slug,
                status: "active",
                plan: "free",
            }).returning();
            tenantId = newTenant.id;
        }

        // Check if store exists
        const [existingStore] = await db
            .select()
            .from(stores)
            .where(eq(stores.slug, slug))
            .limit(1);

        let storeId = existingStore?.id;

        if (!existingStore) {
            const [newStore] = await db.insert(stores).values({
                tenantId: tenantId!,
                name: name,
                slug: slug,
                status: "active",
            }).returning();
            storeId = newStore.id;
        }

        // Upsert Theme
        const [existingTheme] = await db
            .select()
            .from(storeThemes)
            .where(eq(storeThemes.storeId, storeId!))
            .limit(1);

        if (existingTheme) {
            await db.update(storeThemes)
                .set({
                    primaryColor: theme.primaryColor,
                    secondaryColor: theme.secondaryColor,
                    accentColor: theme.accentColor,
                    backgroundColor: theme.backgroundColor,
                    textColor: theme.textColor,
                    headingFont: theme.headingFont,
                    bodyFont: theme.bodyFont,
                    updatedAt: new Date(),
                })
                .where(eq(storeThemes.id, existingTheme.id));
        } else {
            await db.insert(storeThemes).values({
                tenantId: tenantId!,
                storeId: storeId!,
                primaryColor: theme.primaryColor,
                secondaryColor: theme.secondaryColor,
                accentColor: theme.accentColor,
                backgroundColor: theme.backgroundColor,
                textColor: theme.textColor,
                headingFont: theme.headingFont,
                bodyFont: theme.bodyFont,
            });
        }

        // Upsert Content (Hero)
        const [existingContent] = await db
            .select()
            .from(storeContent)
            .where(eq(storeContent.storeId, storeId!))
            .limit(1);

        if (existingContent) {
            // update content if needed
        } else {
            await db.insert(storeContent).values({
                tenantId: tenantId!,
                storeId: storeId!,
                heroLabel: "New Collection",
                heroTitle: `Welcome to ${name}`,
                heroSubtitle: "Discover our premium collection.",
                heroCta: "Shop Now",
            });
        }

        res.json({ success: true, slug, message: "Store created/updated successfully" });

    } catch (error) {
        console.error("[Create Demo] Error:", error);
        res.status(500).json({ error: true, message: "Failed to create demo store" });
    }
});


/**
 * Get store data (DB backed with fallback)
 */
router.get("/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // 1. Try fetching from DB
        const [store] = await db
            .select()
            .from(stores)
            .where(eq(stores.slug, slug))
            .limit(1);

        if (store) {
            console.log(`[Demo Store] Found store in DB: ${slug}`);

            // Fetch theme
            const [theme] = await db
                .select()
                .from(storeThemes)
                .where(eq(storeThemes.storeId, store.id))
                .limit(1);

            // Fetch content
            const [content] = await db
                .select()
                .from(storeContent)
                .where(eq(storeContent.storeId, store.id))
                .limit(1);

            // Fetch an image from the demo folder to use as hero background if not set
            let heroImageUrl = content?.heroImageUrl;
            if (!heroImageUrl) {
                try {
                    const result = await list({ prefix: "demo/", limit: 1 });
                    if (result.blobs.length > 0) heroImageUrl = result.blobs[0].url;
                } catch (e) { console.error("Blob error", e); }
            }

            return res.json({
                id: store.id,
                name: store.name,
                slug: store.slug,
                description: store.description,
                logoUrl: store.logoUrl,
                theme: theme || {}, // Return empty object if no theme found, frontend defaults handle it
                content: {
                    ...content,
                    heroImageUrl,
                }
            });
        }

        // 2. Fallback to hardcoded mock data (if DB miss)
        console.log(`[Demo Store] Store not found in DB, using fallback for: ${slug}`);

        // Fetch an image from the demo folder to use as hero background
        let heroImageUrl: string | null = null;
        try {
            const result = await list({
                prefix: "demo/",
                limit: 10,
            });

            // Find the first image file to use as hero
            const heroImage = result.blobs.find((blob) => {
                const ext = blob.pathname.toLowerCase();
                return (
                    ext.endsWith(".jpg") ||
                    ext.endsWith(".jpeg") ||
                    ext.endsWith(".png") ||
                    ext.endsWith(".webp")
                );
            });

            if (heroImage) {
                heroImageUrl = heroImage.url;
                console.log(`[Demo Store] Using hero image: ${heroImageUrl}`);
            }
        } catch (blobError) {
            console.error("[Demo Store] Error fetching hero image:", blobError);
        }

        // Return mock store data
        const storeData = {
            id: "demo-1",
            name: "Demo Store",
            slug: slug,
            description: "A beautiful demo store showcasing our products",
            logoUrl: null,
            theme: {
                primaryColor: "#1a1a2e",
                secondaryColor: "#4a6fa5",
                accentColor: "#e94560",
                backgroundColor: "#ffffff",
                textColor: "#1a1a2e",
                headingFont: "Playfair Display",
                bodyFont: "Inter",
            },
            content: {
                heroLabel: "New Collection",
                heroTitle: "Demo Collection",
                heroSubtitle: "Discover our curated collection of premium products.",
                heroCta: "Shop Now",
                heroImageUrl: heroImageUrl, // Background image for HeroSection
                newsletterTitle: "Stay Updated",
                newsletterSubtitle: "Subscribe to get the latest updates on new products and offers.",
            },
        };

        res.json(storeData);
    } catch (error) {
        console.error("[Demo Store] Error fetching store data:", error);
        res.status(500).json({
            error: true,
            message: "Failed to fetch store data",
        });
    }
});

/**
 * Get tenant info by slug
 * This allows the Next.js frontend to check tenant existence without DATABASE_URL
 */
router.get("/:slug/tenant", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        console.log(`[Tenant] Fetching tenant info for: ${slug}`);

        const [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.slug, slug))
            .limit(1);

        if (!tenant) {
            return res.status(404).json({
                error: true,
                message: "Tenant not found",
            });
        }

        // Return tenant info (excluding sensitive fields)
        res.json({
            id: tenant.id,
            slug: tenant.slug,
            name: tenant.name,
            status: tenant.status,
            plasmicTemplate: (tenant as { plasmicTemplate?: string }).plasmicTemplate,
            generatedFiles: tenant.generatedFiles,
        });
    } catch (error) {
        console.error("[Tenant] Error fetching tenant:", error);
        res.status(500).json({
            error: true,
            message: "Failed to fetch tenant info",
        });
    }
});

export default router;

