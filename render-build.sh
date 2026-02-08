#!/bin/bash
echo "🔄 Iniciando build para Render..."

# Limpiar caché de build
rm -rf .next

# Instalar dependencias específicas que pueden faltar
echo "📦 Verificando dependencias críticas..."
npm list @tailwindcss/postcss || npm install @tailwindcss/postcss@latest
npm list tailwindcss || npm install tailwindcss@latest

# Instalar todas las dependencias
npm ci

# Build con verificación
echo "🔨 Construyendo aplicación..."
if npm run build; then
    echo "✅ Build REAL completado exitosamente!"
    
    # Verificar que se creó el build
    if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
        echo "✓ Build de producción verificado"
    else
        echo "❌ ERROR: No se creó el build de producción"
        exit 1
    fi
else
    echo "❌ ERROR: Build falló"
    exit 1
fi