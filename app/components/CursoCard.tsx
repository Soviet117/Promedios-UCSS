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
    if (modoCalculo === 'ninguno') {
      // Modo normal: mostrar todas las EC habilitadas, con "--" si están vacías
      const evaluaciones = [];
      for (let i = 1; i <= cantidadContinuas; i++) {
        const key = `EC${i}`;
        const valor = evaluacionesContinuas[key];
        evaluaciones.push({
          label: key,
          value: valor && valor.trim() !== '' ? valor : '--',
          isPublicada: valor && valor.trim() !== ''
        });
      }
      return evaluaciones;
    } else if (modoCalculo === 'habilitadas') {
      // Mostrar todas las habilitadas, pero vacías como "0.0" en vez de "--"
      const evaluaciones = [];
      for (let i = 1; i <= cantidadContinuas; i++) {
        const key = `EC${i}`;
        const valor = evaluacionesContinuas[key];
        evaluaciones.push({
          label: key,
          value: valor && valor.trim() !== '' ? valor : '0.0',
          isPublicada: valor && valor.trim() !== ''
        });
      }
      return evaluaciones;
    } else if (modoCalculo === 'publicadas') {
      // Mostrar solo las que tienen nota publicada
      const evaluaciones = [];
      for (let i = 1; i <= cantidadContinuas; i++) {
        const key = `EC${i}`;
        const valor = evaluacionesContinuas[key];
        if (valor && valor.trim() !== '') {
          evaluaciones.push({
            label: key,
            value: valor,
            isPublicada: true
          });
        }
      }
      return evaluaciones;
    }
    return [];
  };

  const evaluacionesMostrar = obtenerEvaluacionesMostrar();

  // Obtener color para la nota PF
  const obtenerColorPF = (pf: string) => {
    const nota = parseFloat(pf);
    if (isNaN(nota)) return 'text-gray-500';
    if (nota >= 17) return 'text-green-600';
    if (nota >= 14) return 'text-blue-600';
    if (nota >= 11) return 'text-orange-600';
    return 'text-red-600';
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
            ? '🧮 Calculado por continuas habilitadas (vacías = 0.0)' 
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
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && notasPrincipales?.EC 
                    ? 'bg-yellow-50 text-gray-800' 
                    : 'text-gray-800'
                }`}>
                  {notasPrincipales?.EC || '--'}
                </td>
                <td className="border border-gray-300 py-2 px-2 text-sm text-center font-bold text-gray-800">
                  {notasPrincipales?.E1 || '--'}
                </td>
                <td className="border border-gray-300 py-2 px-2 text-sm text-center font-bold text-gray-800">
                  {notasPrincipales?.E2 || '--'}
                </td>
                <td className="border border-gray-300 py-2 px-2 text-sm text-center font-bold text-gray-800">
                  {notasPrincipales?.E3 || '--'}
                </td>
                <td className="border border-gray-300 py-2 px-2 text-sm text-center font-bold text-gray-800">
                  {notasPrincipales?.EF || '--'}
                </td>
                <td className={`border border-gray-300 py-2 px-2 text-sm text-center font-bold text-lg bg-gray-50 ${
                  notasPrincipales?.PF ? obtenerColorPF(notasPrincipales.PF) : 'text-gray-500'
                }`}>
                  {notasPrincipales?.PF || '--'}
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
                        ec.isPublicada ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {ec.label}
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
                        ec.value === '--' ? 'text-gray-400' :
                        ec.value === '0.0' && modoCalculo === 'habilitadas' ? 'text-gray-500 bg-gray-50' :
                        'text-gray-800'
                      }`}
                    >
                      {ec.value}
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
                Mostrando {cantidadContinuas} EC habilitadas (vacías consideradas como 0.0)
              </>
            )}
            {modoCalculo === 'publicadas' && (
              <>
                Mostrando solo {evaluacionesMostrar.length} EC con nota publicada
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default CursoCard;