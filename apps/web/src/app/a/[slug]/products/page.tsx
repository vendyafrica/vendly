"use client";

import { SegmentedStatsCard } from "../components/SegmentedStatsCard";
import { DataTable } from "../components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { AddProductButton } from "./components/add-product-button";

type ProductRow = {
  name: string;
  price: number;
  currency: string;
  inventory: number;
  sales: number;
  status: "Active" | "Draft" | "Low Stock";
};

const products: ProductRow[] = [
  { name: "Winter Beanie", price: 49.2, currency: "USD", inventory: 120, sales: 12628, status: "Active" },
  { name: "Leather Wallet", price: 75.5, currency: "USD", inventory: 60, sales: 10628, status: "Active" },
  { name: "Wireless Earbuds", price: 149, currency: "USD", inventory: 35, sales: 8628, status: "Active" },
  { name: "Yoga Mat", price: 42, currency: "USD", inventory: 18, sales: 6628, status: "Low Stock" },
  { name: "Running Sneakers", price: 120, currency: "USD", inventory: 8, sales: 4200, status: "Low Stock" },
  { name: "Baseball Cap", price: 35, currency: "USD", inventory: 42, sales: 3200, status: "Draft" },
];

const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => new Intl.NumberFormat("en-US", { style: "currency", currency: row.original.currency }).format(row.original.price),
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
  },
  {
    accessorKey: "sales",
    header: "Sales",
    cell: ({ row }) => row.original.sales.toLocaleString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const tone = status === "Active" ? "text-emerald-600" : status === "Low Stock" ? "text-amber-600" : "text-muted-foreground";
      return <span className={`text-sm font-medium ${tone}`}>{status}</span>;
    },
  },
];

export default function ProductsPage() {
  const statSegments = [
    {
      label: "Total Products",
      value: "248",
      changeLabel: "+4.2% vs last 30 days",
      changeTone: "positive" as const,
    },
    {
      label: "Active",
      value: "182",
      changeLabel: "+2.1% vs last 30 days",
      changeTone: "positive" as const,
    },
    {
      label: "Low Stock",
      value: "24",
      changeLabel: "+6 items vs last 30 days",
      changeTone: "neutral" as const,
    },
    {
      label: "Drafts",
      value: "18",
      changeLabel: "-3 vs last 30 days",
      changeTone: "positive" as const,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Keep your catalog tidy and stay on top of stock.</p>
        </div>
        <AddProductButton
          onUploadClick={() => {
            /* TODO: hook to upload flow */
          }}
          onInstagramClick={() => {
            /* TODO: hook to instagram import */
          }}
        />
      </div>

      <SegmentedStatsCard segments={statSegments} />

      <div className="rounded-md border bg-card p-3">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}