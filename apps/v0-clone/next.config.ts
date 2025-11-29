import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  transpilePackages: ["@vendly/ui"],
  turbopack: {
    root: path.resolve(__dirname, "../../"),
    resolveAlias: {
      "@vendly/ui": "../../packages/ui/src/index.ts",
    },
  },
};

export default nextConfig;
