import { Curso, ModoCalculo, ResultadoCalculo } from '../types';

// Logica para poder calcular EC según el modo seleccionado
export const calcularPromedioEC = (curso: Curso, modo: ModoCalculo): ResultadoCalculo => {
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
export const calcularPromedioFinal = (curso: Curso, ecValor: string, ecEsCalculado: boolean): ResultadoCalculo => {
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
export const calcularPromedioPonderado = (cursos: Curso[]): string => {
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

export const contarCursosDesaprobados = (cursos: Curso[]): number => {
  return cursos.filter(curso => {
    const pf = parseFloat(curso.notasPrincipales.PF || curso.promedioFinal || '0');
    return !isNaN(pf) && pf < 10.50;
  }).length;
};

// Función para actualizar todos los cursos con el modo de cálculo
export const actualizarCursosConModoCalculo = (
  cursosOriginales: Curso[], 
  modoCalculo: ModoCalculo
): Curso[] => {
  return cursosOriginales.map(curso => {
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
};

export const calcularCreditosTotales = (cursos: Curso[]): number => {
  return cursos.reduce((total, curso) => total + curso.creditos, 0);
};

export const contarCursosAprobados = (cursos: Curso[]): number => {
  return cursos.filter(curso => {
    const pf = parseFloat(curso.notasPrincipales.PF || curso.promedioFinal || '0');
    return !isNaN(pf) && pf >= 10.5;
  }).length;
};