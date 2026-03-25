import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.myshoptet.com' },
      { protocol: 'https', hostname: '*.myshoptet.com' },
      { protocol: 'https', hostname: 'cdn.danfil.cz' },
      { protocol: 'https', hostname: '*.mergado.com' },
      { protocol: 'https', hostname: '*.heureka.cz' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
