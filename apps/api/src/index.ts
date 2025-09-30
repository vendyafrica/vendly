// apps/api/src/index.ts
import express from "express";
import cors from "cors";
import { auth, toNodeHandler } from "@vendly/auth";

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

// Your other routes
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});