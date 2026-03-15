# Calculadora de Promedios UCSS 🎓

[![Despliegue en Render](https://img.shields.io/badge/Desplegado%20en-Render-%2346a3ff?style=for-the-badge)](https://promedios-ucss.onrender.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Software Libre](https://img.shields.io/badge/Software-Libre-%23017C5B?style=for-the-badge)](https://es.wikipedia.org/wiki/Software_libre)

Una herramienta web desarrollada para los estudiantes de la **Universidad Católica Sedes Sapientiae (UCSS)** que automatiza el cálculo del promedio ponderado, facilitando la planificación académica.

**Enlace de la aplicación:** 🌐 [https://promedios-ucss.onrender.com/](https://promedios-ucss.onrender.com/)

> ⚠️ **Aviso Importante:** Esta es una herramienta **NO OFICIAL** creada por un estudiante. No está afiliada, respaldada ni autorizada por la Universidad Católica Sedes Sapientiae (UCSS).

## ✨ Características Principales

*   🔐 **Login Seguro**: Conexión directa y temporal con el portal de la intranet UCSS. **Tus credenciales NUNCA se almacenan** en ningún servidor externo.
*   📊 **Cálculo Automatizado**: Extrae tus notas y calcula instantáneamente tu promedio ponderado final y por curso.
*   📈 **Análisis Académico**: Te muestra cuánto necesitas en tu próximo examen para alcanzar la nota mínima aprobatoria.
*   🚀 **Rápida y Eficiente**: Olvídate de las planillas de Excel y los cálculos manuales propensos a errores.
*   🎨 **Interfaz Intuitiva**: Diseñada pensando en la experiencia del estudiante.

## 🛠️ Tecnologías Utilizadas

*   **Frontend & Backend**: [Next.js 16](https://nextjs.org/) (React, TypeScript, App Router)
*   **Estilización**: [Tailwind CSS](https://tailwindcss.com/)
*   **Web Scraping**: [Puppeteer](https://pptr.dev/) (para la conexión segura con la intranet)
*   **Parsing HTML**: [Cheerio](https://cheerio.js.org/)
*   **Hospedaje**: [Render](https://render.com/) (Free Tier)

## 🚀 Cómo Usarlo (Para Estudiantes)

1.  Visita la aplicación: [https://promedios-ucss.onrender.com/](https://promedios-ucss.onrender.com/)
2.  Ingresa tu **usuario** y **contraseña** de la intranet UCSS (los mismos que usas en `intranet.ucss.edu.pe`).
3.  Haz clic en "Calcular Promedio".
4.  ¡Listo! Revisa tus notas, promedios por curso y el análisis de tu rendimiento.

**Tu sesión es efímera.** La aplicación actúa como un "puente" para consultar la información una sola vez y presentártela. Al cerrar la pestaña, toda la información se descarta.

## 🔒 Filosofía de Privacidad y Seguridad

Creo firmemente en el **software libre y transparente**. Este proyecto se basa en principios éticos:

*   **Cero Almacenamiento**: No existe una base de datos. Tus credenciales se usan únicamente para iniciar sesión en el portal oficial de UCSS durante la solicitud y se desechan inmediatamente después.
*   **Transparencia**: El código es abierto. Puedes revisar exactamente qué hace la aplicación en este repositorio.
*   **Propósito Educativo**: Busca empoderar a los estudiantes con información clara sobre su situación académica, no recopilar datos.

## 🤝 Contribuciones
Las sugerencias, reportes de errores (issues) y mejoras (pull requests) son bienvenidas. Si encuentras un bug o tienes una idea para mejorar la herramienta, no dudes en abrir un issue en GitHub.

Creado con 🧠 y ☕ por  [Soviet117](https://github.com/Soviet117)

## 👨‍💻 Desarrollo Técnico

Si eres desarrollador y quieres ejecutar el proyecto localmente:

```bash
# 1. Clona el repositorio
git clone https://github.com/Soviet117/Promedios-UCSS.git
cd Promedios-UCSS

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
