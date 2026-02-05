"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@vendly/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store03Icon,
  UserGroup02Icon,
  ShoppingBasket01Icon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons";

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
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8">Failed to load dashboard data.</div>;
  }

  const { tenants, stores, marketplace, topStores } = data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <HugeiconsIcon icon={Wallet03Icon} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(marketplace.gmv)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime GMV (Paid Orders)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <HugeiconsIcon icon={Store03Icon} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.total}</div>
            <p className="text-xs text-muted-foreground">
              {stores.active} active stores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
            <HugeiconsIcon icon={UserGroup02Icon} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.total}</div>
            <p className="text-xs text-muted-foreground">
              +{tenants.new30d} new in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <HugeiconsIcon icon={ShoppingBasket01Icon} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplace.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Across all stores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Stores Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Stores by Revenue</CardTitle>
            <CardDescription>
              Stores generating the most paid revenue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {topStores.byRevenue.map((store: any) => (
                <div className="flex items-center" key={store.storeId}>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{store.storeName}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {store.storeId.substring(0, 8)}...
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(store.revenue)}
                  </div>
                </div>
              ))}
              {topStores.byRevenue.length === 0 && (
                <p className="text-sm text-muted-foreground">No data available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top by Traffic</CardTitle>
            <CardDescription>
              Most visited stores (sessions).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {topStores.byVisits.map((store: any) => (
                <div className="flex items-center" key={store.storeId}>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{store.storeName}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    {store.visits} visits
                  </div>
                </div>
              ))}
              {topStores.byVisits.length === 0 && (
                <p className="text-sm text-muted-foreground">No data available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
