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
import { Search, Filter, Edit, RefreshCw, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { columns, Product } from "./columns"

const data: Product[] = [
  {
    id: "1",
    name: "ASUS ROG Gaming Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&q=80",
    category: "Laptop",
    price: 2199,
    number: 45,
    stockStatus: "out_of_stock",
    createdAt: "01 Dec, 2027",
  },
  {
    id: "2",
    name: "Airpods Pro 2nd Gen",
    image: "https://images.unsplash.com/photo-1603351154351-5cf99bc5f16d?w=100&q=80",
    category: "Accessories",
    price: 839,
    number: 120,
    stockStatus: "in_stock",
    createdAt: "29 Jun, 2027",
  },
  {
    id: "3",
    name: "Apple Watch Ultra",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=100&q=80",
    category: "Watch",
    price: 1579,
    number: 12,
    stockStatus: "out_of_stock",
    createdAt: "13 Mar, 2027",
  },
  {
    id: "4",
    name: "Iphone 15 Pro Max",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&q=80",
    category: "Mobile",
    price: 1199,
    number: 85,
    stockStatus: "in_stock",
    createdAt: "22 Oct, 2027",
  },
  {
    id: "5",
    name: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&q=80",
    category: "Audio",
    price: 348,
    number: 30,
    stockStatus: "low_stock",
    createdAt: "15 Sep, 2027",
  }
]

export function ProductsTable() {
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
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col gap-6">
       {/* Header Card Area */}
       <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                  <h2 className="text-lg font-bold text-card-foreground">Products List</h2>
                  <p className="text-sm text-muted-foreground mt-1">Track your store's progress to boost your sales.</p>
              </div>
              <div className="flex items-center gap-2">
                  {/* The specific links/buttons you requested */}
                  <Button variant="outline" className="gap-2 text-muted-foreground">
                      <Edit className="w-4 h-4" />
                      Edit
                  </Button>
                  <Button variant="outline" className="gap-2 text-muted-foreground">
                      <RefreshCw className="w-4 h-4" />
                      Sync Products
                  </Button>
                  <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Product
                  </Button>
              </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                      table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="pl-9 bg-background border-border"
                  />
              </div>
              <Button variant="outline" className="gap-2 text-muted-foreground border-border">
                  <Filter className="w-4 h-4" />
                  Filter
              </Button>
          </div>

          {/* The Table Itself */}
          <div className="mt-6 border rounded-lg border-border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-12 px-6 text-xs font-semibold text-muted-foreground">
                        {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b border-border hover:bg-muted transition-colors"
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-6 py-4 text-sm">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
       </div>
    </div>
  )
}