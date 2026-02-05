"use client";

import * as React from "react";
import { TenantTable, type Tenant } from "./components/tenant-table";
import { TenantStats } from "./components/tenant-stats";

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
                const [tenantsRes, dashboardRes] = await Promise.all([
                    fetch("/api/tenants"),
                    fetch("/api/dashboard")
                ]);

                const tenantsData = await tenantsRes.json();
                const dashboardData = await dashboardRes.json();

                if (Array.isArray(tenantsData)) {
                    setTenants(tenantsData);
                }

                if (dashboardData.tenants) {
                    setStats({
                        totalTenants: dashboardData.tenants.total,
                        newThisMonth: dashboardData.tenants.new30d,
                        activePlans: 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
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