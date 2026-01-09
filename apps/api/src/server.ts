import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import cors from "cors";
import { Response, Request } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@vendly/auth";
import aiRouter from "./routes/ai";
// import siteBuilderRouter from "./routes/site-builder";
import vercelDeploymentRouter from "./routes/vercel-deployment";
// import storefrontRouter from "./routes/storefront";
// import instagramRouter from "./routes/instagram";
import uploadRouter from "./routes/upload";
import storefrontDemoRouter from "./routes/storefront-demo";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/ai", aiRouter);
// app.use("/api/site-builder", siteBuilderRouter);
app.use("/api/vercel", vercelDeploymentRouter);
// app.use("/api/storefront", storefrontRouter);
// app.use("/api/instagram", instagramRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/storefront", storefrontDemoRouter);

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
    error: true,
  });
});

app.use((err: Error & { status?: number }, _req: Request, res: Response) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: true,
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});