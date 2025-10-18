import express from "express";
import cors from "cors";
import { auth, toNodeHandler } from "@vendly/auth";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: [
      process.env.WEB_URL || "http://localhost:3000",
      process.env.MARKETPLACE_URL || "http://localhost:4000",
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log("Available Better Auth API routes:", Object.keys(auth.api));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});