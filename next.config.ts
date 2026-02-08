import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuraciones para Render
  output: 'standalone', // Importante para Docker en Render
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'cheerio'],
  },
};

export default nextConfig;