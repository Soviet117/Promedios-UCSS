'use client';
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
  onPasswordChange,
}: LoginFormProps) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLoginReal(usuario, password);
  };

  return (
    <div className="lf-wrap">
      <div className="lf-grid">

        {/* LEFT: Info */}
        <div className="lf-panel lf-panel-info">
          <div className="lf-info-header">
            <div className="lf-info-header-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <span className="lf-info-title">Antes de ingresar</span>
          </div>

          <ul className="lf-info-list">
            <li className="lf-info-item">
              <span className="lf-info-bullet">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span>Cierra sesión en la intranet UCSS antes de continuar</span>
            </li>

            <li className="lf-info-item">
              <span className="lf-info-bullet">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span>
                Tus credenciales <strong>no se almacenan</strong> en ningún servidor — verificarlo en el{' '}
                <a
                  href="https://github.com/Soviet117/Promedios-UCSS.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lf-link"
                >
                  código fuente
                </a> del proyecto Open Source
              </span>
            </li>

            <li className="lf-info-item">
              <span className="lf-info-bullet">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span>
                Versión actual: <span className="lf-mono">v2.0.1-beta</span>
              </span>
            </li>
          </ul>

          <div className="lf-warn">
            <span className="lf-warn-icon">⚠</span>
            <span>
              Herramienta <strong>no oficial</strong> de la UCSS.
              Úsala bajo tu propia responsabilidad.
            </span>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="lf-panel lf-panel-form">
          <div className="lf-form-header">
            <div className="lf-form-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div className="lf-form-title">Acceso Intranet UCSS</div>
              <div className="lf-form-sub">Ingresa con tus credenciales universitarias</div>
            </div>
          </div>

          {error && (
            <div className="lf-error">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="lf-form-body">
            <LoginFormReal
              cargando={cargando}
              usuario={usuario}
              password={password}
              onUsuarioChange={onUsuarioChange}
              onPasswordChange={onPasswordChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}