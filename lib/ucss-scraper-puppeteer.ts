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
      // CONFIGURACIÓN ESPECÍFICA PARA RENDER
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
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--window-size=1920,1080'
        ],

        timeout: 60000
      });
      
      const page: Page = await browser.newPage();
      await page.setDefaultNavigationTimeout(60000); // Aumentado para Render
      await page.setDefaultTimeout(60000); // Aumentado para Render
      
      // User-Agent más actualizado
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Configurar request interception para evitar recursos innecesarios
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        // Bloquear recursos innecesarios para mayor velocidad
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });
      
      const baseURL = 'https://intranet.ucss.edu.pe/ucss-intranet';
      
      console.log(`🌐 Intento ${attempt}: Navegando a la intranet...`);
      
      try {
        await page.goto(`${baseURL}/login/ingresar.aspx`, {
          waitUntil: 'networkidle0',
          timeout: 45000
        });
        console.log(`✅ Intento ${attempt}: Navegación exitosa`);
      } catch (navError: any) {
        console.log(`⚠️  Intento ${attempt}: Error de navegación: ${navError.message}`);
        // Intentar con waitUntil más relajado
        await page.goto(`${baseURL}/login/ingresar.aspx`, {
          waitUntil: 'domcontentloaded',
          timeout: 45000
        });
      }
      
      // Esperar dinámicamente por los campos de login
      const loginFieldsLoaded = await Promise.race([
        page.waitForSelector('input[name="txtUsuarioMail"]', { timeout: 15000 }),
        page.waitForSelector('input[type="text"]', { timeout: 15000 }),
        page.waitForSelector('input[id*="usuario"]', { timeout: 15000 })
      ]).catch(() => null);
      
      if (!loginFieldsLoaded) {
        // Verificar si ya estamos logueados o hay error
        const pageContent = await page.content();
        if (pageContent.includes('Usuario o contraseña incorrectos')) {
          throw new Error('Credenciales incorrectas');
        }
        throw new Error('No se pudo cargar la página de login');
      }
      
      // Intentar diferentes selectores para usuario
      try {
        await page.type('input[name="txtUsuarioMail"]', usuario);
      } catch {
        await page.type('input[type="text"]', usuario);
      }
      
      // Intentar diferentes selectores para contraseña
      try {
        await page.type('input[name="txtPwd"]', password);
      } catch {
        await page.type('input[type="password"]', password);
      }
      
      console.log(`🔑 Intento ${attempt}: Enviando credenciales...`);
      
      // Hacer click y esperar navegación con múltiples estrategias
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 })
          .catch(() => page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 })),
        page.click('input[name="btnIngresar"], input[type="submit"], button[type="submit"]')
          .catch(() => page.keyboard.press('Enter'))
      ]).catch(() => {
        console.log('⚠️  Navegación no detectada, continuando...');
      });
      
      // Esperar un momento para que cargue la página
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const pageContent = await page.content();
      if (pageContent.includes('Usuario o contraseña incorrectos') || 
          pageContent.includes('contraseña incorrecta') ||
          pageContent.includes('Credenciales inválidas')) {
        throw new Error('Credenciales incorrectas');
      }
      
      console.log(`✅ Intento ${attempt}: Login exitoso detectado.`);
      
      console.log(`📚 Intento ${attempt}: Navegando a notas...`);
      await page.goto(`${baseURL}/academico/notas.aspx`, {
        waitUntil: 'networkidle0',
        timeout: 45000
      }).catch(async () => {
        await page.goto(`${baseURL}/academico/notas.aspx`, {
          waitUntil: 'domcontentloaded',
          timeout: 45000
        });
      });
      
      // Esperar dinámicamente por los cursos
      await Promise.race([
        page.waitForSelector('div.css-curso-card', { timeout: 20000 }),
        page.waitForSelector('.card', { timeout: 20000 }),
        page.waitForSelector('table', { timeout: 20000 }),
        await new Promise(resolve => setTimeout(resolve, 3000)) // Esperar 5 segundos como máximo
      ]);
      
      const notasHtml = await page.content();
      const $ = cheerio.load(notasHtml);
      const cursosExtraidos: any[] = [];
      
      // Buscar cursos con múltiples selectores
      const cursoSelectors = ['div.css-curso-card', '.card', 'div[class*="curso"]', 'div[class*="materia"]'];
      
      for (const selector of cursoSelectors) {
        const cursos = $(selector);
        if (cursos.length > 0) {
          console.log(`✅ Encontrados ${cursos.length} cursos con selector: ${selector}`);
          
          cursos.each((index, element) => {
            const curso = $(element);
            
            // Extraer nombre del curso
            let nombreCompleto = '';
            const nombreSelectors = ['b', 'strong', 'h3', 'h4', '.nombre-curso', '.curso-nombre'];
            for (const nombreSelector of nombreSelectors) {
              const nombreElement = curso.find(nombreSelector).first();
              if (nombreElement.text().trim()) {
                nombreCompleto = nombreElement.text().trim();
                break;
              }
            }
            
            // Extraer información del curso (código, créditos, tipo)
            const infoItems = curso.find('p, span, div');
            let codigo = '', creditos = '', tipo = '';
            
            infoItems.each((i, elem) => {
              const texto = $(elem).text();
              if (texto.includes('CÓD.:') || texto.includes('COD:')) {
                codigo = texto.split(/CÓD\.?:/)[1]?.trim().split(/\s+/)[0] || '';
              }
              if (texto.includes('CRÉD.:') || texto.includes('CRED:')) {
                creditos = texto.split(/CRÉD\.?:/)[1]?.trim().split(/\s+/)[0] || '';
              }
              if (texto.includes('TIPO:') || texto.includes('Tipo:')) {
                tipo = texto.split(/TIPO:?/)[1]?.trim();
              }
            });
            
            // Extraer docente
            let docente = '';
            const docenteSelectors = ['p', 'span', 'div'];
            for (const docSelector of docenteSelectors) {
              const docElement = curso.find(docSelector);
              docElement.each((i, elem) => {
                const texto = $(elem).text();
                if (texto.includes('DOCENTE:') || texto.includes('Docente:')) {
                  docente = texto.replace(/DOCENTE:?/i, '').trim();
                }
              });
              if (docente) break;
            }
            
            // Buscar tabla de notas
            const notas: Record<string, string> = {};
            const tablaSelectors = ['table', '.table', '.css-curso-card-tabla-notas'];
            
            for (const tablaSelector of tablaSelectors) {
              const tablaPrincipal = curso.find(tablaSelector);
              if (tablaPrincipal.length > 0) {
                tablaPrincipal.find('tr').each((rowIndex, row) => {
                  if (rowIndex === 1) { // Segunda fila (después de headers)
                    const celdas = $(row).find('td, th');
                    const headers = ['EC', 'E1', 'E2', 'E3', 'EF', 'PF'];
                    
                    celdas.each((cellIndex, cell) => {
                      if (headers[cellIndex]) {
                        let valor = $(cell).text().trim();
                        const colorTag = $(cell).find('font, span, b, strong');
                        if (colorTag.length) valor = colorTag.text().trim();
                        notas[headers[cellIndex]] = valor;
                      }
                    });
                  }
                });
                break;
              }
            }
            
            // Buscar evaluaciones continuas
            const evaluacionesContinuas: Record<string, string> = {};
            let Ncontinuas = 0;
            
            // Buscar cualquier tabla adicional
            const tablas = curso.find('table');
            if (tablas.length > 1) {
              const segundaTabla = tablas.eq(1);
              const headersEC = segundaTabla.find('th');
              Ncontinuas = headersEC.filter((i, el) => !$(el).hasClass('d-none')).length;
              
              segundaTabla.find('tr').each((rowIndex, row) => {
                if (rowIndex === 1) {
                  $(row).find('td').each((cellIndex, cell) => {
                    const headerEC = headersEC.eq(cellIndex).text().trim();
                    if (headerEC) {
                      evaluacionesContinuas[headerEC] = $(cell).text().trim();
                    }
                  });
                }
              });
            }
            
            // Solo agregar si tiene nombre
            if (nombreCompleto) {
              cursosExtraidos.push({
                id: `curso_${cursosExtraidos.length + 1}`,
                nombre: nombreCompleto,
                codigo: codigo || `CURSO-${cursosExtraidos.length + 1}`,
                creditos: parseInt(creditos) || 0,
                tipo: tipo || 'Regular',
                docente: docente || 'No asignado',
                notasPrincipales: Object.keys(notas).length > 0 ? notas : { 
                  EC: 'N/A', E1: 'N/A', E2: 'N/A', E3: 'N/A', EF: 'N/A', PF: '0' 
                },
                cantidadContinuas: Ncontinuas,
                evaluacionesContinuas: Object.keys(evaluacionesContinuas).length > 0 ? evaluacionesContinuas : {},
                promedioFinal: notas['PF'] || '0'
              });
            }
          });
          
          break; // Salir del loop si encontramos cursos
        }
      }
      
      if (cursosExtraidos.length === 0) {
        console.log('⚠️  No se encontraron cursos con los selectores usuales, intentando extracción manual...');
        // Extracción alternativa si no se encuentran los elementos esperados
        const allText = $('body').text();
        if (allText.includes('notas') || allText.includes('curso') || allText.includes('materia')) {
          // Agregar un curso genérico como fallback
          cursosExtraidos.push({
            id: 'curso_1',
            nombre: 'Cursos detectados (estructura no estándar)',
            codigo: 'GEN-001',
            creditos: 0,
            tipo: 'No identificado',
            docente: 'No identificado',
            notasPrincipales: { EC: 'N/A', E1: 'N/A', E2: 'N/A', E3: 'N/A', EF: 'N/A', PF: 'N/A' },
            cantidadContinuas: 0,
            evaluacionesContinuas: {},
            promedioFinal: 'N/A'
          });
        }
      }
      
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
          console.log(`⚠️  Error cerrando navegador:`, closeError);
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
  
  // Mensajes de error más específicos
  if (errorMessage.includes('SSL') || errorMessage.includes('certificate')) {
    throw new Error(`Error de certificado SSL con la intranet UCSS. Esto es común en Render.`);
  } else if (errorMessage.includes('Timeout') || errorMessage.includes('timeout')) {
    throw new Error(`La intranet UCSS no respondió a tiempo. Intenta nuevamente en un momento de menor tráfico.`);
  } else if (errorMessage.includes('navegador') || errorMessage.includes('Puppeteer')) {
    throw new Error(`Error de configuración del navegador en el servidor.`);
  } else {
    throw new Error(`Error al conectar con la intranet UCSS: ${errorMessage}`);
  }
}