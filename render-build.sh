#!/bin/bash
echo "🔄 Iniciando build para Render..."

# Limpiar CACHÉ COMPLETA de dependencias y build
echo "🧹 Limpiando caché..."
rm -rf .next node_modules package-lock.json

# Instalar TODO desde cero (esto regenerará package-lock.json)
echo "📦 Instalando TODAS las dependencias..."
npm install

# Build con verificación
echo "🔨 Construyendo aplicación..."
if npm run build; then
    echo "✅ Build REAL completado exitosamente!"
    
    # Verificar que se creó el build
    if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
        echo "✓ Build de producción verificado"
        exit 0
    else
        echo "❌ ERROR: No se creó el build de producción"
        exit 1
    fi
else
    echo "❌ ERROR: Build falló"
    exit 1
fi