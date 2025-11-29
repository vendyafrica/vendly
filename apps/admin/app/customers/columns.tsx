"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@vendly/ui/components/badge"
import { Checkbox } from "@vendly/ui/components/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar"
import { MoreHorizontal, MapPin, Mail, Gift } from "lucide-react"
import { Button } from "@vendly/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu"

export type Customer = {
  id: string
  name: string
  email: string
  image: string
  location: string
  orders: number
  spent: number
  status: "vip" | "active" | "inactive" | "new"
  lastActive: string
}

export const columns: ColumnDef<Customer>[] = [
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
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 border border-gray-200">
          <AvatarImage src={row.original.image} alt={row.getValue("name")} />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.getValue("name")}</span>
          <span className="text-xs text-gray-500">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-gray-600">
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-sm">{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "orders",
    header: "Orders",
    cell: ({ row }) => <div className="text-center font-medium text-gray-700 w-12">{row.getValue("orders")}</div>,
  },
  {
    accessorKey: "spent",
    header: "Total Spent",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("spent"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <span className="font-bold text-gray-900">{formatted}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const styles = {
        vip: "bg-purple-50 text-purple-700 border-purple-200",
        active: "bg-green-50 text-green-700 border-green-200",
        new: "bg-blue-50 text-blue-700 border-blue-200",
        inactive: "bg-gray-100 text-gray-600 border-gray-200",
      }
      return (
        <Badge className={`border px-2 py-0.5 font-normal capitalize ${styles[status as keyof typeof styles]}`}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => <span className="text-xs text-gray-500">{row.getValue("lastActive")}</span>,
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
          <DropdownMenuContent align="end" className="bg-white border-gray-200 min-w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2">
                <Mail className="w-3.5 h-3.5" /> 
                Email Customer
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-blue-600 font-medium">
                <Gift className="w-3.5 h-3.5" /> 
                Send Discount
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]