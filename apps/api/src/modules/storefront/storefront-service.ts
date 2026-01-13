import { CreateStorefrontRequest, StorefrontResponse } from "./storefront-types";
import {
    buildStoreData,
    buildThemeData,
    buildContentData,
    buildStorefrontResponse,
} from "./storefront-builder";
import {
    findStoreBySlug,
    findStoreById,
    createStore,
    updateStoreStatus,
    findTemplateBySlug,
    createStoreTheme,
    findThemeByStoreId,
    updateStoreTheme,
    createStoreContent,
    findContentByStoreId,
    updateStoreContent,
    findCompleteStoreBySlug,
} from "@vendly/db";

// Create complete storefront (store + theme + content)
export const createStorefront = async (
    request: CreateStorefrontRequest
): Promise<StorefrontResponse> => {
    // 1. Check if store slug exists
    const existingStore = await findStoreBySlug(request.storeSlug);
    if (existingStore) {
        throw new Error("Store slug already exists");
    }

    // 2. Find template if provided
    let templateId: string | undefined;
    if (request.themeId) {
        const template = await findTemplateBySlug(request.themeId);
        templateId = template?.id;
    }

    // 3. Create store
    const storeData = buildStoreData(request);
    const store = await createStore(storeData);

    // 4. Create theme and content in parallel
    const themeData = buildThemeData(store.tenantId, store.id, templateId);
    const contentData = buildContentData(store.tenantId, store.id, request.storeName);

    const [theme, content] = await Promise.all([
        createStoreTheme(themeData),
        createStoreContent(contentData),
    ]);

    // 5. Build response
    return buildStorefrontResponse(store, theme, content);
};

// Get storefront by slug (public view)
export const getStorefrontBySlug = async (
    slug: string
): Promise<StorefrontResponse | null> => {
    const result = await findCompleteStoreBySlug(slug);
    if (!result) return null;

    const { store, theme, content } = result;
    return buildStorefrontResponse(store, theme, content);
};

// Get storefront by ID
export const getStorefrontById = async (
    id: string
): Promise<StorefrontResponse | null> => {
    const store = await findStoreById(id);
    if (!store) return null;

    const [theme, content] = await Promise.all([
        findThemeByStoreId(store.id),
        findContentByStoreId(store.id),
    ]);

    return buildStorefrontResponse(store, theme, content);
};

// Update storefront theme
export const updateStorefrontTheme = async (
    storeId: string,
    themeData: any
): Promise<void> => {
    await updateStoreTheme(storeId, themeData);
};

// Update storefront content
export const updateStorefrontContent = async (
    storeId: string,
    contentData: any
): Promise<void> => {
    await updateStoreContent(storeId, contentData);
};

// Publish storefront
export const publishStorefront = async (
    storeId: string
): Promise<void> => {
    await updateStoreStatus(storeId, "active");
};

// Get products from blob storage (temporary - hardcoded)
// import { uploadService } from "../storage/blob-service";

export const getStorefrontProducts = async (
    slug: string,
    limit: number = 12
) => {
    // Hardcoded products for demo
    const demoImages = [
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/327%2B%20Free%20Mockup%20T-Shirt.jpg",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/BAGGY%20PULL-ON%20CARGO%20PANTS.jpg",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Burberry%20Wool%20And%20Silk%20Blend%20Trousers%20-%20Black.jpg",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/FRAME%20Textured%20Short%20Sleeve%20Button-Up%20Shirt%20in%20Black%20at%20Nordstrom%2C%20Size%20Small.jpg",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/G_H.BASS%20Weejuns%C2%AE%20Whitney%20Super%20Lug%20Loafers",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Gabine%20buckled%20leather%20loafer%20mules.jpg",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Gestreiftes%20Hemd%20-%20Polo%20-%20Button-Up%20-%20Langarmhemd%20-%20Herrenhemden%20-%20Gr%C3%BCn%20_%20XL.jpg",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Men%20Drawstring%20Waist%20Straight%20Leg%20Trousers.jpg",
        "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Men%20Lapel%20Short%20Sleeve%20Label%20Texture%20Daily%20Casual%20Slouchy%20Vacation%20Shirt.jpg"
    ];

    const products = demoImages.map((url, index) => {
        // Clean up filename to make a title
        // 1. Get filename part
        // 2. Decode URI component (handle %20, etc)
        // 3. Remove extension
        // 4. Remove extra garbage characters
        const filename = decodeURIComponent(url.split('/').pop() || "");
        const title = filename
            .replace(/\.[^/.]+$/, "") // remove extension
            .replace(/[-_]/g, " ")    // replace separators with spaces
            .replace(/%2B/g, " ")     // replace encoded +
            .replace(/%2C/g, ",")     // replace encoded ,
            .replace(/%C2%AE/g, "")   // remove registered trademark symbol
            .replace(/%C3%BC/g, "ü")  // fix umlaut
            .replace(/^\d+\+?\s*/, "") // remove leading numbers like "327+ "
            .trim();

        return {
            id: `prod_${index + 1}`,
            title: title || `Product ${index + 1}`,
            description: "Premium quality fashion item from our exclusive collection.",
            priceAmount: 2500 + (index * 500), // Variable mock prices
            currency: "KES",
            status: "active",
            imageUrl: url,
            images: [{ url: url }]
        };
    });

    return products.slice(0, limit);
};
