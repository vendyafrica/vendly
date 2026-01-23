"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { OrderTable, type OrderTableRow, type OrderStatus } from "./components/order-table";
import { OrderStats } from "./components/order-stats";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon, FilterIcon } from "@hugeicons/core-free-icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface OrderAPIResponse {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    currency: string;
    createdAt: string;
}

interface OrderStatsResponse {
    totalRevenue: number;
    orderCount: number;
    pendingCount: number;
    refundedAmount: number;
    currency: string;
}

export default function OrdersPage() {
    const params = useParams();
    const tenantSlug = params?.tenant as string;

    const [tenantId, setTenantId] = React.useState<string>("");
    const [orders, setOrders] = React.useState<OrderTableRow[]>([]);
    const [stats, setStats] = React.useState<OrderStatsResponse | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Fetch orders
    const fetchOrders = React.useCallback(async () => {
        if (!tenantId) return;

        if (orders.length === 0) {
            setIsLoading(true);
        }
        setError(null);

        try {
            // Fetch orders list
            const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
                headers: {
                    "x-tenant-id": tenantId,
                    "x-tenant-slug": tenantSlug,
                },
            });

            if (!ordersResponse.ok) {
                throw new Error(`Failed to fetch orders: ${ordersResponse.status}`);
            }

            const ordersData = await ordersResponse.json();
            const orderList: OrderAPIResponse[] = ordersData.data?.orders || [];

            // Transform API response to table format
            const transformed: OrderTableRow[] = orderList.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                customerName: o.customerName,
                customerEmail: o.customerEmail,
                status: o.status as OrderStatus,
                paymentStatus: o.paymentStatus as any,
                paymentMethod: o.paymentMethod,
                totalAmount: o.totalAmount,
                currency: o.currency,
                createdAt: o.createdAt,
            }));

            setOrders(transformed);

            // Fetch stats
            const statsResponse = await fetch(`${API_BASE}/api/orders/stats`, {
                headers: {
                    "x-tenant-id": tenantId,
                    "x-tenant-slug": tenantSlug,
                },
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }, [tenantId, tenantSlug, orders.length]);

    // Initial fetch - get tenant info from localStorage
    React.useEffect(() => {
        const storedTenantId = localStorage.getItem("vendly_tenant_id");
        if (storedTenantId) {
            setTenantId(storedTenantId);
        }
    }, []);

    React.useEffect(() => {
        if (tenantId) {
            fetchOrders();
        }
    }, [tenantId, fetchOrders]);

    const handleViewDetails = (id: string) => {
        // TODO: Open order details modal
        console.log("View order details:", id);
    };

    const handleUpdateStatus = async (id: string, status: OrderStatus) => {
        try {
            const response = await fetch(`${API_BASE}/api/orders/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-id": tenantId,
                    "x-tenant-slug": tenantSlug,
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error("Failed to update order status");
            }

            // Refresh orders
            fetchOrders();
        } catch (err) {
            console.error("Update status failed:", err);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor and manage your customer orders.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <HugeiconsIcon icon={Download04Icon} className="h-4 w-4" /> Export
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <HugeiconsIcon icon={FilterIcon} className="h-4 w-4" /> Filter
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                    {error}
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={fetchOrders}
                    >
                        Retry
                    </Button>
                </div>
            )}

            <OrderStats
                totalRevenue={stats?.totalRevenue || 0}
                orderCount={stats?.orderCount || 0}
                pendingCount={stats?.pendingCount || 0}
                refundedAmount={stats?.refundedAmount || 0}
                currency={stats?.currency || "KES"}
                isLoading={isLoading}
            />

            <div className="rounded-md border bg-card">
                <OrderTable
                    orders={orders}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateStatus}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
