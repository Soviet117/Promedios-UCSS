#!/bin/bash
echo "🔄 Iniciando build para Render..."
rm -rf node_modules .next package-lock.json
npm install
npm run build
echo "✅ Build completado exitosamente!"