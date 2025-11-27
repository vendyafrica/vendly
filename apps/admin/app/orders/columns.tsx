"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@vendly/ui/components/badge"
import { Checkbox } from "@vendly/ui/components/checkbox"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@vendly/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu"

export type Order = {
  id: string
  customer: string
  phone: string
  product: string
  price: number
  status: "confirmed" | "picked_up" | "delivered" | "paid"
  date: string
}

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.getValue("customer")}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone Number", // Replaced Email with Phone
    cell: ({ row }) => <span className="text-gray-500 font-mono text-xs">{row.getValue("phone")}</span>,
  },
  {
    accessorKey: "product",
    header: "Ordered Item",
    cell: ({ row }) => <span className="text-gray-700">{row.getValue("product")}</span>,
  },
  {
    accessorKey: "price",
    header: "Total Amount",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <span className="font-medium text-gray-900">{formatted}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      // Custom mapping for your specific statuses
      const statusStyles = {
        confirmed: "bg-blue-50 text-blue-700 border-blue-200",
        picked_up: "bg-orange-50 text-orange-700 border-orange-200",
        delivered: "bg-green-50 text-green-700 border-green-200",
        paid: "bg-purple-50 text-purple-700 border-purple-200",
      }
      
      const label = status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      
      return (
        <Badge className={`border px-2 py-0.5 font-normal ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"}`}>
          {label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Order Date",
    cell: ({ row }) => <span className="text-gray-500 text-sm">{row.getValue("date")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-200">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Update status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]