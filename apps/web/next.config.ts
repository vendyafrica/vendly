import { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@vendly/ui"],
  turbopack: {
    root: path.resolve(__dirname, "../../.."),
  },
};

export default nextConfig;
