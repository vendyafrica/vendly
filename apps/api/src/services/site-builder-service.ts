/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "v0-sdk";
import {
  createTenantIfNotExists,
  saveTenantStorefrontConfig,
  saveTenantDemoUrl,
  saveTenantGeneratedFiles,
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

function extractTextRecursively(obj: any, depth = 0): string[] {
  const results: string[] = [];
  if (depth > 10) return results; // Prevent infinite recursion
  
  if (typeof obj === "string") {
    results.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      results.push(...extractTextRecursively(item, depth + 1));
    }
  } else if (obj && typeof obj === "object") {
    // Check common text field names and numeric keys (for tuples)
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (["text", "content", "value", "message", "0", "1", "2"].includes(key)) {
        results.push(...extractTextRecursively(obj[key], depth + 1));
      }
    }
  }
  return results;
}

function extractAssistantText(chat: any): string {
  const messages = chat?.messages;
  console.log(`[SiteBuilder] extractAssistantText - messages count: ${Array.isArray(messages) ? messages.length : 'not array'}`);
  
  if (!Array.isArray(messages)) return "";

  const lastAssistant = [...messages].reverse().find((m) => m?.role === "assistant");
  console.log(`[SiteBuilder] extractAssistantText - found assistant message: ${!!lastAssistant}`);
  
  if (!lastAssistant) return "";
  
  // Check content field FIRST - it's usually a clean string with the JSON
  if (typeof lastAssistant.content === "string" && lastAssistant.content.trim()) {
    console.log(`[SiteBuilder] extractAssistantText - using content string (first 200 chars):`, lastAssistant.content.substring(0, 200));
    return lastAssistant.content;
  }
  
  // Fallback to experimental_content if content is not a string
  const expContent = lastAssistant?.experimental_content;
  if (expContent) {
    console.log(`[SiteBuilder] extractAssistantText - trying experimental_content`);
    if (typeof expContent === "string") return expContent;
    
    // Recursively extract all text from the content structure
    const textParts = extractTextRecursively(expContent);
    console.log(`[SiteBuilder] extractAssistantText - extracted ${textParts.length} text parts`);
    if (textParts.length > 0) {
      const result = textParts.filter(t => t && t.trim()).join("\n");
      console.log(`[SiteBuilder] extractAssistantText - combined text (first 500 chars):`, result.substring(0, 500));
      return result;
    }
  }

  return "";
}

function buildStorefrontPrompt(input: any): string {
  const storeName = input?.storeName ?? "My Store";
  const storeSlug = input?.storeSlug ?? "mystore";
  const category = input?.category ?? "General";
  const brandVibe = input?.brandVibe ?? "Modern";
  const colors = input?.colors ?? "";

  return [
    `Create a beautiful, modern ecommerce storefront landing page for "${storeName}".`,
    "",
    "IMPORTANT: This storefront MUST use real data from our API. Use the exact components specified below:",
    "",
    "For the products section, use this exact component:",
    `<ProductGrid storeSlug="${storeSlug}" />`,
    "Import it from '@/components/storefront/ProductGrid'",
    "",
    "For categories section, use:",
    `<CategoryGrid storeSlug="${storeSlug}" />`,
    "Import it from '@/components/storefront/CategoryGrid'",
    "",
    "These components will automatically fetch and display real products and categories from the store.",
    "",
    "Requirements:",
    "- Hero section with store name, tagline, and call-to-action button",
    "- Featured products section using the ProductGrid component",
    "- Categories section using the CategoryGrid component",
    "- Testimonials section",
    "- Newsletter signup section",
    "- Footer with navigation links",
    "",
    "Design specifications:",
    `- Store name: ${storeName}`,
    `- Category: ${category}`,
    `- Brand vibe/style: ${brandVibe}`,
    colors ? `- Color palette: ${colors}` : "- Use a modern, clean color palette",
    "- Mobile-first responsive design",
    "- Use Tailwind CSS for styling",
    "- Make it visually stunning and professional",
    "",
    "Generate a complete, functional React component for this storefront.",
  ].join("\n");
}

// Post-processor function for future use when fetching generated files from v0
// This will ensure proper component injection and store slug replacement
function injectStorefrontComponents(code: string, storeSlug: string): string {
  // Ensure imports are present
  if (!code.includes('import { ProductGrid }')) {
    code = `import { ProductGrid } from '@/components/storefront/ProductGrid';\n${code}`;
  }
  if (!code.includes('import { CategoryGrid }')) {
    code = `import { CategoryGrid } from '@/components/storefront/CategoryGrid';\n${code}`;
  }
  
  // Replace any placeholder product sections with ProductGrid
  code = code.replace(
    /<div[^>]*products[^>]*>[\s\S]*?<\/div>/gi,
    `<ProductGrid storeSlug="${storeSlug}" />`
  );
  
  // Replace any placeholder category sections with CategoryGrid
  code = code.replace(
    /<div[^>]*categories[^>]*>[\s\S]*?<\/div>/gi,
    `<CategoryGrid storeSlug="${storeSlug}" />`
  );
  
  return code;
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
      console.log(`[SiteBuilder] Job ${jobId} - Chat response keys:`, Object.keys(chat as any));

      // Extract demo URL from v0 response
      const chatData = chat as any;
      const v0ChatId = chatData?.id;
      
      // v0 provides multiple URL formats - try to get the demo/preview URL
      // The demo URL is typically at latestVersion.demoUrl or can be constructed from the chat URL
      let demoUrl = chatData?.latestVersion?.demoUrl 
        || chatData?.demo 
        || chatData?.webUrl
        || chatData?.url;
      
      console.log(`[SiteBuilder] Job ${jobId} - v0 Chat ID: ${v0ChatId}`);
      console.log(`[SiteBuilder] Job ${jobId} - Demo URL: ${demoUrl}`);
      console.log(`[SiteBuilder] Job ${jobId} - Full chat data:`, JSON.stringify(chatData, null, 2).substring(0, 1000));

      if (!demoUrl && v0ChatId) {
        // Construct the demo URL from chat ID if not directly available
        demoUrl = `https://v0.dev/chat/${v0ChatId}`;
        console.log(`[SiteBuilder] Job ${jobId} - Constructed demo URL: ${demoUrl}`);
      }

      if (demoUrl) {
        // Save the demo URL for iframe embedding
        console.log(`[SiteBuilder] Job ${jobId} - Saving demo URL...`);
        await saveTenantDemoUrl({ 
          slug: tenantSlug, 
          demoUrl, 
          v0ChatId 
        });
        
        // Also save the generated files if available
        const files = chatData?.latestVersion?.files;
        if (Array.isArray(files) && files.length > 0) {
          console.log(`[SiteBuilder] Job ${jobId} - Saving ${files.length} generated files...`);
          const formattedFiles = files.map((f: any) => ({
            name: f.name,
            content: f.content
          }));
          await saveTenantGeneratedFiles({
            slug: tenantSlug,
            generatedFiles: formattedFiles,
            v0ChatId
          });
          console.log(`[SiteBuilder] Job ${jobId} - Generated files saved`);
        }
        
        job.status = "ready";
        jobs.set(jobId, job);
        console.log(`[SiteBuilder] Job ${jobId} - COMPLETED SUCCESSFULLY with demo URL`);
      } else {
        // Fallback: try to extract JSON config from the response (legacy approach)
        console.log(`[SiteBuilder] Job ${jobId} - No demo URL found, falling back to JSON config extraction...`);
        
        const assistantText = extractAssistantText(chatData);
        if (assistantText) {
          console.log(`[SiteBuilder] Job ${jobId} - Extracted assistant text:`, assistantText.substring(0, 300) + '...');
          
          try {
            const configJson = safeJsonParse(assistantText);
            console.log(`[SiteBuilder] Job ${jobId} - Parsed config, saving...`);
            await saveTenantStorefrontConfig({ slug: tenantSlug, storefrontConfig: configJson });
            
            job.status = "ready";
            jobs.set(jobId, job);
            console.log(`[SiteBuilder] Job ${jobId} - COMPLETED SUCCESSFULLY with JSON config`);
          } catch {
            // If JSON parsing fails, still save the raw response as config
            console.log(`[SiteBuilder] Job ${jobId} - JSON parse failed, saving raw response...`);
            await saveTenantStorefrontConfig({ 
              slug: tenantSlug, 
              storefrontConfig: { rawResponse: assistantText, v0ChatId } 
            });
            
            job.status = "ready";
            jobs.set(jobId, job);
            console.log(`[SiteBuilder] Job ${jobId} - COMPLETED with raw response saved`);
          }
        } else {
          throw new Error("No demo URL or content found in v0 response");
        }
      }
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
