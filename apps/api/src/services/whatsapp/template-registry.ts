import type { SendTemplateMessageInput } from "./whatsapp-client";

export const TEMPLATE_NAMES = {
  SELLER_NEW_ORDER: "seller_new_order_action_v3",
  SELLER_ORDER_DETAILS: "seller_order_details_v2",
  SELLER_CUSTOMER_DETAILS: "seller_order_customer_details_v2",
  SELLER_MARK_READY: "seller_mark_ready_v1",
  SELLER_OUT_FOR_DELIVERY: "seller_out_for_delivery_v1",
  SELLER_ORDER_COMPLETED: "seller_order_completed_v1",
  SELLER_CSW_OPENER: "seller_csw_opener_v1",
  BUYER_ORDER_RECEIVED: "buyer_order_received_v1",
  BUYER_ORDER_READY: "buyer_order_ready_v1",
  BUYER_OUT_FOR_DELIVERY: "buyer_out_for_delivery_v1",
  BUYER_ORDER_DELIVERED: "buyer_order_delivered_v1",
  BUYER_ORDER_DECLINED: "buyer_order_declined_v1",
  BUYER_PAYMENT_ACTION: "buyer_payment_action_v2",
  BUYER_PREF_OPENER: "buyer_pref_opener_v1",
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

  sellerCswOpener(to: string): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_CSW_OPENER,
      languageCode: LANG,
      components: [],
    };
  },

  sellerOrderDetails(to: string, p: { orderId: string; itemsSummary: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_ORDER_DETAILS,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("order_id", p.orderId),
        namedParam("items_summary", p.itemsSummary),
      ])],
    };
  },

  sellerCustomerDetails(to: string, p: { orderId: string; customerDetails: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_CUSTOMER_DETAILS,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("order_id", p.orderId),
        namedParam("customer_details", p.customerDetails),
      ])],
    };
  },

  sellerMarkReady(to: string, p: { orderId: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_MARK_READY,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("order_id", p.orderId),
      ])],
    };
  },

  sellerOutForDelivery(to: string, p: { orderId: string; riderDetails: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_OUT_FOR_DELIVERY,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("order_id", p.orderId),
        namedParam("rider_details", p.riderDetails),
      ])],
    };
  },

  sellerOrderCompleted(to: string, p: { orderId: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.SELLER_ORDER_COMPLETED,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("order_id", p.orderId),
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

  buyerPaymentAction(to: string, p: { customerName: string; orderId: string; storeName: string; amount: string }): SendTemplateMessageInput {
    return {
      to,
      templateName: TEMPLATE_NAMES.BUYER_PAYMENT_ACTION,
      languageCode: LANG,
      components: [bodyComponent([
        namedParam("customer_name", p.customerName),
        namedParam("order_id", p.orderId),
        namedParam("store_name", p.storeName),
        namedParam("amount", p.amount),
      ])],
    };
  },
};
