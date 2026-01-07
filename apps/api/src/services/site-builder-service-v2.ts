import {
  createTenantIfNotExists,
  saveTenantDemoUrl,
  saveTenantGeneratedFiles,
  setTenantStatus,
} from "@vendly/db/tenant-queries";
import {
  createStore,
  getStoreBySlug,
  upsertStoreTheme
} from "@vendly/db/storefront-queries";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type JobStatus = "queued" | "running" | "failed" | "ready";

type SiteBuilderJob = {
  id: string;
  tenantSlug: string;
  status: JobStatus;
  error?: string;
};

// const v0 = createClient(
//   process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {}
// );

const jobs = new Map<string, SiteBuilderJob>();

// Read the locked storefront components
function getBaseFiles() {
  // Go up from apps/api to monorepo root
  const monorepoRoot = path.join(__dirname, "../../../../");
  const baseDir = path.join(
    monorepoRoot,
    "apps/web/src/components/storefront/base-files"
  );
  const storefrontDir = path.join(
    monorepoRoot,
    "apps/web/src/components/storefront"
  );

  return {
    "app/page.tsx": fs.readFileSync(path.join(baseDir, "page.tsx"), "utf-8"),
    "app/layout.tsx": fs.readFileSync(
      path.join(baseDir, "layout.tsx"),
      "utf-8"
    ),
    "app/globals.css": fs.readFileSync(
      path.join(baseDir, "globals.css"),
      "utf-8"
    ),
    "components/storefront/index.ts": fs.readFileSync(
      path.join(storefrontDir, "index.ts"),
      "utf-8"
    ),
    "components/storefront/Header.tsx": fs.readFileSync(
      path.join(storefrontDir, "Header.tsx"),
      "utf-8"
    ),
    "components/storefront/HeroSection.tsx": fs.readFileSync(
      path.join(storefrontDir, "HeroSection.tsx"),
      "utf-8"
    ),
    "components/storefront/CategoryTabs.tsx": fs.readFileSync(
      path.join(storefrontDir, "CategoryTabs.tsx"),
      "utf-8"
    ),
    "components/storefront/ProductGrid.tsx": fs.readFileSync(
      path.join(storefrontDir, "ProductGrid.tsx"),
      "utf-8"
    ),
    "components/storefront/ProductCard.tsx": fs.readFileSync(
      path.join(storefrontDir, "ProductCard.tsx"),
      "utf-8"
    ),
    "components/storefront/CartProvider.tsx": fs.readFileSync(
      path.join(storefrontDir, "CartProvider.tsx"),
      "utf-8"
    ),
    "components/storefront/CartDrawer.tsx": fs.readFileSync(
      path.join(storefrontDir, "CartDrawer.tsx"),
      "utf-8"
    ),
    "components/storefront/StoreLayout.tsx": fs.readFileSync(
      path.join(storefrontDir, "StoreLayout.tsx"),
      "utf-8"
    ),
    "package.json": fs.readFileSync(
      path.join(baseDir, "package.json"),
      "utf-8"
    ),
    "tailwind.config.ts": fs.readFileSync(
      path.join(monorepoRoot, "apps/web/tailwind.config.ts"),
      "utf-8"
    ),
    "tsconfig.json": JSON.stringify({
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": ["./*"]
        }
      }
    }, null, 2),
  };
}

import { getThemeById } from "../lib/theme-presets";

function buildStorefrontPrompt(input: any): string {
  const storeName = input?.storeName ?? "My Store";
  const storeSlug = input?.storeSlug ?? "mystore";
  const category = input?.category ?? "General";

  let theme = input?.theme;
  if (!theme && input?.themeId) {
    theme = getThemeById(input.themeId);
  }

  // Build theme description for AI
  let themeInstructions = "";
  if (theme?.cssVariables) {
    const vars = theme.cssVariables;
    themeInstructions = [
      "",
      `THEME: "${theme.name}" - ${theme.description}`,
      "",
      "APPLY THESE EXACT COLORS:",
      `- Background: ${vars.background}`,
      `- Text/Foreground: ${vars.foreground}`,
      `- Primary buttons/links: ${vars.primary} (text: ${vars.primaryForeground})`,
      `- Secondary elements: ${vars.secondary} (text: ${vars.secondaryForeground})`,
      `- Muted/subtle: ${vars.muted} (text: ${vars.mutedForeground})`,
      `- Accent highlights: ${vars.accent} (text: ${vars.accentForeground})`,
      `- Borders: ${vars.border}`,
      `- Border radius: ${vars.radius}`,
      "",
    ].join("\n");
  }

  return [
    `Create a beautiful, clean storefront for "${storeName}" (${category} category).`,
    "",
    "IMPORTANT DESIGN RULES:",
    "- NO gradients whatsoever - use solid colors only",
    "- Clean, minimal design with generous whitespace",
    "- Professional, uncluttered appearance",
    themeInstructions,
    "AVAILABLE COMPONENTS (already imported, DO NOT modify their internals):",
    "- <Header /> - Store navigation with cart",
    "- <HeroSection /> - Dynamic hero with store data",
    "- <CategoryTabs /> - Category navigation",
    "- <ProductGrid /> - 4-column product grid",
    "",
    "YOU CAN:",
    "- Adjust spacing, padding, margins between components",
    "- Add promotional banners or testimonials",
    "- Modify typography (font sizes, weights)",
    "- Ensure perfect mobile responsiveness",
    "- Add non-functional decorative elements",
    "",
    "YOU CANNOT:",
    "- Remove or modify data fetching",
    "- Use gradient classes",
    "- Hardcode product data",
    "- Break the cart functionality",
    "",
    "Store details:",
    `- Name: ${storeName}`,
    `- Slug: ${storeSlug}`,
    `- Category: ${category}`,
    "",
    "Create a stunning, professional storefront that showcases real products from the API.",
  ].join("\n");
}

export class SiteBuilderServiceV2 {
  startJob({
    tenantSlug,
    input,
  }: {
    tenantSlug: string;
    input: any;
  }): SiteBuilderJob {
    const jobId = crypto.randomUUID();
    console.log(
      `[SiteBuilderV2] Starting job ${jobId} for tenant: ${tenantSlug}`
    );
    console.log(`[SiteBuilderV2] Input:`, JSON.stringify(input, null, 2));

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
      console.log(`[SiteBuilderV2] Job ${jobId} - Status: running`);
      job.status = "running";
      jobs.set(jobId, job);

      console.log(
        `[SiteBuilderV2] Job ${jobId} - Creating tenant if not exists...`
      );
      const tenant = await createTenantIfNotExists(tenantSlug);

      console.log(
        `[SiteBuilderV2] Job ${jobId} - Setting tenant status to generating...`
      );
      await setTenantStatus({ slug: tenantSlug, status: "generating" });

      // Create or get store record for the tenant
      console.log(`[SiteBuilderV2] Job ${jobId} - Checking/Creating store record...`);
      let store = await getStoreBySlug(tenantSlug);

      if (!store) {
        store = await createStore({
          tenantId: tenant.id, // Use actual tenant UUID
          name: input?.storeName || tenantSlug,
          slug: tenantSlug,
          description: `Store for ${input?.category || 'General'} category`,
        });
        console.log(`[SiteBuilderV2] Job ${jobId} - Created store with ID: ${store.id}`);
      } else {
        console.log(`[SiteBuilderV2] Job ${jobId} - Found existing store with ID: ${store.id}`);
      }

      // Save the selected theme if provided
      const themeId = input?.themeId;
      if (themeId) {
        const selectedTheme = getThemeById(themeId);
        if (selectedTheme) {
          console.log(`[SiteBuilderV2] Job ${jobId} - Saving theme: ${selectedTheme.name}`);
          const vars = selectedTheme.cssVariables;
          await upsertStoreTheme({
            storeId: store.id,
            // Map CSS variables to DB columns where possible, or extend DB schema later
            // For now we will map the primary colors which likely exist in schema
            primaryColor: vars.primary,
            secondaryColor: vars.secondary,
            accentColor: vars.accent,
            backgroundColor: vars.background,
            textColor: vars.foreground,
            // Font defaults based on theme vibes could go here
            headingFont: "Inter",
            bodyFont: "Inter",
          });
        }
      }

      // Set tenant status to ready (using default template, no v0 generation needed)
      console.log(`[SiteBuilderV2] Job ${jobId} - Setting tenant status to ready...`);
      await setTenantStatus({ slug: tenantSlug, status: "ready" });

      // 1. Create v0 project with environment variables
      // console.log(`[SiteBuilderV2] Job ${jobId} - Creating v0 project...`);
      // const project = await v0.projects.create({
      //   name: `${tenantSlug}-storefront`,
      //   description: `Ecommerce storefront for ${input.storeName}`,
      //   environmentVariables: [
      //     {
      //       key: "NEXT_PUBLIC_STORE_SLUG",
      //       value: tenantSlug,
      //     },
      //     {
      //       key: "NEXT_PUBLIC_STORE_NAME",
      //       value: input.storeName || tenantSlug,
      //     },
      //     {
      //       key: "NEXT_PUBLIC_API_URL",
      //       value:
      //         process.env.NEXT_PUBLIC_API_URL ||
      //         "https://api.vendlyafrica.store",
      //     },
      //   ],
      // });
      // console.log(
      //   `[SiteBuilderV2] Job ${jobId} - Created project: ${project.id}`
      // );

      // 2. Initialize chat with locked components
      // console.log(
      //   `[SiteBuilderV2] Job ${jobId} - Initializing chat with locked components...`
      // );
      // const baseFiles = getBaseFiles();
      // const chat = await v0.chats.init({
      //   type: "files",
      //   projectId: project.id,
      //   files: Object.entries(baseFiles).map(([name, content]) => ({
      //     name,
      //     content,
      //     locked: name.includes("components/storefront"), // Lock our components
      //   })),
      //   name: `${input.storeName} Storefront`,
      // });
      // console.log(
      //   `[SiteBuilderV2] Job ${jobId} - Initialized chat: ${chat.id}`
      // );

      // 3. Generate the storefront design
      // console.log(
      //   `[SiteBuilderV2] Job ${jobId} - Generating storefront design...`
      // );
      // const prompt = buildStorefrontPrompt(input);
      // const result = await v0.chats.sendMessage({
      //   chatId: chat.id,
      //   message: prompt,
      // });
      // console.log(`[SiteBuilderV2] Job ${jobId} - Design generated`);

      // 4. Save the demo URL (skipped - using default template)
      // const chatData = result as any;
      // const demoUrl =
      //   chatData?.latestVersion?.demoUrl ||
      //   `https://v0.dev/chat/${chatData.id}`;

      // console.log(`[SiteBuilderV2] Job ${jobId} - Saving demo URL: ${demoUrl}`);
      // await saveTenantDemoUrl({
      //   slug: tenantSlug,
      //   demoUrl,
      //   v0ChatId: chatData.id,
      // });

      // 5. Save generated files (skipped - using default template)
      // const files = chatData?.latestVersion?.files;
      // if (Array.isArray(files) && files.length > 0) {
      //   console.log(
      //     `[SiteBuilderV2] Job ${jobId} - Saving ${files.length} generated files...`
      //   );
      //   const formattedFiles = files.map((f: any) => ({
      //     name: f.name,
      //     content: f.content,
      //   }));
      //   await saveTenantGeneratedFiles({
      //     slug: tenantSlug,
      //     generatedFiles: formattedFiles,
      //     v0ChatId: chatData.id,
      //   });
      //   console.log(`[SiteBuilderV2] Job ${jobId} - Generated files saved`);
      // }

      job.status = "ready";
      jobs.set(jobId, job);
      console.log(`[SiteBuilderV2] Job ${jobId} - COMPLETED SUCCESSFULLY`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[SiteBuilderV2] Job ${jobId} - FAILED:`, message);
      console.error(`[SiteBuilderV2] Job ${jobId} - Full error:`, err);

      try {
        await setTenantStatus({
          slug: tenantSlug,
          status: "failed",
          error: message,
        });
      } catch (statusErr) {
        console.error(
          `[SiteBuilderV2] Job ${jobId} - Failed to set tenant status:`,
          statusErr
        );
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

export const siteBuilderServiceV2 = new SiteBuilderServiceV2();
