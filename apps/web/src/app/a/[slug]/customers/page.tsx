"use client";

import { SegmentedStatsCard } from "../components/SegmentedStatsCard";
import { DataTable } from "../components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

type CustomerRow = {
  name: string;
  email: string;
  orders: number;
  totalSpend: number;
  lastOrder: string;
  status: "Active" | "Churn Risk" | "New";
};

const customers: CustomerRow[] = [
  { name: "Alex Morgan", email: "alex@domain.com", orders: 42, totalSpend: 12850, lastOrder: "2025-11-16T10:15:00Z", status: "Active" },
  { name: "Megan Rapin", email: "megan@domain.com", orders: 31, totalSpend: 9870, lastOrder: "2025-11-13T16:20:00Z", status: "Active" },
  { name: "Kristie Mewis", email: "kristie@domain.com", orders: 18, totalSpend: 6420, lastOrder: "2025-11-14T15:42:00Z", status: "New" },
  { name: "Rose Lavelle", email: "rose@domain.com", orders: 22, totalSpend: 8200, lastOrder: "2025-11-15T17:54:00Z", status: "Active" },
  { name: "Tobin Heath", email: "tobin@domain.com", orders: 9, totalSpend: 3120, lastOrder: "2025-11-16T09:45:00Z", status: "Churn Risk" },
];

const columns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "orders",
    header: "Orders",
  },
  {
    accessorKey: "totalSpend",
    header: "Total Spend",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(
        row.original.totalSpend
      ),
  },
  {
    accessorKey: "lastOrder",
    header: "Last Order",
    cell: ({ row }) => new Date(row.original.lastOrder).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const tone = status === "Active" ? "text-emerald-600" : status === "New" ? "text-primary" : "text-amber-600";
      return <span className={`text-sm font-medium ${tone}`}>{status}</span>;
    },
  },
];

export default function CustomersPage() {
  const statSegments = [
    {
      label: "Total Customers",
      value: "8,420",
      changeLabel: "+6.2% vs last 30 days",
      changeTone: "positive" as const,
    },
    {
      label: "New This Month",
      value: "512",
      changeLabel: "+3.4% vs last 30 days",
      changeTone: "positive" as const,
    },
    {
      label: "Active",
      value: "6,980",
      changeLabel: "+1.8% vs last 30 days",
      changeTone: "positive" as const,
    },
    {
      label: "Churn Risk",
      value: "184",
      changeLabel: "-0.6% vs last 30 days",
      changeTone: "positive" as const,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">Key insights and details about your customers.</p>
      </div>

      <SegmentedStatsCard segments={statSegments} />

      <div className="rounded-md border bg-card p-3">
        <DataTable columns={columns} data={customers} />
      </div>
    </div>
  );
}