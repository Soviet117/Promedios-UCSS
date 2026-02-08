#!/bin/bash
echo "🔄 Iniciando build para Render..."

# Limpiar cache
rm -rf .next .next/standalone .next/cache

# 1. INSTALAR CHROMIUM Y DEPENDENCIAS DEL SISTEMA
echo "🔧 Instalando Chromium y dependencias del sistema..."
apt-get update && apt-get install -y \
  chromium \
  chromium-common \
  chromium-driver \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libgbm1 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends

# 2. Limpiar cache de apt para reducir tamaño
apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Instalar dependencias de Node.js
echo "📦 Instalando dependencias de Node.js..."
npm install

# 4. Build
echo "🔨 Construyendo aplicación..."
npm run build

echo "✅ Build completado exitosamente!"