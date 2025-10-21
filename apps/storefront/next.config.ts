import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vendly/auth", "@vendly/database"],
  outputFileTracingRoot: require("path").join(__dirname, "../../"),
  turbopack: {
    resolveAlias: {
      "@vendly/auth": "../../packages/auth/src/index.ts",
      "@vendly/database": "../../packages/database/src/index.ts",
    },
  },
};

export default nextConfig;
