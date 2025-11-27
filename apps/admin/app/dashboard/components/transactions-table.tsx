"use client"
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@vendly/ui/components/table"
import { Button } from "@vendly/ui/components/button"
import { Input } from "@vendly/ui/components/input" // npx shadcn@latest add input
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"

interface TransactionsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function TransactionsTable<TData, TValue>({
  columns,
  data,
}: TransactionsTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize: 8 } }, // Adjusted to fit height better
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm h-full">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h2 className="text-base font-bold text-card-foreground">Recent Sales</h2>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 h-9 w-[200px] text-sm bg-muted border-transparent focus:bg-background transition-colors" />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground border-border">
                <Filter className="h-3.5 w-3.5" />
                Filter
            </Button>
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader className="bg-card sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-border hover:bg-muted transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Simple Footer */}
      <div className="flex items-center justify-end px-6 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0 text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
             {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0 text-muted-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}