import { NextConfig } from "next";
import * as path from "path";

const repoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@vendly/ui", "@vendly/db", "@vendly/auth", "@vendly/transactional"],
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
