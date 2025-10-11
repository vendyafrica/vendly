  import express from "express";
  import cors from "cors";
  import authRoutes from "./routes/auth.routes";

  const app = express();


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: [
        process.env.WEB_URL || "http://localhost:3000",
        process.env.MARKETPLACE_URL || "http://localhost:4000",
      ],
      credentials: true,
    })
  );

  app.use("/api/v1/auth", authRoutes);

  app.get("/", (_req, res) => {
    res.json({ message: "Vendly API is running" });
  });

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });