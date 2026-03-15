import { FC } from 'react';

interface CursoCardProps {
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
  
  const obtenerEvaluacionesMostrar = () => {
    const evaluaciones = [];
    
    if (modoCalculo === 'publicadas') {
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
      for (let i = 1; i <= cantidadContinuas; i++) {
        const key = `EC${i}`;
        const valor = evaluacionesContinuas[key];
        const tieneValor = valor && valor.trim() !== '';
        
        if (modoCalculo === 'habilitadas') {
          evaluaciones.push({
            label: key,
            value: tieneValor ? valor : '0.0',
            isPublicada: tieneValor,
            esCalculada: !tieneValor
          });
        } else {
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

  const obtenerColorNota = (notaStr: string): string => {
    const nota = parseFloat(notaStr);
    if (isNaN(nota)) return 'text-[#3d6070]';
    
    if (nota < 10.50) {
      return 'text-[#f14c4c] font-bold';
    } else if (nota >= 10.50) {
      return 'text-[#4ec9b0]';
    } 
    return 'text-[#d0eaf4]';
  };

  const esNotaCalculada = (valor: string, esCalculada: boolean): boolean => {
    return esCalculada || valor === '0.0';
  };

  const obtenerColorCalculada = (): string => {
    return 'text-[#3d6070]';
  };

  const obtenerColorEC = (): string => {
    const ecValor = notasPrincipales?.EC || '';
    if (modoCalculo !== 'ninguno' && ecValor) {
      return 'text-[#3d6070]';
    }
    return obtenerColorNota(ecValor);
  };

  return (
    <div className={`bg-[#111820] rounded-lg shadow-md border border-[rgba(0,170,210,0.14)] p-4 mb-6 ${className}`}>
      <div className="mb-4 bg-[#0b1118] p-3 rounded-lg border border-[rgba(0,170,210,0.14)]">
        <h2 className="text-lg font-bold text-[#d0eaf4] mb-2">{nombre}</h2>
        <div className="flex flex-wrap gap-4 mb-2 text-sm">
          <p className="text-[#7aa3b4]">
            <span className="font-semibold text-[#3d6070]">CÓD.: </span> {codigo}
          </p>
          <p className="text-[#7aa3b4]">
            <span className="font-semibold text-[#3d6070]">CRÉD.: </span> {creditos}
          </p>
          <p className="text-[#7aa3b4]">
            <span className="font-semibold text-[#3d6070]">TIPO: </span> {tipo}
          </p>
          {cantidadContinuas > 0 && (
            <p className="text-[#7aa3b4]">
              <span className="font-semibold text-[#3d6070]">EC habilitadas: </span> {cantidadContinuas}
            </p>
          )}
        </div>
        <p className="text-[#7aa3b4] text-sm">
          <span className="font-semibold text-[#3d6070]">DOCENTE:</span> {docente}
        </p>
      </div>

      {modoCalculo !== 'ninguno' && (
        <div className={`mb-3 p-2 rounded text-xs ${
          modoCalculo === 'habilitadas' 
            ? 'bg-[rgba(0,170,210,0.05)] text-[#7aa3b4] border border-[rgba(0,170,210,0.14)]' 
            : 'bg-[rgba(0,170,210,0.05)] text-[#7aa3b4] border border-[rgba(0,170,210,0.14)]'
        }`}>
          {modoCalculo === 'habilitadas' 
            ? 'Calculado por continuas habilitadas (vacías = 0.0 en gris)' 
            : 'Calculado por continuas publicadas'}
        </div>
      )}

      {/* Tabla de notas principales */}
      <div className="mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#0b1118]">
                <th className="border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-[#7aa3b4]">EC [20%]</th>
                <th className="border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-[#7aa3b4]">E1 [10%]</th>
                <th className="border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-[#7aa3b4]">E2 [20%]</th>
                <th className="border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-[#7aa3b4]">E3 [20%]</th>
                <th className="border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-[#7aa3b4]">EF [30%]</th>
                <th className="border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-[#7aa3b4]">PF</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && notasPrincipales?.EC 
                    ? obtenerColorCalculada() 
                    : obtenerColorEC()
                }`}>
                  {notasPrincipales?.EC || '--'}
                  {modoCalculo !== 'ninguno' && notasPrincipales?.EC && (
                    <div className="text-xs text-[#3d6070]">calc</div>
                  )}
                </td>
                
                <td className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.E1
                    ? 'text-[#3d6070]'
                    : obtenerColorNota(notasPrincipales?.E1 || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E1 
                    ? '0.0'
                    : (notasPrincipales?.E1 || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E1 && (
                    <div className="text-xs text-[#3d6070]">calc</div>
                  )}
                </td>
                
                <td className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.E2
                    ? 'text-[#3d6070]'
                    : obtenerColorNota(notasPrincipales?.E2 || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E2 
                    ? '0.0'
                    : (notasPrincipales?.E2 || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E2 && (
                    <div className="text-xs text-[#3d6070]">calc</div>
                  )}
                </td>
                
                <td className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.E3
                    ? 'text-[#3d6070]'
                    : obtenerColorNota(notasPrincipales?.E3 || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E3 
                    ? '0.0'
                    : (notasPrincipales?.E3 || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.E3 && (
                    <div className="text-xs text-[#3d6070]">calc</div>
                  )}
                </td>
                
                <td className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-center font-bold ${
                  modoCalculo !== 'ninguno' && !notasPrincipales?.EF
                    ? 'text-[#3d6070]'
                    : obtenerColorNota(notasPrincipales?.EF || '')
                }`}>
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.EF 
                    ? '0.0'
                    : (notasPrincipales?.EF || '--')
                  }
                  {modoCalculo !== 'ninguno' && !notasPrincipales?.EF && (
                    <div className="text-xs text-[#3d6070]">calc</div>
                  )}
                </td>
                
                <td className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-center font-bold text-lg bg-[#0b1118] ${
                  modoCalculo !== 'ninguno' && notasPrincipales?.PF
                    ? 'text-[#3d6070]'
                    : obtenerColorNota(notasPrincipales?.PF || '')
                }`}>
                  {notasPrincipales?.PF || '--'}
                  {modoCalculo !== 'ninguno' && notasPrincipales?.PF && (
                    <div className="text-xs text-[#3d6070]">calc</div>
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
                <tr className="bg-[#0b1118]">
                  {evaluacionesMostrar.map((ec) => (
                    <th 
                      key={`header-${ec.label}`}
                      className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm font-semibold ${
                        ec.esCalculada ? 'text-[#3d6070]' : 'text-[#7aa3b4]'
                      }`}
                    >
                      {ec.label}
                      {ec.esCalculada && <span className="text-xs text-[#3d6070] block">calc</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {evaluacionesMostrar.map((ec) => (
                    <td 
                      key={`value-${ec.label}`}
                      className={`border border-[rgba(0,170,210,0.14)] py-2 px-2 text-sm text-center font-bold ${
                        ec.esCalculada ? 'text-[#3d6070] bg-[#0b1118]' :
                        obtenerColorNota(ec.value)
                      }`}
                    >
                      {ec.value}
                      {ec.esCalculada && <div className="text-xs text-[#3d6070]">calc</div>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#3d6070] mt-1 italic">
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