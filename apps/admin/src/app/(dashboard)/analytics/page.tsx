export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold">Total Customers</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold">Conversion Rate</h3>
          <p className="text-2xl font-bold">0%</p>
        </div>
      </div>
      <div className="bg-muted/50 min-h-[400px] rounded-lg p-6">
        <h3 className="font-semibold mb-4">Revenue Chart</h3>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Chart placeholder
        </div>
      </div>
    </div>
  )
}
