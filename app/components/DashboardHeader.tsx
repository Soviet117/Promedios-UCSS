'use client';
import { Curso, ModoCalculo } from '../types';
import { calcularCreditosTotales, calcularPromedioPonderado, contarCursosAprobados, contarCursosDesaprobados } from '../services/calculos';

interface DashboardHeaderProps {
  usuario: string;
  cursos: Curso[];
  onLogout: () => void;
  modoCalculo: ModoCalculo;
  onModoCalculoChange: (modo: ModoCalculo) => void;
}

export default function DashboardHeader({
  usuario,
  cursos,
  onLogout,
  modoCalculo,
  onModoCalculoChange
}: DashboardHeaderProps) {
  const promedioPonderado = calcularPromedioPonderado(cursos);
  const cursosDesaprobados = contarCursosDesaprobados(cursos);

  return (
    <div className="mb-6 md:mb-8">
      {/* Header con usuario y logout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-[#00aad2]"></div>
            <h1 className="text-xl md:text-2xl font-medium text-[#d0eaf4] uppercase tracking-wider">
              Mis Cursos UCSS
            </h1>
          </div>
          <p className="text-sm text-[#7aa3b4] font-mono">
            <span className="text-[#3d6070]">{'$>'}</span> Usuario: <span className="text-[#00aad2]">{usuario}</span>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-[#1a0f0f] border border-[rgba(220, 60, 80, 0.25)] text-[#f14c4c] hover:text-[#ff8a8a] hover:border-[rgba(220, 60, 80, 0.5)] rounded font-mono text-sm transition-all flex items-center gap-2"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Selectores de modo de cálculo */}
      <div className="mb-6 bg-[#111820] border border-[rgba(0,170,210,0.14)] rounded p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-[#00aad2]"></div>
          <h3 className="text-sm font-medium text-[#d0eaf4] uppercase tracking-wider">Modo de Cálculo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onModoCalculoChange('ninguno')}
            className={`p-4 rounded border transition-all text-left ${
              modoCalculo === 'ninguno'
                ? 'bg-[rgba(0,170,210,0.1)] border-[#00aad2]'
                : 'bg-transparent border-[rgba(0,170,210,0.14)] hover:border-[rgba(0,170,210,0.38)]'
            }`}
          >
            <div className={`font-mono text-sm mb-1 ${modoCalculo === 'ninguno' ? 'text-[#00aad2]' : 'text-[#7aa3b4]'}`}>
              {'>'} Sin calcular
            </div>
            <div className="text-xs text-[#3d6070]">
              Mostrar solo notas publicadas en intranet
            </div>
          </button>

          <button
            onClick={() => onModoCalculoChange('habilitadas')}
            className={`p-4 rounded border transition-all text-left ${
              modoCalculo === 'habilitadas'
                ? 'bg-[rgba(0,170,210,0.1)] border-[#00aad2]'
                : 'bg-transparent border-[rgba(0,170,210,0.14)] hover:border-[rgba(0,170,210,0.38)]'
            }`}
          >
            <div className={`font-mono text-sm mb-1 ${modoCalculo === 'habilitadas' ? 'text-[#00aad2]' : 'text-[#7aa3b4]'}`}>
              {'>'} Por habilitadas
            </div>
            <div className="text-xs text-[#3d6070]">
              Divide entre todas las EC habilitadas (vacías = 0.0)
            </div>
          </button>

          <button
            onClick={() => onModoCalculoChange('publicadas')}
            className={`p-4 rounded border transition-all text-left ${
              modoCalculo === 'publicadas'
                ? 'bg-[rgba(0,170,210,0.1)] border-[#00aad2]'
                : 'bg-transparent border-[rgba(0,170,210,0.14)] hover:border-[rgba(0,170,210,0.38)]'
            }`}
          >
            <div className={`font-mono text-sm mb-1 ${modoCalculo === 'publicadas' ? 'text-[#00aad2]' : 'text-[#7aa3b4]'}`}>
              {'>'} Por publicadas
            </div>
            <div className="text-xs text-[#3d6070]">
              Divide solo entre EC con nota publicada
            </div>
          </button>
        </div>
        
        {modoCalculo !== 'ninguno' && (
          <div className="mt-4 p-3 bg-[rgba(0,170,210,0.05)] border border-[rgba(0,170,210,0.14)] rounded">
            <div className="flex items-start gap-2">
              <div>
                <p className="text-xs text-[#7aa3b4] font-mono">
                  <span className="text-[#00aad2]">Modo activo</span> ={' '}
                  <span className="text-[#d0eaf4]">
                    {modoCalculo === 'habilitadas' ? 'Por habilitadas' : 'Por publicadas'}
                  </span>
                </p>
                <p className="text-xs text-[#3d6070] mt-1">
                  {modoCalculo === 'habilitadas' 
                    ? '// EC sin nota se consideran como 0.0 (gris)' 
                    : '// Solo se muestran EC con nota publicada'}
                </p>
                <p className="text-xs text-[#3d6070] mt-1">
                  // Notas calculadas aparecen en gris para diferenciarlas
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              
        {/* Promedio ponderado */}
        <div className="bg-[#111820] border border-[rgba(0,170,210,0.14)] rounded p-4">
          <div className={`font-mono text-2xl md:text-3xl font-bold mb-1 ${
            parseFloat(promedioPonderado) >= 14 ? 'text-[#4ec9b0]' :
            parseFloat(promedioPonderado) >= 11 ? 'text-[#00aad2]' :
            'text-[#f14c4c]'
          }`}>
            {promedioPonderado}
          </div>
          <div className="text-xs text-[#3d6070] font-mono">
            {'>'} Promedio ponderado
          </div>
          <div className="text-[10px] text-[#3d6070] font-mono mt-1">
            ({calcularCreditosTotales(cursos)} créditos)
          </div>
        </div>
        
        {/* Créditos totales */}
        <div className="bg-[#111820] border border-[rgba(0,170,210,0.14)] rounded p-4">
          <div className="font-mono text-2xl md:text-3xl font-bold text-[#b392f0] mb-1">
            {calcularCreditosTotales(cursos)}
          </div>
          <div className="text-xs text-[#3d6070] font-mono">
            {'>'} Créditos totales
          </div>
        </div>
        
        {/* Cursos aprobados */}
        <div className="bg-[#111820] border border-[rgba(0,170,210,0.14)] rounded p-4">
          <div className="font-mono text-2xl md:text-3xl font-bold text-[#4ec9b0] mb-1">
            {contarCursosAprobados(cursos)}
          </div>
          <div className="text-xs text-[#3d6070] font-mono">
            {'>'} Cursos aprobados
          </div>
          <div className="text-[10px] text-[#3d6070] font-mono mt-1">
            (≥ 10.50)
          </div>
        </div>
        
        {/* Cursos desaprobados */}
        <div className="bg-[#111820] border border-[rgba(0,170,210,0.14)] rounded p-4">
          <div className="font-mono text-2xl md:text-3xl font-bold text-[#f14c4c] mb-1">
            {cursosDesaprobados}
          </div>
          <div className="text-xs text-[#3d6070] font-mono">
            {'>'} Cursos desaprobados
          </div>
          <div className="text-[10px] text-[#3d6070] font-mono mt-1">
            (&lt; 10.50)
          </div>
        </div>
      </div>
    </div>
  );
}