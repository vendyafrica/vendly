"use client";

import { OrdersTable } from "./orders-table";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Title Area */}
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-foreground">Orders</h1>
         <div className="text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">Home</span>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Orders</span>
         </div>
      </div>

      {/* Main Table Component */}
      <OrdersTable />
    </div>
  );
}