import { useState, useEffect } from "react";
import Head from "next/head";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [errores, setErrores] = useState({});
  const [status, setStatus] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    if (status.tipo === "exito") {
      const timer = setTimeout(() => {
        setStatus({ texto: "", tipo: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validación Nombre
    if (!formData.nombre.trim())
      nuevosErrores.nombre = "Debe llenar este campo";
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre))
      nuevosErrores.nombre = "Solo se permiten letras";
    else if (formData.nombre.length < 7 || formData.nombre.length > 70)
      nuevosErrores.nombre = "Solo se permiten 7-70 caracteres";

    // Validación Email (Estricta)
    const emailTrim = formData.email.trim();
    if (!emailTrim) {
      nuevosErrores.email = "Debe llenar este campo";
    } else {
      const regexEmail =
        /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._-]{4,62}[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9-]{3,62}[a-zA-Z0-9]\.[a-zA-Z]{2,4}$/i;

      const tienePuntosDobles = emailTrim.includes("..");
      const guionCercaArroba =
        emailTrim.includes("-@") || emailTrim.includes("@-");
      const puntoCercaArroba =
        emailTrim.includes(".@") || emailTrim.includes("@.");

      if (
        !regexEmail.test(emailTrim) ||
        tienePuntosDobles ||
        guionCercaArroba ||
        puntoCercaArroba
      ) {
        nuevosErrores.email = "Formato de correo inválido";
      }
    }

    // Validación Teléfono
    if (!formData.telefono.trim())
      nuevosErrores.telefono = "Debe llenar este campo";
    else if (!/^\d+$/.test(formData.telefono))
      nuevosErrores.telefono = "Solo se permiten números";
    else if (
      !["0212", "0412", "0414", "0416", "0422", "0424", "0426"].some((p) =>
        formData.telefono.startsWith(p),
      )
    )
      nuevosErrores.telefono = "Número Inválido";
    else if (formData.telefono.length !== 11)
      nuevosErrores.telefono =
        "Solo se permiten números de telefonía venezolana";

    // Validación Mensaje
    if (!formData.mensaje.trim())
      nuevosErrores.mensaje = "Debe llenar este campo";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setStatus({ texto: "Enviando mensaje...", tipo: "info" });

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ texto: "¡Mensaje enviado con éxito!", tipo: "exito" });
        setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
        setErrores({});
      } else {
        setStatus({ texto: "Hubo un problema al enviar.", tipo: "error" });
      }
    } catch (error) {
      setStatus({ texto: "Error de conexión.", tipo: "error" });
    }
  };

  const renderError = (campo) =>
    errores[campo] && (
      <p
        style={{
          color: "#ffd700",
          fontSize: "0.8rem",
          margin: "5px 0 10px 5px",
        }}
      >
        {errores[campo]}
      </p>
    );

  const canalesInfo = [
    {
      id: "instagram",
      icono: (
        <svg
          viewBox="0 0 448 512"
          style={{ width: "24px", height: "24px", fill: "#E1306C" }}
        >
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8c14.8 0 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM402.4 377c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
        </svg>
      ),
      titulo: "Instagram",
      detalle: "@beautyhands.beautynails",
      link: "https://instagram.com/beautyhands.beautynails",
      color: "#E1306C",
    },
    {
      id: "whatsapp",
      icono: (
        <svg
          viewBox="0 0 448 512"
          style={{ width: "24px", height: "24px", fill: "#25D366" }}
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      ),
      titulo: "WhatsApp",
      detalle: "0412-9643551",
      link: "https://wa.me/584129643551?text=Hola%20Keilyndas!%20Me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n.",
      color: "#25D366",
    },
    {
      id: "ubicacion",
      icono: (
        <svg
          viewBox="0 0 384 512"
          style={{ width: "24px", height: "24px", fill: "#ffd166" }}
        >
          <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
        </svg>
      ),
      titulo: "Ubicación",
      detalle: "Carrizal, Miranda (Sector Mérida, calle Landa, local Z-88)",
      link: "https://www.google.com/maps/dir//10.3612412,-67.0045855/@10.3613507,-67.0050843,19z?entry=ttu&g_ep=EgoyMDI2MDYyMy4wIKXMDSoASAFQAw%3D%3D",
      color: "#ffd166",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "transparent",
        minHeight: "100vh",
        marginTop: "-3rem",
        marginBottom: "-5rem",
        padding: "30px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <Head>
        <title>Contacto | Keilyndas</title>
      </Head>
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              color: "#ff007f",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Ponte en Contacto
          </span>
          <h1
            style={{
              color: "#fff",
              fontSize: "3rem",
              fontWeight: "900",
              marginTop: "10px",
              textTransform: "uppercase",
            }}
          >
            Escríbenos
          </h1>
        </div>
        <div className="seccion-contacto-wrapper">
          <div
            style={{
              backgroundColor: "#1c0914",
              border: "2px solid #ff007f",
              borderRadius: "20px",
              padding: "40px 30px",
              marginTop: "-2rem",
            }}
          >
            <h2
              style={{
                color: "#fff",
                marginBottom: "25px",
                borderBottom: "1px dashed #ff007f",
                paddingBottom: "10px",
              }}
            >
              ✉️ Envía un mensaje directo
            </h2>
            {status.texto && (
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center",
                  backgroundColor:
                    status.tipo === "exito" ? "transparent" : "#4a1212",
                  color: status.tipo === "exito" ? "#52b788" : "#e63946",
                  border:
                    status.tipo === "exito" ? "1px solid #52b788" : "none",
                }}
              >
                {status.texto}
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu Nombre Completo"
                className="input-contacto"
              />
              {renderError("nombre")}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
                className="form-row-mobile"
              >
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Tu email"
                    className="input-contacto"
                  />
                  {renderError("email")}
                </div>
                <div>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Tu número de teléfono"
                    className="input-contacto"
                  />
                  {renderError("telefono")}
                </div>
              </div>
              <textarea
                name="mensaje"
                rows="4"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="¿En qué te ayudamos?"
                className="input-contacto"
                style={{ resize: "none" }}
              />
              {renderError("mensaje")}
              <button
                type="submit"
                style={{
                  backgroundColor: "#ff007f",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
          <div
            style={{
              backgroundColor: "#12040d",
              border: "2px dashed rgba(255, 0, 127, 0.4)",
              borderRadius: "20px",
              padding: "40px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginTop: "-2rem",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "1.3rem",
                marginBottom: "20px",
              }}
            >
              ¿O prefieres desde aquí?
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "35px" }}
            >
              {canalesInfo.map((canal) => {
                const Contenedor = canal.link ? "a" : "div";
                return (
                  <Contenedor
                    key={canal.id}
                    href={canal.link}
                    target="_blank"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      textDecoration: "none",
                    }}
                  >
                    {canal.icono}
                    <div>
                      <h4
                        style={{
                          color: canal.color,
                          margin: 0,
                          fontSize: "1.1rem",
                        }}
                      >
                        {canal.titulo}
                      </h4>
                      <p
                        style={{
                          color: "#fff",
                          margin: 0,
                          fontSize: "0.95rem",
                        }}
                      >
                        {canal.detalle}
                      </p>
                    </div>
                  </Contenedor>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .seccion-contacto-wrapper {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
        }
        .input-contacto {
          width: 100%;
          background-color: #0d0309;
          border: 1px solid rgba(255, 0, 127, 0.4);
          border-radius: 8px;
          padding: 12px;
          color: #fff;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0px 1000px #0d0309 inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        @media (max-width: 900px) {
          .seccion-contacto-wrapper {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
