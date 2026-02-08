#!/bin/bash
echo "🔄 Iniciando build para Render..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Instalar Puppeteer con dependencias necesarias
echo "🤖 Configurando Puppeteer..."
npm install puppeteer

# Crear directorio de caché para Puppeteer
mkdir -p .cache/puppeteer

echo "🔨 Construyendo aplicación..."
npm run build

echo "✅ Build completado exitosamente!"