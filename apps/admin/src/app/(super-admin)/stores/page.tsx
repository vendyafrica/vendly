"use client";

import * as React from "react";
import { StoreTable, type Store } from "./components/store-table";
import { StoreStats } from "./components/store-stats";

export default function StoresPage() {
    const [stores, setStores] = React.useState<Store[]>([]);
    const [stats, setStats] = React.useState({
        totalStores: 0,
        totalRevenue: 0,
        totalSales: 0,
    });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [storesRes, dashboardRes] = await Promise.all([
                    fetch("/api/stores"),
                    fetch("/api/dashboard")
                ]);

                const storesData = await storesRes.json();
                const dashboardData = await dashboardRes.json();

                if (Array.isArray(storesData)) {
                    setStores(storesData);
                }

                if (dashboardData.stores && dashboardData.marketplace) {
                    setStats({
                        totalStores: dashboardData.stores.total,
                        totalRevenue: dashboardData.marketplace.gmv,
                        totalSales: dashboardData.marketplace.totalOrders
                    });
                }
            } catch (error) {
                console.error("Failed to fetch stores:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
                    <p className="text-muted-foreground">
                        Overview of all stores and their performance.
                    </p>
                </div>
            </div>

            <StoreStats stats={stats} isLoading={isLoading} />

            <div className="rounded-md border bg-card">
                <StoreTable stores={stores} isLoading={isLoading} />
            </div>
        </div>
    );
}