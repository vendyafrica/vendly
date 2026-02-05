"use client";

import * as React from "react";

interface Payment {
    id: string;
    provider: string;
    providerReference: string | null;
    status: string;
    amount: number;
    currency: string;
    createdAt: Date;
    orderNumber: string | null;
    storeName: string | null;
}

export default function PaymentsPage() {
    const [payments, setPayments] = React.useState<Payment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetch("/api/payments")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPayments(data);
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
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground">
                        Global payments history.
                    </p>
                </div>
            </div>

            <div className="rounded-md border bg-card p-4">
                {isLoading ? (
                    <p>Loading payments...</p>
                ) : (
                    <div className="space-y-2">
                        {payments.length === 0 ? (
                            <p className="text-muted-foreground">No payments found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Provider</th>
                                            <th className="text-left p-2">Reference</th>
                                            <th className="text-left p-2">Store</th>
                                            <th className="text-left p-2">Order #</th>
                                            <th className="text-left p-2">Status</th>
                                            <th className="text-right p-2">Amount</th>
                                            <th className="text-left p-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="border-b">
                                                <td className="p-2">{payment.provider}</td>
                                                <td className="p-2 font-mono text-xs">{payment.providerReference || 'N/A'}</td>
                                                <td className="p-2">{payment.storeName || 'N/A'}</td>
                                                <td className="p-2">{payment.orderNumber || 'N/A'}</td>
                                                <td className="p-2">{payment.status}</td>
                                                <td className="p-2 text-right">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: payment.currency }).format(payment.amount)}</td>
                                                <td className="p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
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
