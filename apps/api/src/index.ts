import express from "express";
import cors from "cors";
import { auth, toNodeHandler } from "@vendly/auth";
import waitlistRoutes from "./routes/waitlist";



const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: [
      'http://localhost:3000',              
      'http://localhost:4000',
      'https://vendly-web.vercel.app',
      'https://www.vendlyafrica.store',
      'https://vendlyafrica.store',
      'https://vendly-storefront.vercel.app',
      /\.vercel\.app$/,
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
