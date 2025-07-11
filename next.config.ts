import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    domains: ["randomuser.me"],
    unoptimized: true,
  },
};

export default nextConfig;
