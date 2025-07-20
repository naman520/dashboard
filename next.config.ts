import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
      source: "/namanTest/:path*",
      destination: "https://bigbucket.online/namanTest/:path*"
    }
    ];
  },
};

export default nextConfig;
