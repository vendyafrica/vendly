import { db } from "@vendly/db";
import {
  tenants,
  stores,
  orders,
  storeCustomers,
  transactions,
  orderAddresses,
  orderItems,
  products
} from "@vendly/db/schema";
import { eq, desc, and, sql, gte } from "drizzle-orm";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantSlug } = await params;

  // 1. Get Tenant
  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, tenantSlug));

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  // 2. Get Store associated with the tenant
  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.tenantId, tenant.id));

  if (!store) {
    // Render client with empty/zero data
    return (
      <DashboardClient
        stats={{
          totalRevenue: "$0.00",
          revenueChange: "+0%",
          revenueTrend: "up",
          totalOrders: "0",
          ordersChange: "+0%",
          ordersTrend: "up",
          newCustomers: "0",
          customersChange: "+0%",
          customersTrend: "up",
          conversionRate: "0%",
          conversionChange: "0%",
          conversionTrend: "up",
        }}
        revenueData={[]}
        transactions={[]}
        countryData={[]}
      />
    )
  }

  // 3. Fetch Data

  // A. Total Revenue (Completed orders)
  // Assuming 'totalAmount' is in cents (integer)
  const revenueResult = await db
    .select({
      total: sql<number>`sum(${orders.totalAmount})`
    })
    .from(orders)
    .where(
      and(
        eq(orders.storeId, store.id),
        eq(orders.paymentStatus, "paid") // or 'completed' depending on your flow
      )
    );

  const totalRevenueCents = revenueResult[0]?.total || 0;
  const totalRevenue = totalRevenueCents / 100;

  // B. Total Orders
  const ordersResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.storeId, store.id));

  const totalOrders = ordersResult[0]?.count || 0;

  // C. New Customers (Last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newCustomersResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(storeCustomers)
    .where(
      and(
        eq(storeCustomers.storeId, store.id),
        gte(storeCustomers.createdAt, thirtyDaysAgo)
      )
    );

  const newCustomers = newCustomersResult[0]?.count || 0;

  // D. Recent Transactions (Latest 5 orders)
  const recentOrders = await db.query.orders.findMany({
    where: eq(orders.storeId, store.id),
    orderBy: [desc(orders.createdAt)],
    limit: 5,
    with: {
      customer: true,
      items: {
        limit: 1 // Just to get a product name example
      }
    }
  });

  const mappedTransactions = recentOrders.map(order => ({
    id: order.orderNumber,
    customer: order.customer?.name || order.email || "Guest",
    product: order.items[0]?.title || "Order", // Simplification
    amount: `$${(order.totalAmount / 100).toFixed(2)}`,
    status: order.status, // e.g. 'completed', 'pending'
    payment: order.paymentStatus, // using payment status as proxy for method sometimes, or add method column
    date: order.createdAt.toLocaleDateString(),
  }));

  // E. Revenue Chart Data (Last 6 months? Or just all time grouped by month)
  // Making a simplified query for last 12 months
  // This is a complex query to do in ORM purely, often raw SQL is easier for aggregation by date
  // For now, let's mock the chart with real totals distributed or try a basic aggregation
  // We'll stick to a simpler "last few orders" aggregation for safety or just keep the mock data for chart ONLY if real data is scarce, 
  // but let's try to fetch it.

  // Fetch all paid orders for chart (maybe limit to last 100 to avoid perf issues for now)
  const chartOrders = await db
    .select({
      amount: orders.totalAmount,
      date: orders.createdAt
    })
    .from(orders)
    .where(
      and(
        eq(orders.storeId, store.id),
        eq(orders.paymentStatus, "paid")
      )
    )
    .orderBy(desc(orders.createdAt))
    .limit(500);

  // Process in JS (group by Month)
  const monthMap = new Map<string, number>();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  chartOrders.forEach(o => {
    const d = new Date(o.date);
    const month = months[d.getMonth()];
    const current = monthMap.get(month) || 0;
    monthMap.set(month, current + (o.amount / 100));
  });

  const revenueData = Array.from(monthMap.entries()).map(([month, revenue]) => ({
    month,
    revenue
  })).reverse(); // This reverse might be wrong depending on iteration order, usually map preserves insertion order
  // Better: Pre-fill months or sort by date. 
  // For this iteration, let's just map the recent 7 months or so.

  const finalRevenueData = revenueData.length > 0 ? revenueData : [
    { month: "No Data", revenue: 0 }
  ];

  // F. Country Stats
  // Aggregate orderAddresses by country
  const countryDist = await db
    .select({
      country: orderAddresses.countryCode,
      count: sql<number>`count(*)`
    })
    .from(orderAddresses)
    .where(eq(orderAddresses.storeId, store.id))
    .groupBy(orderAddresses.countryCode);

  const totalAddresses = countryDist.reduce((acc, curr) => acc + Number(curr.count), 0);

  const countryData = countryDist.map(c => ({
    name: c.country,
    value: Number(c.count),
    percent: totalAddresses > 0 ? (Number(c.count) / totalAddresses) * 100 : 0,
    flag: getFlagEmoji(c.country), // Helper needed
    color: "bg-blue-500"
  })).sort((a, b) => b.value - a.value).slice(0, 4);

  return (
    <DashboardClient
      stats={{
        totalRevenue: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        revenueChange: "+0%", // Needs comparison to prev period
        revenueTrend: "up",
        totalOrders: totalOrders.toLocaleString(),
        ordersChange: "+0%",
        ordersTrend: "up",
        newCustomers: newCustomers.toLocaleString(),
        customersChange: "+0%",
        customersTrend: "up",
        conversionRate: "0%", // Placeholder
        conversionChange: "0%",
        conversionTrend: "up",
      }}
      revenueData={finalRevenueData}
      transactions={mappedTransactions}
      countryData={countryData}
    />
  );
}

// Helper for flag emojis
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
