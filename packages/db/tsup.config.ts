import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    db: "src/db.ts",
    "schema/index": "src/schema/index.ts",
    "v0-clone-queries": "src/queries/v0-clone-queries.ts",
    "tenant-queries": "src/queries/tenant-queries.ts",
    "storefront-queries": "src/queries/storefront-queries.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["drizzle-orm", "dotenv", "server-only"],
});
