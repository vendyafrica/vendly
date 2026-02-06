import { SegmentedStatsCard } from "../components/SegmentedStatsCard";
import { db } from "@vendly/db/db";
import { orders, payments, stores } from "@vendly/db/schema";
import { and, desc, eq, isNull } from "@vendly/db";
import { NotificationsTable, type NotificationRow } from "./NotificationsTable";

function timeAgo(from: Date, to: Date) {
  const diffMs = Math.max(0, to.getTime() - from.getTime());

  const diffMin = Math.floor(diffMs / (60 * 1000));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
    columns: { id: true, tenantId: true },
  });

  if (!store) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">Store not found.</div>
      </div>
    );
  }

  const now = new Date();

  const [recentOrders, recentPayments] = await Promise.all([
    db.query.orders.findMany({
      where: and(eq(orders.tenantId, store.tenantId), eq(orders.storeId, store.id), isNull(orders.deletedAt)),
      orderBy: [desc(orders.createdAt)],
      limit: 15,
      columns: {
        id: true,
        orderNumber: true,
        customerName: true,
        paymentStatus: true,
        status: true,
        totalAmount: true,
        currency: true,
        createdAt: true,
      },
    }),
    db.query.payments.findMany({
      where: and(eq(payments.tenantId, store.tenantId), eq(payments.storeId, store.id)),
      orderBy: [desc(payments.createdAt)],
      limit: 15,
      columns: {
        id: true,
        provider: true,
        status: true,
        amount: true,
        currency: true,
        createdAt: true,
      },
    }),
  ]);

  const orderEvents = recentOrders.map((o) => {
    const summary =
      o.paymentStatus === "paid"
        ? `Payment received for order ${o.orderNumber}`
        : o.paymentStatus === "failed"
          ? `Payment failed for order ${o.orderNumber}`
          : o.paymentStatus === "refunded"
            ? `Order ${o.orderNumber} was refunded`
            : `Order ${o.orderNumber} placed`;

    const actor = o.customerName ? ` • ${o.customerName}` : "";

    return {
      _sortAt: o.createdAt,
      row: {
        id: o.orderNumber,
        type: "Order" as const,
        summary: `${summary}${actor}`,
        channel: "In-App" as const,
        status: "New" as const,
        time: timeAgo(new Date(o.createdAt), now),
      },
    };
  });

  const paymentEvents = recentPayments.map((p) => {
    const providerLabel = p.provider ? p.provider.toUpperCase() : "Payment";
    const summary =
      p.status === "paid" || p.status === "success"
        ? `${providerLabel} payment succeeded`
        : p.status === "failed"
          ? `${providerLabel} payment failed`
          : `${providerLabel} payment pending`;

    return {
      _sortAt: p.createdAt,
      row: {
        id: p.id,
        type: "Payment" as const,
        summary,
        channel: "In-App" as const,
        status: "New" as const,
        time: timeAgo(new Date(p.createdAt), now),
      },
    };
  });

  const notifications: NotificationRow[] = [...orderEvents, ...paymentEvents]
    .sort((a, b) => new Date(b._sortAt).getTime() - new Date(a._sortAt).getTime())
    .slice(0, 20)
    .map((x) => x.row);

  const orderCount = recentOrders.length;
  const paymentCount = recentPayments.length;
  const total = notifications.length;

  const statSegments = [
    {
      label: "Recent Alerts",
      value: total.toLocaleString(),
      changeLabel: "",
      changeTone: "neutral" as const,
    },
    {
      label: "Orders",
      value: orderCount.toLocaleString(),
      changeLabel: "",
      changeTone: "neutral" as const,
    },
    {
      label: "Payments",
      value: paymentCount.toLocaleString(),
      changeLabel: "",
      changeTone: "neutral" as const,
    },
    {
      label: "Status",
      value: total ? "New" : "—",
      changeLabel: "",
      changeTone: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">Recent activity from orders and payments.</p>
      </div>

      <SegmentedStatsCard segments={statSegments} />

      <div className="rounded-md border bg-card p-3">
        <NotificationsTable rows={notifications} />
      </div>
    </div>
  );
}