"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
  { source: "Direct", revenue: 18600 },
  { source: "Organic", revenue: 30500 },
  { source: "Referral", revenue: 23700 },
  { source: "Social", revenue: 7300 },
  { source: "Email", revenue: 20900 },
  { source: "Affiliate", revenue: 21400 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RevenueInsightsChart() {
  return (
    <Card className="flex flex-col h-full border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Revenue by Source</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20, // Negative margin to pull labels closer if needed
            }}
          >
            <XAxis type="number" dataKey="revenue" hide />
            <YAxis
              dataKey="source"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={80} // Ensure enough space for labels
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 3.8% this month <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        <div className="text-muted-foreground leading-none text-xs">
          Showing total revenue sources
        </div>
      </CardFooter>
    </Card>
  )
}