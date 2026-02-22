import type { SendTemplateMessageInput } from "./whatsapp-client";

export const TEMPLATE_NAMES = {
  SELLER_NEW_ORDER: "seller_new_order_action_v10",
  BUYER_ORDER_RECEIVED: "buyer_order_received_v10",
  BUYER_ORDER_READY: "buyer_order_ready_v10",
  BUYER_OUT_FOR_DELIVERY: "buyer_out_for_delivery_v10",
  BUYER_ORDER_DELIVERED: "buyer_order_delivered_v10",
  BUYER_ORDER_DECLINED: "buyer_order_declined_v10",
  BUYER_PREF_OPENER: "buyer_pref_opener_v10",
} as const;

const LANG = "en_US";

function namedParam(paramName: string, text: string): Record<string, unknown> {
  return { type: "text", parameter_name: paramName, text };
}

function bodyComponent(params: Record<string, unknown>[]): { type: "body"; parameters: Record<string, unknown>[] } {
  return { type: "body", parameters: params };
}

export const templateSend = {
  sellerNewOrder(
    to: string,
    p: {
      sellerName: string;
      orderId: string;
      orderItems: string;
      buyerName: string;
      customerPhone: string;
      customerLocation: string;
      total: string;
    }
  ): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_NEW_ORDER,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("seller_name", p.sellerName),
        namedParam("order_id", p.orderId),
        namedParam("order_items", p.orderItems),
        namedParam("buyer_name", p.buyerName),
        namedParam("customer_phone", p.customerPhone),
        namedParam("customer_location", p.customerLocation),
        namedParam("total", p.total),
      ])],
    };
  },

  buyerOrderReceived(to: string, p: { buyerName: string; storeName: string; sellerWhatsappLink: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_RECEIVED,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("buyer_name", p.buyerName),
        namedParam("store_name", p.storeName),
        namedParam("seller_whatsapp_link", p.sellerWhatsappLink),
      ])],
    };
  },

  buyerOrderReady(to: string, p: { buyerName: string; storeName: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_READY,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("buyer_name", p.buyerName),
        namedParam("store_name", p.storeName),
      ])],
    };
  },

  buyerOutForDelivery(to: string, p: { buyerName: string; storeName: string; riderDetails: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_OUT_FOR_DELIVERY,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("buyer_name", p.buyerName),
        namedParam("store_name", p.storeName),
        namedParam("rider_details", p.riderDetails),
      ])],
    };
  },

  buyerOrderDelivered(to: string, p: { buyerName: string; storeName: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_DELIVERED,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("buyer_name", p.buyerName),
        namedParam("store_name", p.storeName),
      ])],
    };
  },

  buyerOrderDeclined(to: string, p: { buyerName: string; storeName: string; sellerWhatsappLink: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_DECLINED,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("buyer_name", p.buyerName),
        namedParam("store_name", p.storeName),
        namedParam("seller_whatsapp_link", p.sellerWhatsappLink),
      ])],
    };
  },
};
