"use client";

import { StatsCard } from "./components/stats-card";
import { SalesTrendChart } from "./components/sales-trend-chart"
import { GrowthInsightsChart } from "./components/growth-insights-chart"
import { TransactionsTable } from "./components/transactions-table"
import { columns, Transaction } from "./components/columns"

const transactionData: Transaction[] = [
  {
    id: "#04910",
    customer: "Ryan Korsgaard",
    product: "Ergo Office Chair",
    status: "success",
    qty: 12,
    unitPrice: 3450,
    totalRevenue: 41400,
  },
  {
    id: "#04911",
    customer: "Madelyn Lubin",
    product: "Sunset Desk 02",
    status: "success",
    qty: 20,
    unitPrice: 2980,
    totalRevenue: 89200,
  },
  {
    id: "#04912",
    customer: "Abram Bergson",
    product: "Eco Bookshelf",
    status: "pending",
    qty: 22,
    unitPrice: 1750,
    totalRevenue: 75900,
  },
  {
    id: "#04913",
    customer: "Phillip Mango",
    product: "Green Leaf Desk",
    status: "processing",
    qty: 24,
    unitPrice: 1950,
    totalRevenue: 19500,
  },
];

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Main Content - Scrollable */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center h-16 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Welcome back, Salung</h1>
            <p className="text-xs text-gray-500">Here's what's happening with your store today</p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Revenue" value="$20,320" change="+0.94" period="last year" />
            <StatsCard title="Total Orders" value="10,320" change="+0.94" period="last year" />
            <StatsCard title="New Customers" value="4,305" change="+0.94" period="last year" />
            <StatsCard title="Conversion Rate" value="3.9%" change="+0.94" period="last year" />
          </div>

          {/* Charts Row - Fixed Height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
            {/* Sales Trend takes up 2/3 space */}
            <div className="lg:col-span-2">
              <SalesTrendChart />
            </div>
            {/* Growth Insights takes up 1/3 space */}
            <div>
              <GrowthInsightsChart />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <TransactionsTable columns={columns} data={transactionData} />
          </div>
          
          {/* Bottom spacer for scrolling comfort */}
          <div className="h-4"></div>
        </div>
      </main>
    </div>
  );
}