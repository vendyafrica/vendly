import { Request, Response } from "express";
import { storefrontRepository } from "./storefront-repository";

/**
 * GET /api/storefront/:slug
 * Returns store header/hero data
 */
export async function getStoreData(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const store = await storefrontRepository.findStoreBySlug(slug);

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        return res.json({
            name: store.name,
            slug: store.slug,
            description: store.description,
            rating: 0, // Store rating not yet implemented
            ratingCount: 0,
        });
    } catch (error) {
        console.error("Error fetching store data:", error);
        return res.status(500).json({ error: "Failed to fetch store data" });
    }
}

/**
 * GET /api/storefront/:slug/categories
 * Returns store categories
 */
export async function getStoreCategories(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const store = await storefrontRepository.findStoreBySlug(slug);

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        // Categories are stored as string[] in store
        const categories = (store.categories ?? []).map((name) => ({
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            image: null, // Category images not yet implemented
        }));

        return res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories" });
    }
}

/**
 * GET /api/storefront/:slug/products
 * Returns store products list
 */
export async function getStoreProducts(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const store = await storefrontRepository.findStoreBySlug(slug);

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const productList = await storefrontRepository.getStoreProducts(store.id);

        return res.json(
            productList.map((p) => ({
                id: p.id,
                slug: p.productName.toLowerCase().replace(/\s+/g, "-"),
                name: p.productName,
                price: p.priceAmount,
                currency: p.currency,
                image: p.media[0]?.media?.blobUrl ?? null,
                rating: 0,
            }))
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
}
