import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    db: "src/db.ts",
    "schema/index": "src/schema/index.ts",
    "tenant-queries": "src/queries/tenant-queries.ts",
    "storefront-queries": "src/queries/storefront-queries.ts",
    "instagram-queries": "src/queries/instagram-queries.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["drizzle-orm", "dotenv", "server-only"],
});
