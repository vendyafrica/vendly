/**
 * Dynamic chart component wrappers
 * These components use next/dynamic to code-split heavy chart libraries (recharts)
 * and improve initial bundle size and page load performance.
 */

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@vendly/ui/components/card";
import { cn } from "@vendly/ui/lib/utils";

// Loading skeleton for charts
function ChartSkeleton({ className }: { className?: string }) {
    return (
        <Card className={cn("w-full border-border/70 shadow-sm", className)}>
            <CardHeader className="space-y-1 pb-2">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="px-3 pb-4 md:px-5">
                <div className="aspect-auto h-[260px] w-full md:h-[320px] bg-muted animate-pulse rounded" />
            </CardContent>
        </Card>
    );
}

// Dynamic imports with loading states
export const RevenueAreaChartCard = dynamic(
    () => import("./RevenueAreaChartCard").then((mod) => ({ default: mod.RevenueAreaChartCard })),
    {
        loading: () => <ChartSkeleton />,
        ssr: false, // Charts don't need SSR, save server processing time
    }
);

export const TopProductsBarChartCard = dynamic(
    () => import("./TopProductsBarChartCard").then((mod) => ({ default: mod.TopProductsBarChartCard })),
    {
        loading: () => <ChartSkeleton />,
        ssr: false,
    }
);

export const VisitsAreaChartCard = dynamic(
    () => import("./VisitsAreaChartCard").then((mod) => ({ default: mod.VisitsAreaChartCard })),
    {
        loading: () => <ChartSkeleton />,
        ssr: false,
    }
);

// Re-export types for convenience
export type { RevenuePoint } from "./RevenueAreaChartCard";
export type { TopProductPoint } from "./TopProductsBarChartCard";
export type { VisitsPoint } from "./VisitsAreaChartCard";
