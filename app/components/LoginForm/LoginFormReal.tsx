'use client';

interface LoginFormRealProps {
  cargando: boolean;
  usuario: string;
  password: string;
  onUsuarioChange: (usuario: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function LoginFormReal({
  cargando,
  usuario,
  password,
  onUsuarioChange,
  onPasswordChange,
  onSubmit
}: LoginFormRealProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Usuario
        </label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => onUsuarioChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: 2023102302"
          required
          disabled={cargando}
        />
      </div>

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

      {cargando ? (
        <div className="lf-progress-container">
          <div className="lf-progress-text">Procesando solicitud</div>
          <div className="lf-progress-bar-track">
            <div className="lf-progress-bar-fill"></div>
          </div>
        </div>
      ) : (
        <button
          type="submit"
          disabled={cargando}
          className={`w-full py-3 px-4 rounded-lg font-medium transition ${
            cargando
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Obtener mis notas
        </button>
      )}
    </form>
  );
}