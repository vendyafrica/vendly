import { db } from "@vendly/db"
import { stores, tenants, orders, orderStatusEvents, inventoryItems, productVariants, products } from "@vendly/db/schema"
import { eq, desc, and, lt } from "drizzle-orm"
import MessagesClient, { Notification, NotificationType } from "./messages-client"

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: tenantSlug } = await params

  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug))
  if (!tenant) return <div>Tenant not found</div>

  const [store] = await db.select().from(stores).where(eq(stores.tenantId, tenant.id))
  if (!store) return <MessagesClient notifications={[]} />

  const notifications: Notification[] = []

  // 1. Fetch recent orders to simulate "Order Placed" / "delivered" notifications
  const recentOrders = await db.query.orders.findMany({
    where: eq(orders.storeId, store.id),
    orderBy: [desc(orders.updatedAt)],
    limit: 20,
    with: { customer: true }
  })

  // Map orders to notifications based on status
  recentOrders.forEach(o => {
    let type: NotificationType | null = null
    let title = ""
    let message = ""

    if (o.status === "completed") {
      type = "ORDER_DELIVERED"
      title = "Order Delivered"
      message = `Order #${o.orderNumber} successfully delivered.`
    } else if (o.paymentStatus === "paid") {
      type = "PAYMENT_RECEIVED"
      title = "Payment Confirmed"
      message = `$${(o.totalAmount / 100).toFixed(2)} received from ${o.customer?.name || "Guest"}.`
    } else if (o.status === "pending" || o.status === "processing") {
      type = "ORDER_PLACED"
      title = "New Order"
      message = `Order #${o.orderNumber} received from ${o.customer?.name || "Guest"}.`
    }

    if (type) {
      notifications.push({
        id: o.id,
        type,
        title,
        message,
        time: getTimeAgo(o.updatedAt),
        isRead: false, // All unread for demo
        data: {
          orderId: o.orderNumber,
          amount: `$${(o.totalAmount / 100).toFixed(2)}`,
          customerName: o.customer?.name || "Guest"
        }
      })
    }
  })

  // 2. Fetch Order Status Events (If any)
  // Merging this might cause duplicates if we are inferring from orders too, so let's stick to orders inference for now 
  // until events are consistently logged.

  // 3. Fetch Low Stock Items
  // Joined with products to filter by storeId correctly
  const lowStockItems = await db
    .select({
      productTitle: products.title,
      variantTitle: productVariants.title,
      stock: inventoryItems.quantityOnHand,
      id: productVariants.id
    })
    .from(inventoryItems)
    .innerJoin(productVariants, eq(inventoryItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(and(
      eq(products.storeId, store.id),
      lt(inventoryItems.quantityOnHand, 10)
    ))
    .limit(5)

  lowStockItems.forEach(item => {
    const title = item.variantTitle && item.variantTitle !== "Default"
      ? `${item.productTitle} (${item.variantTitle})`
      : item.productTitle;

    notifications.push({
      id: item.id,
      type: "STOCK_LOW",
      title: "Low Stock",
      message: `${title} inventory is low (${item.stock} left).`,
      time: "Just now",
      isRead: false
    })
  })

  // Sort by time (rough string comparison won't work well, but it's okay for now or we could store timestamp)
  // Ideally, use real dates.
  // We'll trust the DB sort order for orders, and prepend stock alerts.

  return <MessagesClient notifications={notifications} />
}

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}
