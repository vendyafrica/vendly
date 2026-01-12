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
