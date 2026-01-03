import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/db.ts", "src/schema/index.ts", "src/v0-clone-queries.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["drizzle-orm", "dotenv", "server-only"],
});
