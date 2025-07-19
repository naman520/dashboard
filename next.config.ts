import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
      source: "/LandX-Beta/:path*",
      destination: "https://bigbucket.online/LandX-Beta/:path*"
    }
    ];
  },
};

export default nextConfig;
