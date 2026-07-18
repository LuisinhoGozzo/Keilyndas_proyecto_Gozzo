import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/perfil.module.scss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Patrón y función de validación estricta
const namePattern = /^(?=.*?[A-ZÁÉÍÓÚÑ])(?=.*?[a-záéíóúñ])(?=.*?[\s]).{7,70}$/;

// Regex estricta para el email
const emailPattern =
  /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._-]{4,62}[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9-]{3,62}[a-zA-Z0-9]\.[a-zA-Z]{2,4}$/i;

const validarNombre = (nombre) => {
  if (/\d/.test(nombre)) return false;
  if (!namePattern.test(nombre)) return false;
  if (/[ `~!@#$%^&*()_+\-=[{\]}\|'";:/?.>,<]/.test(nombre.replace(/\s/g, "")))
    return false;
  if (/(.)\1\1/.test(nombre)) return false;
  if (/[aeiouáéíóúñ]{3}/i.test(nombre)) return false;
  if (/[bcdfghjklmnpqrstvwxyz]{5}/i.test(nombre)) return false;

  const vocales = "aeiouáéíóúñ";
  const consonantes = "bcdfghjklmnpqrstvwxyz";

  if (/\s[a-zA-ZáéíóúñÁÉÍÓÚÑ]{1}$/.test(nombre)) return false;
  if (/^[a-zA-ZáéíóúñÁÉÍÓÚÑ]{1}\s/.test(nombre)) return false;

  const regexCons2Pre = new RegExp(`\\s[${consonantes}]{2}$`, "i");
  const regexCons2Suc = new RegExp(`^[${consonantes}]{2}\\s`, "i");
  if (regexCons2Pre.test(nombre) || regexCons2Suc.test(nombre)) return false;

  const regexVoc2Pre = new RegExp(`\\s[${vocales}]{2}$`, "i");
  const regexVoc2Suc = new RegExp(`^[${vocales}]{2}\\s`, "i");
  if (regexVoc2Pre.test(nombre) || regexVoc2Suc.test(nombre)) return false;

  if (/[áéíóúÁÉÍÓÚ]{2}/.test(nombre)) return false;
  if (/ññ/i.test(nombre)) return false;
  if (/[A-ZÁÉÍÓÚÑ]{2,}/.test(nombre.replace(/\s/g, ""))) return false;
  if (/\s{2,}/.test(nombre)) return false;

  return true;
};

export default function Perfil() {
  const router = useRouter();
  const [cliente, setCliente] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
  });
  const [formData, setFormData] = useState({ nombre_completo: "", email: "" });
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [misCitas, setMisCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);

  const inicializarPerfil = () => {
    const storedUser = localStorage.getItem("cliente_keilyndas");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userData = {
          nombre_completo:
            parsedUser.nombre_completo ||
            parsedUser.nombre ||
            "Cliente Keilyndas",
          email: parsedUser.email || "",
          telefono: parsedUser.telefono || "",
        };
        setCliente(userData);
        setFormData({
          nombre_completo: userData.nombre_completo,
          email: userData.email,
        });
        cargarCitas(userData.email);
      } catch (e) {
        setLoadingCitas(false);
      }
    } else {
      setLoadingCitas(false);
    }
  };

  useEffect(() => {
    inicializarPerfil();
    window.addEventListener("focus", inicializarPerfil);
    return () => window.removeEventListener("focus", inicializarPerfil);
  }, []);

  const validarCampos = () => {
    let errs = {};
    const nombre = formData.nombre_completo || "";
    const email = formData.email || "";

    if (nombre.trim() === "") {
      errs.nombre_completo = "Debe llenar este campo";
    } else if (!validarNombre(nombre)) {
      errs.nombre_completo = "Formato de nombre inválido";
    }

    if (!email.trim()) {
      errs.email = "Debe llenar este campo";
    } else {
      const emailTrim = email.trim();
      const tienePuntosDobles = emailTrim.includes("..");
      const guionCercaArroba =
        emailTrim.includes("-@") || emailTrim.includes("@-");
      const puntoCercaArroba =
        emailTrim.includes(".@") || emailTrim.includes("@.");

      if (
        !emailPattern.test(emailTrim) ||
        tienePuntosDobles ||
        guionCercaArroba ||
        puntoCercaArroba
      ) {
        errs.email = "Formato de correo inválido";
      }
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const convertirA24h = (horaStr) => {
    if (!horaStr) return 0;
    const [time, ampm] = horaStr.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (ampm?.toUpperCase() === "PM" && h !== 12) h += 12;
    if (ampm?.toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  async function cargarCitas(emailCliente) {
    try {
      const res = await fetch(`/api/auth/gestion-citas?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const todas = Array.isArray(data) ? data : data.data || [];
      const filtradas = todas.filter(
        (c) => String(c.email).toLowerCase() === emailCliente.toLowerCase(),
      );
      filtradas.sort((a, b) => {
        const fechaA = new Date(a.fecha_cita);
        const fechaB = new Date(b.fecha_cita);
        return fechaB.getTime() !== fechaA.getTime()
          ? fechaB - fechaA
          : convertirA24h(b.hora_cita) - convertirA24h(a.hora_cita);
      });
      setMisCitas(filtradas);
    } catch (e) {
      setMisCitas([]);
    } finally {
      setLoadingCitas(false);
    }
  }

  const handleGuardar = async () => {
    if (!validarCampos()) return;
    try {
      const response = await fetch("/api/auth/actualiza-perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOriginal: cliente.email,
          nombre_completo: formData.nombre_completo.trim(),
          email: formData.email.trim().toLowerCase(),
          telefono: cliente.telefono,
        }),
      });
      if (response.status === 409) {
        setErrores({ email: "Email en uso" });
        return;
      }
      if (!response.ok) throw new Error("Error");
      const actualizado = {
        ...cliente,
        nombre_completo: formData.nombre_completo.trim(),
        email: formData.email.trim().toLowerCase(),
      };
      localStorage.setItem("cliente_keilyndas", JSON.stringify(actualizado));
      setCliente(actualizado);
      setEditando(false);
      setNotificacion("¡Perfil Actualizado Exitosamente!");
      setTimeout(() => setNotificacion(null), 3000);
    } catch (error) {
      setNotificacion("❌ Email ya en uso");
    }
  };

  return (
    <div className={styles.perfilContainer}>
      <style jsx global>{`
        @keyframes brilloSolar {
          0% {
            text-shadow:
              0 0 5px #ffcc00,
              0 0 10px #ffcc00,
              0 0 15px #ff9900;
            transform: scale(1);
          }
          50% {
            text-shadow:
              0 0 15px #fff,
              0 0 25px #ffcc00,
              0 0 35px #ff9900,
              0 0 45px #ff6600;
            transform: scale(1.1);
          }
          100% {
            text-shadow:
              0 0 5px #ffcc00,
              0 0 10px #ffcc00,
              0 0 15px #ff9900;
            transform: scale(1);
          }
        }
        @keyframes moverFlecha {
          0% {
            transform: translateX(10px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(-5px);
            opacity: 0;
          }
        }
        .brillo-sobre {
          display: inline-block;
          animation: brilloSolar 1.5s infinite ease-in-out;
          cursor: pointer;
        }
        .flecha-verde {
          display: inline-block;
          animation: moverFlecha 1s infinite;
          color: #00ff00;
          font-size: 1.8rem;
          margin-right: 5px;
        }
      `}</style>
      <Head>
        <title>Mi Perfil | Keilyndas</title>
      </Head>

      <h1 className={styles.titulo}>Mi Perfil</h1>

      <div className={styles.notificacionWrapper}>
        {notificacion && (
          <div className={styles.notificacionTexto}>{notificacion}</div>
        )}
      </div>

      <div className={styles.cardFormulario}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre Completo</label>
          {editando ? (
            <>
              <input
                className={styles.input}
                value={formData.nombre_completo}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_completo: e.target.value })
                }
                style={{
                  border: errores.nombre_completo
                    ? "1px solid red"
                    : "1px solid #ff007f",
                }}
              />
              {errores.nombre_completo && (
                <div className={styles.errorTexto}>
                  {errores.nombre_completo}
                </div>
              )}
            </>
          ) : (
            <p className={styles.textoInfo}>{cliente.nombre_completo}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Correo Electrónico</label>
          {editando ? (
            <>
              <input
                className={styles.input}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{
                  border: errores.email ? "1px solid red" : "1px solid #ff007f",
                }}
              />
              {errores.email && (
                <div className={styles.errorTexto}>{errores.email}</div>
              )}
            </>
          ) : (
            <p className={styles.textoInfo}>{cliente.email}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Teléfono</label>
          <p className={styles.textoTelefono}>{cliente.telefono}</p>
        </div>

        {editando ? (
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button className={styles.btnGuardar} onClick={handleGuardar}>
              Guardar cambios
            </button>
            <button
              className={styles.btnCancelar}
              onClick={() => {
                setEditando(false);
                setErrores({});
              }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            className={styles.btnEditar}
            onClick={() => setEditando(true)}
          >
            Editar Perfil
          </button>
        )}
      </div>

      <div className={styles.contenedorScroll}>
        <h2 style={{ color: "#fff", marginBottom: "20px" }}>
          📅 Historial de MIS CITAS ({misCitas.length})
        </h2>
        {loadingCitas ? (
          <p>Cargando citas...</p>
        ) : (
          <table className={styles.tablaGestion}>
            <thead>
              <tr>
                <th>Sistema</th>
                <th>Tamaño</th>
                <th>Estilo</th>
                <th>Diseño</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Remoción</th>
                <th>Total</th>
                <th>Depósito</th>
                <th>Estado</th>
                <th>MENSAJE</th>
              </tr>
            </thead>
            <tbody>
              {misCitas.map((c, i) => {
                const esVisible = [
                  "pendiente",
                  "confirmada",
                  "rechazada",
                ].includes(c.estado);
                return (
                  <tr key={i}>
                    <td>{c.sistema}</td>
                    <td>{c.tamano}</td>
                    <td>{c.estilo}</td>
                    <td>{c.diseno}</td>
                    <td>{c.fecha_cita?.split("T")[0]}</td>
                    <td>{c.hora_cita}</td>
                    <td>
                      {c.tipo_servicio === "domicilio" ? "Domicilio" : "Local"}
                    </td>
                    <td>{c.remocion === "si" ? "SI" : "NO"}</td>
                    <td>
                      <span
                        style={{ color: esVisible ? "#fff" : "transparent" }}
                      >
                        ${c.monto_total || 0}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{ color: esVisible ? "#fff" : "transparent" }}
                      >
                        ${c.monto_deposito || 0}
                      </span>
                    </td>
                    <td>{c.estado}</td>
                    <td style={{ fontSize: "1.8rem" }}>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {c.estado === "confirmada" ? (
                          "✅"
                        ) : (
                          <>
                            {c.estado === "pendiente" && (
                              <span className="flecha-verde">←</span>
                            )}
                            <span
                              className={
                                c.estado === "pre-reservada"
                                  ? "brillo-sobre"
                                  : ""
                              }
                              onClick={() =>
                                c.estado === "pre-reservada" &&
                                router.push(`/dashboard/reserva?id=${c.id}`)
                              }
                            >
                              ✉️
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
