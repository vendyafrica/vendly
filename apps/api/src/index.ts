// apps/api/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth, toNodeHandler } from "@vendly/auth";
import type { Request, Response } from "express";
import instagramRoutes from "./routes/instagram.routes";

// Load environment variables
dotenv.config();

const app = express();
const port = 8000;

app.use(
  cors({
    origin: process.env.WEB_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Auth routes - use regex pattern for Express 5 compatibility
app.all(/^\/api\/auth\/.*/, toNodeHandler(auth));

// Other middleware
app.use(express.json());

// Instagram OAuth routes
app.use(instagramRoutes);

// Temporary GET for diagnostics (should return 200)
app.get("/api/onboarding", (_req: Request, res: Response) => {
  res.json({ ok: true, via: "index" });
});

// Your other routes
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});