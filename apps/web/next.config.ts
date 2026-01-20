import { NextConfig } from "next";
import path from "path";

const repoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@vendly/ui"],
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
  // async rewrites() {
  //   return [{
  //     source: '/api/:path*',
  //     destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*'
  //   }];
  // }
}

export default nextConfig;
