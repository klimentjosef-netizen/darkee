import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.myshoptet.com' },
      { protocol: 'https', hostname: '*.myshoptet.com' },
      { protocol: 'https', hostname: 'cdn.danfil.cz' },
    ],
  },
};

export default nextConfig;
