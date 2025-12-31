import { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@vendly/ui"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@vendly/ui": "../../packages/ui/src",
    };
    return config;
  },
  turbopack: {
    root: path.resolve(__dirname, "../../.."),
    // Turbopack configuration
    resolveAlias: {
      "@vendly/ui": "../../packages/ui/src",
    },
  },
};

export default nextConfig;
