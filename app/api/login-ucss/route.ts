import { NextRequest, NextResponse } from 'next/server';
import { obtenerNotasDesdeUCSS } from '@/lib/ucss-scraper-puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { usuario, password } = await request.json();
    
    console.log('🔐 Intento de login recibido para usuario:', usuario);
    console.log('🌐 Conectando a la intranet UCSS...');
    
    if (!usuario || !password) {
      console.log('❌ Error: Faltan credenciales');
      return NextResponse.json(
        { success: false, error: 'Por favor, ingresa usuario y contraseña' },
        { status: 400 }
      );
    }

    const resultado = await obtenerNotasDesdeUCSS(usuario, password);
    
    console.log('='.repeat(60));
    console.log('✅ EXTRACCIÓN COMPLETADA CON ÉXITO');
    console.log('='.repeat(60));
    
    if (resultado.cursos && resultado.cursos.length > 0) {
      console.log(`📚 Total de cursos: ${resultado.cantidadCursos}`);
      console.log(`⭐ Promedio Ponderado: ${resultado.promedioPonderado}`);
      console.log(`📖 Total de Créditos: ${resultado.totalCreditos}`);
      
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
      
      console.log("Cantidad de EC habilitadas: ", curso.cantidadContinuas);

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
    }
    
    console.log('='.repeat(60));

    return NextResponse.json(resultado);
    
  } catch (error: any) {

    console.error('💥 ERROR CRÍTICO EN LA EXTRACCIÓN:', error.message);
    
    let mensajeError = 'No se pudieron obtener las notas.';
    let statusCode = 500;
    
    if (error.message.includes('Credenciales incorrectas')) {
      mensajeError = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
      statusCode = 401;
    } else if (error.message.includes('Timeout')) {
      mensajeError = 'La intranet no respondió a tiempo. Intenta nuevamente.';
    } else if (error.message.includes('navegador') || error.message.includes('Puppeteer')) {
      mensajeError = 'Error técnico al iniciar el navegador.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: mensajeError,
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}