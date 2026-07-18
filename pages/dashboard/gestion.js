import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/gestion.module.scss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Gestion() {
  // Datos del Administrador
  const [admin] = useState({
    nombre_completo: "Luis Gozzo",
    email: "lgozzo1206@gmail.com",
    telefono: "---",
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Panel de Gestión | Keilyndas</title>
      </Head>

      <h1 className={styles.titulo}>Panel de Gestión</h1>

      {/* Contenedor de Info __ solo del Perfil del admin */}
      <div className={styles.cardInfo}>
        <div>
          <label className={styles.label}>Administrador</label>
          <p className={styles.textoDato}>{admin.nombre_completo}</p>
        </div>

        <div className={styles.divisor}>
          <label className={styles.label}>Correo Electrónico</label>
          <p className={styles.textoDato}>{admin.email}</p>
        </div>
      </div>

      {/* Botones de navegación hacia la gestión específica */}
      <div className={styles.contenedorBotones}>
        <Link
          href="/dashboard/gestion-clientes"
          className={styles.btnNavegacion}
        >
          GESTIONAR CLIENTES
        </Link>

        <Link href="/dashboard/gestion-citas" className={styles.btnNavegacion}>
          GESTIONAR CITAS
        </Link>
      </div>
    </div>
  );
}
