import "dotenv/config";
import express from "express";
import cors from "cors";
import { auth, toNodeHandler } from "@vendly/auth";
import { createRoutes } from "./routes/index";
import { Response, Request, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 8000;

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

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", createRoutes());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: true,
  });
});

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
    error: true,
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});