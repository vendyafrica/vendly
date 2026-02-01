import { orders, type OrderItem } from "@vendly/db";
import { whatsappClient } from "./whatsapp/whatsapp-client";
import { normalizePhoneToE164 } from "../utils/phone";

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
