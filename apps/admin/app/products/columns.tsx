"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@vendly/ui/components/badge"
import { Checkbox } from "@vendly/ui/components/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar"

export type Product = {
  id: string
  name: string
  image: string
  category: string
  price: number
  number: number // This could be SKU or Quantity
  stockStatus: "in_stock" | "out_of_stock" | "low_stock"
  createdAt: string
}

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
             {/* Using a placeholder if no image provided */}
             <img 
                src={row.original.image} 
                alt={row.getValue("name")} 
                className="h-full w-full object-cover"
             />
        </div>
        <span className="font-medium text-gray-900">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-gray-600">{row.getValue("category")}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <span className="text-gray-900 font-medium">{formatted}</span>
    },
  },
  {
    accessorKey: "number",
    header: "Number", // As requested
    cell: ({ row }) => <span className="text-gray-600">{row.getValue("number")}</span>,
  },
  {
    accessorKey: "stockStatus",
    header: "Stock",
    cell: ({ row }) => {
      const status = row.getValue("stockStatus") as string
      if (status === "in_stock") {
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-0 font-normal">In Stock</Badge>
      }
      if (status === "out_of_stock") {
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-0 font-normal">Out of Stock</Badge>
      }
      return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-0 font-normal">Low Stock</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) => <span className="text-gray-500 text-sm">{row.getValue("createdAt")}</span>,
  },
]