export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Transaction History</h3>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Export
          </button>
        </div>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No transactions found
        </div>
      </div>
    </div>
  )
}
