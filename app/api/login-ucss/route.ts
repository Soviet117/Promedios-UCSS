import { NextRequest, NextResponse } from 'next/server';
import { obtenerNotasDesdeUCSS } from '@/lib/ucss-scraper-puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { usuario, password } = await request.json();
    
    console.log('🔐 Intento de login recibido para usuario:', usuario);
    
    if (!usuario || !password) {
      console.log('❌ Error: Faltan credenciales');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Por favor, ingresa usuario y contraseña',
          sugerencia: 'Ambos campos son requeridos'
        },
        { status: 400 }
      );
    }

    console.log('🌐 Conectando a la intranet UCSS...');
    
    const resultado = await obtenerNotasDesdeUCSS(usuario, password);
    
    console.log('='.repeat(60));
    console.log('✅ EXTRACCIÓN COMPLETADA CON ÉXITO');
    console.log('='.repeat(60));
    
    if (resultado.cursos && resultado.cursos.length > 0) {
      console.log(`📚 Total de cursos: ${resultado.cantidadCursos}`);
      
      // Calcular estadísticas para el log
      const creditosTotales = resultado.cursos.reduce((sum: number, curso: any) => 
        sum + (curso.creditos || 0), 0);
      console.log(`📖 Total de Créditos: ${creditosTotales}`);
      
      resultado.cursos.forEach((curso: any, index: number) => {
        console.log(`\n${index + 1}. ${curso.nombre}`);
        console.log(`   Código: ${curso.codigo} | Créditos: ${curso.creditos} | Tipo: ${curso.tipo}`);
        console.log(`   Docente: ${curso.docente}`);
        console.log(`   Notas Principales:`);
        console.log(`     EC (Promedio): ${curso.notasPrincipales?.EC || 'N/A'}`);
        console.log(`     E1: ${curso.notasPrincipales?.E1 || 'N/A'}`);
        console.log(`     E2: ${curso.notasPrincipales?.E2 || 'N/A'}`);
        console.log(`     E3: ${curso.notasPrincipales?.E3 || 'N/A'}`);
        console.log(`     EF: ${curso.notasPrincipales?.EF || 'N/A'}`);
        console.log(`     PF: ${curso.promedioFinal}`);
        
        console.log("   Cantidad de EC habilitadas: ", curso.cantidadContinuas);

        if (curso.evaluacionesContinuas && Object.keys(curso.evaluacionesContinuas).length > 0) {
          console.log(`   Evaluaciones Continuas Individuales:`);
          Object.entries(curso.evaluacionesContinuas).forEach(([key, value]) => {
            console.log(`     ${key}: ${value}`);
          });
        } else {
          console.log(`   Evaluaciones Continuas: No disponibles`);
        }
      });

    } else {
      console.log('⚠️  No se encontraron cursos en la página.');
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se encontraron cursos en tu cuenta',
          sugerencia: 'Verifica que tengas cursos activos este semestre'
        },
        { status: 404 }
      );
    }
    
    console.log('='.repeat(60));

    return NextResponse.json({
      ...resultado,
      // Añadir información adicional útil para el frontend
      metadata: {
        fechaExtraccion: new Date().toISOString(),
        creditosTotales: resultado.cursos.reduce((sum: number, curso: any) => 
          sum + (curso.creditos || 0), 0),
        version: '1.0'
      }
    });
    
  } catch (error: any) {
    console.error('💥 ERROR CRÍTICO EN LA EXTRACCIÓN:', error.message);
    
    let mensajeError = 'No se pudieron obtener las notas.';
    let statusCode = 500;
    let sugerencia = 'Intenta nuevamente en unos segundos.';
    let tipoError = 'desconocido';
    
    // CATEGORIZAR ERRORES PARA MEJOR EXPERIENCIA DE USUARIO
    if (error.message.includes('Credenciales incorrectas')) {
      mensajeError = 'Credenciales incorrectas.';
      sugerencia = 'Verifica tu usuario y contraseña de la intranet UCSS.';
      statusCode = 401;
      tipoError = 'credenciales';
    } 
    else if (error.message.includes('Error de conexión SSL') || 
             error.message.includes('SSL') || 
             error.message.includes('certificate')) {
      mensajeError = 'Error de conexión segura con la intranet.';
      sugerencia = 'La intranet puede estar experimentando problemas. Intenta nuevamente en 30 segundos.';
      tipoError = 'conexion_ssl';
    }
    else if (error.message.includes('Timeout') || 
             error.message.includes('respondió a tiempo')) {
      mensajeError = 'La intranet no respondió a tiempo.';
      sugerencia = 'La intranet puede estar saturada. Intenta en horarios de menor tráfico.';
      tipoError = 'timeout';
    }
    else if (error.message.includes('No se pudo cargar') || 
             error.message.includes('elementos')) {
      mensajeError = 'No se pudo acceder a la página de notas.';
      sugerencia = 'La estructura de la intranet pudo haber cambiado.';
      tipoError = 'estructura';
    }
    else if (error.message.includes('navegador') || 
             error.message.includes('Puppeteer')) {
      mensajeError = 'Error técnico al conectar con la intranet.';
      sugerencia = 'Este error suele ser temporal. Intenta nuevamente.';
      tipoError = 'tecnico';
    }
    
    // REGISTRO DETALLADO PARA DESARROLLO
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Detalles del error:', {
        tipo: tipoError,
        mensaje: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join(' | ')
      });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: mensajeError,
        sugerencia,
        tipoError,
        intentosSugeridos: 'Puedes intentar nuevamente hasta 3 veces.',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400' // Cache preflight por 24 horas
    },
  });
}

// Endpoint para verificar estado del servicio
export async function GET() {
  return NextResponse.json({
    status: 'operativo',
    version: '1.0',
    descripcion: 'API de consulta de notas UCSS',
    fecha: new Date().toISOString(),
    endpoints: {
      login: 'POST /api/login-ucss',
      estado: 'GET /api/login-ucss'
    }
  });
}