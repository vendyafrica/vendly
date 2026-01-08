/**
 * AI Service
 * 
 * DISABLED: Using template-based approach instead of AI/v0 SDK.
 * This file is kept for reference but all functionality is commented out.
 */

/*
import { createClient } from "v0-sdk";
import {
  createChatOwnership,
  createAnonymousChatLog,
  getChatCountByUserId,
  getChatCountByIP,
  getChatIdsByUserId,
  getChatOwnership,
} from "@vendly/db/v0-clone-queries";

// Initialize v0 client
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {}
);
*/

// Entitlements constants (kept for reference)
export const entitlementsByUserType = {
  guest: { maxMessagesPerDay: 5 },
  regular: { maxMessagesPerDay: 50 },
};

export const anonymousEntitlements = { maxMessagesPerDay: 3 };

/**
 * AiService - DISABLED
 * 
 * This service is disabled. Use template-based generation instead.
 */
export class AiService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async checkRateLimit(_userId: string | undefined, _ip: string): Promise<boolean> {
    console.log("[AiService] DISABLED - Use template-based generation instead");
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendMessage(
    _message: string,
    _chatId: string | undefined,
    _streaming: boolean,
    _attachments: unknown[],
    _userId: string | undefined,
    _ip: string
  ) {
    console.log("[AiService] DISABLED - Use template-based generation instead");
    throw new Error("AI Service is disabled. Use template-based storefront generation.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async recordChatOwnership(_chatId: string, _userId: string | undefined, _ip: string) {
    console.log("[AiService] DISABLED - Use template-based generation instead");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserChats(_userId: string) {
    console.log("[AiService] DISABLED - Use template-based generation instead");
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getChatDetails(_chatId: string, _userId: string | undefined) {
    console.log("[AiService] DISABLED - Use template-based generation instead");
    throw new Error("AI Service is disabled.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resumeChat(_chatId: string, _messageId: string) {
    console.log("[AiService] DISABLED - Use template-based generation instead");
    throw new Error("AI Service is disabled.");
  }
}

export const aiService = new AiService();
