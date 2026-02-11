import { Curso } from '../types';

export const generarDatosDePrueba = (): Curso[] => {
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