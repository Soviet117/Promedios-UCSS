import { FC } from 'react';

interface CursoCardProps {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  tipo: string;
  docente: string;
  // Notas principales
  notasPrincipales: {
    EC?: string;
    E1?: string;
    E2?: string;
    E3?: string;
    EF?: string;
    PF?: string;
  };
  // Evaluaciones continuas
  evaluacionesContinuas: Record<string, string>;
  // Cantidad de EC habilitadas
  cantidadContinuas?: number;
  // Modo de cálculo
  modoCalculo?: 'ninguno' | 'habilitadas' | 'publicadas';
  className?: string;
}

const CursoCard: FC<CursoCardProps> = ({ 
  nombre,
  codigo,
  creditos,
  tipo,
  docente,
  notasPrincipales,
  evaluacionesContinuas,
  cantidadContinuas = 6,
  modoCalculo = 'ninguno',
  className = ''
}) => {
  
  // Función para obtener las EC a mostrar según el modo
  const obtenerEvaluacionesMostrar = () => {
    const evaluaciones = [];
    
    if (modoCalculo === 'publicadas') {
      // Modo publicadas: solo las que tienen valor
      for (let i = 1; i <= cantidadContinuas; i++) {
        const key = `EC${i}`;
        const valor = evaluacionesContinuas[key];
        if (valor && valor.trim() !== '') {
          evaluaciones.push({
            label: key,
            value: valor,
            isPublicada: true,
            esCalculada: false
          });
        }
      }
    } else {
      // Modo ninguno o habilitadas: mostrar todas las habilitadas
      for (let i = 1; i <= cantidadContinuas; i++) {
        const key = `EC${i}`;
        const valor = evaluacionesContinuas[key];
        const tieneValor = valor && valor.trim() !== '';
        
        if (modoCalculo === 'habilitadas') {
          // En modo habilitadas, las vacías se muestran como "0.0" (calculadas)
          evaluaciones.push({
            label: key,
            value: tieneValor ? valor : '0.0',
            isPublicada: tieneValor,
            esCalculada: !tieneValor // Las vacías son calculadas
          });
        } else {
          // Modo ninguno: mostrar "--" si están vacías
          evaluaciones.push({
            label: key,
            value: tieneValor ? valor : '--',
            isPublicada: tieneValor,
            esCalculada: false
          });
        }
      }
    }
    
    return evaluaciones;
  };

  const evaluacionesMostrar = obtenerEvaluacionesMostrar();

  // Función para determinar el color de una nota
  const obtenerColorNota = (notaStr: string): string => {
    const nota = parseFloat(notaStr);
    if (isNaN(nota)) return 'text-gray-500';
    
    if (nota < 10.50) {
      return 'text-red-600 font-bold';
    } else if (nota >= 17) {
      return 'text-black';
    } else if (nota >= 14) {
      return 'text-black';
    } else if (nota >= 11) {
      return 'text-black';
    }
    return 'text-gray-800';
  };

  // Función para determinar si una nota es calculada
  const esNotaCalculada = (valor: string, esCalculada: boolean): boolean => {
    // Si es "0.0" en modo habilitadas y fue calculada, o si es valor vacío
    return esCalculada || valor === '0.0';
  };

  // Obtener color para nota calculada (gris más claro)
  const obtenerColorCalculada = (): string => {
    return 'text-gray-400'; // Gris más claro para notas calculadas
  };

  // Obtener color para EC (depende si es calculada o no)
  const obtenerColorEC = (): string => {
    const ecValor = notasPrincipales?.EC || '';
    if (modoCalculo !== 'ninguno' && ecValor) {
      // Si estamos en modo cálculo y hay valor de EC, es calculada
      return 'text-gray-400'; // Gris para EC calculada
    }
    return obtenerColorNota(ecValor);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6 ${className}`}>
      {/* Encabezado del curso */}
      <div className="mb-4 bg-blue-100 p-3 rounded-lg">
        <h2 className="text-lg font-bold text-black mb-2">{nombre}</h2>
        <div className="flex flex-wrap gap-4 mb-2 text-sm">
          <p className="text-black">
            <span className="font-semibold">CÓD.: </span> {codigo}
          </p>
          <p className="text-black">
            <span className="font-semibold">CRÉD.: </span> {creditos}
          </p>
          <p className="text-black">
            <span className="font-semibold">TIPO: </span> {tipo}
          </p>
          {cantidadContinuas > 0 && (
            <p className="text-black">
              <span className="font-semibold">EC habilitadas: </span> {cantidadContinuas}
            </p>
          )}
        </div>
        <p className="text-black text-sm">
          <span className="font-semibold">DOCENTE:</span> {docente}
        </p>
      </div>

      {/* Indicador de modo activo */}
      {modoCalculo !== 'ninguno' && (
        <div className={`mb-3 p-2 rounded text-xs ${
          modoCalculo === 'habilitadas' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-purple-50 text-purple-700 border border-purple-200'
        }`}>
          {modoCalculo === 'habilitadas' 
            ? '🧮 Calculado por continuas habilitadas (vacías = 0.0 en gris)' 
            : '🧮 Calculado por continuas publicadas'}
        </div>
      )}

      {/* Tabla de notas principales */}
      <div className="mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-green-100">
                <th className="border border-gray-300 py-2 px-2 text-sm text-gray-700">EC [20%]</th>
                <th className="border border-gray-300 py-2 px-2 text-sm text-gray-700">E1 [10%]</th>
                <th className="border border-gray-300 py-2 px-2 text-sm text-gray-700">E2 [20%]</th>
                <th className="border border-gray-300 py-2 px-2 text-sm text-gray-700">E3 [20%]</th>
                <th className="border border-gray-300 py-2 px-2 text-sm text-gray-700">EF [30%]</th>
                <th className="border border-gray-300 py-2 px-2 text-sm text-gray-700">PF</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* EC */}
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && notasPrincipales?.EC 
                    ? obtenerColorCalculada() 
                    : obtenerColorEC()
                }`}>
                  {notasPrincipales?.EC || '--'}
                  {modoCalculo !== 'ninguno' && notasPrincipales?.EC && (
                    <div className="text-xs text-gray-500">calc</div>
                  )}
                </td>
                
                {/* E1 */}
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.E1
                    ? 'text-gray-400' // Gris para E1 calculada como 0.0
                    : obtenerColorNota(notasPrincipales?.E1 || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E1 
                    ? '0.0'
                    : (notasPrincipales?.E1 || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E1 && (
                    <div className="text-xs text-gray-500">calc</div>
                  )}
                </td>
                
                {/* E2 */}
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.E2
                    ? 'text-gray-400' // Gris para E2 calculada como 0.0
                    : obtenerColorNota(notasPrincipales?.E2 || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E2 
                    ? '0.0'
                    : (notasPrincipales?.E2 || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E2 && (
                    <div className="text-xs text-gray-500">calc</div>
                  )}
                </td>
                
                {/* E3 */}
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.E3
                    ? 'text-gray-400' // Gris para E3 calculada como 0.0
                    : obtenerColorNota(notasPrincipales?.E3 || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E3 
                    ? '0.0'
                    : (notasPrincipales?.E3 || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E3 && (
                    <div className="text-xs text-gray-500">calc</div>
                  )}
                </td>
                
                {/* EF */}
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.EF
                    ? 'text-gray-400' // Gris para EF calculada como 0.0
                    : obtenerColorNota(notasPrincipales?.EF || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.EF 
                    ? '0.0'
                    : (notasPrincipales?.EF || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.EF && (
                    <div className="text-xs text-gray-500">calc</div>
                  )}
                </td>
                
                {/* PF */}
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold text-lg bg-gray-50 ${
                  modoCalculo !== 'ninguno' && notasPrincipales?.PF
                    ? 'text-gray-400' // Gris para PF calculado
                    : obtenerColorNota(notasPrincipales?.PF || '')
                }`}>
                  {notasPrincipales?.PF || '--'}
                  {modoCalculo !== 'ninguno' && notasPrincipales?.PF && (
                    <div className="text-xs text-gray-500">calc</div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de evaluaciones continuas */}
      {cantidadContinuas > 0 && evaluacionesMostrar.length > 0 && (
        <div className="mb-2">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  {evaluacionesMostrar.map((ec) => (
                    <th 
                      key={`header-${ec.label}`}
                      className={`border border-gray-300 py-2 px-2 text-sm font-semibold ${
                        ec.esCalculada ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {ec.label}
                      {ec.esCalculada && <span className="text-xs text-gray-500 block">calc</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {evaluacionesMostrar.map((ec) => (
                    <td 
                      key={`value-${ec.label}`}
                      className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold ${
                        ec.esCalculada ? 'text-gray-400 bg-gray-50' :
                        obtenerColorNota(ec.value)
                      }`}
                    >
                      {ec.value}
                      {ec.esCalculada && <div className="text-xs text-gray-500">calc</div>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-1 italic">
            {modoCalculo === 'ninguno' && (
              <>
                {cantidadContinuas} EC habilitadas • {
                  Object.values(evaluacionesContinuas).filter(val => val && val.trim() !== '').length
                } con nota registrada
              </>
            )}
            {modoCalculo === 'habilitadas' && (
              <>
                Mostrando {cantidadContinuas} EC habilitadas • 
                {evaluacionesMostrar.filter(ec => !ec.esCalculada).length} con nota • 
                {evaluacionesMostrar.filter(ec => ec.esCalculada).length} calculadas (0.0)
              </>
            )}
            {modoCalculo === 'publicadas' && (
              <>
                Mostrando {evaluacionesMostrar.length} EC con nota publicada
              </>
            )}
          </p>
        </div>
      )}

    </div>
  );
};

export default CursoCard;