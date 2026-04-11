import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    '.space.z.ai',
    '.z.ai',
  ],
  // Vercel optimization
  output: undefined, // Let Vercel handle output mode
};

export default nextConfig;
