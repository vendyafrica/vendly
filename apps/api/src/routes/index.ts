// apps/api/src/routes/index.ts
import { Router } from "express";
import { waitlistRoutes } from "../features/waitlist/routes";

export function createRoutes(): Router {
  const router = Router();
  
  router.use("/waitlist", waitlistRoutes);
  
  return router;
}