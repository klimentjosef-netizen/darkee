import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  // Části původního webu, které se nepoužívají a obsahují ukázková data. Kód zůstává, adresy vedou na úvod.
  async redirects() {
    return ['/ucet', '/ucet/:path*', '/merchant', '/merchant/:path*', '/blog', '/blog/:path*', '/pro-eshopy'].map(source => ({
      source,
      destination: '/',
      permanent: true,
    }))
  },
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
