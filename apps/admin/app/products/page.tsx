"use client";

import { ProductsTable } from "./product.table";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Title Area */}
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-foreground">Products</h1>
         <div className="text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">Home</span>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Products</span>
         </div>
      </div>

      {/* Main Table Component */}
      <ProductsTable />
    </div>
  );
}