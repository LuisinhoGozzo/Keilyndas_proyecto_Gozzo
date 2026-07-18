import Head from "next/head";
import styles from "../styles/cuidados.module.scss";

export default function Cuidados() {
  const tipsMantenimiento = [
    {
      icono: "🧴",
      titulo: "Usa aceite de cutículas diariamente",
      descripcion:
        "Mantiene la piel que rodea la uña hidratada, previniendo levantamientos del producto y padrastros dolorosos. ¡Una cutícula sana es el secreto de un sistema duradero!",
    },
    {
      icono: "🧤",
      titulo: "Usa guantes al limpiar",
      descripcion:
        "Los productos químicos del hogar, los detergentes y el agua prolongada debilitan el acrílico o el gel. Protege tus manos y tu set usando guantes de goma.",
    },
    {
      icono: "🛠️",
      titulo: "No las uses como herramientas",
      descripcion:
        "Tus uñas son joyas, no destornilladores ni abrelatas. Evita forzarlas al abrir latas de refresco, raspar etiquetas o teclear con fuerza excesiva.",
    },
    {
      icono: "⏳",
      titulo: "Agenda tu mantenimiento a tiempo",
      descripcion:
        "El crecimiento natural de tu uña desplaza el punto de equilibrio estructural. No dejes pasar más de 21 a 30 días para evitar palancas que puedan fisurar tu uña natural.",
    },
    {
      icono: "🚫",
      titulo: "Jamás te arranques el sistema",
      descripcion:
        "Si un borde se levanta, no lo tires. Al arrancarlo, desprendes capas de tu uña natural, dejándola delgada como el papel. Acude siempre a un retiro profesional.",
    },
  ];

  const señalesAlerta = [
    {
      titulo: "Mantenimiento Necesario",
      tiempo: "Cada 3 semanas (21 - 30 días)",
      items: [
        "Crecimiento visible en la zona de la cutícula.",
        "Ligero cambio en el balance del peso de la uña.",
        "El diseño ya perdió su brillo original.",
      ],
      color: "#ffd166",
      bg: "#2b2207",
      border: "#ffd166",
    },
    {
      titulo: "Retiro Total Inmediato",
      tiempo: "Señales de alerta",
      items: [
        "Filtraciones de agua o desprendimientos evidentes (peligro de humedad/hongos).",
        "Dolor o molestia ante una presión mínima.",
        "Fisuras profundas que comprometan la uña natural.",
      ],
      color: "#e63946",
      bg: "#320e12",
      border: "#e63946",
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Cuidados | Keilyndas</title>
      </Head>

      <main className={styles.mainCard}>
        {/* CABECERA */}
        <div className={styles.header}>
          <span className={styles.subtitulo}>Salud & Estética</span>
          <h1 className={styles.titulo}>
            Guía de Cuidados <br />
            <span>para tus Uñas</span>
          </h1>
          <div className={styles.divider} />
          <p className={styles.descripcionHeader}>
            Para nosotros, tu salud natural es tan importante como un acabado
            impecable. Sigue estos consejos expertos para lucir un set perfecto
            y proteger tus uñas siempre.
          </p>
        </div>

        {/* SECCIÓN TIPS */}
        <div className={styles.bloqueSeccion}>
          <h2 className={styles.seccionTitulo}>
            ✨ Tips de Oro para Alargar tu Set
          </h2>
          <div className={styles.gridTips}>
            {tipsMantenimiento.map((tip, index) => (
              <div key={index} className={styles.tipCard}>
                <div className={styles.icono}>{tip.icono}</div>
                <h3 className={styles.tipTitulo}>{tip.titulo}</h3>
                <p className={styles.tipDescripcion}>{tip.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN ALERTAS */}
        <div className={styles.bloqueSeccion}>
          <h2 className={styles.seccionTitulo}>
            📅 ¿Mantenimiento o Retiro Profesional?
          </h2>
          <div className={styles.gridAlertas}>
            {señalesAlerta.map((alerta, index) => (
              <div
                key={index}
                className={styles.alertaCard}
                style={{
                  backgroundColor: alerta.bg,
                  borderColor: alerta.border,
                  boxShadow: `0px 0px 20px ${alerta.color}15`,
                }}
              >
                <span
                  className={styles.badge}
                  style={{
                    backgroundColor: alerta.color,
                    color: index === 0 ? "#000" : "#fff",
                  }}
                >
                  {alerta.tiempo}
                </span>
                <h3 className={styles.alertaTitulo}>{alerta.titulo}</h3>
                <ul className={styles.listaAlerta}>
                  {alerta.items.map((item, i) => (
                    <li key={i} className={styles.itemAlerta}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
