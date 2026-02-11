'use client';
import { Curso, ModoCalculo } from '../types';
import CursoCard from './CursoCard';

interface CursosGridProps {
  cursos: Curso[];
  modoCalculo: ModoCalculo;
}

export default function CursosGrid({ cursos, modoCalculo }: CursosGridProps) {
  if (cursos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No se encontraron cursos
        </h3>
        <p className="text-gray-500">
          Intenta iniciar sesión nuevamente
        </p>
      </div>
    );
  }

  return (
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
  );
}