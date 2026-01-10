import express, { Express, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@vendly/auth";

import vercelDeploymentRouter from "./modules/deployment/vercel-route";
import imageUploadRouter from "./modules/storage/blob-route";
import storefrontDemoRouter from "./modules/storefront/storefront-route";
import tenantRouter from "./modules/tenant/tenant-route";
import onboardingRouter from "./modules/onboarding/onboarding-route";

export function createApp(): Express {
  const app = express();

  // ---------- Core middleware ----------
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---------- CORS ----------
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5000",
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/[\w-]+\.localhost:\d+$/,
        "https://vendly-web.vercel.app",
        "https://www.vendlyafrica.store",
        "https://vendlyafrica.store",
        "https://admin.vendlyafrica.store",
        /\.vercel\.app$/,
        /\.vendlyafrica\.store$/,
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // ---------- Auth ----------
  app.all("/api/auth/*splat", toNodeHandler(auth));

  // ---------- Routes ----------
  app.use("/api/vercel", vercelDeploymentRouter);
  app.use("/api/upload", imageUploadRouter);
  app.use("/api/storefront", storefrontDemoRouter);
  app.use("/api/tenants", tenantRouter);
  app.use("/api/onboarding", onboardingRouter);

  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  // ---------- 404 ----------
  app.use((_req, res) => {
    res.status(404).json({
      message: "Route not found",
      error: true,
    });
  });

  // ---------- Error handler ----------
  app.use(
    (err: Error & { status?: number }, _req: Request, res: Response) => {
      console.error("Error:", err);
      res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        error: true,
      });
    }
  );

  return app;
}
