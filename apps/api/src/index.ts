import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth_routes";

const app = express();
const PORT = 8000;

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

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});