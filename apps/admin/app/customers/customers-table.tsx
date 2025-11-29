"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@vendly/ui/components/table"
import { Button } from "@vendly/ui/components/button"
import { Input } from "@vendly/ui/components/input"
import { Search, Filter, Download, Plus, Megaphone } from "lucide-react"
import { columns, Customer } from "./columns"

const data: Customer[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", image: "https://github.com/shadcn.png", location: "New York, USA", orders: 15, spent: 3450.00, status: "vip", lastActive: "2 mins ago" },
  { id: "2", name: "Michael Chen", email: "m.chen@example.com", image: "", location: "Toronto, Canada", orders: 3, spent: 450.00, status: "active", lastActive: "1 day ago" },
  { id: "3", name: "Sarah Williams", email: "sarah.w@example.com", image: "", location: "London, UK", orders: 1, spent: 85.00, status: "new", lastActive: "3 days ago" },
  { id: "4", name: "James Rodman", email: "j.rodman@example.com", image: "", location: "Berlin, Germany", orders: 24, spent: 5200.50, status: "vip", lastActive: "5 hours ago" },
  { id: "5", name: "Emily Davis", email: "emily.d@example.com", image: "", location: "Sydney, AU", orders: 0, spent: 0.00, status: "inactive", lastActive: "2 months ago" },
]

export function CustomersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, rowSelection },
  })

  return (
    <div className="flex flex-col gap-6">
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                  <h2 className="text-lg font-bold text-gray-900">All Customers</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage profiles, track spending, and send offers.</p>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2 text-gray-600 hidden sm:flex">
                      <Download className="w-4 h-4" />
                      Export
                  </Button>
                  {/* Campaign Button */}
                  <Button variant="outline" className="gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                      <Megaphone className="w-4 h-4" />
                      Broadcast Offer
                  </Button>
                  <Button className="gap-2 bg-gray-900 text-white hover:bg-gray-800">
                      <Plus className="w-4 h-4" />
                      Add Customer
                  </Button>
              </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or location..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="pl-9 bg-white"
                  />
              </div>
              <Button variant="outline" className="gap-2 text-gray-600 border-gray-200">
                  <Filter className="w-4 h-4" />
                  Filter
              </Button>
          </div>

          <div className="border rounded-lg border-gray-100 overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b border-gray-100 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-12 px-6 text-xs font-semibold text-gray-500">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-6 py-4 text-sm">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
       </div>
    </div>
  )
}