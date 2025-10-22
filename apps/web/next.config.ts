import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
