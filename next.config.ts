import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Notion hosted images
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "notion.so" },
      // Unsplash / other common image hosts
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
