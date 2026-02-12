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

  if (isLoggedIn && cursos.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <DashboardHeader
          usuario={usuario}
          //modoPrueba={false} 
          cursos={cursos}
          //onToggleModo={() => {}}
          onLogout={handleLogout}
          modoCalculo={modoCalculo}
          onModoCalculoChange={setModoCalculo}
        />
        <CursosGrid cursos={cursos} modoCalculo={modoCalculo} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <LoginForm
        cargando={cargando}
        error={error}
        usuario={usuario}
        password={password}
        onLoginReal={handleLoginReal}
        onUsuarioChange={setUsuario}
        onPasswordChange={setPassword}
      />
    </div>
  );
}