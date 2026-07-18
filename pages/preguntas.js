import Head from "next/head";
import styles from "../styles/preguntas.module.scss";

export default function Preguntas() {
  const faqs = [
    {
      pregunta: "¿Cuál es tu zona de cobertura para el servicio a domicilio?",
      respuesta:
        "Nuestro servicio técnico a domicilio es exclusivamente dentro de las zonas de Carrizal, Colinas de Carrizal y San Antonio de los Altos. Al momento de agendar, es indispensable colocar tu dirección exacta para coordinar la logística de traslado. Si te encuentras fuera de estos límites, te invitamos cordialmente a programar tu cita para ser atendido/a directamente en nuestro local.",
    },
    {
      pregunta: "¿Cuánto tiempo dura una sesión?",
      respuesta:
        "El tiempo varía según el servicio elegido. Una manicura semipermanente toma aproximadamente 1-2 horas, mientras que un sistema nuevo (Acrílico o Gel) con diseño puede tardar entre 2 y 3 horas. Trabajamos con un cuidado meticuloso al detalle para garantizar la máxima durabilidad, ¡así que te recomendamos venir sin prisa para consentirte al máximo!",
    },
    {
      pregunta: "¿Cómo debo ir preparada a mi cita?",
      respuesta:
        "Te agradecemos asistir con las uñas completamente limpias y naturales. Si actualmente tienes un sistema anterior (acrílico, gel o semipermanente) puesto por otro salón, es indispensable que agregues el servicio de 'Retiro' al momento de agendar tu cita para poder asignar el tiempo extra necesario en la agenda.",
    },
    {
      pregunta: "¿Qué métodos de pago aceptan?",
      respuesta:
        "Para asegurar tu cita, el depósito inicial del 50% debe realizarse exclusivamente a través de Pago Móvil. El 50% restante se procesa al finalizar el servicio directamente en el local, donde aceptamos Pago Móvil, transferencia bancaria directa o efectivo (divisas).",
    },
    {
      pregunta: "¿Hacen retiros de trabajo de otros salones?",
      respuesta:
        "Sí, realizamos retiros de sistemas provenientes de otros salones. Sin embargo, debido a que no conocemos la composición exacta de los materiales que te aplicaron anteriormente, lo hacemos con extremo cuidado para no maltratar tu uña natural. Y tiene un recargo adicional de $5.",
    },
    {
      pregunta: "¿Cobran por uñas partidas?",
      respuesta:
        "Depende del momento. Si asistes a tu cita de mantenimiento con una o más uñas partidas que requieran reconstrucción total desde cero, el costo de cada reconstrucción se sumará como un adicional al servicio base. Por otro lado, si la ruptura ocurrió dentro de nuestros primeros 3 días posteriores a tu aplicación debido a un problema técnico, la reparación entra completamente gratis en nuestra garantía. ¡Tu satisfacción y la estructura de tu set son nuestra prioridad!",
    },
    {
      pregunta: "¿Cuál es el tiempo de tolerancia para las citas?",
      respuesta:
        "Contamos con una tolerancia máxima de 10 a 15 minutos. Debido a que trabajamos con una agenda estricta y citas consecutivas, el retraso de una clienta afecta los turnos de las demás. Pasado este tiempo, la cita podría cancelarse o modificarse (por ejemplo, realizando un diseño más simple) para respetar el tiempo de la siguiente clienta. Mientras más difícil sea el diseño del sistema a ejecutar, menos tolerancia.",
    },
    {
      pregunta: "¿Con cuánta anticipación debo cancelar o reprogramar?",
      respuesta:
        "Te solicitamos avisarnos con un mínimo de 48 horas de anticipación si necesitas mover o cancelar tu turno. Esto nos permite reasignar el espacio a otra clienta en lista de espera. Para respetar el tiempo de nuestro equipo y de las clientas en lista de espera, los depósitos iniciales no son reembolsables en caso de inasistencias o cancelaciones de última hora (menos de 48 horas antes de la cita).",
    },
    {
      pregunta: "¿Puedo asistir con acompañantes o niños?",
      respuesta:
        "Para garantizar una experiencia totalmente relajante, segura y enfocada en la perfección de tu servicio, te recomendamos asistir sola a tu cita. El espacio del local maneja herramientas punzantes, lámparas de precisión y productos químicos que requieren máxima concentración, por lo que no es un ambiente apto para niños, acompañantes y mascotas.",
    },
    {
      pregunta: "¿Qué diferencia hay entre sistemas acrílicos, gel y kapping?",
      respuesta:
        "El acrílico ofrece máxima resistencia y longitud (ideal para extensiones notables o uñas rebeldes). El gel proporciona un acabado más flexible, cristalino y liviano. Por último, el Kapping no añade largo, sino que es una capa de gel o acrílico sobre tu uña natural para protegerla y evitar que se quiebre.",
    },
    {
      pregunta:
        "¿Tienen disponibilidad para citas el mismo día o atienden sin cita?",
      respuesta:
        "Trabajamos exclusivamente bajo cita previa programada a través de nuestra plataforma web para poder brindarte la atención personalizada y sin apuros que te mereces. Rara vez contamos con espacios el mismo día, por lo que te recomendamos agendar tu servicio según nuestra disponibilidad que observas en la sección al menos una semana de anticipación, especialmente para los días jueves, viernes y sábados.",
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>FAQ | Keilyndas</title>
      </Head>

      <main className={styles.mainCard}>
        <div className={styles.header}>
          <span className={styles.subtitulo}>Soporte & Ayuda</span>
          <h1 className={styles.titulo}>
            Preguntas <br />
            <span>Frecuentes</span>
          </h1>
          <div className={styles.divider} />
        </div>

        <div className={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqSummary}>
                <span>{faq.pregunta}</span>
                <span className={styles.faqIcon}>▼</span>
              </summary>
              <div className={styles.faqContent}>
                <p>{faq.respuesta}</p>
              </div>
            </details>
          ))}
        </div>

        <div className={styles.footer}>
          <p style={{ color: "#b0b0b0", marginBottom: "15px" }}>
            ¿Tienes alguna otra duda que no aparezca aquí?
          </p>
          <a href="/contacto" className={styles.link}>
            💬 Consúltanos directamente por WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
