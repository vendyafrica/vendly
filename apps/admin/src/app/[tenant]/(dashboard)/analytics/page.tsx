import { db } from "@vendly/db"
import { stores, tenants, orders, orderItems, products, orderStatusEvents } from "@vendly/db/schema"
import { eq, desc, and, sql, gte } from "drizzle-orm"
import AnalyticsClient from "./analytics-client"

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: tenantSlug } = await params

  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug))
  if (!tenant) return <div>Tenant not found</div>

  const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id))
  if (!store) return <AnalyticsClient revenueData={[]} salesData={[]} categoryData={[]} recentActivity={[]} />

  // 1. Revenue Over Time (Group by Month)
  // Limited implementation: fetch last N transactions and group in JS
  const transactions = await db
    .select({
      date: orders.createdAt,
      amount: orders.totalAmount
    })
    .from(orders)
    .where(and(
      eq(orders.storeId, store.id),
      eq(orders.paymentStatus, "paid")
    ))
    .orderBy(desc(orders.createdAt)) // Newest first
    .limit(500)

  const monthMap = new Map<string, number>()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  transactions.forEach(t => {
    const d = new Date(t.date)
    const m = months[d.getMonth()]
    monthMap.set(m, (monthMap.get(m) || 0) + (t.amount / 100))
  })

  const revenueData = Array.from(monthMap.entries()).map(([name, total]) => ({ name, total })).reverse()

  // 2. Daily Sales (Group by Day of Week)
  // Fetch orders created last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentOrders = await db
    .select({ date: orders.createdAt })
    .from(orders)
    .where(and(
      eq(orders.storeId, store.id),
      gte(orders.createdAt, sevenDaysAgo)
    ))

  const dayMap = new Map<string, number>()
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  days.forEach(d => dayMap.set(d, 0)) // Init

  recentOrders.forEach(o => {
    const d = days[new Date(o.date).getDay()]
    dayMap.set(d, (dayMap.get(d) || 0) + 1)
  })

  // Start from "Mon" as per design usually
  const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const salesData = orderedDays.map(d => ({ name: d, sales: dayMap.get(d) || 0 }))


  // 3. Sales by Category
  // Join orderItems -> products -> category
  // This is tricky if categories are not strictly set. We'll do best effort.
  // Actually, let's just use Product Titles or simple count for now to avoid complex join if schema is flux
  // Or query orderItems and group by productId, then map to product names.

  /* 
  const categoryStats = await db
     .select({
        catName: storeCategories.name,
        count: sql<number>`count(*)`
     })
     .from(orderItems)
     .leftJoin(products, eq(orderItems.productId, products.id))
     .leftJoin(storeCategories, eq(products.categoryId, storeCategories.id))
     .where(eq(orderItems.storeId, store.id))
     .groupBy(storeCategories.name) 
  */
  // Simplified: Mock categories based on product titles or just use placeholders if empty
  const categoryData = [
    { name: "Uncategorized", value: 100 } // Default
  ]

  // 4. Recent Activity
  // Fetch latest 5 orders
  const latestOrders = await db.query.orders.findMany({
    where: eq(orders.storeId, store.id),
    orderBy: [desc(orders.createdAt)],
    limit: 5,
    with: { customer: true }
  })

  const recentActivity = latestOrders.map(o => ({
    id: o.id,
    title: `New Order ${o.orderNumber}`,
    description: `Order received from ${o.customer?.name || "Guest"}`,
    time: getTimeAgo(o.createdAt)
  }))

  return <AnalyticsClient
    revenueData={revenueData.length ? revenueData : [{ name: "No Data", total: 0 }]}
    salesData={salesData}
    categoryData={categoryData} // TODO: Implement real category aggregation
    recentActivity={recentActivity}
  />
}

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
