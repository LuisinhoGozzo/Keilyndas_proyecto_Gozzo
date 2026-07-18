import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Header({ isLogged, userRol, handleLogout }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/dashboard/gestion") {
      return router.pathname.includes("/dashboard/gestion");
    }
    return router.pathname === path;
  };

  return (
    <>
      <header className="header-nav">
        <div className="header-logo">
          <Link href="/">
            <Image
              src="/assets/keilyndas-logo.png"
              alt="Logo Keilyndas"
              width={40}
              height={45}
              className="pulse-logo"
              unoptimized
            />
          </Link>
        </div>

        {/* Menú Hamburguesa */}
        <div className="hamburger-wrapper">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰ MENÚ
          </button>
          <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <Link href="/" className={isActive("/") ? "nav-item-active" : ""}>
              Inicio
            </Link>
            <Link
              href="/servicios"
              className={isActive("/servicios") ? "nav-item-active" : ""}
            >
              Servicios
            </Link>
            <Link
              href="/normas"
              className={isActive("/normas") ? "nav-item-active" : ""}
            >
              Normas
            </Link>
            <Link
              href="/cuidados"
              className={isActive("/cuidados") ? "nav-item-active" : ""}
            >
              Cuidados
            </Link>
            <Link
              href="/galeria"
              className={isActive("/galeria") ? "nav-item-active" : ""}
            >
              Galería
            </Link>
            <Link
              href="/preguntas"
              className={isActive("/preguntas") ? "nav-item-active" : ""}
            >
              Preguntas
            </Link>
            <Link
              href="/contacto"
              className={isActive("/contacto") ? "nav-item-active" : ""}
            >
              Contacto
            </Link>
          </nav>
        </div>

        {/* Menú Desktop */}
        <nav className="nav-container desktop-menu">
          <ul className="header-menu">
            <li>
              <Link href="/" className={isActive("/") ? "nav-item-active" : ""}>
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/servicios"
                className={isActive("/servicios") ? "nav-item-active" : ""}
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                href="/normas"
                className={isActive("/normas") ? "nav-item-active" : ""}
              >
                Normas
              </Link>
            </li>
            <li>
              <Link
                href="/cuidados"
                className={isActive("/cuidados") ? "nav-item-active" : ""}
              >
                Cuidados
              </Link>
            </li>
            <li>
              <Link
                href="/galeria"
                className={isActive("/galeria") ? "nav-item-active" : ""}
              >
                Galería
              </Link>
            </li>
            <li className="hide-preguntas-range">
              <Link
                href="/preguntas"
                className={isActive("/preguntas") ? "nav-item-active" : ""}
              >
                Preguntas
              </Link>
            </li>
            <li className="hide-contacto-range">
              <Link
                href="/contacto"
                className={isActive("/contacto") ? "nav-item-active" : ""}
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contenedor de Usuario */}
        <div className="header-auth">
          {isLogged && (
            <Link
              href="/agendar"
              className={`nav-shrink ${isActive("/agendar") ? "nav-item-active" : ""}`}
            >
              ARMA TU ESTILO
            </Link>
          )}
          {isLogged ? (
            <>
              <div className={`profile-gestion-wrapper`}>
                <Link
                  href="/dashboard/perfil"
                  className={`nav-shrink ${isActive("/dashboard/perfil") ? "nav-item-active" : ""}`}
                >
                  PERFIL
                </Link>
                {userRol === "admin" && (
                  <Link
                    href="/dashboard/gestion"
                    className={`nav-shrink ${isActive("/dashboard/gestion") ? "nav-item-active" : ""}`}
                  >
                    GESTIÓN
                  </Link>
                )}
              </div>
              <button onClick={handleLogout} className="btn-sun-glow">
                SALIR
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-sun-glow">
              INICIAR SESIÓN
            </Link>
          )}
        </div>
      </header>

      <style jsx global>{`
        .header-nav {
          width: 100%;
          background-color: #0a0a0a;
          border-bottom: 1px solid #333;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          gap: 15px;
        }
        .header-menu {
          display: flex;
          list-style: none;
          gap: 15px;
        }
        .header-auth {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .profile-gestion-wrapper {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .hamburger-wrapper {
          display: none;
        }

        @media (min-width: 100px) and (max-width: 450px) {
          .profile-gestion-wrapper {
            flex-direction: column;
            gap: 2px;
          }
        }

        /* Reducción elementos 40% en pantallas 100px - 450px */
        @media (min-width: 100px) and (max-width: 450px) {
          .nav-shrink {
            font-size: 0.54rem !important;
          }
          .btn-sun-glow {
            padding: 4.8px 9.6px !important;
            font-size: 0.54rem !important;
          }
          .menu-toggle {
            padding: 3px 6px !important;
            font-size: 0.54rem !important;
          }
        }

        @media (min-width: 780px) and (max-width: 980px) {
          .hide-contacto-range {
            display: none;
          }
        }
        @media (min-width: 780px) and (max-width: 880px) {
          .hide-preguntas-range {
            display: none;
          }
        }
        @media (min-width: 780px) {
          .desktop-menu {
            display: block;
          }
        }

        @media (max-width: 779px) {
          .desktop-menu {
            display: none;
          }
          .hamburger-wrapper {
            display: block;
            position: relative;
          }
          .menu-toggle {
            background: none;
            border: 2px solid #ff007f;
            color: #ff007f;
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
          }
          .mobile-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: #0a0a0a;
            width: 100%;
            flex-direction: column;
            padding: 20px;
            border-bottom: 1px solid #333;
          }
          .mobile-menu.open {
            display: flex;
            gap: 15px;
          }
        }

        @keyframes logoNeonPulse {
          0%,
          100% {
            filter: drop-shadow(0 0 4px rgba(255, 0, 127, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(255, 0, 127, 0.85));
          }
        }
        .pulse-logo {
          animation: logoNeonPulse 3s infinite ease-in-out;
        }
        .header-menu li a,
        .header-auth a,
        .mobile-menu a {
          color: #fff;
          text-decoration: none;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9rem;
        }
        .nav-item-active {
          color: #ff007f !important;
        }
        .btn-sun-glow {
          background-color: #0a0a0a;
          border: 2px solid #ff007f;
          color: #ff007f;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
