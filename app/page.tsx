'use client';

import { useState, useEffect } from 'react';
import { Curso, ModoCalculo } from './types';
import DashboardHeader from './components/DashboardHeader';
import CursosGrid from './components/CursosGrid';
import LoginForm from './components/LoginForm/LoginForm';
import { loginConBackendReal } from './services/apiService';
import { actualizarCursosConModoCalculo } from './services/calculos';

export default function HomePage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursosOriginales, setCursosOriginales] = useState<Curso[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modoCalculo, setModoCalculo] = useState<ModoCalculo>('ninguno');

  // Efecto para recalcular cuando cambia el modo
  useEffect(() => {
    if (cursosOriginales.length > 0) {
      const cursosActualizados = actualizarCursosConModoCalculo(cursosOriginales, modoCalculo);
      setCursos(cursosActualizados);
    }
  }, [modoCalculo, cursosOriginales]);

  // Función para login con backend real
  const handleLoginReal = async (usuario: string, password: string) => {
    setCargando(true);
    setError(null);

    const resultado = await loginConBackendReal(usuario, password);

    if (resultado.success && resultado.cursos) {
      setCursosOriginales(resultado.cursos);
      setCursos(actualizarCursosConModoCalculo(resultado.cursos, modoCalculo));
      setIsLoggedIn(true);
      setError(null);
    } else {
      setError(resultado.error || 'Error desconocido');
      setCursosOriginales([]);
      setCursos([]);
      setIsLoggedIn(false);
    }

    setCargando(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!usuario.trim()) {
      setError('Por favor ingresa tu usuario');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    await handleLoginReal(usuario, password);
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

  // Si está logueado, mostrar el dashboard con fondo oscuro
  if (isLoggedIn && cursos.length > 0) {
    return (
      <div className="min-h-screen bg-[#0b1118] p-4 md:p-8">
        
        <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00aad2] to-transparent opacity-30"></div>
        
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            usuario={usuario}
            cursos={cursos}
            onLogout={handleLogout}
            modoCalculo={modoCalculo}
            onModoCalculoChange={setModoCalculo}
          />
          <CursosGrid cursos={cursos} modoCalculo={modoCalculo} />
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-[#3d6070]">
            <span className="text-[#00aad2]">UCSS</span> Promedio_calculator v2.0.1-beta
          </p>
        </div>
      </div>
    );
  }

  // Si NO está logueado, mostrar SOLO el LoginForm
  return (
    <LoginForm
      cargando={cargando}
      error={error}
      usuario={usuario}
      password={password}
      onLoginReal={handleLoginReal}
      onUsuarioChange={setUsuario}
      onPasswordChange={setPassword}
    />
  );
}