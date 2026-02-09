import { NextConfig } from "next";
import path from "path";

const repoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: repoRoot,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
