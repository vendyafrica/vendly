/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "v0-sdk";
import {
  createTenantIfNotExists,
  saveTenantStorefrontConfig,
  setTenantStatus,
} from "@vendly/db/tenant-queries";

type JobStatus = "queued" | "running" | "failed" | "ready";

type SiteBuilderJob = {
  id: string;
  tenantSlug: string;
  status: JobStatus;
  error?: string;
};

const v0 = createClient(process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {});

const jobs = new Map<string, SiteBuilderJob>();

function safeJsonParse(input: string): unknown {
  const firstBrace = input.indexOf("{");
  const lastBrace = input.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const sliced = input.slice(firstBrace, lastBrace + 1);
    return JSON.parse(sliced);
  }
  return JSON.parse(input);
}

function extractAssistantText(chat: any): string {
  const messages = chat?.messages;
  console.log(`[SiteBuilder] extractAssistantText - messages count: ${Array.isArray(messages) ? messages.length : 'not array'}`);
  
  if (!Array.isArray(messages)) return "";

  const lastAssistant = [...messages].reverse().find((m) => m?.role === "assistant");
  console.log(`[SiteBuilder] extractAssistantText - found assistant message: ${!!lastAssistant}`);
  
  if (!lastAssistant) return "";
  
  // Log the full assistant message structure to understand the format
  console.log(`[SiteBuilder] extractAssistantText - assistant message keys:`, Object.keys(lastAssistant));
  
  // Try different possible content locations
  const content = lastAssistant?.experimental_content 
    ?? lastAssistant?.content 
    ?? lastAssistant?.text
    ?? lastAssistant?.message;

  console.log(`[SiteBuilder] extractAssistantText - content type: ${typeof content}`);

  if (typeof content === "string") return content;

  // v0 can return structured content arrays; try to find text blocks.
  if (Array.isArray(content)) {
    console.log(`[SiteBuilder] extractAssistantText - content is array with ${content.length} items`);
    const textParts: string[] = [];
    for (const part of content) {
      if (typeof part === "string") textParts.push(part);
      if (part && typeof part === "object") {
        // Log the structure of each part
        console.log(`[SiteBuilder] extractAssistantText - part keys:`, Object.keys(part));
        if (typeof (part as any).text === "string") textParts.push((part as any).text);
        if (typeof (part as any).content === "string") textParts.push((part as any).content);
        if (typeof (part as any).value === "string") textParts.push((part as any).value);
      }
    }
    return textParts.join("\n");
  }

  if (content && typeof content === "object") {
    console.log(`[SiteBuilder] extractAssistantText - content is object with keys:`, Object.keys(content));
    if (typeof (content as any).text === "string") return (content as any).text;
    if (typeof (content as any).value === "string") return (content as any).value;
  }

  // Last resort: stringify the whole assistant message to see what we have
  console.log(`[SiteBuilder] extractAssistantText - full assistant message:`, JSON.stringify(lastAssistant, null, 2).substring(0, 1000));

  return "";
}

function buildStorefrontPrompt(input: any): string {
  const storeName = input?.storeName ?? "";
  const category = input?.category ?? "";
  const brandVibe = input?.brandVibe ?? "";
  const colors = input?.colors ?? "";

  return [
    "You are generating a JSON configuration for an ecommerce storefront.",
    "Return ONLY valid JSON. No markdown. No backticks.",
    "The JSON must include:",
    "- theme: { primaryColor, accentColor, backgroundColor, textColor, font, radius }",
    "- homepage: { sections: Array<{ type, variant, props }> }",
    "Allowed section types: hero, categoryGrid, featuredProducts, testimonials, newsletter, footer.",
    "Variants should be short strings like A, B, C.",
    "Keep it mobile-first and modern.",
    "",
    `Store name: ${storeName}`,
    `Category: ${category}`,
    `Brand vibe: ${brandVibe}`,
    `Preferred colors (optional): ${colors}`,
  ].join("\n");
}

export class SiteBuilderService {
  startJob({ tenantSlug, input }: { tenantSlug: string; input: any }): SiteBuilderJob {
    const jobId = crypto.randomUUID();
    console.log(`[SiteBuilder] Starting job ${jobId} for tenant: ${tenantSlug}`);
    console.log(`[SiteBuilder] Input:`, JSON.stringify(input, null, 2));

    const job: SiteBuilderJob = {
      id: jobId,
      tenantSlug,
      status: "queued",
    };

    jobs.set(jobId, job);

    void this.runJob({ jobId, tenantSlug, input });

    return job;
  }

  getJob(jobId: string): SiteBuilderJob | undefined {
    return jobs.get(jobId);
  }

  private async runJob({
    jobId,
    tenantSlug,
    input,
  }: {
    jobId: string;
    tenantSlug: string;
    input: any;
  }): Promise<void> {
    const job = jobs.get(jobId);
    if (!job) return;

    try {
      console.log(`[SiteBuilder] Job ${jobId} - Status: running`);
      job.status = "running";
      jobs.set(jobId, job);

      console.log(`[SiteBuilder] Job ${jobId} - Creating tenant if not exists...`);
      await createTenantIfNotExists(tenantSlug);
      
      console.log(`[SiteBuilder] Job ${jobId} - Setting tenant status to generating...`);
      await setTenantStatus({ slug: tenantSlug, status: "generating" });

      const prompt = buildStorefrontPrompt(input);
      console.log(`[SiteBuilder] Job ${jobId} - Built prompt:`, prompt.substring(0, 200) + '...');

      console.log(`[SiteBuilder] Job ${jobId} - Calling v0 API...`);
      console.log(`[SiteBuilder] V0_API_KEY present: ${!!process.env.V0_API_KEY}`);
      
      const chat = await v0.chats.create({
        message: prompt,
        responseMode: "sync",
      } as any);
      console.log(`[SiteBuilder] Job ${jobId} - v0 API response received`);
      console.log(`[SiteBuilder] Job ${jobId} - Chat response:`, JSON.stringify(chat, null, 2).substring(0, 500));

      const assistantText = extractAssistantText(chat as any);
      console.log(`[SiteBuilder] Job ${jobId} - Extracted assistant text:`, assistantText.substring(0, 300) + '...');
      
      console.log(`[SiteBuilder] Job ${jobId} - Parsing JSON...`);
      const configJson = safeJsonParse(assistantText);
      console.log(`[SiteBuilder] Job ${jobId} - Parsed config:`, JSON.stringify(configJson, null, 2).substring(0, 300));

      console.log(`[SiteBuilder] Job ${jobId} - Saving storefront config...`);
      await saveTenantStorefrontConfig({ slug: tenantSlug, storefrontConfig: configJson });

      job.status = "ready";
      jobs.set(jobId, job);
      console.log(`[SiteBuilder] Job ${jobId} - COMPLETED SUCCESSFULLY`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[SiteBuilder] Job ${jobId} - FAILED:`, message);
      console.error(`[SiteBuilder] Job ${jobId} - Full error:`, err);

      try {
        await setTenantStatus({ slug: tenantSlug, status: "failed", error: message });
      } catch (statusErr) {
        console.error(`[SiteBuilder] Job ${jobId} - Failed to set tenant status:`, statusErr);
      }

      const jobToUpdate = jobs.get(jobId);
      if (jobToUpdate) {
        jobToUpdate.status = "failed";
        jobToUpdate.error = message;
        jobs.set(jobId, jobToUpdate);
      }
    }
  }
}

export const siteBuilderService = new SiteBuilderService();
