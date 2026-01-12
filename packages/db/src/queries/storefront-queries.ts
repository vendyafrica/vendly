import { db, stores, storeThemes, storeContent, templates, storeMemberships, eq } from "@vendly/db";

export const findStoreBySlug = async (slug: string) => {
    const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.slug, slug))
        .limit(1);
    return store || null;
};

export const findStoreById = async (id: string) => {
    const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.id, id))
        .limit(1);
    return store || null;
};

export const createStore = async (data: typeof stores.$inferInsert) => {
    const [store] = await db.insert(stores).values(data).returning();
    return store;
};

export const updateStoreStatus = async (storeId: string, status: "draft" | "active" | "suspended") => {
    await db
        .update(stores)
        .set({ status, updatedAt: new Date() })
        .where(eq(stores.id, storeId));
};

export const findTemplateBySlug = async (slug: string) => {
    const [template] = await db
        .select()
        .from(templates)
        .where(eq(templates.slug, slug))
        .limit(1);
    return template || null;
};

export const createStoreTheme = async (data: typeof storeThemes.$inferInsert) => {
    const [theme] = await db.insert(storeThemes).values(data).returning();
    return theme;
};

export const findThemeByStoreId = async (storeId: string) => {
    const [theme] = await db
        .select()
        .from(storeThemes)
        .where(eq(storeThemes.storeId, storeId))
        .limit(1);
    return theme || null;
};

export const updateStoreTheme = async (storeId: string, data: Partial<typeof storeThemes.$inferInsert>) => {
    await db
        .update(storeThemes)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(storeThemes.storeId, storeId));
};

export const createStoreContent = async (data: typeof storeContent.$inferInsert) => {
    const [content] = await db.insert(storeContent).values(data).returning();
    return content;
};

export const findContentByStoreId = async (storeId: string) => {
    const [content] = await db
        .select()
        .from(storeContent)
        .where(eq(storeContent.storeId, storeId))
        .limit(1);
    return content || null;
};

export const updateStoreContent = async (storeId: string, data: Partial<typeof storeContent.$inferInsert>) => {
    await db
        .update(storeContent)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(storeContent.storeId, storeId));
};

export const createStoreMembership = async (
    tenantId: string,
    storeId: string,
    userId: string,
    role: "store_owner" | "manager" | "seller" | "viewer" = "store_owner"
) => {
    await db.insert(storeMemberships).values({
        tenantId,
        storeId,
        userId,
        role,
    });
};

// Get complete store with theme and content
export const findCompleteStoreBySlug = async (slug: string) => {
    const store = await findStoreBySlug(slug);
    if (!store) return null;

    const [theme, content] = await Promise.all([
        findThemeByStoreId(store.id),
        findContentByStoreId(store.id),
    ]);

    return { store, theme, content };
};
