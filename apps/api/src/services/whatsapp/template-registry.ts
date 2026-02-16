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
  sellerNewOrder(to: string, p: { orderId: string; totalAmount: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_NEW_ORDER,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("order_id", p.orderId),
        namedParam("total_amount", p.totalAmount),
      ])],
    };
  },

  buyerOrderReceived(to: string, p: { customerName: string; orderId: string; storeName: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_RECEIVED,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("customer_name", p.customerName),
        namedParam("order_id", p.orderId),
        namedParam("store_name", p.storeName),
      ])],
    };
  },

  buyerOrderReady(to: string, p: { customerName: string; orderId: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_READY,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("customer_name", p.customerName),
        namedParam("order_id", p.orderId),
      ])],
    };
  },

  buyerOutForDelivery(to: string, p: { customerName: string; orderId: string; riderDetails: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_OUT_FOR_DELIVERY,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("customer_name", p.customerName),
        namedParam("order_id", p.orderId),
        namedParam("rider_details", p.riderDetails),
      ])],
    };
  },

  buyerOrderDelivered(to: string, p: { customerName: string; orderId: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_DELIVERED,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("customer_name", p.customerName),
        namedParam("order_id", p.orderId),
      ])],
    };
  },

  buyerOrderDeclined(to: string, p: { customerName: string; orderId: string; storeName: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_ORDER_DECLINED,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("customer_name", p.customerName),
        namedParam("order_id", p.orderId),
        namedParam("store_name", p.storeName),
      ])],
    };
  },
};
