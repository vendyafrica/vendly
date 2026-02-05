"use client";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@vendly/ui/components/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card";
import { cn } from "@vendly/ui/lib/utils";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export type StoreData = {
    storeId: string;
    storeName: string;
    revenue: number;
    // Optional: add traffic or other metrics if needed
    orders?: number;
};

export function TopStoresCard({
    title,
    description,
    stores,
    dataKey = "revenue",
    className,
}: {
    title: string;
    description: string;
    stores: StoreData[];
    dataKey?: keyof StoreData;
    formatValue?: (store: StoreData) => string; // Kept for compatibility but unused in chart for now
    className?: string;
}) {
    const totalValue = stores.reduce((acc, curr) => acc + (Number(curr[dataKey]) || 0), 0);
    const formattedTotal = new Intl.NumberFormat("en-US", {
        style: dataKey === "revenue" ? "currency" : "decimal",
        currency: "UGX",
        minimumFractionDigits: 0,
    }).format(totalValue);

    const chartConfig = {
        [dataKey]: {
            label: dataKey === "revenue" ? "Revenue" : "Value",
            color: "hsl(var(--primary))",
        },
    } satisfies ChartConfig;

    return (
        <Card className={cn("w-full border-border/70 shadow-sm", className)}>
            <CardHeader className="space-y-1 pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
                <div className="text-3xl font-bold text-foreground">{formattedTotal}</div>
            </CardHeader>
            <CardContent className="px-3 pb-4 md:px-5">
                <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full md:h-[320px]">
                    <BarChart
                        accessibilityLayer
                        data={stores}
                        layout="vertical"
                        margin={{
                            left: 0,
                            right: 16,
                            top: 8,
                            bottom: 8,
                        }}
                    >
                        <YAxis
                            dataKey="storeName"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={120}
                            tick={{ fontSize: 12 }}
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey={dataKey as string}
                            fill={`var(--color-${dataKey})`}
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
