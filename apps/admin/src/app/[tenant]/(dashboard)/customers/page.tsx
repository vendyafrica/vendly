import { db } from "@vendly/db"
import { stores, tenants, storeCustomers } from "@vendly/db/schema"
import { eq, desc, and, sql, gte } from "drizzle-orm"
import CustomersClient from "./customers-client"

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: tenantSlug } = await params

  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug))
  if (!tenant) return <div>Tenant not found</div>

  const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id))
  if (!store) return <CustomersClient stats={[
    { label: "Total Customers", value: "0", change: "+0%", trend: "up" },
    { label: "Active Now", value: "0", change: "+0", trend: "up" },
    { label: "New This Month", value: "0", change: "+0%", trend: "up" },
    { label: "Blocked Users", value: "0", change: "0", trend: "down" }
  ]} customers={[]} />

  // 1. Fetch Stats

  // Total
  const [totalRes] = await db
    .select({ count: sql<number>`count(*)` })
    .from(storeCustomers)
    .where(eq(storeCustomers.storeId, store.id))
  const total = totalRes?.count || 0

  // New This Month
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [newRes] = await db
    .select({ count: sql<number>`count(*)` })
    .from(storeCustomers)
    .where(and(
      eq(storeCustomers.storeId, store.id),
      gte(storeCustomers.createdAt, thirtyDaysAgo)
    ))
  const newCount = newRes?.count || 0

  // 2. Fetch Customers
  const dbCustomers = await db.query.storeCustomers.findMany({
    where: eq(storeCustomers.storeId, store.id),
    orderBy: [desc(storeCustomers.createdAt)],
    limit: 50
  })

  // 3. Map to UI
  const customers = dbCustomers.map(c => ({
    id: c.id,
    name: c.name || "Unknown",
    email: c.email || "No email",
    orders: c.totalOrders || 0,
    spent: `$${(Number(c.totalSpent) || 0).toFixed(2)}`, // Schema uses numeric string
    lastActive: c.lastPurchaseAt ? c.lastPurchaseAt.toLocaleDateString() : "Never",
    status: (Number(c.totalSpent) > 1000) ? "VIP" : "Active", // Simple logic for VIP
    avatar: (c.name || "U").substring(0, 2).toUpperCase()
  }))

  const stats = [
    {
      label: "Total Customers",
      value: total.toLocaleString(),
      change: "+0% from last month", // Placeholder
      trend: "up" as const
    },
    {
      label: "Active Now",
      value: Math.floor(Math.random() * 5).toString(), // Mock
      change: "Real-time",
      trend: "up" as const
    },
    {
      label: "New This Month",
      value: `+${newCount}`,
      change: "Rolling 30 days",
      trend: "up" as const
    },
    {
      label: "Blocked Users",
      value: "0",
      change: "N/A",
      trend: "down" as const
    },
  ]

  return <CustomersClient stats={stats} customers={customers} />
}
