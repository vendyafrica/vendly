"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@vendly/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@vendly/ui/components/chart"

const chartData = [
  { month: "Jan", sales: 18600 },
  { month: "Feb", sales: 30500 },
  { month: "Mar", sales: 23700 },
  { month: "Apr", sales: 17300 },
  { month: "May", sales: 20900 },
  { month: "Jun", sales: 31400 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SalesTrendChart() {
  return (
    <Card className="flex flex-col h-full border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>
          Total sales volume Jan - Jun 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="var(--color-sales)"
              fillOpacity={0.4}
              stroke="var(--color-sales)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none text-xs">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}