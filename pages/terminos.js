import Head from "next/head";
import Link from "next/link";
import styles from "../styles/terminos.module.scss";

export default function Terminos() {
  const secciones = [
    {
      titulo: "1. Reservas, Confirmación y Pagos",
      items: [
        "Garantía de agenda: Las citas pre-reservadas a través de nuestra plataforma web solo se reservarán de forma temporal por un lapso de 30 minutos a 2 horas. Si no se reporta y registra el pago correspondiente en ese lapso, el sistema liberará el horario automáticamente para otro cliente.",
        "Validación obligatoria: Para validar y consolidar la reserva, es estrictamente obligatorio escribir el número de referencia exacto del Pago Móvil y adjuntar el comprobante de pago.",
        "Servicio de retiro: Si posees un sistema anterior (acrílico, gel o semipermanente u otro sistema) de otro establecimiento, es obligatorio marcar la casilla de 'Retiro de producto anterior'. Este proceso añade entre 15 y 30 minutos extra de trabajo meticuloso a la agenda, por lo cual conlleva un recargo adicional ($5 extra).",
      ],
    },
    {
      titulo: "2. Políticas de Cancelación, Cambios y Reembolsos",
      items: [
        "Modificaciones sin costo: Se permiten cambios de fecha u hora sin penalización notificando con un mínimo de 48 horas de anticipación a la cita original.",
        "Cancelaciones tardías: Si decides cancelar o mover tu turno con menos de 48 horas de anticipación, se retendrá el 50% del monto total del servicio (el depósito inicial) por concepto de penalización debido al bloqueo de la agenda.",
        "Incomparecencia a domicilio: En la modalidad de servicio a domicilio, si nuestro personal asiste a la dirección acordada y nadie atiende al llamado, la cita se dará por cancelada automáticamente y no habrá derecho a reembolso ni reprogramación del dinero transferido.",
      ],
    },
    {
      titulo: "3. Puntualidad y Tiempos de Espera",
      items: [
        "Tolerancia máxima: Por respeto a la planificación horaria de las demás clientas, el tiempo máximo de espera (tanto en el local como en servicio a domicilio) es de 15 minutos. Pasado este límite, la cita se cancela sin reembolso.",
        "Compromiso de la manicurista: Entendemos que las condiciones del tráfico en las zonas de Carrizal y San Antonio pueden variar. Nos comprometemos a notificarte de inmediato si prevemos un retraso mayor a 10 minutos en nuestro traslado hacia tu domicilio.",
      ],
    },
    {
      titulo: "4. Condiciones para el Servicio a Domicilio",
      items: [
        "Tarifa de traslado: El servicio a domicilio conlleva un recargo adicional de $5 sobre el valor total del servicio, correspondiente a gastos logísticos y de traslado.",
        "Requisitos del entorno: Para ejecutar un set con acabado de alta gama, la clienta debe garantizar un espacio óptimo, limpio, una mesa estable, dos sillas cómodas, buena iluminación y una conexión eléctrica cercana para el uso seguro de lámparas de curado y el torno.",
        "Seguridad y concentración: Debido al uso de productos químicos, limas de alta velocidad y herramientas cortantes de precisión, se exige estrictamente que los niños pequeños y las mascotas permanezcan alejados del área de trabajo durante toda la sesión para evitar accidentes.",
      ],
    },
    {
      titulo: "5. Salud de las Uñas y Garantías de Fábrica",
      items: [
        "Salud e higiene: Por estricta normativa sanitaria, bajo ninguna circunstancia se realizarán aplicaciones sobre uñas que presenten sospechas de hongos (micosis), bacterias, infecciones cutáneas o heridas abiertas. Si se detecta alguna anomalía al iniciar la cita, el servicio se suspenderá inmediatamente y no habrá devolución del depósito.",
        "Garantía del set: Ofrecemos un respaldo de garantía de 5 días posteriores a la aplicación en sistemas de gel o acrílico ante desprendimientos prematuros por fallas de fábrica. Esta garantía no cubre fracturas, desprendimientos o levantamientos causados por golpes, maltrato o mal uso por parte de la clienta. El retoque técnico bajo garantía es completamente gratuito.",
      ],
    },
    {
      titulo: "6. Uso de Imagen y Marketing Post-Venta",
      items: [
        "Consentimiento fotográfico: Con el fin de nutrir nuestro portafolio profesional en redes sociales, el sistema dispone de una casilla de verificación opcional. Al marcarla, autorizas expresamente la captura fotográfica y de video del resultado final en tus manos para difusión comercial, respetando siempre la privacidad de tu identidad.",
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Términos y Condiciones | Keilyndas</title>
      </Head>

      <main className={styles.mainBox}>
        <div className={styles.cabecera}>
          <span className={styles.tagline}>Marco Legal y Normativas</span>
          <h1 className={styles.titulo}>
            Términos, Condiciones <br />
            <span>y Políticas de Servicio</span>
          </h1>

          <div className={styles.separador} />

          <p className={styles.intro}>
            Al agendar un turno a través de nuestra plataforma web, aceptas de
            forma expresa y automatizada las siguientes cláusulas comerciales,
            operativas y logísticas. Te recomendamos leerlas con atención para
            garantizar una experiencia armónica y un servicio óptimo.
          </p>
        </div>

        <div className={styles.cuerpo}>
          {secciones.map((sec, idx) => (
            <section key={idx} className={styles.seccion}>
              <h2 className={styles.subtitulo}>{sec.titulo}</h2>
              <ul className={styles.lista}>
                {sec.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <p>
            Última actualización: Junio, 2026. Keilyndas se reserva el derecho
            de modificar los presentes términos en función de mejoras logísticas
            o comerciales.
          </p>
          <div>
            <Link href="/" className={styles.btnRegresar}>
              Volver al Inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
