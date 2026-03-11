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
        <h2 className="text-xl font-bold text-gray-800 mb-3">Información importante</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            No debes estar logueado en la intranet UCSS en otra pestaña o navegador
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            Este proyecto es Open Source:    {" "}
             <a 
              href="https://github.com/Soviet117/Promedios-UCSS.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
                 _Repositorio en GitHub
            </a>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            Versión: v2.0.1-beta
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            Tus credenciales no se almacenan, puedes revisar el código.
          </li>
        </ul>
      </div>

      {/* Formulario de login */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
           Login UCSS
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Indicador de modo */}
        <div className="mb-6 p-3 rounded-lg text-center font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Credenciales reales requeridas
        </div>

        <LoginFormReal
          cargando={cargando}
          usuario={usuario}
          password={password}
          onUsuarioChange={onUsuarioChange}
          onPasswordChange={onPasswordChange}
          onSubmit={handleSubmit}
        />

        <div className="mt-8 text-sm text-gray-600">
          <p className="mt-3 text-xs bg-yellow-50 p-2 rounded">
            ⚠️ <strong>Nota:</strong> Esta es una herramienta no oficial para consultar notas de la UCSS.
          </p>
        </div>
      </div>
    </div>
  );
}