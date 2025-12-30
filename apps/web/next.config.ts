import { NextConfig } from "next";

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
    // Turbopack configuration
    resolveAlias: {
      "@vendly/ui": "../../packages/ui/src",
    },
  },
};

export default nextConfig;
