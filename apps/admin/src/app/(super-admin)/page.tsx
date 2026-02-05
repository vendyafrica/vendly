"use client";

import { useEffect, useState } from "react";
import { SegmentedStatsCard } from "./components/SegmentedStatsCard";
import { RevenueAreaChartCard } from "./components/RevenueAreaChartCard";
import { TopProductsBarChartCard } from "./components/TopProductsBarChartCard";
import { TopStoresCard } from "./components/TopStoresCard";

// Mock data for revenue chart
const mockRevenueData = [
  { date: "Jan", total: 125000 },
  { date: "Feb", total: 189000 },
  { date: "Mar", total: 156000 },
  { date: "Apr", total: 210000 },
  { date: "May", total: 258000 },
  { date: "Jun", total: 295000 },
  { date: "Jul", total: 342000 },
  { date: "Aug", total: 399520 },
  { date: "Sep", total: 378000 },
  { date: "Oct", total: 425000 },
  { date: "Nov", total: 410000 },
  { date: "Dec", total: 520000 },
];

// Mock data for top stores by orders
const topStoresByOrders = [
  { product: "Vendly Store A", sales: 1262, fill: "hsl(var(--primary))" },
  { product: "Vendly Store B", sales: 1062, fill: "hsl(var(--primary))" },
  { product: "Vendly Store C", sales: 862, fill: "hsl(var(--primary))" },
  { product: "Vendly Store D", sales: 662, fill: "hsl(var(--primary))" },
  { product: "Vendly Store E", sales: 420, fill: "hsl(var(--primary))" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="text-sm text-destructive">Failed to load dashboard data.</div>
      </div>
    );
  }

  const { tenants, stores, marketplace, topStores } = data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and key metrics
        </p>
      </div>

      {/* KPI Stats */}
      <SegmentedStatsCard
        segments={[
          {
            label: "Total Revenue",
            value: formatCurrency(marketplace.gmv),
            changeLabel: "Lifetime GMV",
            changeTone: "neutral",
          },
          {
            label: "Total Stores",
            value: stores.total.toString(),
            changeLabel: `${stores.active} active`,
            changeTone: "positive",
          },
          {
            label: "Tenants",
            value: tenants.total.toString(),
            changeLabel: `+${tenants.new30d} last 30 days`,
            changeTone: "positive",
          },
          {
            label: "Total Orders",
            value: marketplace.totalOrders.toString(),
            changeLabel: "Across all stores",
            changeTone: "neutral",
          },
        ]}
      />

      {/* Charts Section */}
      <div className="grid gap-5 md:grid-cols-7 lg:grid-cols-7">
        <RevenueAreaChartCard
          className="md:col-span-4"
          title="Platform Revenue"
          totalLabel={formatCurrency(marketplace.gmv)}
          data={mockRevenueData}
        />
        <TopProductsBarChartCard
          className="md:col-span-3"
          title="Top Stores"
          description="By order volume"
          totalLabel={stores.total.toString()}
          data={topStoresByOrders}
        />
      </div>

      {/* Top Stores Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        <TopStoresCard
          title="Top Stores by Revenue"
          description="Stores generating the most paid revenue"
          stores={topStores.byRevenue}
          formatValue={(store) => formatCurrency(store.revenue)}
        />
        <TopStoresCard
          title="Top Stores by Traffic"
          description="Most visited stores (sessions)"
          stores={topStores.byVisits}
          formatValue={(store) => `${(store as any).visits} visits`}
        />
      </div>
    </div>
  );
}
