import Head from "next/head";
import styles from "../styles/index.module.scss";

export default function Inicio() {
  const testimonios = [
    {
      nombre: "Heiderly de Dumont.",
      origen: "vía WhatsApp",
      comentario:
        "¡Me encantaron! Pasaron las 3 semanas completas y el sistema está intacto, ni un solo levantamiento. El brillo sigue como el primer día. ✨",
      etiqueta: "Durabilidad",
    },

    {
      nombre: "Anais Diaz.",
      origen: "vía Instagram",
      comentario:
        "😍😍 que cuchitura ❤️ Que bellas Guaooo quede boca abierta 🔥🔥🔥🔥.",
      etiqueta: "Estética Impecable",
    },

    {
      nombre: "Adrianyelis Contreras.",
      origen: "vía WhatsApp",
      comentario:
        "Me encantaron, un trabajo espectacular super elegante, muy satisfecha con la atención. Estoy súper feliz con el resultado! 💕",
      etiqueta: "Atención Premium",
    },
  ];

  const handleNavigation = (e) => {
    e.preventDefault();
    const usuarioLogueado = localStorage.getItem("cliente_keilyndas");
    window.location.href = usuarioLogueado ? "/agendar" : "/login";
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Inicio | Keilyndas</title>
      </Head>

      <main className={styles.mainBox}>
        <h1 className={styles.titulo}>
          ¡DEJA TUS MANOS <br />
          <span>EN MIS MANOS!</span>
        </h1>
        <div className={styles.separador} />

        <p className={styles.descripcion}>
          Reserva tu cita personalizándola a tu gusto. Elige el sistema, tamaño,
          estilo y diseño ideales para lucir unas manos impecables.{" "}
          <a href="#" onClick={handleNavigation}>
            CREA TU CUENTA y ARMA TU ESTILO
          </a>
          !
        </p>
      </main>

      <section className={styles.seccionOpiniones}>
        <span className={styles.subtitulo}>Opiniones Reales</span>
        <h2 className={styles.tituloOpiniones}>💞 Clientas Felices</h2>

        <div className={styles.gridTestimonios}>
          {testimonios.map((t, idx) => (
            <div key={idx} className={styles.testimonioCard}>
              <div>
                <span className={styles.etiqueta}>{t.etiqueta}</span>
                <p className={styles.comentario}>"{t.comentario}"</p>
              </div>
              <div className={styles.footerCard}>
                <h4>{t.nombre}</h4>
                <span>{t.origen}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
