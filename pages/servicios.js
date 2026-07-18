import Head from "next/head";
import styles from "../styles/servicios.module.scss";

export default function Servicios() {
  const listaServicios = [
    {
      id: 1,
      nombre: "ESMALTADO SEMIPERMANENTE",
      precio: "12",
      descripcion:
        "La solución perfecta para mantener tus manos impecables en el día a día. Consiste en la aplicación de un gel de color de alta tecnología que se cura instantáneamente bajo lámpara UV/LED. Aporta una capa ligera que protege el largo natural de tu uña, garantizando un brillo espejo impecable, libre de descascarados y con una durabilidad excepcional de 15 a 21 días.",
      imagen: "/assets/S1_semipermanente.jpg",
    },
    {
      id: 2,
      nombre: "SOFT GEL",
      precio: "18",
      descripcion:
        "La revolución en extensiones de uñas que combina la ligereza del gel con la resistencia del acrílico. Utilizamos tips fabricados completamente de gel premoldeado que se adhieren y nivelan a la perfección sobre tu uña natural. Es un método ultra rápido, sin olores fuertes ni limados agresivos, ideal para quienes buscan una longitud personalizada con un aspecto sumamente natural, flexible y cómodo.",
      imagen: "/assets/S2_softgel.jpg",
    },
    {
      id: 3,
      nombre: "KAPPING CON POLYGEL",
      precio: "15",
      descripcion:
        "El tratamiento definitivo de blindaje para uñas frágiles, quebradizas o con tendencia a escamarse. El polygel es un sistema híbrido que une lo mejor del acrílico y del gel, creando una barrera protectora ligera pero extremadamente resistente sobre tu propia uña (sin extender el largo). Protege tus manos contra impactos diarios, permitiendo que tus uñas crezcan sanas, fuertes y hermosas.",
      imagen: "/assets/S3_kappingPolygel.jpg",
    },
    {
      id: 4,
      nombre: "ACRÍLICO",
      precio: "25",
      descripcion:
        "El sistema clásico de alta gama por excelencia, diseñado para quienes sueñan con una longitud notable, estructuras perfectas y una resistencia inigualable. Modelado meticulosamente a mano alzada mediante moldes esculpidos o tips, este servicio permite corregir imperfecciones y diseñar la forma exacta que desees. Es la opción más duradera del mercado, ideal para lucir unas manos estilizadas y de impacto.",
      imagen: "/assets/S4_acrilica.jpg",
    },
    {
      id: 5,
      isInfo: true,
    },
    {
      id: 6,
      nombre: "KAPPING CON ACRÍLICO",
      precio: "18",
      descripcion:
        "Un blindaje de máxima dureza estructural diseñado para proteger tu largo actual. Aplicamos una fina y precisa capa de acrílico de alta resistencia directamente sobre la superficie de tu uña natural, sin añadir extensiones. Es el servicio ideal si tienes un ritmo de vida activo y necesitas un escudo total contra golpes, quiebres y desgastes, manteniendo tus manos impecables por semanas.",
      imagen: "/assets/S5_KappingAcrilico.jpg",
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Servicios | Keilyndas</title>
      </Head>

      <div className={styles.mainWrapper}>
        <div className={styles.header}>
          <span className={styles.subtitulo}>Nuestro Catálogo</span>
          <h1 className={styles.titulo}>SERVICIOS EXCLUSIVOS</h1>
          <p className={styles.descripcionHeader}>
            Sistemas de alta gama diseñados para realzar la elegancia de tus
            manos con durabilidad garantizada.
          </p>
        </div>

        {/* GRID DE SERVICIOS */}
        <div className={styles.grid}>
          {listaServicios.map((serv) =>
            serv.isInfo ? (
              <div
                key={serv.id}
                className={`${styles.card} ${styles.infoCard}`}
              >
                <h2 className={styles.nombre}>
                  ¿DUDAS SOBRE QUÉ SISTEMA ELEGIR?
                </h2>
                <p className={styles.descripcion}>
                  Recuerda que todos nuestros servicios incluyen preparación de
                  cutícula y limpieza profunda. Si no estás segura de cuál
                  elegir, nuestra especialista evaluará el estado actual de tus
                  uñas durante la cita para recomendarte el sistema que mejor se
                  adapte a tu estilo de vida.
                </p>
              </div>
            ) : (
              <div key={serv.id} className={styles.card}>
                <h2 className={styles.nombre}>{serv.nombre}</h2>
                <p className={styles.descripcion}>{serv.descripcion}</p>
                <p className={styles.precio}>${serv.precio}</p>
                <div className={styles.imagenContainer}>
                  <img src={serv.imagen} alt={serv.nombre} />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
