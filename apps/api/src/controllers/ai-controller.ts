/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { aiService } from "../services/ai-service";
import { auth } from "@vendly/auth";
import { fromNodeHeaders } from "better-auth/node";
import { ChatDetail } from "v0-sdk";

function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const realIP = req.headers["x-real-ip"];

  if (forwarded) {
    return (forwarded as string).split(",")[0].trim();
  }

  if (realIP) {
    return realIP as string;
  }

  return "unknown";
}

async function getSession(req: Request) {
  return await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
}

export class AiController {
  async chat(req: Request, res: Response): Promise<void> {
    try {
      const session = await getSession(req);
      const { message, chatId, streaming, attachments } = req.body;
      const clientIP = getClientIP(req);

      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const chat = await aiService.sendMessage(
        message,
        chatId,
        streaming,
        attachments,
        session?.user?.id,
        clientIP
      );

      if (streaming) {
        // Handle streaming response
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        
        const stream = chat as ReadableStream<Uint8Array>;
        const reader = stream.getReader();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();
        // Note: Ownership creation for new streaming chats is tricky if SDK doesn't return ID first.
        // We rely on the client to poll or the service to handle it if possible.
        return;
      }

      const chatDetail = chat as ChatDetail;

      // Create ownership if it's a new chat
      if (!chatId && chatDetail.id) {
        await aiService.recordChatOwnership(chatDetail.id, session?.user?.id, clientIP);
      }

      res.json({
        id: chatDetail.id,
        demo: chatDetail.demo,
        messages: chatDetail.messages?.map((msg) => ({
          ...msg,
          experimental_content: (msg as any).experimental_content,
        })),
      });

    } catch (error) {
      console.error("Chat Error:", error);
      if ((error as Error).message === "RATE_LIMIT_EXCEEDED") {
          res.status(429).json({ 
            code: "rate_limit:chat",
            message: "You have exceeded your maximum number of messages for the day. Please try again later."
        });
        return;
      }
      res.status(500).json({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getChats(req: Request, res: Response): Promise<void> {
    try {
      const session = await getSession(req);

      if (!session?.user?.id) {
        res.json({ data: [] });
        return;
      }

      const chats = await aiService.getUserChats(session.user.id);
      res.json({ data: chats });
    } catch (error) {
      console.error("Chats fetch error:", error);
      res.status(500).json({
        error: "Failed to fetch chats",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getChatById(req: Request, res: Response): Promise<void> {
    try {
      const session = await getSession(req);
      const { chatId } = req.params;

      if (!chatId) {
        res.status(400).json({ error: "Chat ID is required" });
        return;
      }

      const chatDetails = await aiService.getChatDetails(chatId, session?.user?.id);
      res.json(chatDetails);
    } catch (error) {
      console.error("Error fetching chat details:", error);
      if ((error as Error).message === "NOT_FOUND") {
          res.status(404).json({ error: "Chat not found" });
          return;
      }
      if ((error as Error).message === "FORBIDDEN") {
          res.status(403).json({ error: "Forbidden" });
          return;
      }
      res.status(500).json({
        error: "Failed to fetch chat details",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async resumeChat(req: Request, res: Response): Promise<void> {
    try {
      // Ensure auth check if needed, though resume logic often depends on just ID validity
      // await getSession(req); 

      const { chatId, messageId } = req.body;

      if (!chatId || typeof chatId !== "string") {
        res.status(400).json({ error: "Chat ID is required" });
        return;
      }

      if (!messageId || typeof messageId !== "string") {
        res.status(400).json({ error: "Message ID is required" });
        return;
      }

      const resumed = await aiService.resumeChat(chatId, messageId);
      res.json(resumed);
    } catch (error) {
      console.error("Resume error:", error);
      res.status(500).json({
        error: "Failed to resume generation",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createOwnership(req: Request, res: Response): Promise<void> {
      try {
          const session = await getSession(req);
          const { chatId } = req.body;
          const clientIP = getClientIP(req);
  
          if (!chatId) {
              res.status(400).json({ error: "Chat ID is required" });
              return;
          }

          await aiService.recordChatOwnership(chatId, session?.user?.id, clientIP);
          res.json({ success: true });
      } catch (error) {
          console.error("Failed to create chat ownership/log:", error);
          res.status(500).json({ error: "Failed to create ownership record" });
      }
  }
}

export const aiController = new AiController();
