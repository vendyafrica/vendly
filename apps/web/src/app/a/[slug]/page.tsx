"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenant } from "./tenant-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@vendly/ui/components/card";
import { Badge } from "@vendly/ui/components/badge";
import { Button } from "@vendly/ui/components/button";
import { Skeleton } from "@vendly/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@vendly/ui/components/table";
import { cn } from "@vendly/ui/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@vendly/ui/components/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Bar, BarChart, LabelList } from "recharts";
import { TrendingUp, ArrowUpRight, Users, CreditCard, ShoppingCart, Activity } from "lucide-react";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type OrderStatsResponse = {
  totalRevenue: number;
  orderCount: number;
  pendingCount: number;
  refundedAmount: number;
  currency: string;
};

// Mock Data for Main Chart (Revenue)
const mockRevenueData = [
  { date: "Jan", total: 12500 },
  { date: "Feb", total: 18900 },
  { date: "Mar", total: 15600 },
  { date: "Apr", total: 21000 },
  { date: "May", total: 25800 },
  { date: "Jun", total: 29500 },
  { date: "Jul", total: 34200 },
  { date: "Aug", total: 39952 }, // Highlighted in design
  { date: "Sep", total: 37800 },
  { date: "Oct", total: 42500 },
  { date: "Nov", total: 41000 },
  { date: "Dec", total: 52000 },
];

// Mock Data for Top Products
const topProductsData = [
  { product: "Winter Beanie", sales: 12628, fill: "hsl(var(--primary))" },
  { product: "Leather Wallet", sales: 10628, fill: "hsl(var(--primary))" },
  { product: "Wireless Earbuds", sales: 8628, fill: "hsl(var(--primary))" },
  { product: "Yoga Mat", sales: 6628, fill: "hsl(var(--primary))" },
  { product: "Running Sneakers", sales: 4200, fill: "hsl(var(--primary))" },
];

// Mock Data for Recent Transactions
const mockTransactions = [
  {
    id: "#893427",
    customer: "Alex Morgan",
    product: "Winter Beanie",
    amount: 49.20,
    status: "Completed",
    payment: "Apple Pay",
    date: "Nov 12, 2025 3:42 PM",
    currency: "USD",
  },
  {
    id: "#A74329",
    customer: "Megan Rapin",
    product: "Smart Watch",
    amount: 150.75,
    status: "Failed",
    payment: "PayPal",
    date: "Nov 13, 2025 4:20 PM",
    currency: "USD",
  },
  {
    id: "#B8652C",
    customer: "Kristie Mewis",
    product: "Sunglasses",
    amount: 120.62,
    status: "Completed",
    payment: "Bank Transfer",
    date: "Nov 14, 2025 5:42 PM",
    currency: "USD",
  },
  {
    id: "#C8872F",
    customer: "Rose Lavelle",
    product: "Baseball Cap",
    amount: 200.45,
    status: "Pending",
    payment: "Stripe",
    date: "Nov 15, 2025 5:54 PM",
    currency: "USD",
  },
  {
    id: "#D9983G",
    customer: "Tobin Heath",
    product: "Soccer Ball",
    amount: 35.00,
    status: "Completed",
    payment: "Visa",
    date: "Nov 16, 2025 10:15 AM",
    currency: "USD",
  },
];

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { // Matching mock design Currency
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardPage() {
  const { bootstrap, isLoading: isBootstrapping, error: bootstrapError } = useTenant();

  const statsQuery = useQuery({
    queryKey: ["dashboard", "orders-stats", bootstrap?.storeSlug],
    queryFn: async () => {
      const res = await fetch("/api/orders/stats");
      if (!res.ok) throw new Error("Failed to fetch order stats");
      return (await res.json()) as OrderStatsResponse;
    },
    enabled: Boolean(bootstrap),
  });

  const currency = "USD"; // Mocking USD to match design/mock data

  const isLoading = isBootstrapping; // Only wait for bootstrap, data is mocked

  const error = bootstrapError;

  // Main Chart Config
  const chartConfig = {
    total: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  // Top Products Config
  const topProductsConfig = {
    sales: {
      label: "Sales",
    },
    product: {
      label: "Product",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your store's performance.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              Filter
            </Button>
            <Button size="sm" className="h-8 gap-1">
              Export
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Profit
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(30720, currency)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-green-500 font-medium flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 12.04%
                  </span>
                  Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">
                  15,350
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-green-500 font-medium flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 16.02%
                  </span>
                  Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">
                  4,972
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-green-500 font-medium flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 19.08%
                  </span>
                  Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">
                  5.18%
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-green-500 font-medium flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 10.02%
                  </span>
                  Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <div className="text-3xl font-bold text-foreground">$72,592</div>
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
              <LineChart
                accessibilityLayer
                data={mockRevenueData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="total"
                  type="monotone" // Smooth curve like design
                  stroke="var(--foreground)" // Dark line
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Side Panel Chart - Top Products */}
        <Card className="col-span-3 lg:col-span-3">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>By sales volume</CardDescription>
              </div>
              <div className="text-2xl font-bold">38,512</div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={topProductsConfig} className="h-[350px] w-full">
              <BarChart
                accessibilityLayer
                data={topProductsData}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 40, // Space for labels if needed
                  top: 20,
                  bottom: 0,
                }}
                barSize={32}
                barGap={8}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="product"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={120} // Wider for names
                  hide // Hiding default Y axis to put labels "above" or custom
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="sales" layout="vertical" radius={16}>
                  <LabelList
                    dataKey="product"
                    position="insideTopLeft"
                    offset={8}
                    className="fill-foreground font-medium"
                    fontSize={12}
                    dy={-24} // Move label up above the bar
                  />
                  <LabelList
                    dataKey="sales"
                    position="right"
                    offset={8}
                    className="fill-muted-foreground"
                    fontSize={12}
                    formatter={(val: number) => val.toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="grid gap-0.5">
            <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            Filter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.id}</TableCell>
                  <TableCell>{t.customer}</TableCell>
                  <TableCell>{t.product}</TableCell>
                  <TableCell>{formatCurrency(t.amount, t.currency)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-normal border-0",
                        t.status === 'Completed' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700" :
                          t.status === 'Failed' ? "bg-rose-100 text-rose-700 hover:bg-rose-100 hover:text-rose-700" :
                            "bg-amber-100 text-amber-700 hover:bg-amber-100 hover:text-amber-700"
                      )}
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.payment}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {t.date}
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
