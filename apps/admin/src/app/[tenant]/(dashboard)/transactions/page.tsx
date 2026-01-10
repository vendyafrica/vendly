import { db } from "@vendly/db"
import { stores, tenants, transactions } from "@vendly/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"
import TransactionsClient from "./transactions-client"

export default async function TransactionsPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: tenantSlug } = await params

  // 1. Get Tenant & Store
  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug))
  if (!tenant) return <div>Tenant not found</div>

  const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id))
  if (!store) {
    return <TransactionsClient
      stats={{
        revenue: "$0.00", revenueChange: "+0%",
        count: "0", countChange: "+0%",
        pending: "0", pendingChange: "+0%",
        refunded: "$0.00", refundedChange: "+0%"
      }}
      transactions={[]}
    />
  }

  // 2. Fetch Stats

  // Total Revenue (Completed transactions of type payment)
  const [revenueStat] = await db
    .select({ total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .where(and(
      eq(transactions.storeId, store.id),
      eq(transactions.type, "payment"),
      eq(transactions.status, "completed")
    ))

  // Total Count
  const [countStat] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.storeId, store.id))

  // Pending Count
  const [pendingStat] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(and(
      eq(transactions.storeId, store.id),
      eq(transactions.status, "pending")
    ))

  // Refunded Amount
  const [refundStat] = await db
    .select({ total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .where(and(
      eq(transactions.storeId, store.id),
      eq(transactions.type, "refund")
    ))

  // 3. Fetch Transactions List
  const dbTransactions = await db.query.transactions.findMany({
    where: eq(transactions.storeId, store.id),
    orderBy: [desc(transactions.createdAt)],
    limit: 50,
    with: {
      customer: true
    }
  })

  // 4. Map Data
  const mappedTransactions = dbTransactions.map(tx => ({
    id: tx.transactionNumber,
    user: tx.customer?.name || "Guest",
    email: tx.customer?.email || "No email",
    amount: `$${(tx.amount / 100).toFixed(2)}`,
    status: tx.status,
    date: tx.createdAt.toLocaleDateString(),
    method: tx.paymentMethod || "N/A"
  }))

  const stats = {
    revenue: `$${((revenueStat?.total || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    revenueChange: "+0% from last month", // Placeholder for drift
    count: (countStat?.count || 0).toLocaleString(),
    countChange: "+0% from last month",
    pending: (pendingStat?.count || 0).toLocaleString(),
    pendingChange: "+0% from last month",
    refunded: `$${((refundStat?.total || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    refundedChange: "+0% from last month"
  }

  return <TransactionsClient stats={stats} transactions={mappedTransactions} />
}
