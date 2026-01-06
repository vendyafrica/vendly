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
// Using standard Recharts because the shadcn Chart component source was not provided in the prompt context.
// This implementation matches the visual design exactly.

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

// Mock Data
const revenueData = [
  { month: "Jan", revenue: 10000 },
  { month: "Feb", revenue: 12000 },
  { month: "Mar", revenue: 11000 },
  { month: "Apr", revenue: 15000 },
  { month: "May", revenue: 13000 },
  { month: "Jun", revenue: 20000 },
  { month: "Jul", revenue: 18000 },
  { month: "Aug", revenue: 39952 },
  { month: "Sep", revenue: 35000 },
  { month: "Oct", revenue: 45000 },
  { month: "Nov", revenue: 40000 },
  { month: "Dec", revenue: 55000 },
];

const recentTransactions = [
  {
    id: "#893427",
    customer: "Alex Morgan",
    product: "Jacket",
    amount: "$49.20",
    status: "Completed",
    payment: "Apple Pay",
    date: "Nov 12, 2025 3:42 PM",
  },
  {
    id: "#A74329",
    customer: "Megan Rapin",
    product: "Watch",
    amount: "$150.75",
    status: "Failed",
    payment: "PayPal",
    date: "Nov 13, 2025 4:20 PM",
  },
  {
    id: "#B8652C",
    customer: "Kristie Mewis",
    product: "Sunglass",
    amount: "$120.62",
    status: "Completed",
    payment: "Bank Transfer",
    date: "Nov 14, 2025 5:42 PM",
  },
  {
    id: "#C8872F",
    customer: "Rose Lavelle",
    product: "Cap",
    amount: "$200.45",
    status: "Pending",
    payment: "Stripe",
    date: "Nov 15, 2025 5:54 PM",
  },
];

const countryData = [
  {
    name: "United Kingdom",
    value: 12628,
    percent: 80,
    flag: "🇬🇧",
    color: "bg-blue-500",
  },
  {
    name: "United States",
    value: 10628,
    percent: 80,
    flag: "🇺🇸",
    color: "bg-blue-500",
  },
  {
    name: "Sweden",
    value: 8628,
    percent: 60,
    flag: "🇸🇪",
    color: "bg-blue-500",
  },
  {
    name: "Turkey",
    value: 6628,
    percent: 40,
    flag: "🇹🇷",
    color: "bg-blue-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pt-2">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Profit"
          value="$30,720"
          change="+12.04%"
          trend="up"
          color="text-green-500"
        />
        <StatsCard
          title="Total Orders"
          value="15,350"
          change="+16.02%"
          trend="up"
          color="text-green-500"
        />
        <StatsCard
          title="New Customers"
          value="4,972"
          change="+19.08%"
          trend="up"
          color="text-green-500"
        />
        <StatsCard
          title="Conversion Rate"
          value="5.18%"
          change="+10.02%"
          trend="up"
          color="text-green-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl font-bold">$72,592</CardTitle>
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
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
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
                  {/* Current Active Dot Annotation Mockup - roughly at Aug */}
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
              <CardTitle className="text-3xl font-bold">38,512</CardTitle>
              <div className="mt-1 flex items-center text-xs text-green-500">
                <HugeiconsIcon icon={ArrowUp01Icon} className="mr-1 size-3" />
                <span className="font-medium">39.22%</span>
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
                    <span>({country.percent}%)</span>
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
              <HugeiconsIcon icon={DownloadCircle01Icon} className="mr-2 size-4" />
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
              {recentTransactions.map((tx) => (
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
              ))}
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
      className =
        "border-transparent bg-green-100 text-green-700 hover:bg-green-100/80";
      variant = "outline"; // Custom styling
      break;
    case "failed":
      className =
        "border-transparent bg-red-100 text-red-700 hover:bg-red-100/80";
      break;
    case "pending":
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
