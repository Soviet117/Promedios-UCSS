'use client';

interface LoginFormDemoProps {
  cargando: boolean;
  usuario: string;
  onUsuarioChange: (usuario: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function LoginFormDemo({
  cargando,
  usuario,
  onUsuarioChange,
  onSubmit
}: LoginFormDemoProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Usuario (Cualquiera)
        </label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => onUsuarioChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: demo2024"
          required
          disabled={cargando}
        />
      </div>

      <button
        type="submit"
        disabled={cargando}
        className={`w-full py-3 px-4 rounded-lg font-medium transition ${
          cargando
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }`}
      >
        {cargando ? '🎭 Cargando demo...' : '🎭 Probar con datos demo'}
      </button>
    </form>
  );
}