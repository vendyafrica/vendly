import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vendly/ui"],
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
          port: "",
          pathname: "/**",
        },
      ],
    },
};

export default nextConfig;
