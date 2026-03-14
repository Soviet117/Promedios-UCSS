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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next {
          height: 100%;
          background: #0b1118 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        :root {
          --bg:        #0b1118;
          --surface:   #111820;
          --border:    rgba(0, 170, 210, 0.14);
          --border-hv: rgba(0, 170, 210, 0.38);
          --accent:    #00aad2;
          --accent-dk: rgba(0, 170, 210, 0.08);
          --text-hi:   #d0eaf4;
          --text-md:   #7aa3b4;
          --text-lo:   #3d6070;
          --red:       rgba(220, 60, 80, 0.75);
          --red-bg:    rgba(220, 60, 80, 0.06);
          --amber:     rgba(200, 155, 30, 0.65);
          --amber-bg:  rgba(200, 155, 30, 0.05);
        }

        .lf-wrap {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
        }

        /* ── Grid ── */
        .lf-grid {
          width: 100%;
          max-width: 860px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;                          /* the gap IS the divider */
          background: var(--border);         /* divider colour */
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .lf-grid { grid-template-columns: 1fr; }
        }

        /* ── Panel shared ── */
        .lf-panel {
          background: var(--surface);
          padding: 36px 32px;
        }
        @media (max-width: 640px) {
          .lf-panel { padding: 28px 20px; }
        }

        /* ── Left panel ── */
        .lf-panel-info {}

        .lf-info-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .lf-info-header-icon {
          width: 32px; height: 32px;
          background: var(--accent-dk);
          border: 1px solid var(--border);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lf-info-header-icon svg { width: 16px; height: 16px; color: var(--accent); }
        .lf-info-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-hi);
          letter-spacing: 0.02em;
        }

        /* Info list */
        .lf-info-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .lf-info-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: var(--text-md);
          line-height: 1.55;
        }
        .lf-info-bullet {
          width: 18px; height: 18px;
          background: var(--accent-dk);
          border: 1px solid var(--border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .lf-info-bullet svg { width: 9px; height: 9px; color: var(--accent); }

        .lf-link {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid rgba(0,170,210,0.25);
          transition: border-color 0.15s;
        }
        .lf-link:hover { border-color: var(--accent); }

        .lf-mono {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          background: rgba(0,170,210,0.07);
          border: 1px solid var(--border);
          padding: 1px 7px;
          border-radius: 3px;
          color: var(--accent);
          vertical-align: middle;
        }

        /* Warning box */
        .lf-warn {
          margin-top: 24px;
          padding: 12px 14px;
          background: var(--amber-bg);
          border: 1px solid rgba(200,155,30,0.18);
          border-radius: 6px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 12px;
          color: rgba(200,165,80,0.8);
          line-height: 1.5;
        }
        .lf-warn-icon { flex-shrink: 0; margin-top: 1px; font-style: normal; }

        /* ── Right panel ── */
        .lf-panel-form {}

        .lf-form-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          text-align: center;
        }
        .lf-form-icon {
          width: 48px; height: 48px;
          background: var(--accent-dk);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .lf-form-icon svg { width: 22px; height: 22px; color: var(--accent); }
        .lf-form-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-hi);
          letter-spacing: 0.01em;
        }
        .lf-form-sub {
          font-size: 12px;
          color: var(--text-lo);
          margin-top: -4px;
        }

        /* Error */
        .lf-error {
          margin-bottom: 18px;
          padding: 10px 14px;
          background: var(--red-bg);
          border: 1px solid rgba(220,60,80,0.2);
          border-radius: 6px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 12.5px;
          color: rgba(240,120,130,0.9);
          line-height: 1.45;
        }
        .lf-error svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }

        /* The LoginFormReal component will render inside .lf-form-body.
           Override its internal inputs & button via global selectors below. */
        .lf-form-body {}

        /* ── Generic overrides for LoginFormReal children ── */
        .lf-form-body label {
          display: block;
          font-size: 11.5px;
          font-weight: 500;
          color: var(--text-lo);
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-family: 'DM Mono', monospace;
        }
        .lf-form-body input[type="text"],
        .lf-form-body input[type="email"],
        .lf-form-body input[type="password"],
        .lf-form-body input[type="number"] {
          width: 100%;
          background: rgba(0,170,210,0.04);
          border: 1px solid var(--border);
          border-radius: 5px;
          color: var(--text-hi);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
          -webkit-appearance: none;
          margin-bottom: 14px;
        }
        .lf-form-body input::placeholder { color: var(--text-lo); }
        .lf-form-body input:focus {
          border-color: var(--border-hv);
          background: rgba(0,170,210,0.07);
          box-shadow: 0 0 0 3px rgba(0,170,210,0.08);
        }
        .lf-form-body input:disabled { opacity: 0.35; cursor: not-allowed; }

        .lf-form-body button[type="submit"],
        .lf-form-body button[type="button"].submit-btn {
          width: 100%;
          padding: 11px 16px;
          margin-top: 4px;
          background: rgba(0,170,210,0.1);
          border: 1px solid rgba(0,170,210,0.35);
          border-radius: 5px;
          color: #5ac8e4;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
          letter-spacing: 0.02em;
        }
        .lf-form-body button[type="submit"]:not(:disabled):hover,
        .lf-form-body button[type="button"].submit-btn:not(:disabled):hover {
          background: rgba(0,170,210,0.18);
          border-color: rgba(0,170,210,0.6);
          color: #9de0f4;
        }
        .lf-form-body button[type="submit"]:disabled { opacity: 0.35; cursor: not-allowed; }

        /* Divider between form sections if any */
        .lf-form-body hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 16px 0;
        }
      `}</style>

      <div className="lf-wrap">
        <div className="lf-grid">

          {/* ── LEFT: Info ── */}
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
                  Tus credenciales <strong style={{ color: 'var(--text-hi)', fontWeight: 500 }}>no se almacenan</strong> en ningún servidor — verificarlo en el{' '}
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
                Herramienta <strong style={{ fontWeight: 500 }}>no oficial</strong> de la UCSS.
                Úsala bajo tu propia responsabilidad.
              </span>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
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
    </>
  );
}