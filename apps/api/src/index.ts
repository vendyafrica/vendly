import express from "express";
import cors from "cors";
import { auth, toNodeHandler } from "@vendly/auth";
import waitlistRoutes from "./routes/waitlist";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: [
      process.env.WEB_URL as string,
      "http://localhost:3000",
      process.env.MARKETPLACE_URL as string,
      "http://localhost:4000",
      process.env.CLIENT_URL as string,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (_req, res) => {
  res.send("API is running");
});


app.use("/api/waitlist", waitlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
