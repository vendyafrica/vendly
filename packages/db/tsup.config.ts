import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    db: "src/db.ts",
    "schema/index": "src/schema/index.ts",
    "tenant-queries": "src/queries/tenant-queries.ts",
    "storefront-queries": "src/queries/storefront-queries.ts",
    "product-queries": "src/queries/product-queries.ts",
    "instagram-queries": "src/queries/instagram-queries.ts",
    "media-queries": "src/queries/media-queries.ts",
    "cart-queries": "src/queries/cart-queries.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["drizzle-orm", "dotenv", "server-only"],
});
