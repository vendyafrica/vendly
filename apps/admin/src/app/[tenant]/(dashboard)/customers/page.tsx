"use client"

import * as React from "react"
import { Badge } from "@vendly/ui/components/badge"
import { Button } from "@vendly/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
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

const stats = [
  {
    label: "Total Customers",
    value: "2,420",
    change: "+12.5% from last month",
    trend: "up",
  },
  {
    label: "Active Now",
    value: "573",
    change: "+201 since last hour",
    trend: "up",
  },
  {
    label: "New This Month",
    value: "+120",
    change: "+5% from last month",
    trend: "up",
  },
  {
    label: "Blocked Users",
    value: "3",
    change: "-2 from last month",
    trend: "down",
  },
]

const customers = [
  {
    id: 1,
    name: "Jeremiah Sentomero",
    email: "jeremiah@example.com",
    orders: 24,
    spent: "$4,200.00",
    lastActive: "Active today",
    status: "Active",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Alice Wonderland",
    email: "alice@example.com",
    orders: 5,
    spent: "$320.00",
    lastActive: "2 min ago",
    status: "Active",
    avatar: "AW",
  },
  {
    id: 3,
    name: "Bob Builder",
    email: "bob@example.com",
    orders: 12,
    spent: "$1,150.00",
    lastActive: "1 day ago",
    status: "Inactive",
    avatar: "BB",
  },
  {
    id: 4,
    name: "Charlie Chocolate",
    email: "charlie@example.com",
    orders: 1,
    spent: "$15.00",
    lastActive: "3 days ago",
    status: "Active",
    avatar: "CC",
  },
  {
    id: 5,
    name: "David Davidson",
    email: "david@example.com",
    orders: 50,
    spent: "$12,400.00",
    lastActive: "5 min ago",
    status: "VIP",
    avatar: "DD",
  },
]

export default function CustomersPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <p className="text-sm text-muted-foreground">Manage your customer base and view their activity.</p>
        </div>
        <Button>Add Customer</Button>
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

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            A list of all registered customers including their name, email, and order stats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {customer.avatar}
                        </div>
                        <div className="flex flex-col">
                            <span>{customer.name}</span>
                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.spent}</TableCell>
                  <TableCell>{customer.lastActive}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "VIP" ? "default" : customer.status === "Active" ? "outline" : "secondary"}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
