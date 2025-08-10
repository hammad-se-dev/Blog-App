import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Recommended for Render
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  // Ensure proper handling of environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Optimize for production
  swcMinify: true,
  // Handle static assets properly
  images: {
    unoptimized: true, // For Render deployment
  }
};

export default nextConfig;
