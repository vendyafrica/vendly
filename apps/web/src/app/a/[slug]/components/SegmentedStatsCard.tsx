import { Card, CardContent } from "@vendly/ui/components/card";
import { cn } from "@vendly/ui/lib/utils";

export type StatSegment = {
  label: string;
  value: string;
  changeLabel: string;
  changeTone?: "positive" | "negative" | "neutral";
};

export function SegmentedStatsCard({
  segments,
  className,
}: {
  segments: StatSegment[];
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4 md:gap-0 md:p-0 md:divide-x">
          {segments.map((s, idx) => {
            const toneClass =
              s.changeTone === "positive"
                ? "text-emerald-600"
                : s.changeTone === "negative"
                  ? "text-rose-600"
                  : "text-muted-foreground";

            return (
              <div
                key={idx}
                className="rounded-lg border border-border/70 bg-card px-4 py-3 md:rounded-none md:border-0 md:px-5 md:py-4"
              >
                <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-2xl font-semibold text-foreground">{s.value}</div>
                <div className={cn("mt-1 text-xs", toneClass)}>{s.changeLabel}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
