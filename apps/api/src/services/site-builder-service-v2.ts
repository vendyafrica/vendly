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
// v0-sdk integration commented out - migrating to AI Gateway
// import { createClient } from "v0-sdk";
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

// v0 client initialization commented out - migrating to AI Gateway
// const v0 = createClient({
//   apiKey: process.env.V0_API_KEY,
// });

const jobs = new Map<string, SiteBuilderJob>();

// Read the locked storefront components
function getBaseFiles() {
  // Find monorepo root - try multiple approaches
  let monorepoRoot: string;

  // When running from apps/api with tsx watch, __dirname is the source dir
  // Go up: services -> src -> api -> apps -> root
  const fromDirname = path.resolve(__dirname, "../../../../");

  // When running from apps/api (cwd is apps/api)
  const fromCwd = path.resolve(process.cwd(), "../../");

  // Check which path has the apps/web directory
  if (fs.existsSync(path.join(fromDirname, "apps/web"))) {
    monorepoRoot = fromDirname;
  } else if (fs.existsSync(path.join(fromCwd, "apps/web"))) {
    monorepoRoot = fromCwd;
  } else {
    // Fallback: try to find it by walking up from cwd
    let current = process.cwd();
    while (current !== path.dirname(current)) {
      if (fs.existsSync(path.join(current, "apps/web"))) {
        monorepoRoot = current;
        break;
      }
      current = path.dirname(current);
    }
    if (!monorepoRoot!) {
      throw new Error(`Could not find monorepo root. __dirname: ${__dirname}, cwd: ${process.cwd()}`);
    }
  }

  console.log(`[SiteBuilderV2] Monorepo root: ${monorepoRoot}`);

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
    "tailwind.config.ts": `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card, var(--background)))",
          foreground: "hsl(var(--card-foreground, var(--foreground)))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, var(--background)))",
          foreground: "hsl(var(--popover-foreground, var(--foreground)))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
`,
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
    "AVAILABLE COMPONENTS (already imported and LOCKED - DO NOT modify their internals):",
    "- <Header /> - Store navigation with cart",
    "- <HeroSection /> - Dynamic hero with store data",
    "- <CategoryTabs /> - Category navigation",
    "- <ProductGrid /> - 4-column product grid",
    "",
    "YOU CAN:",
    "- Customize the layout and arrangement of components in app/page.tsx",
    "- Adjust spacing, padding, margins between components",
    "- Add promotional banners, testimonials, or decorative sections",
    "- Modify typography (font sizes, weights) in globals.css",
    "- Ensure perfect mobile responsiveness",
    "- Add CSS custom properties and styling",
    "",
    "YOU CANNOT:",
    "- Modify files in components/storefront/ (they are LOCKED)",
    "- Remove or modify data fetching logic",
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
          tenantId: tenant.id,
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
            primaryColor: vars.primary,
            secondaryColor: vars.secondary,
            accentColor: vars.accent,
            backgroundColor: vars.background,
            textColor: vars.foreground,
            headingFont: "Inter",
            bodyFont: "Inter",
          });
        }
      }

      // === AI GATEWAY INTEGRATION (replaces v0) ===

      // Import and use AI Gateway service
      const { aiGatewayService } = await import("./ai-gateway-service");

      // Get theme for AI generation
      const selectedTheme = themeId ? getThemeById(themeId) : undefined;

      // Generate storefront using AI Gateway (Gemini)
      console.log(`[SiteBuilderV2] Job ${jobId} - Generating storefront via AI Gateway...`);
      const generatedStorefront = await aiGatewayService.generateStorefront({
        storeName: input?.storeName || tenantSlug,
        storeSlug: tenantSlug,
        category: input?.category || "General",
        theme: selectedTheme ? {
          name: selectedTheme.name,
          description: selectedTheme.description,
          cssVariables: selectedTheme.cssVariables,
        } : undefined,
      });
      console.log(`[SiteBuilderV2] Job ${jobId} - Storefront generated with ${generatedStorefront.files.length} files`);

      // Save generated files to tenant (Upload to Vercel Blob)
      if (generatedStorefront.files.length > 0) {
        console.log(`[SiteBuilderV2] Job ${jobId} - Uploading ${generatedStorefront.files.length} generated files to Vercel Blob...`);

        const { put } = await import("@vercel/blob");
        const uploadedFiles = await Promise.all(
          generatedStorefront.files.map(async (file) => {
            const blobPath = `tenants/${tenantSlug}/${file.name}`;
            const { url } = await put(blobPath, file.content, {
              access: "public",
              addRandomSuffix: false, // Keep names clean: tenants/slug/index.html
            });
            return { name: file.name, url };
          })
        );

        console.log(`[SiteBuilderV2] Job ${jobId} - Saving uploaded file URLs to database...`);
        await saveTenantGeneratedFiles({
          slug: tenantSlug,
          generatedFiles: uploadedFiles as any, // Cast to match DB schema expectation if strictly typed
          v0ChatId: undefined,
        });
        console.log(`[SiteBuilderV2] Job ${jobId} - Generated files saved to Blob`);
      }

      // Save demo URL (using data URL for inline HTML preview, or you can host it)
      const demoUrl = `data:text/html;charset=utf-8,${encodeURIComponent(generatedStorefront.demoHtml)}`;
      console.log(`[SiteBuilderV2] Job ${jobId} - Demo HTML generated (${generatedStorefront.demoHtml.length} chars)`);
      await saveTenantDemoUrl({
        slug: tenantSlug,
        demoUrl,
        v0ChatId: undefined,
      });

      // Set tenant status to ready
      console.log(`[SiteBuilderV2] Job ${jobId} - Setting tenant status to ready...`);
      await setTenantStatus({ slug: tenantSlug, status: "ready" });

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
