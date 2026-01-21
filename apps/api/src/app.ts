import express, { Express, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@vendly/auth";
import onboardingRoutes from "./modules/onboarding/onboarding-routes";
import storefrontRoutes from "./modules/storefront/storefront-routes";
import { productRoutes } from "./modules/products/product-routes";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", true);

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:4000",
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/[\w-]+\.localhost:\d+$/,
        "https://vendly-web.vercel.app",
        "https://www.vendlyafrica.store",
        "https://vendlyafrica.store",
        "https://admin.vendlyafrica.store",
        /\.vercel\.app$/,
        /\.vendlyafrica\.store$/,
        /\.ngrok-free\.dev$/,
        /\.ngrok\.io$/,
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-With", "x-tenant-id", "x-tenant-slug"],
    })
  );

  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Onboarding routes
  app.use("/api/onboarding", onboardingRoutes);

  // Storefront routes (public - no auth required)
  app.use("/api/storefront", storefrontRoutes);

  // Product routes
  app.use("/api/products", productRoutes);

  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  app.use((_req, res) => {
    res.status(404).json({
      message: "Route not found",
      error: true,
    });
  });

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
