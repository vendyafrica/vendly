"use client";

import { StatsCard } from "./dashboard/components/stats-card";
import { SalesTrendChart } from "./dashboard/components/sales-trend-chart";
import { GrowthInsightsChart } from "./dashboard/components/growth-insights-chart";
import { TransactionsTable } from "./dashboard/components/transactions-table";
import { columns, Transaction } from "./dashboard/components/columns";
import { ShoppingBag, Users, DollarSign, RefreshCw } from "lucide-react";

// Updated Mock Data to look more realistic
const transactionData: Transaction[] = [
  {
    id: "#789901",
    customer: "Oliver John Brown",
    product: "Shoes, Shirt",
    status: "pending",
    qty: 2,
    unitPrice: 394.5,
    totalRevenue: 789.0,
  },
  {
    id: "#789902",
    customer: "Noah James Smith",
    product: "Sneakers, T-shirt",
    status: "success",
    qty: 3,
    unitPrice: 322.33,
    totalRevenue: 967.0,
  },
  {
    id: "#789903",
    customer: "William Robert",
    product: "Jeans, Jacket",
    status: "processing",
    qty: 2,
    unitPrice: 450.0,
    totalRevenue: 900.0,
  },
  {
    id: "#789904",
    customer: "Lucas Michael",
    product: "Watch, Belt",
    status: "failed",
    qty: 1,
    unitPrice: 120.0,
    totalRevenue: 120.0,
  },
  {
    id: "#789905",
    customer: "James William",
    product: "Phone Case",
    status: "success",
    qty: 5,
    unitPrice: 20.0,
    totalRevenue: 100.0,
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      {/* 1. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value="2,500"
          change="4.9%"
          trend="up"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Total Customers"
          value="1,340"
          change="2.7%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Total Revenue"
          value="$5,567"
          change="4.9%"
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Returning Buyers"
          value="865"
          change="3.4%"
          trend="up"
          icon={RefreshCw}
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[420px]">
          <SalesTrendChart />
        </div>
        <div className="h-[420px]">
          <GrowthInsightsChart />
        </div>
      </div>

      {/* 3. Transactions Table */}
      {/* Fixed height to show approx 5-6 rows comfortably */}
      <div className="h-[500px]">
        <TransactionsTable columns={columns} data={transactionData} />
      </div>

      <div className="h-4" />
    </div>
  );
}