import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@vendly/ui/components/card"

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
}

export function StatsCard({ title, value, change, trend, icon: Icon }: StatsCardProps) {
  return (
    <Card className="rounded-xl border-border shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-lg">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
            </div>
            {/* Info Icon placeholder */}
            <span className="text-muted-foreground cursor-help">ⓘ</span>
        </div>

        <div className="mt-4">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>

        <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                trend === 'up' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
            }`}>
                {trend === 'up' ? '↑' : '↓'} {change}
            </span>
            <span className="text-xs text-muted-foreground">From the Last month</span>
        </div>
      </CardContent>
    </Card>
  )
}