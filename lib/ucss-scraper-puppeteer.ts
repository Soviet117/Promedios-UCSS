import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';

export async function obtenerNotasDesdeUCSS(usuario: string, password: string) {
  console.log(`🚀 Iniciando scraping con Puppeteer para usuario: ${usuario}`);
  
  const baseURL = 'https://intranet.ucss.edu.pe/ucss-intranet';
  let browser: Browser | null = null;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page: Page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    await page.goto(`${baseURL}/login/ingresar.aspx`, { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.type('input[name="txtUsuarioMail"]', usuario);
    await page.type('input[name="txtPwd"]', password);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
      page.click('input[name="btnIngresar"]')
    ]);

    const pageContent = await page.content();
    if (pageContent.includes('Usuario o contraseña incorrectos')) {
      throw new Error('Credenciales incorrectas');
    }
    console.log('Login exitoso detectado.');

    await page.goto(`${baseURL}/academico/notas.aspx`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const notasHtml = await page.content();
    
    const $ = cheerio.load(notasHtml);
    const cursosExtraidos: any[] = [];

    $('div.css-curso-card').each((index, element) => {
      const curso = $(element);
      
      const nombreCompleto = curso.find('b').first().text().trim();
      
      const infoItems = curso.find('.css-curso-card-body-cred-tipo p');
      let codigo = '', creditos = '', tipo = '';
      
      infoItems.each((i, pElem) => {
        const texto = $(pElem).text();
        if (texto.includes('CÓD.:')) codigo = texto.split('CÓD.:')[1]?.trim().split(/\s+/)[0] || '';
        if (texto.includes('CRÉD.:')) creditos = texto.split('CRÉD.:')[1]?.trim().split(/\s+/)[0] || '';
        if (texto.includes('TIPO:')) tipo = texto.split('TIPO:')[1]?.trim();
      });
      
      const docente = curso.find('p[style*="padding-bottom:5px;"]').text()
        .replace('DOCENTE:', '').trim();
      
      // Extraer notas principales
      const notas: Record<string, string> = {};
      const tablaPrincipal = curso.find('.css-curso-card-tabla-notas');
      
      tablaPrincipal.find('tr').each((rowIndex, row) => {
        if (rowIndex === 1) {
          const celdas = $(row).find('td');
          const headers = ['EC', 'E1', 'E2', 'E3', 'EF', 'PF'];
          
          celdas.each((cellIndex, cell) => {
            if (headers[cellIndex]) {
              let valor = $(cell).text().trim();
              const colorTag = $(cell).find('font');
              if (colorTag.length) valor = colorTag.text().trim();
              notas[headers[cellIndex]] = valor;
            }
          });
        }
      });
      
      const evaluacionesContinuas: Record<string, string> = {};
      let Ncontinuas = 0;
      const tablaEC = curso.find('.css-curso-card-tabla-notas-ec');

      // Primero, contamos los th que NO tienen la clase d-none
      tablaEC.find('th').each((index, thElement) => {
          const th = $(thElement);
          if (!th.hasClass('d-none')) {
              Ncontinuas++;
          }
      });

      // Luego, extraemos los valores de las evaluaciones continuas
      tablaEC.find('tr').each((rowIndex, row) => {
          if (rowIndex === 1) { // Asumiendo que la segunda fila (índice 1) tiene los valores
              $(row).find('td').each((cellIndex, cell) => {
                  const headerEC = tablaEC.find('th').eq(cellIndex).text().trim();
                  if (headerEC) {
                      evaluacionesContinuas[headerEC] = $(cell).text().trim();
                  }
              });
          }
      });
      
      cursosExtraidos.push({
        id: `curso_${index + 1}`,
        nombre: nombreCompleto,
        codigo,
        creditos: parseInt(creditos) || 0,
        tipo,
        docente,
        notasPrincipales: notas,
        cantidadContinuas: Ncontinuas,
        evaluacionesContinuas,
        promedioFinal: notas['PF'] || '0'
      });
    });

    console.log(`${cursosExtraidos.length} cursos extraídos correctamente.`);
    
    /*
    cursosExtraidos.forEach((curso, i) => {
      console.log(`  ${i + 1}. ${curso.nombre} - PF: ${curso.promedioFinal}`);
    });*/

    // ========== CALCULAR PROMEDIO PONDERADO ==========
  

    // ========== DEVOLVER DATOS ESTRUCTURADOS ==========
    return {
      success: true,
      usuario,
      timestamp: new Date().toISOString(),
      cantidadCursos: cursosExtraidos.length,
      cursos: cursosExtraidos,
      message: `Se extrajeron ${cursosExtraidos.length} cursos correctamente.`
    };
    
  } catch (error: any) {
    console.error('Error en Puppeteer:', error.message);
    
    if (error.message.includes('Timeout')) {
      throw new Error('El servidor de la intranet no respondió a tiempo.');
    }
    if (error.message.includes('Credenciales incorrectas')) {
      throw error;
    }
    throw new Error(`Error durante la extracción: ${error.message}`);
    
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador cerrado.');
    }
  }
}
