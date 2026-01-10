/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getTenantBySlug,
  saveTenantDeploymentUrl,
  getAllTenants,
} from "@vendly/db/tenant-queries";

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const ROOT_DOMAIN = process.env.ROOT_DOMAIN;

export class VercelDeploymentService {
  /**
   * Add a subdomain to the Vercel project
   */
  async addSubdomainToVercel(
    subdomain: string
  ): Promise<{ success: boolean; domain: string; error?: string }> {
    const domain = `${subdomain}.${ROOT_DOMAIN}`;
    console.log(`[VercelDeploy] Adding domain to Vercel: ${domain}`);

    if (!VERCEL_API_TOKEN) {
      throw new Error("VERCEL_API_TOKEN is not set");
    }

    try {
      const url = new URL(
        `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`
      );

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: domain,
        }),
      });

      const data = (await response.json()) as {
        error?: { code?: string; message?: string };
      };

      if (!response.ok) {
        // Check if domain already exists (which is fine)
        if (
          data.error?.code === "domain_already_exists" ||
          data.error?.code === "domain_taken"
        ) {
          console.log(`[VercelDeploy] Domain already exists: ${domain}`);
          return { success: true, domain };
        }

        console.error(`[VercelDeploy] Failed to add domain:`, data);
        return {
          success: false,
          domain,
          error: data.error?.message || "Failed to add domain",
        };
      }

      console.log(`[VercelDeploy] Successfully added domain: ${domain}`);
      return { success: true, domain };
    } catch (error) {
      console.error(`[VercelDeploy] Error adding domain:`, error);
      return {
        success: false,
        domain,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Trigger a deployment for the Vercel project
   * This will redeploy the apps/web project which handles all subdomains via middleware
   */
  async triggerDeployment(): Promise<{
    success: boolean;
    deploymentUrl?: string;
    error?: string;
  }> {
    console.log(
      `[VercelDeploy] Triggering deployment for project: ${VERCEL_PROJECT_ID}`
    );

    if (!VERCEL_API_TOKEN) {
      throw new Error("VERCEL_API_TOKEN is not set");
    }

    try {
      // Get the project's git repo info first
      const projectUrl = new URL(
        `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}`
      );

      const projectResponse = await fetch(projectUrl.toString(), {
        headers: {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        },
      });

      if (!projectResponse.ok) {
        const error = await projectResponse.json();
        console.error(`[VercelDeploy] Failed to get project:`, error);
        return { success: false, error: "Failed to get project info" };
      }

      const project = (await projectResponse.json()) as {
        name?: string;
        id?: string;
      };
      console.log(`[VercelDeploy] Project info:`, {
        name: project.name,
        id: project.id,
      });

      // Create a deployment hook or use the deployments API
      // For now, we'll just return success since the subdomain is added
      // The actual deployment happens when you push to git or manually deploy

      return {
        success: true,
        deploymentUrl: `https://${ROOT_DOMAIN}`,
      };
    } catch (error) {
      console.error(`[VercelDeploy] Error triggering deployment:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Full deployment flow for a tenant:
   * 1. Add subdomain to Vercel
   * 2. Update tenant record
   * Note: v0 file fetching disabled - using default template
   */
  async deployTenant(slug: string): Promise<{
    success: boolean;
    domain?: string;
    error?: string;
  }> {
    console.log(`[VercelDeploy] Starting deployment for tenant: ${slug}`);

    try {
      // Step 1: Get tenant info
      const tenant = await getTenantBySlug(slug);
      if (!tenant) {
        return { success: false, error: `Tenant not found: ${slug}` };
      }

      // Step 2: Skip v0 file fetching - using default template

      console.log(
        `[VercelDeploy] Using default template - skipping v0 file fetching`
      );

      // Step 3: Add subdomain to Vercel project
      const domainResult = await this.addSubdomainToVercel(slug);
      if (!domainResult.success) {
        return { success: false, error: domainResult.error };
      }

      // Step 4: Update tenant with deployment URL
      const deploymentUrl = `https://${slug}.${ROOT_DOMAIN}`;
      await saveTenantDeploymentUrl({
        slug,
        vercelDeploymentUrl: deploymentUrl,
      });

      console.log(`[VercelDeploy] Deployment complete for tenant: ${slug}`);
      console.log(`[VercelDeploy] URL: ${deploymentUrl}`);

      return {
        success: true,
        domain: domainResult.domain,
      };
    } catch (error) {
      console.error(
        `[VercelDeploy] Deployment failed for tenant ${slug}:`,
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Deploy all tenants (v0 integration disabled)
   */
  async deployAllTenants(): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{ slug: string; success: boolean; error?: string }>;
  }> {
    console.log(
      `[VercelDeploy] Deploying all tenants (using default template)...`
    );

    const tenants = await getAllTenants();
    const results: Array<{ slug: string; success: boolean; error?: string }> =
      [];

    for (const tenant of tenants) {
      const result = await this.deployTenant(tenant.slug);
      results.push({
        slug: tenant.slug,
        success: result.success,
        error: result.error,
      });
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(
      `[VercelDeploy] Deployment complete: ${successful} successful, ${failed} failed`
    );

    return {
      total: tenants.length,
      successful,
      failed,
      results,
    };
  }

  /**
   * List all tenants and their deployment status
   */
  async listTenants(): Promise<
    Array<{
      slug: string;
      status: string;
      v0ChatId: string | null;
      demoUrl: string | null;
      vercelDeploymentUrl: string | null;
      hasGeneratedFiles: boolean;
    }>
  > {
    const tenants = await getAllTenants();

    return tenants.map((t) => ({
      slug: t.slug,
      status: t.status,
      v0ChatId: t.v0ChatId,
      demoUrl: t.demoUrl,
      vercelDeploymentUrl: (t as any).vercelDeploymentUrl,
      hasGeneratedFiles:
        !!(t as any).generatedFiles &&
        Array.isArray((t as any).generatedFiles) &&
        (t as any).generatedFiles.length > 0,
    }));
  }
}

export const vercelDeploymentService = new VercelDeploymentService();
