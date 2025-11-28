// apps/api/src/routes/index.ts
import { Router } from "express";
import { waitlistRoutes } from "../features/waitlist/routes";
// import { authRoutes } from "../features/auth/routes";

export function createRoutes(): Router {
  const router = Router();
  
  router.use("/waitlist", waitlistRoutes);
// router.use("/auth", authRoutes);
  // Add more as you grow
  
  return router;
}