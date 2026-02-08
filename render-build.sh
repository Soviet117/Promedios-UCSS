#!/bin/bash
echo "🔄 Iniciando build para Render..."
# Solo limpia la caché de build, NO node_modules
rm -rf .next
npm ci --only=production
npm run build
echo "✅ Build completado exitosamente!"