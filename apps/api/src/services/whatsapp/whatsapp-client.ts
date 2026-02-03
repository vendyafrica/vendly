type WhatsAppTemplateComponent = {
  type: "header" | "body" | "button";
  parameters: Array<Record<string, unknown>>;
};

export type SendTemplateMessageInput = {
  to: string;
  templateName: string;
  languageCode: string;
  components?: WhatsAppTemplateComponent[];
};

export type CreateTemplateInput = {
  name: string;
  language: string;
  category: "marketing" | "utility" | "authentication";
  parameter_format?: "named" | "positional";
  components: Array<Record<string, unknown>>;
};

function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const whatsappClient = {
  isConfigured(): boolean {
    const hasAccessToken = Boolean(process.env.WHATSAPP_ACCESS_TOKEN?.trim());
    const hasPhoneNumberId = Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID?.trim());
    return hasAccessToken && hasPhoneNumberId;
  },

  async sendTextMessage(input: { to: string; body: string }) {
    const accessToken = getRequiredEnv("WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = getRequiredEnv("WHATSAPP_PHONE_NUMBER_ID");
    const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v23.0";

    const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: input.to,
        type: "text",
        text: { body: input.body },
      }),
    });

    const json = (await res.json().catch(() => ({}))) as unknown;

    if (!res.ok) {
      throw new Error(`WhatsApp text send failed: ${res.status} ${JSON.stringify(json)}`);
    }

    return json;
  },

  async sendTemplateMessage(input: SendTemplateMessageInput) {
    const accessToken = getRequiredEnv("WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = getRequiredEnv("WHATSAPP_PHONE_NUMBER_ID");
    const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v23.0";

    const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: input.to,
        type: "template",
        template: {
          name: input.templateName,
          language: { code: input.languageCode },
          ...(input.components ? { components: input.components } : {}),
        },
      }),
    });

    const json = (await res.json().catch(() => ({}))) as unknown;

    if (!res.ok) {
      throw new Error(`WhatsApp send failed: ${res.status} ${JSON.stringify(json)}`);
    }

    return json;
  },

  async createTemplate(input: CreateTemplateInput) {
    const accessToken = getRequiredEnv("WHATSAPP_ACCESS_TOKEN");
    const wabaId = getRequiredEnv("WHATSAPP_BUSINESS_ACCOUNT_ID");
    const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v23.0";

    const url = `https://graph.facebook.com/${graphVersion}/${wabaId}/message_templates`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        language: input.language,
        category: input.category,
        ...(input.parameter_format ? { parameter_format: input.parameter_format } : {}),
        components: input.components,
      }),
    });

    const json = (await res.json().catch(() => ({}))) as unknown;

    if (!res.ok) {
      throw new Error(`WhatsApp template create failed: ${res.status} ${JSON.stringify(json)}`);
    }

    return json;
  },
};
