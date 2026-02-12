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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            📚 Mis Cursos UCSS
          </h1>
          <p className="text-gray-600">
            Usuario: <span className="font-semibold">{usuario}</span>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Selectores de modo de cálculo */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3">🧮 Modo de Cálculo de Promedio</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onModoCalculoChange('ninguno')}
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
            onClick={() => onModoCalculoChange('habilitadas')}
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
            onClick={() => onModoCalculoChange('publicadas')}
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
            {calcularCreditosTotales(cursos)} créditos
          </div>
        </div>
        
        {/* Créditos totales */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-2xl md:text-3xl font-bold text-purple-600">
            {calcularCreditosTotales(cursos)}
          </div>
          <div className="text-sm text-gray-600">Créditos totales</div>
        </div>
        
        {/* Cursos aprobados */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-2xl md:text-3xl font-bold text-green-600">
            {contarCursosAprobados(cursos)}
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
    </div>
  );
}