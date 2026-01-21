"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@vendly/ui/components/card";

interface StatCardProps {
    label: string;
    value: string;
    change: string;
    changeType?: "positive" | "negative" | "neutral";
}

function StatCard({ label, value, change, changeType = "neutral" }: StatCardProps) {
    const changeColorClass =
        changeType === "positive"
            ? "text-green-600 dark:text-green-400"
            : changeType === "negative"
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground";

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs ${changeColorClass}`}>{change}</p>
            </CardContent>
        </Card>
    );
}

interface ProductStatsProps {
    totalProducts?: number;
    totalSales?: number;
    activeNow?: number;
    newProducts?: number;
    lowStock?: number;
}

export function ProductStats({
    totalProducts = 0,
    totalSales = 0,
    activeNow = 0,
    newProducts = 0,
    lowStock = 3,
}: ProductStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Total Products"
                value={totalProducts.toLocaleString()}
                change="+12.5% from last month"
                changeType="positive"
            />
            <StatCard
                label="Active Now"
                value={activeNow.toLocaleString()}
                change="+5 since last hour"
                changeType="positive"
            />
            <StatCard
                label="New This Month"
                value={`+${newProducts}`}
                change="+5% from last month"
                changeType="positive"
            />
            <StatCard
                label="Low Stock"
                value={lowStock.toLocaleString()}
                change="-2 from last month"
                changeType="negative"
            />
        </div>
    );
}
