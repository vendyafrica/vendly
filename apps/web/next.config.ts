import { NextConfig } from "next";
import path from "path";

const repoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@vendly/ui", "@vendly/auth"],
  outputFileTracingRoot: repoRoot,
  allowedDevOrigins: [
    "harmonically-carpetless-janna.ngrok-free.dev",
    "*.ngrok-free.dev",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
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
        hostname: "mplsrodasp.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.cosmos.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.cosmos.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "momodeveloper.mtn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
