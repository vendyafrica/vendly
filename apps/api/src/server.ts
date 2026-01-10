import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { createApp } from "./app";

const PORT = process.env.PORT || 8000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
