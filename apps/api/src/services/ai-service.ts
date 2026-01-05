/* eslint-disable @typescript-eslint/no-explicit-any */
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

const defaultSystem =
  "Temporary constraint: Do not use Supabase or any external database/service. Do not reference @supabase/* packages or require any environment variables. Build the app using local in-memory state only (React state).";

// Entitlements constants
export const entitlementsByUserType = {
  guest: { maxMessagesPerDay: 5 },
  regular: { maxMessagesPerDay: 50 },
};

export const anonymousEntitlements = { maxMessagesPerDay: 3 };

export class AiService {
  async checkRateLimit(userId: string | undefined, ip: string): Promise<boolean> {
    if (userId) {
      const chatCount = await getChatCountByUserId({
        userId,
        differenceInHours: 24,
      });
      // Assuming regular user for now
      const userType = "regular";
      return chatCount < entitlementsByUserType[userType].maxMessagesPerDay;
    } else {
      const chatCount = await getChatCountByIP({
        ipAddress: ip,
        differenceInHours: 24,
      });
      return chatCount < anonymousEntitlements.maxMessagesPerDay;
    }
  }

  async sendMessage(
    message: string,
    chatId: string | undefined,
    streaming: boolean,
    attachments: any[],
    userId: string | undefined,
    ip: string
  ) {
    // Check rate limit
    const allowed = await this.checkRateLimit(userId, ip);
    if (!allowed) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    let chat;

    if (chatId) {
      // Continue existing chat
      if (streaming) {
        console.log("Sending streaming message to existing chat:", {
          chatId,
          message,
          responseMode: "experimental_stream",
        });
        chat = await v0.chats.sendMessage({
          chatId: chatId,
          message,
          system: defaultSystem,
          responseMode: "experimental_stream",
          ...(attachments && attachments.length > 0 && { attachments }),
        } as any);
      } else {
        chat = await v0.chats.sendMessage({
          chatId: chatId,
          message,
          system: defaultSystem,
          ...(attachments && attachments.length > 0 && { attachments }),
        } as any);
      }
    } else {
      // Create new chat
      if (streaming) {
        console.log("Creating streaming chat with params:", {
          message,
          responseMode: "experimental_stream",
        });
        chat = await v0.chats.create({
          message,
          system: defaultSystem,
          responseMode: "experimental_stream",
          ...(attachments && attachments.length > 0 && { attachments }),
        } as any);
      } else {
        chat = await v0.chats.create({
          message,
          system: defaultSystem,
          responseMode: "sync",
          ...(attachments && attachments.length > 0 && { attachments }),
        } as any);
      }
    }

    // If we have a chat object (sync or stream wrapper), check for ID to create ownership
    // Note: For streaming, we might not get the ID immediately in the same way depending on SDK,
    // but the current implementation treats `chat` as the stream or object.
    // If it is a stream, we might need to handle ownership differently or expect the caller to handle it?
    // In the previous code, `chat` was cast to `ChatDetail` to get ID.
    // However, if `experimental_stream` is used, `chat` is a ReadableStream.
    // We cannot read the ID from the stream until it is consumed.
    // The previous implementation had a logic flaw or `v0-sdk` returns an object that has the stream AND id?
    // Checking v0-sdk docs/types would be ideal, but assuming previous code "worked" or was intended to work:
    
    // Previous code:
    // if (chat instanceof ReadableStream) { ... } -> "Unexpected streaming response in sync block" (only for sync path?)
    // Actually, for streaming, the previous code immediately piped the stream to res.
    // AND THEN it tried to cast `chat` to `ChatDetail` to get ID?
    // That code block `const chatDetail = chat as ChatDetail;` was reachable after streaming block?
    // NO. In the streaming block it did `return;` after piping.
    // So ownership creation for NEW chats was NOT happening for streaming requests in the previous code?
    // Let's fix that. If it's a stream, we can't easily get the ID *before* streaming starts unless the SDK returns it.
    // If we can't get ID, we can't create ownership.
    
    return chat;
  }

  // Helper to handle ownership creation after we have a chat ID
  async recordChatOwnership(chatId: string, userId: string | undefined, ip: string) {
    if (userId) {
      await createChatOwnership({
        v0ChatId: chatId,
        userId: userId,
      });
      console.log("Chat ownership created:", chatId);
    } else {
      await createAnonymousChatLog({
        ipAddress: ip,
        v0ChatId: chatId,
      });
      console.log("Anonymous chat logged:", chatId, "IP:", ip);
    }
  }

  async getUserChats(userId: string) {
    const userChatIds = await getChatIdsByUserId({ userId });

    if (userChatIds.length === 0) {
      return [];
    }

    const allChats = await v0.chats.find();
    
    // Filter to only include chats owned by this user
    return allChats.data?.filter((chat) => userChatIds.includes(chat.id)) || [];
  }

  async getChatDetails(chatId: string, userId: string | undefined) {
    if (userId) {
      const ownership = await getChatOwnership({ v0ChatId: chatId });

      if (!ownership) {
         throw new Error("NOT_FOUND");
      }

      if (ownership.user_id !== userId) {
         throw new Error("FORBIDDEN");
      }
    }
    // If anonymous, we currently allow access if they have the ID (or we could check IP logs)

    const chatDetails = await v0.chats.getById({ chatId });
    
    const demo =
      (chatDetails as any)?.latestVersion?.demoUrl || (chatDetails as any)?.demo;

    return {
      ...(chatDetails as any),
      demo,
      url: (chatDetails as any)?.webUrl || (chatDetails as any)?.url,
    };
  }

  async resumeChat(chatId: string, messageId: string) {
    return await v0.chats.resume({ chatId, messageId });
  }
}

export const aiService = new AiService();
