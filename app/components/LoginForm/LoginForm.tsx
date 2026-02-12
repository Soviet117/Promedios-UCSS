'use client';
import { useState } from 'react';
import LoginFormReal from './LoginFormReal';

interface LoginFormProps {
  cargando: boolean;
  error: string | null;
  usuario: string;
  password: string;
  onLoginReal: (usuario: string, password: string) => Promise<void>;
  onUsuarioChange: (usuario: string) => void;
  onPasswordChange: (password: string) => void;
}

export default function LoginForm({
  cargando,
  error,
  usuario,
  password,
  onLoginReal,
  onUsuarioChange,
  onPasswordChange
}: LoginFormProps) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLoginReal(usuario, password);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Información importante */}
      <div className="mb-6 md:mb-8 bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📋 Información importante</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            No debes estar logueado en la intranet UCSS en otro navegador
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            Puedes calcular tu promedio general automáticamente
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            Se muestran todos los tipos de promedios y evaluaciones
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">⚠</span>
            Tus credenciales se usan solo para acceder a la intranet, no se almacenan
          </li>
        </ul>
      </div>

      {/* Formulario de login */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🔐 Login UCSS
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Indicador de modo */}
        <div className="mb-6 p-3 rounded-lg text-center font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Conectándose a la intranet UCSS - Credenciales reales requeridas
        </div>

        <LoginFormReal
          cargando={cargando}
          usuario={usuario}
          password={password}
          onUsuarioChange={onUsuarioChange}
          onPasswordChange={onPasswordChange}
          onSubmit={handleSubmit}
        />

        {/* Instrucciones */}
        <div className="mt-8 text-sm text-gray-600">
          <h3 className="font-bold mb-2">ℹ️ Cómo funciona:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Envía tus credenciales al servidor de forma segura</li>
            <li>El servidor simula un navegador y se conecta a la intranet UCSS</li>
            <li>Hace login automático con tu usuario y contraseña</li>
            <li>Si el login es exitoso, extrae todas tus notas</li>
            <li>Muestra tus cursos en una interfaz limpia y responsiva</li>
          </ul>
          <p className="mt-3 text-xs bg-yellow-50 p-2 rounded">
            ⚠️ <strong>Nota:</strong> Esta es una herramienta no oficial para consultar notas de la UCSS.
          </p>
        </div>
      </div>
    </div>
  );
}