/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Importante para Render
  // Lista de paquetes de Node.js que deben empaquetarse para el servidor
  serverExternalPackages: ['puppeteer', 'cheerio', 'tough-cookie'], // Corregido aquí
};

module.exports = nextConfig;