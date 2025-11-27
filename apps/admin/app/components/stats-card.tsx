// components/stats-card.tsx
export function StatsCard({ 
  title, 
  value, 
  change, 
  period 
}: { 
  title: string
  value: string
  change: string
  period: string 
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-2 text-xs text-green-600 font-medium">
        <span>↑ {change}</span>
        <span className="text-gray-500 ml-1">{period}</span>
      </p>
    </div>
  )
}