// apps/api/src/index.ts
import express from "express";
import cors from "cors";
import { auth, toNodeHandler } from "@vendly/auth";
import onboardingRouter from "./routes/onboarding";
import type { Request, Response, NextFunction } from "express";
import sellerRoutes from './routes/seller.routes';
import storeRoutes from './routes/store.routes';
import importRoutes from './routes/import.routes';

const app = express();
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Auth routes - use regex pattern for Express 5 compatibility
app.all(/^\/api\/auth\/.*/, toNodeHandler(auth));

// Other middleware
app.use(express.json());

// Debug: inspect router wiring
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.log('[index] onboardingRouter typeof', typeof (onboardingRouter as any), 'keys', Object.keys(onboardingRouter as any));

// Temporary GET for diagnostics (should return 200)
app.get("/api/onboarding", (_req: Request, res: Response) => {
  res.json({ ok: true, via: "index" });
});

// Onboarding routes
app.use("/api/onboarding", onboardingRouter);

app.use('/api/sellers', sellerRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/import', importRoutes);

// Your other routes
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ ok: false, error: "InternalServerError" });
});

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});