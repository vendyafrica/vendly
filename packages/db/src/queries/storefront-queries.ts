import { db, stores, storeMemberships, templates, eq } from "@vendly/db";
import { StoreData } from "../types/onboarding-types";

export const findTemplateBySlug = async (slug: string) => {
    return await db.query.templates.findFirst({
        where: eq(templates.slug, slug)
    });
};

export const createStore = async (data: StoreData) => {
    const [store] = await db.insert(stores).values(data).returning();
    return store;
};

export const createStoreMembership = async (
    tenantId: string,
    storeId: string,
    userId: string,
    role: "store_owner" = "store_owner"
) => {
    await db.insert(storeMemberships).values({
        tenantId,
        storeId,
        userId,
        role,
    });
};

export const updateStoreSocials = async (
    storeId: string,
    data: {
        instagramUrl?: string;
        facebookUrl?: string;
        twitterUrl?: string;
        address?: string;
    }
) => {
    await db.update(stores).set(data).where(eq(stores.id, storeId));
};

