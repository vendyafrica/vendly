// components/columns.tsx
"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@vendly/ui/components/badge"

export type Transaction = {
  id: string
  customer: string
  product: string
  status: "success" | "pending" | "processing" | "failed"
  qty: number
  unitPrice: number
  totalRevenue: number
}

const statusConfig = {
  success: { label: "Success", className: "bg-green-50 text-green-700 border-0 hover:bg-green-100" },
  pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-0 hover:bg-yellow-100" },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700 border-0 hover:bg-blue-100" },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border-0 hover:bg-red-100" },
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => <span className="font-medium text-gray-900 text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => <span className="text-gray-700 text-sm">{row.getValue("customer")}</span>,
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <span className="text-gray-700 text-sm">{row.getValue("product")}</span>,
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => <span className="text-gray-700 text-sm">{row.getValue("qty")}</span>,
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => <span className="text-gray-700 text-sm">${row.getValue("unitPrice")}</span>,
  },
  {
    accessorKey: "totalRevenue",
    header: "Total Revenue",
    cell: ({ row }) => <span className="font-medium text-gray-900 text-sm">${row.getValue("totalRevenue")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusConfig
      const config = statusConfig[status]
      return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>
    },
  },
]
