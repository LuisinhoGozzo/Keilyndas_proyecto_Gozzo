import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Reserva() {
  const router = useRouter();
  const { id } = router.query;
  const [cita, setCita] = useState(null);
  const [vista, setVista] = useState("confirmacion");
  const [ref, setRef] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [notificacion, setNotificacion] = useState(false);
  const [reservaEnviada, setReservaEnviada] = useState(false);
  const [fechaHoyVzla, setFechaHoyVzla] = useState("");

  const [datosPago, setDatosPago] = useState({
    nombreTitular: "",
    prefijoTelefono: "0412",
    telefonoTitular: "",
    cedulaTitular: "",
    bancoTitular: "",
    fechaPago: "",
    comprobante: null,
  });

  const soloLetras = (valor) => /^[a-zA-Z\s]*$/.test(valor);
  const soloNumeros = (valor) => /^[0-9]*$/.test(valor);

  useEffect(() => {
    const ahoraUTC = new Date();
    const utc = ahoraUTC.getTime() + ahoraUTC.getTimezoneOffset() * 60000;
    const ahoraVzla = new Date(utc + 3600000 * -4);
    const fechaString = `${ahoraVzla.getFullYear()}-${String(ahoraVzla.getMonth() + 1).padStart(2, "0")}-${String(ahoraVzla.getDate()).padStart(2, "0")}`;
    setFechaHoyVzla(fechaString);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/citas/admin-listar?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Cita no encontrada");
        return res.json();
      })
      .then((data) => setCita(data))
      .catch((err) => console.error("Error al cargar la cita:", err));
  }, [id]);

  const confirmarCita = async () => {
    if (ref.length < 10 || ref.length > 12) {
      alert("El número de referencia debe tener entre 10 y 12 dígitos.");
      return;
    }
    setEnviando(true);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("nombreCliente", cita?.nombre_cliente || "Cliente");
    formData.append("nombreTitular", datosPago.nombreTitular);
    formData.append(
      "telefonoTitular",
      datosPago.prefijoTelefono + datosPago.telefonoTitular,
    );
    formData.append("cedulaTitular", datosPago.cedulaTitular);
    formData.append("bancoTitular", datosPago.bancoTitular);
    formData.append("fechaPago", datosPago.fechaPago);
    formData.append("referencia", ref);
    formData.append(
      "fechaCita",
      cita?.fecha || cita?.fecha_cita || "No definida",
    );
    formData.append("horaCita", cita?.hora || cita?.hora_cita || "No definida");
    if (datosPago.comprobante)
      formData.append("comprobante", datosPago.comprobante);

    try {
      const response = await fetch("/api/enviar-reserva", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setReservaEnviada(true);
        setNotificacion(true);
        setTimeout(() => {
          setNotificacion(false);
          router.push("/dashboard/perfil");
        }, 8000);
      } else {
        alert("Error al enviar la información.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setEnviando(false);
    }
  };

  if (!cita)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
        Cargando detalles...
      </p>
    );

  const esFormularioValido =
    aceptaTerminos &&
    datosPago.nombreTitular &&
    datosPago.telefonoTitular.length === 7 &&
    datosPago.cedulaTitular.length >= 7 &&
    datosPago.cedulaTitular.length <= 8 &&
    datosPago.bancoTitular &&
    datosPago.fechaPago &&
    datosPago.comprobante &&
    ref.length >= 10 &&
    ref.length <= 12;

  const necesitaRemocion =
    String(cita.remocion || "")
      .trim()
      .toUpperCase() === "SI";

  return (
    <div
      style={{
        padding: "10px 20px",
        color: "#fff",
        maxWidth: "1000px",
        margin: "auto",
        fontFamily: "sans-serif",
      }}
    >
      {notificacion ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#1c0914",
            borderRadius: "15px",
            border: "1px solid #ff007f",
          }}
        >
          <h2 style={{ color: "#ff007f" }}>RESERVA PENDIENTE</h2>
          <p>Su cita se confirmará en breve tras comprobar el pago inicial.</p>
        </div>
      ) : vista === "confirmacion" ? (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ff007f" }}>PRESUPUESTO DE CITA</h1>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              maxWidth: "800px",
              margin: "0 auto 20px auto",
            }}
          >
            Estimad@ <strong>{cita.nombre_cliente}</strong>, debido a que usted
            ha elegido el sistema <strong>{cita.sistema}</strong>, tamaño{" "}
            <strong>{cita.tamano}</strong>, el estilo{" "}
            <strong>{cita.estilo}</strong>, el diseño{" "}
            <strong>{cita.diseno}</strong>,
            {cita.tipo_servicio === "domicilio" && (
              <span>
                {" "}
                necesita que nos dirijamos hacia su ubicación (
                <strong>{cita.direccion}</strong>),
              </span>
            )}
            {necesitaRemocion &&
              " y también necesita que le hagamos una remoción de material externo,"}{" "}
            aquí le indicamos que este sería el presupuesto:
          </p>
          <div
            style={{
              background: "#1c0914",
              padding: "20px",
              borderRadius: "10px",
              margin: "20px auto",
              borderLeft: "5px solid #ff007f",
              display: "inline-block",
              textAlign: "left",
            }}
          >
            <p>
              Monto Total:{" "}
              <strong>${parseFloat(cita.monto_total || 0).toFixed(2)}</strong>
            </p>
            <p>
              Depósito Inicial:{" "}
              <strong>
                ${parseFloat(cita.monto_deposito || 0).toFixed(2)} (PAGO MÓVIL)
              </strong>
            </p>
          </div>
          <h3>¿Está usted de acuerdo con este presupuesto?</h3>
          <div
            style={{ display: "flex", gap: "20px", justifyContent: "center" }}
          >
            <button
              onClick={() => !reservaEnviada && setVista("pago")}
              disabled={reservaEnviada}
              style={{
                background: "#00ff00",
                padding: "10px 30px",
                border: "none",
                cursor: "pointer",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              {reservaEnviada ? "YA SOLICITADO" : "SI"}
            </button>
            <button
              onClick={() => router.back()}
              style={{
                background: "#ff0000",
                padding: "10px 30px",
                border: "none",
                cursor: "pointer",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              NO
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "-20px" }}>
          <h1
            style={{
              color: "#ff007f",
              textAlign: "center",
              fontSize: "4rem",
              marginBottom: "10px",
            }}
          >
            PAGO MÓVIL
          </h1>
          <div
            style={{
              display: "flex",
              gap: "50px",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  border: "4px solid #ff007f",
                  borderRadius: "50%",
                  width: "280px",
                  height: "280px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "yellow",
                    fontSize: "1.6rem",
                    fontWeight: "bold",
                  }}
                >
                  DEPÓSITO INICIAL
                </p>
                <h2 style={{ fontSize: "5.5rem", margin: "-14.1px 0" }}>
                  ${parseFloat(cita.monto_deposito || 0).toFixed(2)}
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: "yellow",
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                  }}
                >
                  TBCV
                </p>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "1.1rem",
                  lineHeight: "1.5",
                  color: "#ddd",
                }}
              >
                <p style={{ margin: "5px 0" }}>
                  <strong>Titular del beneficiario:</strong> KEILYN CHACÓN
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Banco del beneficiario:</strong> PROVINCIAL (0114)
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Cédula del beneficiario:</strong> 18249182
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Teléfono del beneficiario:</strong> 04129643551
                </p>
              </div>
            </div>

            <div style={{ flex: "1", minWidth: "300px" }}>
              <input
                type="text"
                placeholder="NOMBRE DEL TITULAR EMISOR"
                value={datosPago.nombreTitular}
                onChange={(e) =>
                  soloLetras(e.target.value) &&
                  setDatosPago({ ...datosPago, nombreTitular: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  background: "#fff",
                  padding: "0 5px",
                }}
              >
                <select
                  value={datosPago.prefijoTelefono}
                  onChange={(e) =>
                    setDatosPago({
                      ...datosPago,
                      prefijoTelefono: e.target.value,
                    })
                  }
                  style={{
                    border: "none",
                    fontSize: "0.85rem",
                    background: "transparent",
                    cursor: "pointer",
                    outline: "none",
                    color: "#333",
                    padding: "5px 2px",
                    width: "25%",
                  }}
                >
                  {["0412", "0414", "0416", "0422", "0424", "0426"].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="TÉLEFONO DEL EMISOR"
                  maxLength={7}
                  value={datosPago.telefonoTitular}
                  onChange={(e) =>
                    soloNumeros(e.target.value) &&
                    setDatosPago({
                      ...datosPago,
                      telefonoTitular: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 10px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="CÉDULA DE IDENTIDAD DEL EMISOR"
                maxLength={8}
                value={datosPago.cedulaTitular}
                onChange={(e) =>
                  soloNumeros(e.target.value) &&
                  setDatosPago({ ...datosPago, cedulaTitular: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
              <input
                type="text"
                placeholder="BANCO EMISOR"
                value={datosPago.bancoTitular}
                onChange={(e) =>
                  setDatosPago({ ...datosPago, bancoTitular: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
              <input
                type="date"
                max={fechaHoyVzla}
                value={datosPago.fechaPago}
                onChange={(e) =>
                  setDatosPago({ ...datosPago, fechaPago: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "none",
                }}
              />
              <input
                type="text"
                placeholder="NÚMERO DE REFERENCIA"
                value={ref}
                onChange={(e) =>
                  soloNumeros(e.target.value) &&
                  e.target.value.length <= 12 &&
                  setRef(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "none",
                }}
              />

              <div style={{ marginBottom: "15px" }}>
                <label>Adjuntar Comprobante: </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setDatosPago({
                      ...datosPago,
                      comprobante: e.target.files[0],
                    })
                  }
                />
              </div>

              <label
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                />
                <span>Acepto los términos y confirmo los datos.</span>
              </label>

              <button
                onClick={confirmarCita}
                disabled={!esFormularioValido || enviando}
                style={{
                  width: "100%",
                  padding: "15px",
                  marginTop: "20px",
                  background:
                    esFormularioValido && !enviando ? "#ff007f" : "#555",
                  border: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor:
                    esFormularioValido && !enviando ? "pointer" : "not-allowed",
                }}
              >
                {enviando ? "PROCESANDO..." : "CONFIRMAR CITA"}
              </button>
              <p
                onClick={() => setVista("confirmacion")}
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  marginTop: "15px",
                }}
              >
                ← Regresar
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
