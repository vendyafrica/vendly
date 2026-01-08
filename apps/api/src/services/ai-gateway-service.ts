/**
 * AI Gateway Service
 * 
 * DISABLED: Using template-based approach instead of AI generation.
 * This file is kept for reference but all functionality is commented out.
 */

/*
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Initialize Vercel AI Gateway provider (OpenAI compatible)
const gateway = createOpenAI({
    baseURL: "https://ai-gateway.vercel.sh/v1",
    apiKey: process.env.AI_GATEWAY_API_KEY,
    headers: {
        "x-vercel-ai-provider": "google",
    },
});
*/

export interface StorefrontInput {
    storeName: string;
    storeSlug: string;
    category: string;
    theme?: {
        name: string;
        description: string;
        cssVariables: {
            background: string;
            foreground: string;
            primary: string;
            primaryForeground: string;
            secondary: string;
            secondaryForeground: string;
            muted: string;
            mutedForeground: string;
            accent: string;
            accentForeground: string;
            border: string;
            radius: string;
        };
    };
}

export interface GeneratedFile {
    name: string;
    content: string;
}

export interface GeneratedStorefront {
    files: GeneratedFile[];
    demoHtml: string;
}

/**
 * AIGatewayService - DISABLED
 * 
 * This service is disabled. Use template-based generation instead.
 */
export class AIGatewayService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async generateStorefront(_input: StorefrontInput): Promise<GeneratedStorefront> {
        console.log("[AIGateway] DISABLED - Use template-based generation instead");
        throw new Error("AI Gateway is disabled. Use template-based storefront generation.");
    }
}

export const aiGatewayService = new AIGatewayService();

