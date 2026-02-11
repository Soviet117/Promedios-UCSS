export type ModoCalculo = 'ninguno' | 'habilitadas' | 'publicadas';

export interface Curso {
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
  notasCalculadas?: {
    ecCalculado?: boolean;
    pfCalculado?: boolean;
  };
}

export interface ResultadoCalculo {
  valor: string;
  esCalculado: boolean;
}