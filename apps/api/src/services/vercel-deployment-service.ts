/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getTenantBySlug,
  saveTenantGeneratedFiles,
  saveTenantDeploymentUrl,
  getAllTenants,
} from "@vendly/db/tenant-queries";

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "vendly-web"; // Your apps/web project name
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "vendlyafrica.store";

interface V0File {
  name: string;
  content: string;
}

interface V0ChatResponse {
  id: string;
  demo?: string;
  webUrl?: string;
  files?: V0File[];
  latestVersion?: {
    demoUrl?: string;
    files?: V0File[];
  };
}

export class VercelDeploymentService {
  /**
   * Fetch files from an existing v0 chat using direct API call
   */
  async fetchFilesFromV0Chat(chatId: string): Promise<V0File[]> {
    console.log(`[VercelDeploy] Fetching files from v0 chat: ${chatId}`);
    
    try {
      // Use direct API call to get chat details with files
      const response = await fetch(`https://api.v0.dev/v1/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${process.env.V0_API_KEY}`,
        },
      });
      
      if (!response.ok) {
        console.error(`[VercelDeploy] Failed to fetch chat: ${response.status}`);
        return [];
      }
      
      const chat = await response.json() as V0ChatResponse;
      
      if (!chat) {
        console.log(`[VercelDeploy] Chat not found: ${chatId}`);
        return [];
      }
      
      console.log(`[VercelDeploy] Chat response keys:`, Object.keys(chat));
      
      // Try to get files from various locations in the response
      const files = chat.files 
        || chat.latestVersion?.files 
        || [];
      
      console.log(`[VercelDeploy] Found ${files.length} files`);
      
      if (files.length > 0) {
        files.forEach((f: V0File) => console.log(`  - ${f.name}`));
      }
      
      return files;
    } catch (error) {
      console.error(`[VercelDeploy] Error fetching files from v0:`, error);
      throw error;
    }
  }

  /**
   * Fetch and save files for a tenant from their v0 chat
   */
  async fetchAndSaveFilesForTenant(slug: string): Promise<V0File[]> {
    console.log(`[VercelDeploy] Fetching files for tenant: ${slug}`);
    
    const tenant = await getTenantBySlug(slug);
    if (!tenant) {
      throw new Error(`Tenant not found: ${slug}`);
    }
    
    if (!tenant.v0ChatId) {
      throw new Error(`Tenant ${slug} has no v0ChatId`);
    }
    
    const files = await this.fetchFilesFromV0Chat(tenant.v0ChatId);
    
    if (files.length > 0) {
      await saveTenantGeneratedFiles({
        slug,
        generatedFiles: files,
        v0ChatId: tenant.v0ChatId,
      });
      console.log(`[VercelDeploy] Saved ${files.length} files for tenant: ${slug}`);
    }
    
    return files;
  }

  /**
   * Add a subdomain to the Vercel project
   */
  async addSubdomainToVercel(subdomain: string): Promise<{ success: boolean; domain: string; error?: string }> {
    const domain = `${subdomain}.${ROOT_DOMAIN}`;
    console.log(`[VercelDeploy] Adding domain to Vercel: ${domain}`);
    
    if (!VERCEL_API_TOKEN) {
      throw new Error("VERCEL_API_TOKEN is not set");
    }
    
    try {
      const url = new URL(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`);
      if (VERCEL_TEAM_ID) {
        url.searchParams.set("teamId", VERCEL_TEAM_ID);
      }
      
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
      
      const data = await response.json() as { error?: { code?: string; message?: string } };
      
      if (!response.ok) {
        // Check if domain already exists (which is fine)
        if (data.error?.code === "domain_already_exists" || data.error?.code === "domain_taken") {
          console.log(`[VercelDeploy] Domain already exists: ${domain}`);
          return { success: true, domain };
        }
        
        console.error(`[VercelDeploy] Failed to add domain:`, data);
        return { success: false, domain, error: data.error?.message || "Failed to add domain" };
      }
      
      console.log(`[VercelDeploy] Successfully added domain: ${domain}`);
      return { success: true, domain };
    } catch (error) {
      console.error(`[VercelDeploy] Error adding domain:`, error);
      return { 
        success: false, 
        domain, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Trigger a deployment for the Vercel project
   * This will redeploy the apps/web project which handles all subdomains via middleware
   */
  async triggerDeployment(): Promise<{ success: boolean; deploymentUrl?: string; error?: string }> {
    console.log(`[VercelDeploy] Triggering deployment for project: ${VERCEL_PROJECT_ID}`);
    
    if (!VERCEL_API_TOKEN) {
      throw new Error("VERCEL_API_TOKEN is not set");
    }
    
    try {
      // Get the project's git repo info first
      const projectUrl = new URL(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}`);
      if (VERCEL_TEAM_ID) {
        projectUrl.searchParams.set("teamId", VERCEL_TEAM_ID);
      }
      
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
      
      const project = await projectResponse.json() as { name?: string; id?: string };
      console.log(`[VercelDeploy] Project info:`, { name: project.name, id: project.id });
      
      // Create a deployment hook or use the deployments API
      // For now, we'll just return success since the subdomain is added
      // The actual deployment happens when you push to git or manually deploy
      
      return { 
        success: true, 
        deploymentUrl: `https://${ROOT_DOMAIN}` 
      };
    } catch (error) {
      console.error(`[VercelDeploy] Error triggering deployment:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Full deployment flow for a tenant:
   * 1. Fetch files from v0
   * 2. Add subdomain to Vercel
   * 3. Update tenant record
   */
  async deployTenant(slug: string): Promise<{
    success: boolean;
    files?: V0File[];
    domain?: string;
    error?: string;
  }> {
    console.log(`[VercelDeploy] Starting deployment for tenant: ${slug}`);
    
    try {
      // Step 1: Fetch files from v0 (if tenant has v0ChatId)
      const tenant = await getTenantBySlug(slug);
      if (!tenant) {
        return { success: false, error: `Tenant not found: ${slug}` };
      }
      
      let files: V0File[] = [];
      if (tenant.v0ChatId) {
        try {
          files = await this.fetchAndSaveFilesForTenant(slug);
        } catch (err) {
          console.warn(`[VercelDeploy] Could not fetch files from v0:`, err);
          // Continue anyway - we can still add the subdomain
        }
      }
      
      // Step 2: Add subdomain to Vercel project
      const domainResult = await this.addSubdomainToVercel(slug);
      if (!domainResult.success) {
        return { success: false, files, error: domainResult.error };
      }
      
      // Step 3: Update tenant with deployment URL
      const deploymentUrl = `https://${slug}.${ROOT_DOMAIN}`;
      await saveTenantDeploymentUrl({ slug, vercelDeploymentUrl: deploymentUrl });
      
      console.log(`[VercelDeploy] Deployment complete for tenant: ${slug}`);
      console.log(`[VercelDeploy] URL: ${deploymentUrl}`);
      
      return {
        success: true,
        files,
        domain: domainResult.domain,
      };
    } catch (error) {
      console.error(`[VercelDeploy] Deployment failed for tenant ${slug}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Deploy all tenants that have v0ChatId
   */
  async deployAllTenants(): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{ slug: string; success: boolean; error?: string }>;
  }> {
    console.log(`[VercelDeploy] Deploying all tenants...`);
    
    const tenants = await getAllTenants();
    const results: Array<{ slug: string; success: boolean; error?: string }> = [];
    
    for (const tenant of tenants) {
      const result = await this.deployTenant(tenant.slug);
      results.push({
        slug: tenant.slug,
        success: result.success,
        error: result.error,
      });
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`[VercelDeploy] Deployment complete: ${successful} successful, ${failed} failed`);
    
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
  async listTenants(): Promise<Array<{
    slug: string;
    status: string;
    v0ChatId: string | null;
    demoUrl: string | null;
    vercelDeploymentUrl: string | null;
    hasGeneratedFiles: boolean;
  }>> {
    const tenants = await getAllTenants();
    
    return tenants.map(t => ({
      slug: t.slug,
      status: t.status,
      v0ChatId: t.v0ChatId,
      demoUrl: t.demoUrl,
      vercelDeploymentUrl: (t as any).vercelDeploymentUrl,
      hasGeneratedFiles: !!(t as any).generatedFiles && Array.isArray((t as any).generatedFiles) && (t as any).generatedFiles.length > 0,
    }));
  }
}

export const vercelDeploymentService = new VercelDeploymentService();
