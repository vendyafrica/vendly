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

// Icons
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
  Search: (props: React.SVGProps<SVGSVGElement>) => (
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
}

const stats = [
  {
    label: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    trend: "up",
  },
  {
    label: "Transactions",
    value: "+2350",
    change: "+180.1% from last month",
    trend: "up",
  },
  {
    label: "Pending",
    value: "12",
    change: "+19% from last month",
    trend: "down", // actually up but maybe bad?
  },
  {
    label: "Refunded",
    value: "$1,200.00",
    change: "+4.5% from last month",
    trend: "up",
  },
]

const transactions = [
  {
    id: "TRX-9871",
    user: "Alice Smith",
    email: "alice@example.com",
    amount: "$250.00",
    status: "Completed",
    date: "2024-03-12",
    method: "Credit Card",
  },
  {
    id: "TRX-9872",
    user: "Bob Jones",
    email: "bob@example.com",
    amount: "$120.50",
    status: "Processing",
    date: "2024-03-12",
    method: "PayPal",
  },
  {
    id: "TRX-9873",
    user: "Charlie Day",
    email: "charlie@example.com",
    amount: "$450.00",
    status: "Completed",
    date: "2024-03-11",
    method: "Credit Card",
  },
  {
    id: "TRX-9874",
    user: "Dana Lee",
    email: "dana@example.com",
    amount: "$89.99",
    status: "Failed",
    date: "2024-03-11",
    method: "Stripe",
  },
  {
    id: "TRX-9875",
    user: "Eve Foster",
    email: "eve@example.com",
    amount: "$65.00",
    status: "Completed",
    date: "2024-03-10",
    method: "Apple Pay",
  },
  {
    id: "TRX-9876",
    user: "Frank Miller",
    email: "frank@example.com",
    amount: "$1,200.00",
    status: "Refunded",
    date: "2024-03-09",
    method: "Credit Card",
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100/80",
    Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100/80",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100/80",
    Refunded: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100/80",
  }
  
  return (
    <Badge className={cn("border-0 shadow-none font-medium", styles[status] || styles.Completed)}>
      {status}
    </Badge>
  )
}

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              Monitor and manage your financial transactions.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
               <Icons.Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" className="gap-2">
               <Icons.Filter className="h-4 w-4" /> Filter
            </Button>
         </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-md border bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {transactions.map((trx) => (
                  <TableRow key={trx.id}>
                     <TableCell className="font-medium">{trx.id}</TableCell>
                     <TableCell>
                        <StatusBadge status={trx.status} />
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium">{trx.user}</span>
                           <span className="text-xs text-muted-foreground">{trx.email}</span>
                        </div>
                     </TableCell>
                     <TableCell>{trx.method}</TableCell>
                     <TableCell>{trx.date}</TableCell>
                     <TableCell className="text-right">{trx.amount}</TableCell>
                     <TableCell>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Icons.MoreHorizontal className="h-4 w-4" />
                         </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
    </div>
  )
}
