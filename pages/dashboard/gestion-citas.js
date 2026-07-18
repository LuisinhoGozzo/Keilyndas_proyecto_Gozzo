import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/gestion-citas.module.scss";

export default function GestionCitas() {
  const router = useRouter();
  const [citas, setCitas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  const convertirA24h = (horaStr) => {
    if (!horaStr) return 0;
    const [time, ampm] = horaStr.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (ampm?.toUpperCase() === "PM" && h !== 12) h += 12;
    if (ampm?.toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const cargarCitas = async () => {
    try {
      const res = await fetch("/api/auth/gestion-citas");
      const data = await res.json();
      const listaCitas = Array.isArray(data) ? data : data.data || [];

      listaCitas.sort((a, b) => {
        const fechaA = new Date(a.fecha_cita);
        const fechaB = new Date(b.fecha_cita);
        if (fechaB.getTime() !== fechaA.getTime()) {
          return fechaB - fechaA;
        }
        return convertirA24h(b.hora_cita) - convertirA24h(a.hora_cita);
      });

      setCitas(listaCitas);
    } catch (e) {
      console.error("Error al cargar citas:", e);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const iniciarEdicion = (c) => {
    setEditandoId(c.id);
    setEditForm({ ...c });
  };

  const handleEditChange = (e, field) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const guardarEdicion = async () => {
    try {
      const res = await fetch("/api/auth/gestion-citas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditandoId(null);
        cargarCitas();
      } else {
        alert("Error al actualizar la base de datos.");
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarCita = async (id) => {
    try {
      const res = await fetch(`/api/auth/gestion-citas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        cargarCitas();
        setConfirmarEliminar(null);
      }
    } catch (e) {
      console.error("Error al eliminar:", e);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>GESTIÓN DE CITAS</h1>
      <div className={styles.tablaWrapper}>
        <div className={styles.tablaContainer}>
          <table className={styles.tabla}>
            <thead>
              <tr className={styles.trHead}>
                <th className={styles.th}>Cliente</th>
                <th className={styles.th}>Set Personalizado</th>
                <th className={styles.th}>Fecha/Hora</th>
                <th className={styles.th}>Tipo de servicio</th>
                <th className={styles.th}>Pagos</th>
                <th className={styles.th}>Estado</th>
                <th className={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id} className={styles.fila}>
                  <td className={styles.td}>
                    {editandoId === c.id ? (
                      <>
                        <input
                          className={styles.input}
                          value={editForm.nombre_completo}
                          onChange={(e) =>
                            handleEditChange(e, "nombre_completo")
                          }
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          value={editForm.telefono}
                          onChange={(e) => handleEditChange(e, "telefono")}
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          value={editForm.email}
                          onChange={(e) => handleEditChange(e, "email")}
                        />
                      </>
                    ) : (
                      <>
                        {c.nombre_completo} <br /> {c.telefono} <br /> {c.email}
                      </>
                    )}
                  </td>
                  <td className={styles.td}>
                    {editandoId === c.id ? (
                      <>
                        <input
                          className={styles.input}
                          value={editForm.sistema}
                          onChange={(e) => handleEditChange(e, "sistema")}
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          value={editForm.tamano}
                          onChange={(e) => handleEditChange(e, "tamano")}
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          value={editForm.estilo}
                          onChange={(e) => handleEditChange(e, "estilo")}
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          value={editForm.diseno}
                          onChange={(e) => handleEditChange(e, "diseno")}
                        />
                      </>
                    ) : (
                      <>
                        {c.sistema} <br /> {c.tamano} - {c.estilo} - {c.diseno}
                      </>
                    )}
                  </td>
                  <td className={styles.td}>
                    {editandoId === c.id ? (
                      <>
                        <input
                          type="date"
                          className={styles.input}
                          value={editForm.fecha_cita?.split("T")[0]}
                          onChange={(e) => handleEditChange(e, "fecha_cita")}
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          value={editForm.hora_cita}
                          onChange={(e) => handleEditChange(e, "hora_cita")}
                        />
                      </>
                    ) : (
                      <>
                        {c.fecha_cita?.split("T")[0]} <br /> {c.hora_cita}
                      </>
                    )}
                  </td>
                  <td className={styles.td}>
                    {editandoId === c.id ? (
                      <input
                        className={styles.input}
                        value={editForm.tipo_servicio}
                        onChange={(e) => handleEditChange(e, "tipo_servicio")}
                      />
                    ) : (
                      c.tipo_servicio
                    )}
                  </td>
                  <td className={styles.td}>
                    {editandoId === c.id ? (
                      <>
                        <input
                          className={styles.input}
                          value={editForm.monto_total}
                          onChange={(e) => handleEditChange(e, "monto_total")}
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          value={editForm.monto_deposito}
                          onChange={(e) =>
                            handleEditChange(e, "monto_deposito")
                          }
                        />
                        <input
                          className={`${styles.input} ${styles.mt5}`}
                          placeholder="Ref. pago"
                          value={editForm.ref_deposito || ""}
                          onChange={(e) => handleEditChange(e, "ref_deposito")}
                        />
                      </>
                    ) : (
                      <div
                        style={{
                          opacity:
                            c.estado?.toLowerCase() === "pre-reservada" ||
                            c.estado?.toLowerCase() === "rechazada"
                              ? 0.5
                              : 1,
                        }}
                      >
                        Total: ${c.monto_total} <br /> Dep: ${c.monto_deposito}{" "}
                        <br /> Ref: {c.ref_deposito}
                      </div>
                    )}
                  </td>
                  <td className={styles.td}>
                    {editandoId === c.id ? (
                      <select
                        className={styles.input}
                        value={
                          editForm.estado?.toLowerCase() || "pre-reservada"
                        }
                        onChange={(e) => handleEditChange(e, "estado")}
                      >
                        <option value="pre-reservada">Pre-reservada</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                    ) : (
                      c.estado
                    )}
                  </td>
                  <td className={styles.td}>
                    {confirmarEliminar === c.id ? (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnLime}`}
                          onClick={() => eliminarCita(c.id)}
                        >
                          SI
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnRed}`}
                          onClick={() => setConfirmarEliminar(null)}
                        >
                          NO
                        </button>
                      </>
                    ) : editandoId === c.id ? (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnLime}`}
                          onClick={guardarEdicion}
                        >
                          Actualizar
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnGold}`}
                          onClick={() => setEditandoId(null)}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnPink}`}
                          onClick={() => iniciarEdicion(c)}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnRed}`}
                          onClick={() => setConfirmarEliminar(c.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button className={styles.linkRegresar} onClick={() => router.back()}>
        ← Regresar
      </button>
    </div>
  );
}
