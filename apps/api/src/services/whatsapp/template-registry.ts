import type { CreateTemplateInput } from "./whatsapp-client";

export const templateRegistry = {
  sellerNewPaidOrder(): CreateTemplateInput {
    return {
      name: "seller_new_paid_order",
      language: "en_US",
      category: "utility",
      parameter_format: "named",
      components: [
        {
          type: "body",
          text:
            "New paid order: #{{order_number}}\nBuyer: {{buyer_name}}\nTotal: {{currency}} {{total}}\n\nTap to accept or decline.",
          example: {
            body_text_named_params: [
              { param_name: "order_number", example: "ORD-0001" },
              { param_name: "buyer_name", example: "Jane Doe" },
              { param_name: "currency", example: "KES" },
              { param_name: "total", example: "1500" },
            ],
          },
        },
        {
          type: "buttons",
          buttons: [
            { type: "quick_reply", text: "Accept" },
            { type: "quick_reply", text: "Decline" },
          ],
        },
      ],
    };
  },

  orderReadyUpdate(): CreateTemplateInput {
    return {
      name: "order_ready_update",
      language: "en_US",
      category: "utility",
      parameter_format: "named",
      components: [
        {
          type: "body",
          text: "Order #{{order_number}} is currently processing. Is it ready for pickup?",
          example: {
            body_text_named_params: [{ param_name: "order_number", example: "ORD-0001" }],
          },
        },
        {
          type: "buttons",
          buttons: [{ type: "quick_reply", text: "Order Ready" }],
        },
      ],
    };
  },
};
