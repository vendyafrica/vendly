// components/sales-trend-chart.tsx
"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card"
import { ChartConfig, ChartContainer } from "@vendly/ui/components/chart"

const chartData = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 73 },
  { month: "May", sales: 209 },
  { month: "June", sales: 214 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#c4b5fd",
  },
} satisfies ChartConfig

export function SalesTrendChart() {
  return (
    <Card className="h-full flex flex-col border-gray-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Sales Trend</CardTitle>
        <CardDescription className="text-xs">Total sales volume Jan - Jun 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 pb-4">
        <ChartContainer config={chartConfig} className="w-full h-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
                formatter={(value) => [value, "Sales"]}
              />
              <Bar dataKey="sales" fill="#c4b5fd" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}