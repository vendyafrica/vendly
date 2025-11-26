"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@vendly/ui/components/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@vendly/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";

export type Transaction = {
  id: string;
  customer: string;
  product: string;
  status: "success" | "pending" | "processing" | "failed";
  qty: number;
  unitPrice: number;
  totalRevenue: number;
};

const statusConfig = {
  success: { label: "Success", className: "bg-green-100 text-green-800" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800" },
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-gray-900">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">{row.getValue("customer")}</span>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">{row.getValue("product")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusConfig;
      const config = statusConfig[status];
      return (
        <Badge variant="outline" className={`${config.className} border-0`}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "qty",
    header: "QTY",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">{row.getValue("qty")}</span>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => {
      const price = row.getValue("unitPrice") as number;
      return (
        <span className="text-sm text-gray-700">
          ${price.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "totalRevenue",
    header: "Total Revenue",
    cell: ({ row }) => {
      const revenue = row.getValue("totalRevenue") as number;
      return (
        <span className="text-sm font-medium text-gray-900">
          ${revenue.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Download receipt</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];