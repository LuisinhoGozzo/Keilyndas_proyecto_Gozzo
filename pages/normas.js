import Head from "next/head";
import styles from "../styles/normas.module.scss";

export default function Normas() {
  const sugerencias = [
    {
      t: "Puntualidad",
      d: "Por favor, llega a tiempo a tu cita. Esto nos ayuda a cumplir con los horarios y a brindarte el mejor servicio sin prisas.",
    },
    {
      t: "Uso del teléfono",
      d: "Se recomienda evitar su uso durante el proceso para garantizar un trabajo preciso y sin interrupciones.",
    },
    {
      t: "Manos limpias y relajadas",
      d: "Evita tocar tu cara o cabello durante la sesión. Mantener la mano relajada facilita un acabado impecable.",
    },
    {
      t: "Ambiente tranquilo",
      d: "Por favor, no traer niños ni mascotas. Esto permite mantener un espacio relajado y centrado en tu atención.",
    },
    {
      t: "Pago del servicio",
      d: "Antes de retirarte, el pago del servicio debe realizarse en su totalidad. Agradezco tu comprensión.",
    },
  ];

  const normasHigiene = [
    {
      t: "Uñas sanas",
      d: "Solo realizo servicios en uñas sanas. Por seguridad, no trabajo en uñas con hongos o infecciones.",
    },
    {
      t: "Asesoría previa",
      d: "Si tienes dudas sobre el estado de tus uñas, estaré encantada de asesorarte antes de confirmar tu cita.",
    },
    {
      t: "Responsabilidad médica",
      d: "Si presentas alguna condición médica en tus uñas, consulta con un especialista antes de agendar.",
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Normas y Sugerencias | Keilyndas</title>
      </Head>

      <main className={styles.mainWrapper}>
        {/* CABECERA */}
        <div className={styles.cabecera}>
          <span className={styles.etiqueta}>Información Importante</span>
          <h1 className={styles.titulo}>NORMAS Y SUGERENCIAS</h1>
        </div>

        {/* SUGERENCIAS */}
        <section className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>
            🌸 Sugerencias para una mejor experiencia
          </h2>
          <div className={styles.listaFlex}>
            {sugerencias.map((item, i) => (
              <div key={i} className={styles.item}>
                <strong className={styles.subtitulo}>{item.t}</strong>
                <p className={styles.texto}>{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NORMAS DE HIGIENE */}
        <section className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>
            🌸 Normas de Higiene y Bienestar
          </h2>
          <div className={styles.listaFlex}>
            {normasHigiene.map((item, i) => (
              <div key={i} className={styles.cardHigiene}>
                <h3 className={styles.subtitulo}>{item.t}</h3>
                <p className={styles.texto}>{item.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
