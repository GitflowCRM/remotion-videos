import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon }: KPICardProps) {
  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {change && (
            <span
              className={cn(
                "text-[11px] font-semibold px-2 py-1 rounded-full",
                changeType === "positive" && "bg-green-100 text-green-600",
                changeType === "negative" && "bg-red-100 text-red-600",
                changeType === "neutral" && "bg-gray-100 text-gray-600",
              )}
            >
              {change}
            </span>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          <p className="text-[13px] text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export { KPICard as KpiCard }
