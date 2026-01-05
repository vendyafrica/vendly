import { NextConfig } from "next";
import path from "path";

const repoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@vendly/ui", "@vendly/db", "@vendly/auth", "@vendly/transactional"],
  outputFileTracingRoot: repoRoot,
  // Disable Turbopack for production builds to fix middleware.js.nft.json error
  // turbopack: {
  //   root: repoRoot,
  // },
};

export default nextConfig;
