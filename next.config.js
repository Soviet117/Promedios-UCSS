/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['puppeteer', 'cheerio', 'tough-cookie'],
};

module.exports = nextConfig;