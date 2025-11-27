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
import { Search, ChevronLeft, ChevronRight, Download, Calendar } from "lucide-react"
import { columns, Order } from "./columns"

// Mock Data matching your requirements
const data: Order[] = [
  { id: "#323537", customer: "Abram Schleifer", phone: "+1 (555) 123-4567", product: "Macbook Pro M2", price: 2399, status: "delivered", date: "25 Apr, 2027" },
  { id: "#323538", customer: "Ava Smith", phone: "+1 (555) 987-6543", product: "Leather Handbag", price: 1200, status: "picked_up", date: "01 Dec, 2027" },
  { id: "#323539", customer: "Carla George", phone: "+1 (555) 456-7890", product: "Wireless Headphones", price: 350, status: "confirmed", date: "11 May, 2027" },
  { id: "#323540", customer: "Ekstrom Bothman", phone: "+1 (555) 222-3333", product: "Smart Watch Ultra", price: 799, status: "paid", date: "15 Nov, 2027" },
  { id: "#323541", customer: "Ella Davis", phone: "+1 (555) 444-5555", product: "Gaming Console", price: 499, status: "confirmed", date: "01 Mar, 2028" },
]

export function OrdersTable() {
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
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                  <h2 className="text-lg font-bold text-gray-900">Orders</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage and track your customer orders.</p>
              </div>
              
              {/* Toolbar Actions */}
              <div className="flex flex-1 md:flex-none w-full md:w-auto items-center gap-3">
                  <div className="relative flex-1 md:w-[300px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search orders..."
                        value={(table.getColumn("customer")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("customer")?.setFilterValue(event.target.value)}
                        className="pl-9 bg-white"
                    />
                  </div>
                  
                  {/* Date Filter Mockup */}
                  <Button variant="outline" className="gap-2 text-gray-600 hidden sm:flex">
                      <Calendar className="w-4 h-4" />
                      Last 7 Days
                  </Button>

                  {/* Export Button */}
                  <Button variant="outline" className="gap-2 text-gray-600">
                      <Download className="w-4 h-4" />
                      Export CSV
                  </Button>
              </div>
          </div>

          {/* Table */}
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

          {/* Footer */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
       </div>
    </div>
  )
}