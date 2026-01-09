import { Router, Request, Response } from "express";
import { list } from "@vercel/blob";
import { db, tenants } from "@vendly/db";
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
 * Get store data (mock for demo) with hero background image
 */
router.get("/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

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

