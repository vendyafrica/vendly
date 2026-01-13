import { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const repoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@vendly/ui", "@vendly/db", "@vendly/auth", "@vendly/transactional"],
  outputFileTracingRoot: repoRoot,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
