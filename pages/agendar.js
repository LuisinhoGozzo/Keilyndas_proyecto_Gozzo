import { useState, useMemo, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const descripcionesSistemas = {
  Semipermanente:
    "Color de alta duración curado en lámpara. Mantiene brillo espejo de 15 a 21 días en tu uña natural. Es la opción ideal si buscas un resultado súper natural y un color impecable por hasta dos semanas.",
  "Soft Gel":
    "La opción perfecta si buscas lucir un largo espectacular pero valoras la rapidez y la ligereza. Son tips de gel que se adhieren a tu uña, logrando una extensión hermosa, flexible y con acabado impecable.",
  "Kapping con Polygel":
    "Si tus uñas tienden a quebrarse y quieres mantener tu largo, este sistema es una maravilla. Funciona como un escudo protector que aporta flexibilidad y ligereza sin que se sientan pesadas.",
  Acrílico:
    "Si sueñas con lucir uñas largas, estilizadas y llamativas, este es el clásico infalible. Permite esculpir la longitud y forma exacta que desees, garantizando una estructura fuerte y duradera.",
  "Kapping con Acrílico":
    "Tiene el mismo objetivo de proteger y dar fuerza a tu uña natural para que crezca, pero usando una capa de máxima dureza. Es ideal si tus manos tienen mucho trote diario y necesitas resistencia extra.",
};

const descripcionesDiseno = {
  Sencillo: "Unicolor, con stickers, trazos sencillos por uña.",
  Medio: "Trazos elaborados, Decorados con adornos, por set.",
  Difícil: "Francesa, Coreana, Pedrería, Decogel, 3D, por set.",
};

export default function Agendar() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const bloqueoClic = useRef(false);
  const [notificacion, setNotificacion] = useState("");

  const [sel, setSel] = useState({
    sistema: null,
    tamano: null,
    estilo: null,
    diseno: null,
  });
  const [hoveredItem, setHoveredItem] = useState({
    categoria: null,
    nombre: null,
  });
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [ocupadas, setOcupadas] = useState([]);
  const [tipoServicio, setTipoServicio] = useState("local");
  const [direccionExacta, setDireccionExacta] = useState("");
  const [remocion, setRemocion] = useState("no");
  const [fotoReferencia, setFotoReferencia] = useState("");

  useEffect(() => {
    if (fecha) {
      fetch(`/api/citas/disponibles?fecha=${fecha}`)
        .then((res) => res.json())
        .then((data) => setOcupadas(data))
        .catch((err) => console.error("Error cargando disponibilidad:", err));
    }
  }, [fecha]);

  const opciones = {
    sistema: [
      { n: "Semipermanente", p: 12, img: "1-1Semipermanente.jpg" },
      { n: "Soft Gel", p: 18, img: "1-2Soft Gel.jpg" },
      { n: "Kapping con Polygel", p: 15, img: "1-3Kapping con Polygel.jpg" },
      { n: "Acrílico", p: 25, img: "1-4Acrílico.jpg" },
      { n: "Kapping con Acrílico", p: 18, img: "1-5Kapping con Acrílico.jpg" },
    ],
    tamano: [
      { n: "Corta", p: 0, img: "2-1corta.jpg" },
      { n: "Mediana", p: 0, img: "2-2mediana.jpg" },
      { n: "Larga", p: 0, img: "2-3larga.jpg" },
      { n: "Extralarga", p: 5, img: "2-4extralarga.jpg" },
    ],
    estilo: [
      { n: "Cuadrada", p: 0, img: "3-1cuadrada.jpg" },
      { n: "Almond", p: 0, img: "3-2almond.jpg" },
      { n: "Coffin", p: 0, img: "3-3coffin.jpg" },
      { n: "Stiletto", p: 0, img: "3-4stiletto.jpg" },
    ],
    diseno: [
      { n: "Sencillo", p: 0, img: "4-1sencillo.jpg" },
      { n: "Medio", p: 5, img: "4-2medio.jpg" },
      { n: "Difícil", p: 10, img: "4-3dificil.jpg" },
    ],
  };

  const total = useMemo(() => {
    let sub =
      (sel.sistema?.p || 0) +
      (sel.tamano?.p || 0) +
      (sel.estilo?.p || 0) +
      (sel.diseno?.p || 0);
    if (tipoServicio === "domicilio") sub += 5;
    if (remocion === "si") sub += 5;
    return sub;
  }, [sel, tipoServicio, remocion]);

  const generarFechas = () => {
    let dias = [];
    let d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    let dVzla = new Date(utc + 3600000 * -4);

    for (let i = 0; i < 7; i++) {
      if (dVzla.getDay() !== 0) {
        const year = dVzla.getFullYear();
        const month = String(dVzla.getMonth() + 1).padStart(2, "0");
        const day = String(dVzla.getDate()).padStart(2, "0");
        dias.push({
          label: dVzla.toLocaleDateString("es-VE", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
          value: `${year}-${month}-${day}`,
        });
      }
      dVzla.setDate(dVzla.getDate() + 1);
    }
    return dias;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Archivo muy pesado.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFotoReferencia(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const confirmarCita = async () => {
    const storedUser = localStorage.getItem("cliente_keilyndas");
    if (!storedUser) {
      alert("Por favor, inicia sesión para poder agendar.");
      return;
    }
    const user = JSON.parse(storedUser);

    if (bloqueoClic.current) return;
    bloqueoClic.current = true;
    setEnviando(true);
    setNotificacion(
      "Tu cita ha sido PRE-RESERVADA. (TIEMPO LÍMITE: 30 MIN - 2 HORAS) Verifique su email y su historial de citas de esta cuenta",
    );

    const bodyData = {
      nombre_completo: user.nombre_completo || "Cliente",
      email: user.email,
      telefono: user.telefono,
      sistema: sel.sistema?.n,
      tamano: sel.tamano?.n,
      estilo: sel.estilo?.n,
      diseno: sel.diseno?.n,
      fecha_cita: fecha,
      hora_cita: hora,
      monto_total: total,
      monto_deposito: total / 2,
      ref_deposito: "0",
      tipo_servicio: tipoServicio,
      direccion: tipoServicio === "domicilio" ? direccionExacta : "Local",
      remocion: remocion,
      foto_referencia: fotoReferencia,
    };

    try {
      const res = await fetch("/api/citas/enviar-cita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setNotificacion("");
          router.push("/dashboard/perfil");
        }, 1000);
      } else {
        setNotificacion("");
        alert("Error: " + data.message);
        bloqueoClic.current = false;
        setEnviando(false);
      }
    } catch (err) {
      setNotificacion("");
      alert("Error de conexión.");
      bloqueoClic.current = false;
      setEnviando(false);
    }
  };

  return (
    <div
      className="flex-center"
      style={{ width: "95%", maxWidth: "1300px", margin: "0 auto" }}
    >
      <Head>
        <title>Arma tu estilo | Keilyndas</title>
      </Head>
      {notificacion && (
        <div className="notificacion-overlay">{notificacion}</div>
      )}
      <h1 className="title-center" style={{ textTransform: "uppercase" }}>
        Arma tu estilo
      </h1>

      {Object.keys(opciones).map((cat) => (
        <div
          key={cat}
          className="categoria-box"
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto 35px auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              fontSize: "1.7rem",
              color: "#fff",
            }}
          >
            Elige el{" "}
            {cat === "tamano" ? "tamaño" : cat === "diseno" ? "diseño" : cat}
          </h2>
          <div
            className="grid-seleccion"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "30px",
            }}
          >
            {opciones[cat].map((item) => (
              <div
                key={item.n}
                className={`card-item ${sel[cat]?.n === item.n ? "active" : ""}`}
                onClick={() => setSel({ ...sel, [cat]: item })}
                onMouseEnter={() =>
                  (cat === "sistema" || cat === "diseno") &&
                  setHoveredItem({ categoria: cat, nombre: item.n })
                }
                onMouseLeave={() =>
                  setHoveredItem({ categoria: null, nombre: null })
                }
                style={{
                  width: "210px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "15px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {hoveredItem.categoria === cat &&
                  hoveredItem.nombre === item.n && (
                    <div className="ovalo-info">
                      <strong
                        style={{
                          display: "block",
                          color: "#ff007f",
                          marginBottom: "5px",
                        }}
                      >
                        {item.n.toUpperCase()}
                      </strong>
                      {cat === "sistema"
                        ? descripcionesSistemas[item.n]
                        : descripcionesDiseno[item.n]}
                    </div>
                  )}
                <div
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`/assets/${item.img}`}
                    alt={item.n}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    marginTop: "5px",
                  }}
                >
                  {item.n}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <select
        value={fecha}
        onChange={(e) => {
          setFecha(e.target.value);
          setHora("");
        }}
        style={{ maxWidth: "500px", width: "100%", margin: "10px auto" }}
      >
        <option value="">Selecciona Fecha</option>
        {generarFechas().map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {(() => {
        const horasBase = ["08:00 AM", "11:30 AM", "03:30 PM"];
        const ahoraUTC = new Date();
        const utc = ahoraUTC.getTime() + ahoraUTC.getTimezoneOffset() * 60000;
        const ahoraVzla = new Date(utc + 3600000 * -4);
        const hoyVzla = `${ahoraVzla.getFullYear()}-${String(ahoraVzla.getMonth() + 1).padStart(2, "0")}-${String(ahoraVzla.getDate()).padStart(2, "0")}`;
        const horaActualEnMinutos =
          ahoraVzla.getHours() * 60 + ahoraVzla.getMinutes();
        const esHoy = fecha === hoyVzla;

        const horasDisponibles = horasBase.filter((h) => {
          const [time, period] = h.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;
          const horaEnMinutos = hours * 60 + minutes;

          if (esHoy) {
            return horaEnMinutos > horaActualEnMinutos && !ocupadas.includes(h);
          }
          return !ocupadas.includes(h);
        });

        return (
          <select
            onChange={(e) => setHora(e.target.value)}
            value={hora}
            style={{ maxWidth: "500px", width: "100%", margin: "10px auto" }}
          >
            <option value="">
              {!fecha
                ? "Primero selecciona una fecha"
                : horasDisponibles.length === 0
                  ? "NO HAY HORAS DISPONIBLES"
                  : "Selecciona Hora"}
            </option>
            {horasDisponibles.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        );
      })()}

      <div
        className="categoria-box"
        style={{ maxWidth: "500px", margin: "20px auto" }}
      >
        <h2 style={{ color: "#ff007f", textAlign: "center" }}>
          ¿Dónde deseas recibir tu servicio?
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <label>
            <input
              type="radio"
              checked={tipoServicio === "local"}
              onChange={() => setTipoServicio("local")}
            />{" "}
            Local
          </label>
          <label>
            <input
              type="radio"
              checked={tipoServicio === "domicilio"}
              onChange={() => setTipoServicio("domicilio")}
            />{" "}
            A domicilio
          </label>
        </div>
        {tipoServicio === "domicilio" && (
          <input
            type="text"
            placeholder="Dirección exacta..."
            onChange={(e) => setDireccionExacta(e.target.value)}
            style={{ width: "100%", marginTop: "10px" }}
          />
        )}
      </div>

      <div
        className="categoria-box"
        style={{ maxWidth: "500px", margin: "20px auto" }}
      >
        <h2 style={{ color: "#ff007f", textAlign: "center" }}>
          ¿Necesitas remoción de material externo?
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <label>
            <input
              type="radio"
              checked={remocion === "si"}
              onChange={() => setRemocion("si")}
            />{" "}
            SI
          </label>
          <label>
            <input
              type="radio"
              checked={remocion === "no"}
              onChange={() => setRemocion("no")}
            />{" "}
            NO
          </label>
        </div>
      </div>

      <div style={{ maxWidth: "500px", margin: "20px auto" }}>
        <h2 style={{ color: "#ff007f" }}>
          Envía por aquí una Foto referencial sobre el diseño que usted desea:
        </h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button
        className="btn-morado"
        onClick={confirmarCita}
        disabled={
          enviando ||
          !sel.sistema ||
          !sel.tamano ||
          !sel.estilo ||
          !sel.diseno ||
          !fecha ||
          !hora ||
          !fotoReferencia
        }
        style={{ display: "block", margin: "20px auto" }}
      >
        {enviando ? "PROCESANDO..." : "PRE-RESERVA"}
      </button>

      <style jsx global>{`
        .notificacion-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          background: #ff007f;
          color: #fff;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          max-width: 350px;
        }
        .ovalo-info {
          position: absolute;
          top: -160px;
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          background: #1c0914;
          color: #fff;
          padding: 15px;
          border-radius: 25px;
          z-index: 1000;
          border: 2px solid #ff007f;
          box-shadow: 0 4px 15px rgba(255, 0, 127, 0.3);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
