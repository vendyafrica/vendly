"use client";

import * as React from "react";
import { TenantTable, type Tenant } from "./components/tenant-table";
import { TenantStats } from "./components/tenant-stats";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TenantsPage() {
    const [tenants, setTenants] = React.useState<Tenant[]>([]);
    const [stats, setStats] = React.useState({
        totalTenants: 0,
        newThisMonth: 0,
        activePlans: 0,
    });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/admin/tenants`);
                const data = await res.json();

                if (data.success) {
                    setTenants(data.data.tenants);
                    setStats(data.data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch tenants:", error);
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
                    <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
                    <p className="text-muted-foreground">
                        Manage all tenants registered on the platform.
                    </p>
                </div>
            </div>

            <TenantStats stats={stats} isLoading={isLoading} />

            <div className="rounded-md border bg-card">
                <TenantTable tenants={tenants} isLoading={isLoading} />
            </div>
        </div>
    );
}