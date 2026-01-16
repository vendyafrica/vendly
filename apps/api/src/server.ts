import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import { productRoutes } from "./modules/products/product-routes";
import { instagramRoutes } from "./modules/instagram/routes/instagram-routes";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/instagram", instagramRoutes);

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
