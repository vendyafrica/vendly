// apps/api/src/routes/index.ts
import { Router } from "express";
import { waitlistRoutes } from "../features/waitlist/routes";
import { authRoutes } from "./auth";

export function createRoutes(): Router {
  const router = Router();
  
  router.use("/waitlist", waitlistRoutes);
  router.use("/auth", authRoutes);
  
  return router;
}