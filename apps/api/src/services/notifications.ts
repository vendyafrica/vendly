import { orders, type OrderItem } from "@vendly/db";
import { whatsappClient } from "./whatsapp/whatsapp-client";
import { templateSend } from "./whatsapp/template-registry";
import { normalizePhoneToE164 } from "../utils/phone";
import { shouldSendNotificationOnce } from "./notification-dedupe";
import { buyerPreferenceStore } from "./whatsapp/preference-store";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeToWhatsApp(phone: string | null | undefined, label: string, context: Record<string, unknown>): string | null {
  if (!phone) {
    console.warn(`[Notify] Missing ${label} phone; skipping`, context);
    return null;
  }

  const to = normalizePhoneToE164(phone, {
    defaultCountryCallingCode: process.env.DEFAULT_COUNTRY_CALLING_CODE || "256",
  });

  if (!to) {
    console.warn(`[Notify] Invalid ${label} phone; cannot normalize to E.164`, { phone, ...context });
    return null;
  }

  return to.replace(/^\+/, "");
}

export async function notifySellerCswOpener(params: { sellerPhone: string | null; tenantId: string }) {
  const { sellerPhone, tenantId } = params;
  const to = normalizeToWhatsApp(sellerPhone, "seller", { tenantId });
  if (!to) return;

  const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = `seller:csw_opener:${tenantId}:${dayKey}:${to}`;
  // 24h TTL to avoid multiple sends per day
  await sendOnce(key, () => whatsappClient.sendTemplateMessage(templateSend.sellerCswOpener(to)), { ttlMs: 24 * 60 * 60 * 1000 });
}

type OrderLike = (typeof orders.$inferSelect) & {
  items?: Array<OrderItem> | null;
  store?: { name?: string | null } | null;
};

function formatItemsSummary(items: Array<OrderItem> | null | undefined): string {
  if (!items || items.length === 0) return "See order details";
  return items
    .map((i) => `${i.quantity ?? 1}x ${i.productName || "Item"}`)
    .join(", ");
}

function formatCustomerDetails(order: OrderLike): string {
  const parts: string[] = [];
  parts.push(order.customerName);
  if (order.customerPhone) parts.push(order.customerPhone);
  if (order.deliveryAddress) parts.push(`Address: ${order.deliveryAddress}`);
  if (order.notes) parts.push(`Note: ${order.notes}`);
  return parts.join(". ");
}

async function sendOnce(key: string, fn: () => Promise<unknown>, opts?: { ttlMs?: number }) {
  if (!shouldSendNotificationOnce({ key, ttlMs: opts?.ttlMs })) {
    console.log("[Notify] Skipping duplicate", { key });
    return;
  }

  if (!whatsappClient.isConfigured()) {
    console.log("[Notify] (stub) WhatsApp not configured; would send", { key });
    return;
  }

  await fn();
}

// ---------------------------------------------------------------------------
// Seller notifications
// ---------------------------------------------------------------------------

export async function notifySellerNewOrder(params: {
  sellerPhone: string | null;
  order: OrderLike;
}) {
  const { sellerPhone, order } = params;
  const to = normalizeToWhatsApp(sellerPhone, "seller", { orderId: order.id, tenantId: order.tenantId });
  if (!to) return;

  const key = `seller:new_order:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.sellerNewOrder(to, {
        orderId: order.orderNumber,
        totalAmount: String(order.totalAmount),
      })
    )
  );
}

export async function notifySellerOrderDetails(params: {
  sellerPhone: string | null;
  order: OrderLike;
}) {
  const { sellerPhone, order } = params;
  const to = normalizeToWhatsApp(sellerPhone, "seller", { orderId: order.id });
  if (!to) return;

  const key = `seller:order_details:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.sellerOrderDetails(to, {
        orderId: order.orderNumber,
        itemsSummary: formatItemsSummary(order.items),
      })
    )
  );
}

export async function notifySellerCustomerDetails(params: {
  sellerPhone: string | null;
  order: OrderLike;
}) {
  const { sellerPhone, order } = params;
  const to = normalizeToWhatsApp(sellerPhone, "seller", { orderId: order.id });
  if (!to) return;

  const key = `seller:customer_details:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.sellerCustomerDetails(to, {
        orderId: order.orderNumber,
        customerDetails: formatCustomerDetails(order),
      })
    )
  );
}

export async function notifySellerMarkReady(params: {
  sellerPhone: string | null;
  order: OrderLike;
}) {
  const { sellerPhone, order } = params;
  const to = normalizeToWhatsApp(sellerPhone, "seller", { orderId: order.id });
  if (!to) return;

  const key = `seller:mark_ready:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.sellerMarkReady(to, { orderId: order.orderNumber })
    )
  );
}

export async function notifySellerOutForDelivery(params: {
  sellerPhone: string | null;
  order: OrderLike;
  riderDetails?: string;
}) {
  const { sellerPhone, order } = params;
  const to = normalizeToWhatsApp(sellerPhone, "seller", { orderId: order.id });
  if (!to) return;

  const key = `seller:out_for_delivery:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.sellerOutForDelivery(to, {
        orderId: order.orderNumber,
        riderDetails: params.riderDetails || "Vendly Rider (+256700000000)",
      })
    )
  );
}

export async function notifySellerOrderCompleted(params: {
  sellerPhone: string | null;
  order: OrderLike;
}) {
  const { sellerPhone, order } = params;
  const to = normalizeToWhatsApp(sellerPhone, "seller", { orderId: order.id });
  if (!to) return;

  const key = `seller:order_completed:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.sellerOrderCompleted(to, { orderId: order.orderNumber })
    )
  );
}

// ---------------------------------------------------------------------------
// Buyer / Customer notifications
// ---------------------------------------------------------------------------

export async function notifyCustomerOrderReceived(params: { order: OrderLike }) {
  const { order } = params;
  const to = normalizeToWhatsApp(order.customerPhone, "customer", { orderId: order.id, orderNumber: order.orderNumber });
  if (!to) return;

  const key = `customer:received:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.buyerOrderReceived(to, {
        customerName: order.customerName,
        orderId: order.orderNumber,
        storeName: order.store?.name || "the store",
      })
    )
  );
}

export async function notifyCustomerPaymentAction(params: { order: OrderLike }) {
  const { order } = params;
  const to = normalizeToWhatsApp(order.customerPhone, "customer", { orderId: order.id, orderNumber: order.orderNumber });
  if (!to) return;

  const key = `customer:payment_action:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.buyerPaymentAction(to, {
        customerName: order.customerName,
        orderId: order.orderNumber,
        storeName: order.store?.name || "the store",
        amount: String(order.totalAmount),
      })
    )
  );
}

export async function notifyCustomerOrderAccepted(params: { order: OrderLike }) {
  const { order } = params;
  const to = normalizeToWhatsApp(order.customerPhone, "customer", { orderId: order.id, orderNumber: order.orderNumber });
  if (!to) return;

  const key = `customer:accepted:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.buyerOrderReady(to, {
        customerName: order.customerName,
        orderId: order.orderNumber,
      })
    )
  );
}

export async function notifyCustomerOrderReady(params: { order: OrderLike }) {
  const { order } = params;
  if (buyerPreferenceStore.isOnce(order.customerPhone)) return;
  const to = normalizeToWhatsApp(order.customerPhone, "customer", { orderId: order.id, orderNumber: order.orderNumber });
  if (!to) return;

  const key = `customer:ready:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.buyerOrderReady(to, {
        customerName: order.customerName,
        orderId: order.orderNumber,
      })
    )
  );
}

export async function notifyCustomerOutForDelivery(params: { order: OrderLike; riderDetails?: string }) {
  const { order } = params;
  const to = normalizeToWhatsApp(order.customerPhone, "customer", { orderId: order.id, orderNumber: order.orderNumber });
  if (!to) return;

  const key = `customer:out_for_delivery:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.buyerOutForDelivery(to, {
        customerName: order.customerName,
        orderId: order.orderNumber,
        riderDetails: params.riderDetails || "Vendly Rider (+256700000000)",
      })
    )
  );
}

export async function notifyCustomerOrderDelivered(params: { order: OrderLike }) {
  const { order } = params;
  const to = normalizeToWhatsApp(order.customerPhone, "customer", { orderId: order.id, orderNumber: order.orderNumber });
  if (!to) return;

  const key = `customer:delivered:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.buyerOrderDelivered(to, {
        customerName: order.customerName,
        orderId: order.orderNumber,
      })
    )
  );
}

export async function notifyCustomerOrderDeclined(params: { order: OrderLike }) {
  const { order } = params;
  if (buyerPreferenceStore.isOnce(order.customerPhone)) return;
  const to = normalizeToWhatsApp(order.customerPhone, "customer", { orderId: order.id, orderNumber: order.orderNumber });
  if (!to) return;

  const key = `customer:declined:${order.id}:${to}`;
  await sendOnce(key, () =>
    whatsappClient.sendTemplateMessage(
      templateSend.buyerOrderDeclined(to, {
        customerName: order.customerName,
        orderId: order.orderNumber,
        storeName: order.store?.name || "the store",
      })
    )
  );
}
