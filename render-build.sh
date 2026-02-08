#!/bin/bash
echo "🔄 Iniciando build para Render..."
rm -rf .next node_modules package-lock.json
npm install
npm run build
echo "✅ Build completado exitosamente!"