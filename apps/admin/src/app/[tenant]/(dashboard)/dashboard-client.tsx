"use client";

import * as React from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Badge } from "@vendly/ui/components/badge";
import { Button } from "@vendly/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@vendly/ui/components/card";
import { Input } from "@vendly/ui/components/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@vendly/ui/components/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    PreferenceHorizontalIcon,
    DownloadCircle01Icon,
    Search01Icon,
    ArrowUp01Icon,
    ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

export interface Transaction {
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: string;
    payment: string;
    date: string;
}

export interface RevenueDataPoint {
    month: string;
    revenue: number;
}

export interface CountryDataPoint {
    name: string;
    value: number;
    percent: number;
    flag: string;
    color: string;
}

export interface DashboardStats {
    totalRevenue: string; // e.g. "$30,720"
    revenueChange: string;
    revenueTrend: "up" | "down";

    totalOrders: string; // e.g. "15,350"
    ordersChange: string;
    ordersTrend: "up" | "down";

    newCustomers: string; // e.g. "4,972"
    customersChange: string;
    customersTrend: "up" | "down";

    conversionRate: string; // e.g. "5.18%"
    conversionChange: string;
    conversionTrend: "up" | "down";
}

interface DashboardClientProps {
    stats: DashboardStats;
    revenueData: RevenueDataPoint[];
    transactions: Transaction[];
    countryData: CountryDataPoint[];
}

export default function DashboardClient({
    stats,
    revenueData,
    transactions,
    countryData,
}: DashboardClientProps) {
    return (
        <div className="space-y-6 pt-2">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Profit"
                    value={stats.totalRevenue}
                    change={stats.revenueChange}
                    trend={stats.revenueTrend}
                    color="text-green-500"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    change={stats.ordersChange}
                    trend={stats.ordersTrend}
                    color="text-green-500"
                />
                <StatsCard
                    title="New Customers"
                    value={stats.newCustomers}
                    change={stats.customersChange}
                    trend={stats.customersTrend}
                    color="text-green-500"
                />
                <StatsCard
                    title="Conversion Rate"
                    value={stats.conversionRate}
                    change={stats.conversionChange}
                    trend={stats.conversionTrend}
                    color="text-green-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardDescription>Total Revenue</CardDescription>
                            <CardTitle className="text-3xl font-bold">
                                {stats.totalRevenue}
                            </CardTitle>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline" size="sm" className="text-xs">
                                    Yearly{" "}
                                    <HugeiconsIcon icon={ArrowDown01Icon} className="ml-2 size-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Daily</DropdownMenuItem>
                                <DropdownMenuItem>Weekly</DropdownMenuItem>
                                <DropdownMenuItem>Yearly</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorRevenue"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#8884d8"
                                                stopOpacity={0.1}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8884d8"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                                        tickMargin={10}
                                    />
                                    <YAxis hide axisLine={false} tickLine={false} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow-lg">
                                                        <span className="text-sm font-bold">
                                                            ${payload[0].value}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#1f2937"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Country Stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardDescription>Country</CardDescription>
                            <CardTitle className="text-3xl font-bold">
                                {countryData.reduce((acc, c) => acc + c.value, 0).toLocaleString()}
                            </CardTitle>
                            <div className="mt-1 flex items-center text-xs text-green-500">
                                <HugeiconsIcon icon={ArrowUp01Icon} className="mr-1 size-3" />
                                <span className="font-medium">+12%</span>
                                <span className="ml-1 text-muted-foreground">Last month</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                            View All{" "}
                            <HugeiconsIcon
                                icon={ArrowUp01Icon}
                                className="ml-2 size-3 rotate-45"
                            />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {countryData.map((country) => (
                            <div key={country.name} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{country.flag}</span>
                                        <span className="font-medium">{country.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span>{country.value.toLocaleString()}</span>
                                        <span>({country.percent.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                    <div
                                        className={`h-full ${country.color}`}
                                        style={{ width: `${country.percent}%` }}
                                        role="progressbar"
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg font-semibold">
                        Recent Transactions
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <HugeiconsIcon
                                icon={Search01Icon}
                                className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
                            />
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-[200px] pl-9"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <HugeiconsIcon icon={PreferenceHorizontalIcon} className="size-4" />
                            <span className="sr-only">Filter</span>
                        </Button>
                        <Button variant="outline">
                            <HugeiconsIcon
                                icon={DownloadCircle01Icon}
                                className="mr-2 size-4"
                            />
                            Export
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-medium">{tx.id}</TableCell>
                                        <TableCell>{tx.customer}</TableCell>
                                        <TableCell>{tx.product}</TableCell>
                                        <TableCell>{tx.amount}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={tx.status} />
                                        </TableCell>
                                        <TableCell>{tx.payment}</TableCell>
                                        <TableCell>{tx.date}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <span className="text-lg leading-none">...</span>
                                                <span className="sr-only">More options</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({
    title,
    value,
    change,
    trend,
    color,
}: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    color: string;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-3xl font-bold">{value}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`flex items-center text-xs font-medium ${color}`}>
                    {trend === "up" ? (
                        <HugeiconsIcon icon={ArrowUp01Icon} className="mr-1 size-3" />
                    ) : (
                        <HugeiconsIcon icon={ArrowDown01Icon} className="mr-1 size-3" />
                    )}
                    <span>{change}</span>
                    <span className="ml-1 text-muted-foreground">Last 30 days</span>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let className = "";

    switch (status.toLowerCase()) {
        case "completed":
        case "paid":
            className =
                "border-transparent bg-green-100 text-green-700 hover:bg-green-100/80";
            variant = "outline"; // Custom styling
            break;
        case "failed":
        case "cancelled":
            className =
                "border-transparent bg-red-100 text-red-700 hover:bg-red-100/80";
            break;
        case "pending":
        case "process":
            className =
                "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
            break;
        default:
            variant = "outline";
    }

    return (
        <Badge variant={variant} className={className}>
            {status}
        </Badge>
    );
}
