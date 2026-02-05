"use client";

import * as React from "react";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    currency: string;
    createdAt: Date;
    storeName: string | null;
    tenantName: string | null;
}

export default function OrdersPage() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetch("/api/orders")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">
                        Global orders across all stores.
                    </p>
                </div>
            </div>

            <div className="rounded-md border bg-card p-4">
                {isLoading ? (
                    <p>Loading orders...</p>
                ) : (
                    <div className="space-y-2">
                        {orders.length === 0 ? (
                            <p className="text-muted-foreground">No orders found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Order #</th>
                                            <th className="text-left p-2">Store</th>
                                            <th className="text-left p-2">Status</th>
                                            <th className="text-left p-2">Payment</th>
                                            <th className="text-right p-2">Amount</th>
                                            <th className="text-left p-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b">
                                                <td className="p-2">{order.orderNumber}</td>
                                                <td className="p-2">{order.storeName || 'N/A'}</td>
                                                <td className="p-2">{order.status}</td>
                                                <td className="p-2">{order.paymentStatus}</td>
                                                <td className="p-2 text-right">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: order.currency }).format(order.totalAmount)}</td>
                                                <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
