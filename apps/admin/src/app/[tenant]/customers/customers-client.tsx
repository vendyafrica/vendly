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

export interface CustomerStat {
    label: string
    value: string
    change: string
    trend: "up" | "down"
}

export interface CustomerItem {
    id: string
    name: string
    email: string
    orders: number
    spent: string
    lastActive: string
    status: string
    avatar: string
}

interface CustomersClientProps {
    stats: CustomerStat[]
    customers: CustomerItem[]
}

export default function CustomersClient({ stats, customers }: CustomersClientProps) {
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
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary uppercase">
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
