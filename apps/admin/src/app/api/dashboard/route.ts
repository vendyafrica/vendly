import { db } from "@vendly/db/db";
import { tenants, stores, orders, storefrontSessions } from "@vendly/db/schema";
import { count, eq, gte, sum, desc } from "@vendly/db";
import { TTL, withCache } from "@vendly/db";
import { NextResponse } from "next/server";
import { checkSuperAdminApi } from "@/lib/auth-guard";

export async function GET() {
    const auth = await checkSuperAdminApi(["super_admin"]);
    if (auth.error) {
        return NextResponse.json(auth, { status: auth.status });
    }

    try {
        const data = await withCache(
            "admin:dashboard:super_admin",
            async () => {
                const now = new Date();
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

                // 1. Tenant Metrics
                const [totalTenants] = await db.select({ count: count() }).from(tenants);
                const [newTenants7d] = await db
                    .select({ count: count() })
                    .from(tenants)
                    .where(gte(tenants.createdAt, sevenDaysAgo));
                const [newTenants30d] = await db
                    .select({ count: count() })
                    .from(tenants)
                    .where(gte(tenants.createdAt, thirtyDaysAgo));

                // 2. Store Metrics
                const [totalStores] = await db.select({ count: count() }).from(stores);
                const [activeStores] = await db
                    .select({ count: count() })
                    .from(stores)
                    .where(eq(stores.status, true));
                const [inactiveStores] = await db
                    .select({ count: count() })
                    .from(stores)
                    .where(eq(stores.status, false));

                // 3. Marketplace Metrics
                // GMV (Paid Orders)
                const [gmvResult] = await db
                    .select({ total: sum(orders.totalAmount) })
                    .from(orders)
                    .where(eq(orders.paymentStatus, "paid"));
                const gmv = Number(gmvResult?.total || 0);

                const [totalOrders] = await db.select({ count: count() }).from(orders);
                // 4. Top Stores by Revenue
                const topStoresByRevenue = await db
                    .select({
                        storeId: orders.storeId,
                        storeName: stores.name,
                        revenue: sum(orders.totalAmount).mapWith(Number),
                    })
                    .from(orders)
                    .leftJoin(stores, eq(orders.storeId, stores.id))
                    .where(eq(orders.paymentStatus, "paid"))
                    .groupBy(orders.storeId, stores.name)
                    .orderBy(desc(sum(orders.totalAmount)))
                    .limit(5);

                // 5. Top Stores by Visits
                const topStoresByVisits = await db
                    .select({
                        storeId: storefrontSessions.storeId,
                        storeName: stores.name,
                        visits: count(),
                    })
                    .from(storefrontSessions)
                    .leftJoin(stores, eq(storefrontSessions.storeId, stores.id))
                    .groupBy(storefrontSessions.storeId, stores.name)
                    .orderBy(desc(count()))
                    .limit(5);

                return {
                    tenants: {
                        total: totalTenants.count,
                        new7d: newTenants7d.count,
                        new30d: newTenants30d.count,
                    },
                    stores: {
                        total: totalStores.count,
                        active: activeStores.count,
                        inactive: inactiveStores.count,
                    },
                    marketplace: {
                        gmv: gmv,
                        totalOrders: totalOrders.count,
                    },
                    topStores: {
                        byRevenue: topStoresByRevenue,
                        byVisits: topStoresByVisits,
                    },
                };
            },
            TTL.SHORT
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
