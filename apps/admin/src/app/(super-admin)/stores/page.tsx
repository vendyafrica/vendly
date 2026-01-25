"use client";

import * as React from "react";
import { StoreTable, type Store } from "./components/store-table";
import { StoreStats } from "./components/store-stats";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
                const res = await fetch(`${API_BASE}/api/admin/stores`);
                const data = await res.json();

                if (data.success) {
                    setStores(data.data.stores);
                    setStats(data.data.stats);
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