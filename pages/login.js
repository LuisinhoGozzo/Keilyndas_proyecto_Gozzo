import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/login.module.scss"; // Asegúrate de la ruta correcta

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", clave: "" });
  const [errores, setErrores] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrores({});
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem(
          "cliente_keilyndas",
          JSON.stringify({
            nombre_completo: data.nombre_completo,
            email: data.email,
            telefono: data.telefono,
            rol: data.rol,
          }),
        );
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("local-login"));
        router.push("/agendar");
      } else if (data.field) {
        setErrores({ [data.field]: data.message });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Login | Keilyndas</title>
      </Head>

      <main className={styles.loginMain}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "900",
            color: "#fff",
            textTransform: "uppercase",
          }}
        >
          Iniciar Sesión
        </h1>
        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "#ff007f",
            marginTop: "15px",
            marginBottom: "25px",
          }}
        />

        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={styles.loginInput}
              style={{ borderColor: errores.email ? "red" : undefined }}
            />
            {errores.email && (
              <div className={styles.errorText}>{errores.email}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={formData.clave}
              onChange={(e) =>
                setFormData({ ...formData, clave: e.target.value })
              }
              className={styles.loginInput}
              style={{ borderColor: errores.clave ? "red" : undefined }}
            />
            {errores.clave && (
              <div className={styles.errorText}>{errores.clave}</div>
            )}
          </div>

          <button type="submit" className={styles.btnIngresar}>
            Ingresar
          </button>
        </form>

        <p style={{ marginTop: "15px", color: "#ffccd8", fontSize: "0.95rem" }}>
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            style={{
              color: "#ff007f",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Regístrate aquí
          </Link>
        </p>
      </main>
    </div>
  );
}
