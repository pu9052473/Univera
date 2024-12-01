import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.clerk.com'], // Add img.clerk.com to the allowed domains
  },
};

export default nextConfig;
