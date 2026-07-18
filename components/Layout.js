import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "./Header";

export default function Layout({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [userRol, setUserRol] = useState(null);
  const router = useRouter();

  const checkUser = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("cliente_keilyndas");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setIsLogged(true);
          setUserRol(parsedUser.rol);
        } catch (error) {
          console.error("Error al parsear el cliente", error);
          setIsLogged(false);
          setUserRol(null);
        }
      } else {
        setIsLogged(false);
        setUserRol(null);
      }
    }
  };

  useEffect(() => {
    checkUser();

    window.addEventListener("storage", checkUser);
    window.addEventListener("local-login", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("local-login", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cliente_keilyndas");
    setIsLogged(false);
    setUserRol(null);
    router.push("/");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header
        isLogged={isLogged}
        userRol={userRol}
        handleLogout={handleLogout}
      />

      <main className="flex-center" style={{ flex: "1 0 auto", width: "100%" }}>
        {children}
      </main>

      <footer
        className="footer-main"
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#0a0a0a",
          borderTop: "1px solid rgba(255, 0, 127, 0.15)",
        }}
      >
        <div style={{ flex: "1 1 0%", textAlign: "left" }}>
          <Link href="/terminos" className="footer-link">
            Términos, Condiciones y Políticas de Servicio
          </Link>
        </div>

        <div style={{ flex: "1 1 0%", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#b0b0b0",
              display: "inline-block",
            }}
          >
            &copy; {new Date().getFullYear()} Keilyndas. Desarrollado por Gozzo.
          </p>
        </div>

        <div
          style={{ flex: "1 1 0%", display: "block" }}
          className="footer-spacer"
        />

        <style jsx>{`
          :global(.footer-link) {
            color: #b0b0b0;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s ease;
          }
          :global(.footer-link:hover) {
            color: #ff007f;
            text-decoration: underline;
          }
          @media (max-width: 768px) {
            .footer-main {
              flex-direction: column;
              gap: 12px;
              text-align: center;
              padding: 20px;
            }
            .footer-spacer {
              display: none !important;
            }
          }
        `}</style>
      </footer>
    </div>
  );
}
