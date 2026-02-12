import { Client } from "@upstash/qstash";
import { redis } from "@vendly/db";
import type { SendTemplateMessageInput } from "./whatsapp-client";

export type QueuePayload = {
  type: "text" | "template";
  to: string;
  body?: string | null;
  templateName?: string | null;
  languageCode?: string | null;
  components?: SendTemplateMessageInput["components"] | null;
  tenantId?: string | null;
  orderId?: string | null;
  dedupeKey?: string | null;
};

const DEDUPE_TTL_SECONDS = 60 * 60 * 24;

function getQstashClient(): Client | null {
  const token = process.env.QSTASH_TOKEN;
  if (!token) return null;
  const baseUrl = process.env.QSTASH_BASE_URL;
  return new Client({ token, baseUrl });
}

async function reserveDedupeKey(dedupeKey?: string | null) {
  if (!dedupeKey) return true;
  if (!redis) return true;

  const result = await redis.set(`qstash:dedupe:${dedupeKey}`, "1", {
    nx: true,
    ex: DEDUPE_TTL_SECONDS,
  });
  return result === "OK";
}

export async function enqueueTextMessage(params: {
  to: string;
  body: string;
  tenantId?: string | null;
  orderId?: string | null;
  dedupeKey?: string | null;
  scheduledAt?: Date;
}) {
  return publishMessage({
    type: "text",
    to: params.to,
    body: params.body,
    tenantId: params.tenantId ?? null,
    orderId: params.orderId ?? null,
    dedupeKey: params.dedupeKey ?? null,
  });
}

export async function enqueueTemplateMessage(params: {
  input: SendTemplateMessageInput;
  tenantId?: string | null;
  orderId?: string | null;
  dedupeKey?: string | null;
  scheduledAt?: Date;
}) {
  return publishMessage({
    type: "template",
    to: params.input.to,
    templateName: params.input.templateName,
    languageCode: params.input.languageCode,
    components: params.input.components ?? null,
    tenantId: params.tenantId ?? null,
    orderId: params.orderId ?? null,
    dedupeKey: params.dedupeKey ?? null,
  });
}

export async function enqueueInboundMessage(params: {
  from: string;
  to: string;
  messageBody: string;
  tenantId?: string | null;
  orderId?: string | null;
  dedupeKey?: string | null;
}) {
  const reserved = await reserveDedupeKey(params.dedupeKey);
  if (!reserved) return null;

  console.log("[WhatsAppInbound]", {
    from: params.from,
    to: params.to,
    tenantId: params.tenantId ?? null,
    orderId: params.orderId ?? null,
    messageBody: params.messageBody,
  });
  return { received: true };
}

export async function hasDedupeKey(dedupeKey: string): Promise<boolean> {
  if (!redis) return false;
  const existing = await redis.get<string>(`qstash:dedupe:${dedupeKey}`);
  return Boolean(existing);
}

async function publishMessage(payload: QueuePayload) {
  const reserved = await reserveDedupeKey(payload.dedupeKey);
  if (!reserved) return null;

  const client = getQstashClient();
  if (!client) {
    console.warn("[QStash] Missing QSTASH_TOKEN; message not published.");
    return null;
  }

  const url = process.env.QSTASH_DELIVERY_URL;
  if (!url) {
    console.warn("[QStash] Missing QSTASH_DELIVERY_URL; message not published.");
    return null;
  }

  await client.publishJSON({
    url,
    body: payload,
  });

  return { queued: true };
}
