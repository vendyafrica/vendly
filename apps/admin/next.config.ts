import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@vendly/auth", "@vendly/database", "@vendly/types", "@vendly/ui"],
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  turbopack: {
    root: path.resolve(__dirname, "../../"),
    resolveAlias: {
      "@vendly/auth": "../../packages/auth/src/index.ts",
      "@vendly/database": "../../packages/database/src/index.ts",
      "@vendly/types": "../../packages/types/src/index.ts",
      "@vendly/ui": "../../packages/ui/src/index.ts",
    },
  },
};

export default nextConfig;
