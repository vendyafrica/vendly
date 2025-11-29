// apps/api/src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { auth, toNodeHandler } from "@vendly/auth";
import { createRoutes } from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Debug: Log Google credentials
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Not loaded");

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "https://vendly-web.vercel.app",
      "https://www.vendlyafrica.store",
      "https://vendlyafrica.store",
      "https://vendly-storefront.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// === HEALTH CHECK ===

app.get("/", (_req, res) => {
  res.send("API is running");
});

// === AUTH ROUTES ===

app.all("/api/auth/*splat", toNodeHandler(auth));

// === API ROUTES ===

app.use("/api", createRoutes());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === ERROR HANDLING ===

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: true,
  });
});

// === 404 HANDLER ===

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    error: true,
  });
});

// === START SERVER ===

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
});