"use client"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@vendly/ui/components/card"
import { Button } from "@vendly/ui/components/button"
import { ChartConfig, ChartContainer } from "@vendly/ui/components/chart"

const chartData = [
  { month: "Jan", sales: 18, earning: 12 },
  { month: "Feb", sales: 25, earning: 15 },
  { month: "Mar", sales: 20, earning: 10 },
  { month: "Apr", sales: 30, earning: 22 },
  { month: "May", sales: 15, earning: 8 },
  { month: "Jun", sales: 22, earning: 14 },
  { month: "Jul", sales: 35, earning: 24 }, // Peak
  { month: "Aug", sales: 28, earning: 18 },
  { month: "Sep", sales: 18, earning: 12 },
  { month: "Oct", sales: 24, earning: 16 },
  { month: "Nov", sales: 28, earning: 20 },
  { month: "Dec", sales: 32, earning: 25 },
]

const chartConfig = {
  sales: { label: "Sales", color: "#e5e7eb" }, // Light gray for sales
  earning: { label: "Earning", color: "#f97316" }, // Orange for earning (active)
} satisfies ChartConfig

export function SalesTrendChart() {
  return (
    <Card className="h-full flex flex-col border-border bg-card rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-bold text-card-foreground">Revenue Insights</CardTitle>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-2xl font-bold">$5,567.00</span>
             <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">↑ 4.9%</span>
          </div>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <Button variant="ghost" size="sm" className="h-7 text-xs rounded-md hover:bg-background hover:shadow-sm">Monthly</Button>
          <Button size="sm" className="h-7 text-xs bg-foreground text-background rounded-md shadow-sm">Yearly</Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pl-0">
        <ChartContainer config={chartConfig} className="w-full h-full aspect-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={5}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: "#9ca3af", fontSize: 11 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }} 
              />
              <Bar dataKey="sales" name="Sales" fill="#f3f4f6" radius={[4, 4, 4, 4]} barSize={12} />
              <Bar dataKey="earning" name="Earning" fill="#ea580c" radius={[4, 4, 4, 4]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}