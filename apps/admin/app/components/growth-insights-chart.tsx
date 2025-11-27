// components/growth-insights-chart.tsx
"use client"
import { TrendingUp } from "lucide-react"
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card"
import { ChartConfig, ChartContainer } from "@vendly/ui/components/chart"

const chartData = [
  { name: "Growth", value: 72, fill: "#c4b5fd" },
]

const chartConfig = {
  value: {
    label: "Growth",
  },
} satisfies ChartConfig

export function GrowthInsightsChart() {
  return (
    <Card className="h-full flex flex-col border-gray-200 bg-white">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-sm font-semibold">Revenue by Source</CardTitle>
        <CardDescription className="text-xs">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 pb-2 flex items-center justify-center">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={70}
            outerRadius={100}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-gray-100 last:fill-white"
              polarRadius={[80, 68]}
            />
            <RadialBar dataKey="value" background cornerRadius={8} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-gray-900 text-3xl font-bold">
                          72%
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-gray-500 text-xs">
                          Growth
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}