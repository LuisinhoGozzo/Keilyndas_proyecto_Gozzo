import Head from "next/head";
import Image from "next/image";
import styles from "../styles/galeria.module.scss";

export default function Galeria() {
  const fotosGaleria = [
    { id: 1, src: "/assets/foto1_kei.jpg", alt: "Trabajo uñas 1" },
    { id: 2, src: "/assets/foto2_kei.jpg", alt: "Trabajo uñas 2" },
    { id: 3, src: "/assets/foto3_kei.jpg", alt: "Trabajo uñas 3" },
    { id: 4, src: "/assets/foto4_kei.jpg", alt: "Trabajo uñas 4" },
    { id: 5, src: "/assets/foto5_kei.jpg", alt: "Trabajo uñas 5" },
    { id: 6, src: "/assets/foto6_kei.jpg", alt: "Trabajo uñas 6" },
    { id: 7, src: "/assets/foto7_kei.jpg", alt: "Trabajo uñas 7" },
    { id: 8, src: "/assets/foto8_kei.jpg", alt: "Trabajo uñas 8" },
    { id: 9, src: "/assets/foto9_kei.jpg", alt: "Trabajo uñas 9" },
    { id: 10, src: "/assets/foto10_kei.jpg", alt: "Trabajo uñas 10" },
    {
      id: 12,
      isInstagram: true,
      url: "https://www.instagram.com/beautyhands.beautynails",
    },
    { id: 11, src: "/assets/foto11_kei.jpg", alt: "Trabajo uñas 11" },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Galería | Keilyndas</title>
      </Head>

      <div className={styles.wrapper}>
        {/* ENCABEZADO */}
        <div className={styles.header}>
          <span className={styles.etiqueta}>Nuestro Trabajo</span>
          <h1 className={styles.titulo}>GALERÍA</h1>
        </div>

        {/* GRILLA DE IMÁGENES */}
        <div className={styles.grid}>
          {fotosGaleria.map((foto) =>
            foto.isInstagram ? (
              <a
                key={foto.id}
                href={foto.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.item} ${styles.instagramCard}`}
              >
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <p>¡Mira más diseños en nuestro Instagram!</p>
                <span>@beautyhands.beautynails</span>
              </a>
            ) : (
              <a
                key={foto.id}
                href={foto.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.item}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  width={500}
                  height={500}
                  className={styles.imagen}
                  unoptimized
                />
              </a>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
