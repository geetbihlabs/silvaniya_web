import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-c0a702f55f8043a299b1835aa0ac6587.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
