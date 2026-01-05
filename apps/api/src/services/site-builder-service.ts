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
  if (!Array.isArray(messages)) return "";

  const lastAssistant = [...messages].reverse().find((m) => m?.role === "assistant");
  const content = lastAssistant?.experimental_content ?? lastAssistant?.content;

  if (typeof content === "string") return content;

  // v0 can return structured content arrays; try to find text blocks.
  if (Array.isArray(content)) {
    const textParts: string[] = [];
    for (const part of content) {
      if (typeof part === "string") textParts.push(part);
      if (part && typeof part === "object") {
        if (typeof (part as any).text === "string") textParts.push((part as any).text);
        if (typeof (part as any).content === "string") textParts.push((part as any).content);
      }
    }
    return textParts.join("\n");
  }

  if (content && typeof content === "object") {
    if (typeof (content as any).text === "string") return (content as any).text;
  }

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
      job.status = "running";
      jobs.set(jobId, job);

      await createTenantIfNotExists(tenantSlug);
      await setTenantStatus({ slug: tenantSlug, status: "generating" });

      const prompt = buildStorefrontPrompt(input);

      const chat = await v0.chats.create({
        message: prompt,
        responseMode: "sync",
      } as any);

      const assistantText = extractAssistantText(chat as any);
      const configJson = safeJsonParse(assistantText);

      await saveTenantStorefrontConfig({ slug: tenantSlug, storefrontConfig: configJson });

      job.status = "ready";
      jobs.set(jobId, job);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      try {
        await setTenantStatus({ slug: tenantSlug, status: "failed", error: message });
      } catch {
        // ignore
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
