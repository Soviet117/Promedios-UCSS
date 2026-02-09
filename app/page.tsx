'use client';

import { useState, useEffect } from 'react';
import CursoCard from './components/CursoCard';

interface Curso {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  tipo: string;
  docente: string;
  notasPrincipales: {
    EC?: string;
    E1?: string;
    E2?: string;
    E3?: string;
    EF?: string;
    PF?: string;
  };
  evaluacionesContinuas: Record<string, string>;
  cantidadContinuas?: number;
  promedioFinal: string;
}

// Tipos para el modo de cálculo
type ModoCalculo = 'ninguno' | 'habilitadas' | 'publicadas';

// ======================================================
// FUNCIÓN DE DATOS DE PRUEBA
// ======================================================

const generarDatosDePrueba = (): Curso[] => {
  return [
    {
      id: "curso_1",
      nombre: "EXPERIENCIA DE USUARIO Y USABILIDAD DEL SOFTWARE 686",
      codigo: "200297",
      creditos: 3,
      tipo: "O",
      docente: "GONZALEZ OLIVARES, JUAN",
      notasPrincipales: {
        EC: "",
        E1: "14.00",
        E2: "11.00",
        E3: "15.50",
        EF: "",
        PF: ""
      },
      evaluacionesContinuas: {
        EC1: "13.50",
        EC2: "17.00",
        EC3: "12.00",
        EC4: "",
        EC5: "",
        EC6: "",
        EC7: "",
        EC8: "",
        EC9: "",
        EC10: ""
      },
      cantidadContinuas: 6,
      promedioFinal: ""
    },
    {
      id: "curso_2",
      nombre: "INGENIERIA DE SOFTWARE 2 686",
      codigo: "200231",
      creditos: 3,
      tipo: "O",
      docente: "OCHOA CIEZA, GONZALO",
      notasPrincipales: {
        EC: "",
        E1: "17.00",
        E2: "15.50",
        E3: "",
        EF: "",
        PF: ""
      },
      evaluacionesContinuas: {
        EC1: "15.00",
        EC2: "16.50",
        EC3: "14.00",
        EC4: "17.00",
        EC5: "",
        EC6: "",
        EC7: "",
        EC8: "",
        EC9: "",
        EC10: ""
      },
      cantidadContinuas: 7,
      promedioFinal: ""
    },
    {
      id: "curso_3",
      nombre: "INTELIGENCIA DE NEGOCIOS Y ANALISIS DE DATOS 686",
      codigo: "200232",
      creditos: 3,
      tipo: "O",
      docente: "PEREZ MARTINEZ, CARLOS",
      notasPrincipales: {
        EC: "",
        E1: "19.00",
        E2: "17.50",
        E3: "18.50",
        EF: "12.00",
        PF: ""
      },
      evaluacionesContinuas: {
        EC1: "17.00",
        EC2: "18.50",
        EC3: "16.00",
        EC4: "19.00",
        EC5: "18.00",
        EC6: "20.00",
        EC7: "",
        EC8: "",
        EC9: "",
        EC10: ""
      },
      cantidadContinuas: 8,
      promedioFinal: ""
    },
    {
      id: "curso_4",
      nombre: "PROGRAMACIÓN AVANZADA 686",
      codigo: "200245",
      creditos: 4,
      tipo: "E",
      docente: "RODRIGUEZ LOPEZ, MARÍA",
      notasPrincipales: {
        EC: "",
        E1: "11.00",
        E2: "10.50",
        E3: "13.00",
        EF: "8.50",
        PF: ""
      },
      evaluacionesContinuas: {
        EC1: "10.00",
        EC2: "12.50",
        EC3: "11.00",
        EC4: "13.00",
        EC5: "",
        EC6: "",
        EC7: "",
        EC8: "",
        EC9: "",
        EC10: ""
      },
      cantidadContinuas: 6,
      promedioFinal: ""
    },
    {
      id: "curso_5",
      nombre: "ARQUITECTURA DE COMPUTADORAS 686",
      codigo: "200278",
      creditos: 4,
      tipo: "E",
      docente: "SANCHEZ DIAZ, RAÚL",
      notasPrincipales: {
        EC: "",
        E1: "15.50",
        E2: "13.00",
        E3: "14.50",
        EF: "18.50",
        PF: ""
      },
      evaluacionesContinuas: {
        EC1: "13.50",
        EC2: "14.00",
        EC3: "12.50",
        EC4: "15.00",
        EC5: "",
        EC6: "",
        EC7: "",
        EC8: "",
        EC9: "",
        EC10: ""
      },
      cantidadContinuas: 8,
      promedioFinal: ""
    }
  ];
};

// ======================================================
// FUNCIONES DE CÁLCULO MEJORADAS
// ======================================================

// Aquí cree la logica para poder calcular EC según el modo seleccionado
const calcularPromedioEC = (curso: Curso, modo: ModoCalculo): { valor: string, esCalculado: boolean } => {
  if (modo === 'ninguno') {
    return { valor: curso.notasPrincipales.EC || '', esCalculado: false };
  }

  const evaluaciones = curso.evaluacionesContinuas;
  const cantidadHabilitadas = curso.cantidadContinuas || 0;

  if (modo === 'habilitadas') {
    // Calculamos el promedio dividiendo entre continuas habilitadas
    let suma = 0;
    for (let i = 1; i <= cantidadHabilitadas; i++) {
      const key = `EC${i}`;
      const valor = evaluaciones[key];
      if (valor && valor.trim() !== '') {
        suma += parseFloat(valor);
      }
    }
    
    if (cantidadHabilitadas > 0) {
      return { 
        valor: (suma / cantidadHabilitadas).toFixed(2), 
        esCalculado: true 
      };
    }
    return { valor: '', esCalculado: false };
    
  } else if (modo === 'publicadas') {
    // Calculamos el promedio solo con las notas publicadas
    let suma = 0;
    let contador = 0;
    
    for (let i = 1; i <= cantidadHabilitadas; i++) {
      const key = `EC${i}`;
      const valor = evaluaciones[key];
      if (valor && valor.trim() !== '') {
        suma += parseFloat(valor);
        contador++;
      }
    }
    
    if (contador > 0) {
      return { 
        valor: (suma / contador).toFixed(2), 
        esCalculado: true 
      };
    }
    return { valor: '', esCalculado: false };
  }

  return { valor: '', esCalculado: false };
};

// Función para calcular PF
const calcularPromedioFinal = (curso: Curso, ecValor: string, ecEsCalculado: boolean): { valor: string, esCalculado: boolean } => {
 
  if (!ecValor || ecValor.trim() === '') {
    return { valor: curso.promedioFinal || '', esCalculado: false };
  }

  const ecNum = parseFloat(ecValor) || 0;
  const e1Num = parseFloat(curso.notasPrincipales.E1 || '0') || 0;
  const e2Num = parseFloat(curso.notasPrincipales.E2 || '0') || 0;
  const e3Num = parseFloat(curso.notasPrincipales.E3 || '0') || 0;
  const efNum = parseFloat(curso.notasPrincipales.EF || '0') || 0;

  // Fórmula: EC*20% + E1*10% + E2*20% + E3*20% + EF*30%
  const pf = (ecNum * 0.20) + (e1Num * 0.10) + (e2Num * 0.20) + (e3Num * 0.20) + (efNum * 0.30);
  
  return { 
    valor: pf.toFixed(2), 
    esCalculado: ecEsCalculado || !curso.notasPrincipales.PF 
  };
};

// Función para calcular Promedio Ponderado
const calcularPromedioPonderado = (cursos: Curso[]): string => {
  let sumaPonderada = 0;
  let creditosTotales = 0;
  let cursosConNota = 0;

  cursos.forEach(curso => {
    const pf = parseFloat(curso.notasPrincipales.PF || curso.promedioFinal || '0');
    const creditos = curso.creditos || 0;
    
    if (!isNaN(pf) && pf > 0 && creditos > 0) {
      sumaPonderada += pf * creditos;
      creditosTotales += creditos;
      cursosConNota++;
    }
  });

  if (creditosTotales > 0 && cursosConNota > 0) {
    return (sumaPonderada / creditosTotales).toFixed(2);
  }
  
  return '0.00';
};

const contarCursosDesaprobados = (cursos: Curso[]): number => {
  return cursos.filter(curso => {
    const pf = parseFloat(curso.notasPrincipales.PF || curso.promedioFinal || '0');
    return !isNaN(pf) && pf < 10.50;
  }).length;
};

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================

export default function HomePage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursosOriginales, setCursosOriginales] = useState<Curso[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modoPrueba, setModoPrueba] = useState(true);
  const [modoCalculo, setModoCalculo] = useState<ModoCalculo>('ninguno');

  // Efecto para recalcular cuando cambia el modo
  useEffect(() => {
    if (cursosOriginales.length > 0) {
      const cursosActualizados = cursosOriginales.map(curso => {
        const { valor: ecValor, esCalculado: ecEsCalculado } = calcularPromedioEC(curso, modoCalculo);
        const { valor: pfValor, esCalculado: pfEsCalculado } = calcularPromedioFinal(curso, ecValor, ecEsCalculado);
        
        return {
          ...curso,
          notasPrincipales: {
            ...curso.notasPrincipales,
            EC: ecValor,
            PF: pfValor
          },
          notasCalculadas: {
            ecCalculado: ecEsCalculado,
            pfCalculado: pfEsCalculado
          }
        };
      });
      
      setCursos(cursosActualizados);
    }
  }, [modoCalculo, cursosOriginales]);

  // Función para login con backend real
  const loginConBackendReal = async (usuario: string, password: string) => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await fetch('/api/login-ucss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          password: password.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok && datos.success) {
        setCursosOriginales(datos.cursos || []);
        setCursos(datos.cursos || []);
        setIsLoggedIn(true);
        setError(null);
        
        console.log('✅ Login exitoso!');
        console.log(`📚 ${datos.cantidadCursos} cursos encontrados`);
        return true;
      } else {
        setError(datos.error || 'Credenciales incorrectas o problema de conexión');
        setCursosOriginales([]);
        setCursos([]);
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión con el servidor');
      setCursosOriginales([]);
      setCursos([]);
      setIsLoggedIn(false);
      return false;
    } finally {
      setCargando(false);
    }
  };

  // Función para login con datos de prueba
  const loginConDatosDePrueba = (usuario: string) => {
    setCargando(true);
    
    setTimeout(() => {
      const datosPrueba = generarDatosDePrueba();
      setCursosOriginales(datosPrueba);
      setCursos(datosPrueba);
      setIsLoggedIn(true);
      setError(null);
      setCargando(false);
      
      console.log('🎭 Modo demo activado');
      console.log(`📚 ${datosPrueba.length} cursos de prueba cargados`);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!usuario.trim()) {
      setError('Por favor ingresa tu usuario');
      return;
    }

    if (!modoPrueba && !password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    if (modoPrueba) {
      loginConDatosDePrueba(usuario);
    } else {
      await loginConBackendReal(usuario, password);
    }
  };

  const handleLogout = () => {
    setUsuario('');
    setPassword('');
    setCursos([]);
    setCursosOriginales([]);
    setIsLoggedIn(false);
    setError(null);
    setModoCalculo('ninguno');
  };

  // Calcular estadísticas
  const calcularCreditosTotales = () => {
    return cursos.reduce((total, curso) => total + curso.creditos, 0);
  };

  const contarCursosAprobados = () => {
    return cursos.filter(curso => {
      const pf = parseFloat(curso.notasPrincipales.PF || curso.promedioFinal || '0');
      return !isNaN(pf) && pf >= 10.5;
    }).length;
  };

  const contarCursosDesaprobadosComponente = () => {
    return contarCursosDesaprobados(cursos);
  };

  const calcularPromedioPonderadoComponente = () => {
    return calcularPromedioPonderado(cursos);
  };

  // Toggle entre modo prueba y real
  const toggleModoPrueba = () => {
    setModoPrueba(!modoPrueba);
    setError(null);
    setPassword('');
  };

  // Resetear para modo demo
  const usarModoDemo = () => {
    setUsuario('2023102302');
    setPassword('');
    setModoPrueba(true);
    setError(null);
  };

  if (isLoggedIn && cursos.length > 0) {
    const promedioPonderado = calcularPromedioPonderadoComponente();
    const cursosDesaprobados = contarCursosDesaprobadosComponente();

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Header con estadísticas */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                📚 {modoPrueba ? 'MODO DEMO - ' : ''}Mis Cursos UCSS
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <p className="text-gray-600">
                  Usuario: <span className="font-semibold">{usuario}</span>
                </p>
                {modoPrueba && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    🎭 Modo Demo Activo
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              {modoPrueba && (
                <button
                  onClick={toggleModoPrueba}
                  className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition"
                >
                  🔄 Cambiar a modo real
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Selectores de modo de cálculo */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🧮 Modo de Cálculo de Promedio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setModoCalculo('ninguno')}
                className={`p-4 rounded-lg border-2 transition ${
                  modoCalculo === 'ninguno'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">Sin calcular</div>
                <div className="text-sm text-gray-600 mt-1">
                  Mostrar solo notas publicadas en intranet
                </div>
              </button>

              <button
                onClick={() => setModoCalculo('habilitadas')}
                className={`p-4 rounded-lg border-2 transition ${
                  modoCalculo === 'habilitadas'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">Por continuas habilitadas</div>
                <div className="text-sm text-gray-600 mt-1">
                  Divide entre todas las EC habilitadas (vacías = 0.0)
                </div>
              </button>

              <button
                onClick={() => setModoCalculo('publicadas')}
                className={`p-4 rounded-lg border-2 transition ${
                  modoCalculo === 'publicadas'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">Por continuas publicadas</div>
                <div className="text-sm text-gray-600 mt-1">
                  Divide solo entre EC con nota publicada
                </div>
              </button>
            </div>
            
            {modoCalculo !== 'ninguno' && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  ℹ️ Modo activo: <strong>
                    {modoCalculo === 'habilitadas' ? 'Cálculo por continuas habilitadas' : 'Cálculo por continuas publicadas'}
                  </strong>
                  {modoCalculo === 'habilitadas' && ' - Las EC sin nota se consideran como 0.0 (gris)'}
                  {modoCalculo === 'publicadas' && ' - Solo se muestran las EC con nota publicada'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Notas calculadas aparecen en color gris más claro para diferenciarlas de las originales.
                </p>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
            {/* Cursos totales */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {cursos.length}
              </div>
              <div className="text-sm text-gray-600">Cursos totales</div>
            </div>
            
            {/* Promedio ponderado */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className={`text-2xl md:text-3xl font-bold ${
                parseFloat(promedioPonderado) >= 14 ? 'text-green-600' :
                parseFloat(promedioPonderado) >= 11 ? 'text-blue-600' :
                'text-red-600'
              }`}>
                {promedioPonderado}
              </div>
              <div className="text-sm text-gray-600">Promedio ponderado</div>
              <div className="text-xs text-gray-500 mt-1">
                {(calcularCreditosTotales())} créditos
              </div>
            </div>
            
            {/* Créditos totales */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">
                {calcularCreditosTotales()}
              </div>
              <div className="text-sm text-gray-600">Créditos totales</div>
            </div>
            
            {/* Cursos aprobados */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl md:text-3xl font-bold text-green-600">
                {contarCursosAprobados()}
              </div>
              <div className="text-sm text-gray-600">Cursos aprobados</div>
              <div className="text-xs text-gray-500 mt-1">
                ≥ 10.50
              </div>
            </div>
            
            {/* Cursos desaprobados */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl md:text-3xl font-bold text-red-600">
                {cursosDesaprobados}
              </div>
              <div className="text-sm text-gray-600">Cursos desaprobados</div>
              <div className="text-xs text-gray-500 mt-1">
                &lt; 10.50
              </div>
            </div>
          </div>

          {/* Nota de demo */}
          {modoPrueba && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600">🎭</div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Modo Demo Activo</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Estás viendo datos de prueba. Para ver tus datos reales, haz clic en "Cambiar a modo real" y usa tus credenciales de la intranet UCSS.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid de cursos responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cursos.map((curso) => (
            <CursoCard
              key={curso.id}
              id={curso.id}
              nombre={curso.nombre}
              codigo={curso.codigo}
              creditos={curso.creditos}
              tipo={curso.tipo}
              docente={curso.docente}
              notasPrincipales={curso.notasPrincipales}
              evaluacionesContinuas={curso.evaluacionesContinuas}
              cantidadContinuas={curso.cantidadContinuas}
              modoCalculo={modoCalculo}
            />
          ))}
        </div>

        {cursos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron cursos
            </h3>
            <p className="text-gray-500">
              Intenta iniciar sesión nuevamente
            </p>
          </div>
        )}
      </div>
    );
  }

  // Si no está logueado, mostrar formulario (mantener igual)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Switch entre modo demo y real */}
        <div className="mb-6 bg-white rounded-xl shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {modoPrueba ? '🎭 Modo Demo' : '🔐 Modo Real'}
              </h2>
              <p className="text-gray-600 text-sm">
                {modoPrueba 
                  ? 'Prueba la aplicación con datos de ejemplo' 
                  : 'Conéctate a la intranet UCSS con tus credenciales reales'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={usarModoDemo}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
              >
                Probar Modo Demo
              </button>
              <button
                onClick={toggleModoPrueba}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
              >
                {modoPrueba ? 'Cambiar a Modo Real' : 'Cambiar a Modo Demo'}
              </button>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <div className="mb-6 md:mb-8 bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📋 Información importante</h2>
          {modoPrueba ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-600 mt-0.5">🎭</span>
                <div>
                  <h3 className="font-semibold text-yellow-800">Modo Demo Activado</h3>
                  <p className="text-yellow-700 text-sm">
                    Puedes usar cualquier usuario y dejar la contraseña vacía. Se cargarán datos de prueba.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <p className="text-gray-600">Prueba todas las funcionalidades sin credenciales reales</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <p className="text-gray-600">Datos de ejemplo realistas para testing</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                No debes estar logueado en la intranet UCSS en otro navegador
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Puedes calcular tu promedio general automáticamente
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Se muestran todos los tipos de promedios y evaluaciones
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠</span>
                Tus credenciales se usan solo para acceder a la intranet, no se almacenan
              </li>
            </ul>
          )}
        </div>

        {/* Formulario de login */}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {modoPrueba ? '🎭 Modo Demo' : '🔐 Login UCSS'}
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Indicador de modo */}
          <div className={`mb-6 p-3 rounded-lg text-center font-medium ${
            modoPrueba 
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {modoPrueba 
              ? 'Usando datos de prueba - No se requiere conexión' 
              : 'Conectándose a la intranet UCSS - Credenciales reales requeridas'
            }
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario {modoPrueba && '(Cualquiera)'}
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={modoPrueba ? "Ej: demo2024" : "Ej: 2023102302"}
                required
                disabled={cargando}
              />
            </div>

            {!modoPrueba && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu contraseña de intranet"
                  required
                  disabled={cargando}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                cargando
                  ? 'bg-gray-400 cursor-not-allowed'
                  : modoPrueba
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {cargando 
                ? (modoPrueba ? '🎭 Cargando demo...' : '🔐 Conectando...') 
                : (modoPrueba ? '🎭 Probar con datos demo' : '🚀 Obtener mis notas')
              }
            </button>
          </form>

          {/* Instrucciones */}
          <div className="mt-8 text-sm text-gray-600">
            <h3 className="font-bold mb-2">ℹ️ {modoPrueba ? 'Cómo usar el demo:' : 'Cómo funciona:'}</h3>
            {modoPrueba ? (
              <ul className="list-disc pl-5 space-y-1">
                <li>Ingresa cualquier usuario (puedes dejar contraseña vacía)</li>
                <li>Se cargarán 5 cursos de ejemplo con datos realistas</li>
                <li>Puedes probar todas las funcionalidades</li>
                <li>Para datos reales, cambia a "Modo Real"</li>
              </ul>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                <li>Envía tus credenciales al servidor de forma segura</li>
                <li>El servidor simula un navegador y se conecta a la intranet UCSS</li>
                <li>Hace login automático con tu usuario y contraseña</li>
                <li>Si el login es exitoso, extrae todas tus notas</li>
                <li>Muestra tus cursos en una interfaz limpia y responsiva</li>
              </ul>
            )}
            <p className="mt-3 text-xs bg-yellow-50 p-2 rounded">
              ⚠️ <strong>Nota:</strong> {modoPrueba 
                ? 'Los datos mostrados son de ejemplo para testing.' 
                : 'Esta es una herramienta no oficial para consultar notas de la UCSS.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}