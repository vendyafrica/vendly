import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import morgan from "morgan";
import { createApp } from "./app";

const PORT = process.env.PORT || 8000;

const app = createApp();

// Add request logging
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
