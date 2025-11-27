"use client"
import { MoreHorizontal } from "lucide-react"
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@vendly/ui/components/card"
import { ChartConfig, ChartContainer } from "@vendly/ui/components/chart"
import { Progress } from "@vendly/ui/components/progress" // Ensure you have npx shadcn@latest add progress

const chartData = [
  { name: "Growth", value: 70.8, fill: "#ea580c" }, // Orange color
]

const chartConfig = {
  value: { label: "Growth" },
} satisfies ChartConfig

export function GrowthInsightsChart() {
  return (
    <Card className="h-full flex flex-col border-gray-100 bg-white rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold text-gray-900">Sales Overview</CardTitle>
        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
      </CardHeader>
      
      {/* Chart Section */}
      <CardContent className="flex-1 flex flex-col items-center justify-center p-0 pb-4">
        <div className="relative w-full h-[200px]">
             <ChartContainer config={chartConfig} className="w-full h-full mx-auto aspect-square">
            <RadialBarChart data={chartData} startAngle={180} endAngle={0} innerRadius={80} outerRadius={110}>
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                    content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-gray-900 text-3xl font-bold">70.8%</tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-gray-500 text-xs">Sales Growth</tspan>
                        </text>
                        )
                    }
                    }}
                />
                </PolarRadiusAxis>
                <RadialBar dataKey="value" background cornerRadius={10} />
            </RadialBarChart>
            </ChartContainer>
        </div>

        {/* Footer Target Section */}
        <div className="w-full px-6 mt-2">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-xs text-gray-500 block">Sales</span>
                    <span className="text-lg font-bold text-gray-900">$3,884.00</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-500 block">Target $20,000.00</span>
                </div>
            </div>
            <Progress value={20} className="h-2 bg-gray-100 [&>div]:bg-orange-600" />
        </div>
      </CardContent>
    </Card>
  )
}