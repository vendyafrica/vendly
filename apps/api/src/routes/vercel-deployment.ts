import { Router, type IRouter } from "express";
import { vercelDeploymentController } from "../controllers/vercel-deployment-controller";

const router: IRouter = Router();

// List all tenants and their deployment status
router.get("/tenants", vercelDeploymentController.listTenants);

// Fetch files from v0 for a specific tenant
router.post("/tenants/:slug/fetch-files", vercelDeploymentController.fetchFiles);

// Deploy a specific tenant (add subdomain to Vercel)
router.post("/tenants/:slug/deploy", vercelDeploymentController.deployTenant);

// Deploy all tenants
router.post("/deploy-all", vercelDeploymentController.deployAll);

// Add subdomain to Vercel project
router.post("/add-subdomain", vercelDeploymentController.addSubdomain);

export default router;
