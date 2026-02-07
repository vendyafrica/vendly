import { orders, type OrderItem } from "@vendly/db";
import { whatsappClient } from "./whatsapp/whatsapp-client";
import { normalizePhoneToE164 } from "../utils/phone";
import { shouldSendNotificationOnce } from "./notification-dedupe";

export async function notifySellerNewOrder(params: {
  sellerPhone: string | null;
  order: (typeof orders.$inferSelect) & { items?: Array<OrderItem> };
}) {
  // MVP: reuse the existing seller template + have tenant reply with Accept/Decline/Ready.
  return notifySellerOrderPaid(params);
}

export async function notifySellerOrderPaid(params: {
  sellerPhone: string | null;
  order: (typeof orders.$inferSelect) & { items?: Array<OrderItem> };
}) {
  const { sellerPhone, order } = params;

  if (!sellerPhone) {
    console.warn("[NotifySeller] No tenant phoneNumber configured; skipping WhatsApp stub", {
      orderId: order.id,
      tenantId: order.tenantId,
    });
    return;
  }

  const to = normalizePhoneToE164(sellerPhone, {
    defaultCountryCallingCode: process.env.DEFAULT_COUNTRY_CALLING_CODE || "254",
  });

  if (!to) {
    console.warn("[NotifySeller] Invalid seller phone; cannot normalize to E.164", {
      sellerPhone,
      orderId: order.id,
      tenantId: order.tenantId,
    });
    return;
  }

  // Meta expects a WhatsApp ID / phone number in international format (digits), typically without '+'.
  const toWhatsApp = to.replace(/^\+/, "");

  if (!whatsappClient.isConfigured()) {
    console.log("[NotifySeller] (stub) WhatsApp client not configured", {
      hasAccessToken: Boolean(process.env.WHATSAPP_ACCESS_TOKEN),
      hasPhoneNumberId: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID),
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || null,
    });

    console.log("[NotifySeller] (stub) Would send WhatsApp 'new paid order' to seller", {
      to: toWhatsApp,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
    });
    return;
  }

  // Uses a Utility template. Template must be created & approved in Meta before this can send.
  await whatsappClient.sendTemplateMessage({
    to: toWhatsApp,
    templateName: "seller_new_paid_order",
    languageCode: "en_US",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", parameter_name: "order_number", text: order.orderNumber },
          { type: "text", parameter_name: "buyer_name", text: order.customerName },
          { type: "text", parameter_name: "currency", text: order.currency },
          { type: "text", parameter_name: "total", text: String(order.totalAmount) },
        ],
      },
    ],
  });
}

function normalizeCustomerWhatsAppTo(order: { id: string; customerPhone?: string | null; orderNumber: string }) {
  if (!order.customerPhone) {
    console.warn("[NotifyCustomer] Missing customerPhone; skipping", { orderId: order.id, orderNumber: order.orderNumber });
    return null;
  }

  const to = normalizePhoneToE164(order.customerPhone, {
    defaultCountryCallingCode: process.env.DEFAULT_COUNTRY_CALLING_CODE || "254",
  });

  if (!to) {
    console.warn("[NotifyCustomer] Invalid customer phone; cannot normalize to E.164", {
      customerPhone: order.customerPhone,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
    return null;
  }

  return to.replace(/^\+/, "");
}

async function sendCustomerTextOnce(params: {
  orderId: string;
  event: "received" | "accepted" | "out_for_delivery";
  toWhatsApp: string;
  body: string;
}) {
  const key = `customer:${params.event}:${params.orderId}:${params.toWhatsApp}`;
  if (!shouldSendNotificationOnce({ key })) {
    console.log("[NotifyCustomer] Skipping duplicate", { key });
    return;
  }

  if (!whatsappClient.isConfigured()) {
    console.log("[NotifyCustomer] (stub) WhatsApp client not configured", {
      event: params.event,
      to: params.toWhatsApp,
      orderId: params.orderId,
    });
    console.log("[NotifyCustomer] (stub) Would send", { body: params.body });
    return;
  }

  await whatsappClient.sendTextMessage({
    to: params.toWhatsApp,
    body: params.body,
  });
}

export async function notifyCustomerOrderReceived(params: {
  order: (typeof orders.$inferSelect) & { store?: { name?: string | null } | null };
}) {
  const { order } = params;
  const toWhatsApp = normalizeCustomerWhatsAppTo(order);
  if (!toWhatsApp) return;

  const storeName = order.store?.name || "the store";
  const body = `We received your order ${order.orderNumber} from ${storeName}. We’ll notify you when it’s accepted.`;
  await sendCustomerTextOnce({ orderId: order.id, event: "received", toWhatsApp, body });
}

export async function notifyCustomerOrderAccepted(params: {
  order: (typeof orders.$inferSelect) & { store?: { name?: string | null } | null };
}) {
  const { order } = params;
  const toWhatsApp = normalizeCustomerWhatsAppTo(order);
  if (!toWhatsApp) return;

  const storeName = order.store?.name || "the store";
  const body = `Good news — ${storeName} accepted your order ${order.orderNumber}. We’ll notify you when it’s out for delivery.`;
  await sendCustomerTextOnce({ orderId: order.id, event: "accepted", toWhatsApp, body });
}

export async function notifyCustomerOrderOutForDelivery(params: {
  order: (typeof orders.$inferSelect) & { store?: { name?: string | null } | null };
}) {
  const { order } = params;
  const toWhatsApp = normalizeCustomerWhatsAppTo(order);
  if (!toWhatsApp) return;

  const storeName = order.store?.name || "the store";
  const body = `Update: ${storeName} says your order ${order.orderNumber} is out for delivery.`;
  await sendCustomerTextOnce({ orderId: order.id, event: "out_for_delivery", toWhatsApp, body });
}
