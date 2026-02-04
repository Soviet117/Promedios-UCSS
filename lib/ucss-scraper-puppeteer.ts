import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';

export async function obtenerNotasDesdeUCSS(usuario: string, password: string) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`🔄 Intento ${attempt} de ${MAX_RETRIES} para usuario: ${usuario}`);
    
    let browser: Browser | null = null;
    
    try {
      // CONFIGURACIÓN FIXED - Con "as any" para evitar error TypeScript
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
          '--disable-web-security'
        ]
      } as any);
      
      const page: Page = await browser.newPage();
      await page.setDefaultNavigationTimeout(40000);
      await page.setDefaultTimeout(40000);
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1366, height: 768 });
      
      const baseURL = 'https://intranet.ucss.edu.pe/ucss-intranet';
      
      console.log(`🌐 Intento ${attempt}: Navegando a la intranet...`);
      
      try {
        await page.goto(`${baseURL}/login/ingresar.aspx`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
        console.log(`✅ Intento ${attempt}: Navegación exitosa`);
      } catch (navError: any) {
        if (navError.message.includes('SSL') || navError.message.includes('certificate')) {
          console.log(`⚠️  Intento ${attempt}: Error SSL, continuando...`);
        } else {
          throw navError;
        }
      }
      
      await page.waitForSelector('input[name="txtUsuarioMail"]', { timeout: 10000 })
        .catch(() => { throw new Error('No se pudo cargar la página de login'); });
      
      await page.type('input[name="txtUsuarioMail"]', usuario);
      await page.type('input[name="txtPwd"]', password);
      
      console.log(`🔑 Intento ${attempt}: Enviando credenciales...`);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
        page.click('input[name="btnIngresar"]')
      ]);
      
      const pageContent = await page.content();
      if (pageContent.includes('Usuario o contraseña incorrectos')) {
        throw new Error('Credenciales incorrectas');
      }
      
      console.log(`✅ Intento ${attempt}: Login exitoso detectado.`);
      
      console.log(`📚 Intento ${attempt}: Navegando a notas...`);
      await page.goto(`${baseURL}/academico/notas.aspx`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      await page.waitForSelector('div.css-curso-card', { timeout: 15000 })
        .catch(() => {
          console.log('⚠️  No se encontraron cursos inmediatamente, continuando...');
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
        
        tablaEC.find('th').each((index, thElement) => {
          const th = $(thElement);
          if (!th.hasClass('d-none')) {
            Ncontinuas++;
          }
        });
        
        tablaEC.find('tr').each((rowIndex, row) => {
          if (rowIndex === 1) {
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
      
      console.log(`✅ Intento ${attempt}: ${cursosExtraidos.length} cursos extraídos.`);
      await browser.close();
      console.log(`✅ Intento ${attempt}: Navegador cerrado.`);
      
      return {
        success: true,
        usuario,
        timestamp: new Date().toISOString(),
        cantidadCursos: cursosExtraidos.length,
        cursos: cursosExtraidos,
        message: `Se extrajeron ${cursosExtraidos.length} cursos correctamente.`
      };
      
    } catch (error: any) {
      console.error(`❌ Intento ${attempt} fallido:`, error.message);
      lastError = error;
      
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.log(`Error cerrando navegador:`, closeError.message);
        }
      }
      
      if (attempt === MAX_RETRIES) {
        console.error(`💥 Todos los ${MAX_RETRIES} intentos fallaron`);
        break;
      }
      
      if (error.message.includes('Credenciales incorrectas')) {
        throw error;
      }
      
      const delay = RETRY_DELAY * Math.pow(1.5, attempt - 1);
      console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  const errorMessage = lastError?.message || 'Error desconocido';
  
  if (errorMessage.includes('SSL') || errorMessage.includes('certificate')) {
    throw new Error(`Error de conexión SSL con la intranet UCSS. Intenta nuevamente.`);
  } else if (errorMessage.includes('Timeout')) {
    throw new Error(`La intranet UCSS no respondió a tiempo. Intenta nuevamente.`);
  } else {
    throw new Error(`No se pudo conectar a la intranet UCSS. Error: ${errorMessage}`);
  }
}