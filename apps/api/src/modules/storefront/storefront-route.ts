import { Router, Request, Response } from "express";
import { list } from "@vercel/blob";
import { storefrontController } from "./storefront-controller";
import { authMiddleware } from "../../middlewares/auth";

const router: Router = Router();

// --- Core Storefront Endpoints ---

/**
 * @route   POST /api/storefront
 * @desc    Create a new store
 * @access  Private
 */
router.post("/", authMiddleware, storefrontController.create.bind(storefrontController));

/**
 * @route   PUT /api/storefront/:id
 * @desc    Update store config (theme/content)
 * @access  Private
 */
router.put("/:id", authMiddleware, storefrontController.update.bind(storefrontController));

/**
 * @route   POST /api/storefront/:id/publish
 * @desc    Publish store (Deploy to Vercel)
 * @access  Private
 */
router.post("/:id/publish", authMiddleware, storefrontController.publish.bind(storefrontController));

/**
 * @route   GET /api/storefront/:slug/page-data
 * @desc    Get store page data for editor
 * @access  Public
 */
router.get("/:slug/page-data", storefrontController.getPageData.bind(storefrontController));

/**
 * @route   GET /api/storefront/:slug
 * @desc    Get store public data (Preview)
 * @access  Public
 */
router.get("/:slug", storefrontController.getBySlug.bind(storefrontController));


// --- Legacy / Demo Endpoints (Preserved) ---

/**
 * Get demo products from Vercel Blob "demo" folder
 */
router.get("/:slug/products", async (req: Request, res: Response) => {
    try {
        const { limit = "12" } = req.query;
        const limitNum = parseInt(limit as string);

        // List all blobs in the "demo" folder
        const result = await list({
            prefix: "demo/",
            limit: limitNum || 100,
        });

        // Transform blobs into product format
        let products = result.blobs
            .filter((blob) => {
                const ext = blob.pathname.toLowerCase();
                return (
                    ext.endsWith(".jpg") ||
                    ext.endsWith(".jpeg") ||
                    ext.endsWith(".png") ||
                    ext.endsWith(".webp")
                );
            })
            .map((blob, index) => {
                const filename = blob.pathname.split("/").pop() || `Product ${index + 1}`;
                const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");
                const formattedName = nameWithoutExt
                    .replace(/[-_]/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return {
                    id: `demo-${index}`,
                    name: formattedName || `Product ${index + 1}`,
                    description: `Demo product from Vercel Blob`,
                    basePriceAmount: Math.floor(Math.random() * 50000) + 10000,
                    baseCurrency: "UGX",
                    status: "active",
                    imageUrl: blob.url,
                };
            })
            .slice(0, limitNum);

        // FALLBACK: If no blobs found (e.g. user deleted folder), return static demo data
        if (products.length === 0) {
            products = Array.from({ length: 8 }).map((_, i) => ({
                id: `static-demo-${i}`,
                name: `Premium Item ${i + 1}`,
                description: "This is a sample product description to demonstrate the layout.",
                basePriceAmount: (i + 1) * 1500 + 2000,
                baseCurrency: "KES",
                status: "active",
                imageUrl: `https://images.unsplash.com/photo-${i % 2 === 0 ? '1523275335684-37898b6baf30' : '1505740420926-4d67395efdc2'}?auto=format&fit=crop&w=800&q=80`,
            }));
        }

        res.json(products);
    } catch (error) {
        console.error("[Demo Products] Error fetching demo products:", error);
        res.status(500).json({
            error: true,
            message: "Failed to fetch demo products",
        });
    }
});

export default router;
