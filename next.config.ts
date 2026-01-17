import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/tools/payment-qr-portfolio',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
