"use client"

import * as React from "react"
import { Badge } from "@vendly/ui/components/badge"
import { Button } from "@vendly/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@vendly/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@vendly/ui/components/table"
import { cn } from "@vendly/ui/lib/utils"

// Icons (Inline for safety/speed without checking external icon lib availability)
const Icons = {
  Filter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Sort: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  ),
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  ),
  Info: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  Star: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-400"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Trash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  MoreHorizontal: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
  Edit: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  ),
  Tag: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l5 5a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-5-5z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  ),
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 18 18" />
    </svg>
  ),
}

// Dummy Data
const stats = [
  {
    label: "Total Product",
    value: "250",
    change: "+ 3 product",
    trend: "up",
    info: true,
  },
  {
    label: "Product Revenue",
    value: "$15,490",
    change: "+ 9%",
    trend: "up",
    info: true,
  },
  {
    label: "Product Sold",
    value: "2,355",
    change: "+ 7%",
    trend: "up",
    info: true,
  },
  {
    label: "Avg. Monthly Sales",
    value: "890",
    change: "+ 5%",
    trend: "up",
    info: true,
  },
]

const products = [
  {
    id: 1,
    name: "Uxerflow T-Shirt #10",
    variant: "White",
    price: "$1.35",
    sales: "471 pcs",
    revenue: "$635.85",
    stock: 100,
    status: "In Stock",
    rating: 5.0,
    selected: false,
  },
  {
    id: 2,
    name: "Uxerflow T-Shirt #10",
    variant: "Black",
    price: "$1.35",
    sales: "402 pcs",
    revenue: "$544.05",
    stock: 0,
    status: "Out of Stock",
    rating: 5.0,
    selected: true,
  },
  {
    id: 3,
    name: "Uxerflow T-Shirt #19",
    variant: "White",
    price: "$1.35",
    sales: "455 pcs",
    revenue: "$645.25",
    stock: 20,
    status: "Restock",
    rating: 4.9,
    selected: false,
  },
  {
    id: 4,
    name: "SmartHome Hub",
    variant: "",
    price: "$150",
    sales: "7 pcs",
    revenue: "$1,050.00",
    stock: 12,
    status: "In Stock",
    rating: 4.8,
    selected: true,
  },
  {
    id: 5,
    name: "UltraSound Wireless Earbuds",
    variant: "",
    price: "$200",
    sales: "5 pcs",
    revenue: "$1,000.00",
    stock: 0,
    status: "Out of Stock",
    rating: 4.8,
    selected: false,
  },
  {
    id: 6,
    name: "ProVision 4K Monitor",
    variant: "",
    price: "$400.25",
    sales: "1 pcs",
    revenue: "$400.25",
    stock: 3,
    status: "Restock",
    rating: 5.0,
    selected: false,
  },
  {
    id: 7,
    name: "Uxerflow Retro Wave Shirt",
    variant: "",
    price: "$1.35",
    sales: "120 pcs",
    revenue: "$162.40",
    stock: 20,
    status: "In Stock",
    rating: 4.7,
    selected: false,
  },
  {
    id: 8,
    name: "Uxerflow Graphic Art T-Shirt",
    variant: "",
    price: "$1.35",
    sales: "200 pcs",
    revenue: "$270.15",
    stock: 0,
    status: "Out of Stock",
    rating: 4.9,
    selected: false,
  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === "In Stock") {
    return (
      <Badge
        className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100 hover:text-purple-600 border-0 shadow-none font-medium px-2.5"
      >
        In Stock
      </Badge>
    )
  }
  if (status === "Out of Stock") {
    return (
      <Badge
        variant="destructive"
        className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 hover:bg-red-100 hover:text-red-600 border-0 shadow-none font-medium px-2.5"
      >
        Out of Stock
      </Badge>
    )
  }
  if (status === "Restock") {
    return (
      <Badge
        className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 border-0 shadow-none font-medium px-2.5"
      >
        Restock
      </Badge>
    )
  }
  return <Badge>{status}</Badge>
}

// Simple custom checkbox using tailwind
function CustomCheckbox({
  checked,
  onChange,
}: {
  checked?: boolean
  onChange?: () => void
}) {
  return (
    <div
      onClick={(e) => {
        // Prevent row selection when clicking the checkbox/padding area
        e.stopPropagation();
        if (onChange) onChange();
      }}
      className={cn(
        "h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-colors z-20 relative",
        checked
          ? "bg-orange-500 border-orange-500 text-white"
          : "border-input bg-background"
      )}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  )
}

function CustomSwitch() {
  return (
    <div className="w-9 h-5 bg-orange-500 rounded-full relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
      <div className="absolute right-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow-sm" />
    </div>
  )
}

export default function ProductsPage() {
  const [productList, setProductList] = React.useState(products)

  const toggleSelect = (id: number) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    )
  }

  const selectedCount = productList.filter((p) => p.selected).length

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 font-normal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" cy="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            Table View
            <Icons.ChevronDown className="ml-1 text-muted-foreground" />
          </Button>
          <Button variant="outline" className="gap-2 font-normal">
            <Icons.Filter /> Filter
          </Button>
          <Button variant="outline" className="gap-2 font-normal">
            <Icons.Sort /> Sort
          </Button>
          <div className="flex items-center gap-2 pl-2">
            <span className="text-sm font-medium">Show Statistics</span>
            <CustomSwitch />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 font-normal">
            <Icons.Settings /> Customize
          </Button>
          <Button variant="outline" className="gap-2 font-normal">
            <Icons.Download /> Export
          </Button>
          <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 gap-2">
            <Icons.Plus className="h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-none border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                {stat.label}
                {stat.info && <Icons.Info className="h-3.5 w-3.5 text-muted-foreground/70" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 text-nowrap flex items-center gap-1">
                vs last month 
                <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                  {stat.change}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Table */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden relative pb-16">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[40px] pl-4">
                <CustomCheckbox />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productList.map((product) => (
              <TableRow
                key={product.id}
                className={cn(
                  "cursor-pointer group transition-colors",
                  product.selected && "bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-50/60"
                )}
                onClick={() => toggleSelect(product.id)}
              >
                <TableCell className="pl-4 relative">
                  {product.selected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                  )}
                  <CustomCheckbox
                    checked={product.selected}
                    onChange={() => toggleSelect(product.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                       Img
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">{product.name}</span>
                      {product.variant && (
                        <span className="text-xs text-muted-foreground">
                           - {product.variant}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>{product.revenue}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <StatusBadge status={product.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Icons.Star className="h-4 w-4" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Floating Action Bar */}
        {selectedCount > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-center gap-2 bg-background border shadow-xl rounded-lg p-1.5 pr-2">
              <div className="flex items-center gap-2 border-r pr-3 pl-2">
                <span className="flex items-center justify-center bg-foreground text-background text-xs font-bold h-5 w-5 rounded-full">
                  {selectedCount}
                </span>
                <span className="text-sm font-medium">Selected</span>
              </div>
              <Button size="sm" variant="ghost" className="gap-2 h-8 text-xs">
                <Icons.Tag className="h-3.5 w-3.5" />
                Apply Code
              </Button>
              <Button size="sm" variant="ghost" className="gap-2 h-8 text-xs">
                <Icons.Edit className="h-3.5 w-3.5" />
                Edit Info
              </Button>
              <Button size="sm" variant="ghost" className="gap-2 h-8 text-xs hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                <Icons.Trash className="h-3.5 w-3.5" />
                Delete
              </Button>
               <Button size="sm" variant="ghost" className="h-8 w-8 px-0">
                <Icons.MoreHorizontal className="h-4 w-4" />
              </Button>
              <div className="w-[1px] h-4 bg-border mx-1" />
              <Button
                size="sm"
                variant="ghost"
                 className="h-8 w-8 px-0 hover:bg-transparent"
                 onClick={(e) => {
                   e.stopPropagation();
                   setProductList(prev => prev.map(p => ({ ...p, selected: false })))
                 }}
              >
                <Icons.X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
