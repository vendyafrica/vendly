import { db } from "@vendly/db";
import {
    tenants,
    stores,
    users,
    categories,
    type NewCategory,
} from "@vendly/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const adminRepository = {
    // Tenants
    findAllTenants: async () => {
        return await db.select().from(tenants).orderBy(desc(tenants.createdAt));
    },

    // Stores
    findAllStores: async () => {
        return await db
            .select({
                id: stores.id,
                name: stores.name,
                slug: stores.slug,
                storeRating: stores.storeRating,
                status: stores.status,
                storeContactPhone: stores.storeContactPhone,
                storeAddress: stores.storeAddress,
                createdAt: stores.createdAt,
                customDomain: stores.customDomain,
                tenantName: tenants.fullName,
            })
            .from(stores)
            .leftJoin(tenants, eq(stores.tenantId, tenants.id))
            .orderBy(desc(stores.createdAt));
    },

    // Users
    findAllUsers: async () => {
        return await db.select().from(users).orderBy(desc(users.createdAt));
    },

    // Categories
    findAllCategories: async () => {
        return await db.query.categories.findMany({
            with: {
                children: true,
            },
            where: (categories, { eq }) => eq(categories.level, 0),
        });
    },

    createCategory: async (data: NewCategory) => {
        return await db.insert(categories).values(data).returning();
    },

    // Stats
    getTenantStats: async () => {
        const [total] = await db.select({ count: sql<number>`count(*)` }).from(tenants);
        // Mocking "new this month" and "active plans" for now or implementing real query
        return {
            totalTenants: Number(total?.count || 0),
            newThisMonth: 0, // Placeholder
            activePlans: 0,  // Placeholder
        };
    },

    getStoreStats: async () => {
        const [total] = await db.select({ count: sql<number>`count(*)` }).from(stores);
        return {
            totalStores: Number(total?.count || 0),
            totalRevenue: 0, // Placeholder
            totalSales: 0,   // Placeholder
        };
    },
};
