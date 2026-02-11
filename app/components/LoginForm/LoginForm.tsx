'use client';
import { useState } from 'react';
import LoginFormReal from './LoginFormReal';
import LoginFormDemo from './LoginFormDemo';
import { Curso } from '../../types';

interface LoginFormProps {
  modoPrueba: boolean;
  cargando: boolean;
  error: string | null;
  usuario: string;
  password: string;
  onToggleModo: () => void;
  onUsarModoDemo: () => void;
  onLoginReal: (usuario: string, password: string) => Promise<void>;
  onLoginDemo: (usuario: string) => Promise<void>;
  onUsuarioChange: (usuario: string) => void;
  onPasswordChange: (password: string) => void;
}

export default function LoginForm({
  modoPrueba,
  cargando,
  error,
  usuario,
  password,
  onToggleModo,
  onUsarModoDemo,
  onLoginReal,
  onLoginDemo,
  onUsuarioChange,
  onPasswordChange
}: LoginFormProps) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modoPrueba) {
      await onLoginDemo(usuario);
    } else {
      await onLoginReal(usuario, password);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Switch entre modo demo y real */}
      <div className="mb-6 bg-white rounded-xl shadow p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {modoPrueba ? '🎭 Modo Demo' : '🔐 Modo Real'}
            </h2>
            <p className="text-gray-600 text-sm">
              {modoPrueba 
                ? 'Prueba la aplicación con datos de ejemplo' 
                : 'Conéctate a la intranet UCSS con tus credenciales reales'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onUsarModoDemo}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
            >
              Probar Modo Demo
            </button>
            <button
              onClick={onToggleModo}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
            >
              {modoPrueba ? 'Cambiar a Modo Real' : 'Cambiar a Modo Demo'}
            </button>
          </div>
        </div>
      </div>

      {/* Información importante */}
      <div className="mb-6 md:mb-8 bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📋 Información importante</h2>
        {modoPrueba ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 mt-0.5">🎭</span>
              <div>
                <h3 className="font-semibold text-yellow-800">Modo Demo Activado</h3>
                <p className="text-yellow-700 text-sm">
                  Puedes usar cualquier usuario y dejar la contraseña vacía. Se cargarán datos de prueba.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <p className="text-gray-600">Prueba todas las funcionalidades sin credenciales reales</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <p className="text-gray-600">Datos de ejemplo realistas para testing</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Formulario de login */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {modoPrueba ? '🎭 Modo Demo' : '🔐 Login UCSS'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Indicador de modo */}
        <div className={`mb-6 p-3 rounded-lg text-center font-medium ${
          modoPrueba 
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {modoPrueba 
            ? 'Usando datos de prueba - No se requiere conexión' 
            : 'Conectándose a la intranet UCSS - Credenciales reales requeridas'
          }
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario {modoPrueba && '(Cualquiera)'}
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => onUsuarioChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={modoPrueba ? "Ej: demo2024" : "Ej: 2023102302"}
              required
              disabled={cargando}
            />
          </div>

          {!modoPrueba && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tu contraseña de intranet"
                required
                disabled={cargando}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className={`w-full py-3 px-4 rounded-lg font-medium transition ${
              cargando
                ? 'bg-gray-400 cursor-not-allowed'
                : modoPrueba
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {cargando 
              ? (modoPrueba ? '🎭 Cargando demo...' : '🔐 Conectando...') 
              : (modoPrueba ? '🎭 Probar con datos demo' : '🚀 Obtener mis notas')
            }
          </button>
        </form>

        {/* Instrucciones */}
        <div className="mt-8 text-sm text-gray-600">
          <h3 className="font-bold mb-2">ℹ️ {modoPrueba ? 'Cómo usar el demo:' : 'Cómo funciona:'}</h3>
          {modoPrueba ? (
            <ul className="list-disc pl-5 space-y-1">
              <li>Ingresa cualquier usuario (puedes dejar contraseña vacía)</li>
              <li>Se cargarán 5 cursos de ejemplo con datos realistas</li>
              <li>Puedes probar todas las funcionalidades</li>
              <li>Para datos reales, cambia a "Modo Real"</li>
            </ul>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              <li>Envía tus credenciales al servidor de forma segura</li>
              <li>El servidor simula un navegador y se conecta a la intranet UCSS</li>
              <li>Hace login automático con tu usuario y contraseña</li>
              <li>Si el login es exitoso, extrae todas tus notas</li>
              <li>Muestra tus cursos en una interfaz limpia y responsiva</li>
            </ul>
          )}
          <p className="mt-3 text-xs bg-yellow-50 p-2 rounded">
            ⚠️ <strong>Nota:</strong> {modoPrueba 
              ? 'Los datos mostrados son de ejemplo para testing.' 
              : 'Esta es una herramienta no oficial para consultar notas de la UCSS.'}
          </p>
        </div>
      </div>
    </div>
  );
}