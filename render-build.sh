#!/bin/bash
echo "🔄 Iniciando build para Render..."

# 1. LIMPIA TODO
rm -rf .next node_modules package-lock.json

# 2. INSTALA (esto generará warnings de puppeteer, ignóralos)
echo "📦 Instalando dependencias..."
npm install

# 3. BUILD con CAPTURA DE ERROR REAL
echo "🔨 Construyendo aplicación..."
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT_CODE=$?

# 4. VERIFICA SI EL BUILD REALMENTE PASÓ
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    # Busca en el output si Next.js reportó éxito
    if echo "$BUILD_OUTPUT" | grep -q "✓ Compiled successfully\|✓ Finalizing page optimization"; then
        echo "✅ Build REAL de Next.js completado exitosamente!"
        
        # Verifica que la carpeta .next se creó
        if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
            echo "✓ Build de producción verificado (.next/BUILD_ID existe)"
            exit 0
        else
            echo "❌ ERROR: Carpeta .next NO se creó"
            exit 1
        fi
    else
        echo "❌ ERROR: Next.js no reportó éxito en el build"
        echo "=== ÚLTIMAS LÍNEAS DEL OUTPUT ==="
        echo "$BUILD_OUTPUT" | tail -20
        exit 1
    fi
else
    echo "❌ ERROR: Comando 'npm run build' falló con código $BUILD_EXIT_CODE"
    echo "=== OUTPUT COMPLETO ==="
    echo "$BUILD_OUTPUT"
    exit 1
fi