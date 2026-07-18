import { useEffect, useState } from "react";
import styles from "../../styles/gestion-clientes.module.scss";

// Patrón y función de validación estricta para nombres
const namePattern = /^(?=.*?[A-ZÁÉÍÓÚÑ])(?=.*?[a-záéíóúñ])(?=.*?[\s]).{7,70}$/;

const validarNombre = (nombre) => {
  if (/\d/.test(nombre)) return false;
  if (!namePattern.test(nombre)) return false;
  if (/[ `~!@#$%^&*()_+\-=[{\]}\|'";:/?.>,<]/.test(nombre.replace(/\s/g, "")))
    return false;
  if (/(.)\1\1/.test(nombre)) return false;
  if (/[aeiouáéíóúñ]{3}/i.test(nombre)) return false;
  if (/[bcdfghjklmnpqrstvwxyz]{5}/i.test(nombre)) return false;

  const vocales = "aeiouáéíóúñ";
  const consonantes = "bcdfghjklmnpqrstvwxyz";

  if (/\s[a-zA-ZáéíóúñÁÉÍÓÚÑ]{1}$/.test(nombre)) return false;
  if (/^[a-zA-ZáéíóúñÁÉÍÓÚÑ]{1}\s/.test(nombre)) return false;

  const regexCons2Pre = new RegExp(`\\s[${consonantes}]{2}$`, "i");
  const regexCons2Suc = new RegExp(`^[${consonantes}]{2}\\s`, "i");
  if (regexCons2Pre.test(nombre) || regexCons2Suc.test(nombre)) return false;

  const regexVoc2Pre = new RegExp(`\\s[${vocales}]{2}$`, "i");
  const regexVoc2Suc = new RegExp(`^[${vocales}]{2}\\s`, "i");
  if (regexVoc2Pre.test(nombre) || regexVoc2Suc.test(nombre)) return false;

  if (/[áéíóúÁÉÍÓÚ]{2}/.test(nombre)) return false;
  if (/ññ/i.test(nombre)) return false;
  if (/[A-ZÁÉÍÓÚÑ]{2,}/.test(nombre.replace(/\s/g, ""))) return false;
  if (/\s{2,}/.test(nombre)) return false;

  return true;
};

export default function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [notificacion, setNotificacion] = useState("");
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [creando, setCreando] = useState(false);
  const [errores, setErrores] = useState({});

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre_completo: "",
    telefono: "",
    email: "",
    clave: "",
    confirmar_clave: "",
  });

  useEffect(() => {
    fetch("/api/auth/gestion-clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }, []);

  const validarTelefono = (tel) => {
    if (!tel || !tel.trim()) return "Debe llenar este campo";
    if (!/^\d+$/.test(tel)) return "Solo se aceptan números";
    if (tel.length < 11 || tel.length > 12)
      return "Número de Teléfono Inválido";

    const prefijos4 = ["0212", "0412", "0414", "0416", "0422", "0424", "0426"];
    const prefijos5 = [
      "58212",
      "58412",
      "58414",
      "58416",
      "58422",
      "58424",
      "58426",
    ];

    const esValido4 = prefijos4.some(
      (p) => tel.startsWith(p) && tel.length === 11,
    );
    const esValido5 = prefijos5.some(
      (p) => tel.startsWith(p) && tel.length === 12,
    );

    if (!esValido4 && !esValido5) return "Número de Teléfono Inválido";
    return null;
  };

  const validarCampos = (data, esEdicion = false) => {
    let errs = {};
    const nombre = data.nombre_completo || "";
    const telefono = data.telefono || "";
    const email = data.email || "";
    const clave = data.clave || "";

    const duplicado = clientes.find((c) => {
      if (esEdicion && c.id === data.id) return false;
      return c.telefono === telefono || c.email === email;
    });

    if (duplicado) {
      if (duplicado.telefono === telefono)
        errs.telefono = "Número de télefono en uso";
      if (duplicado.email === email) errs.email = "Email en uso";
    }

    if (!nombre.trim()) {
      errs.nombre_completo = "Debe llenar este campo";
    } else if (!validarNombre(nombre)) {
      errs.nombre_completo = "Formato de nombre inválido";
    }

    const errTel = validarTelefono(telefono);
    if (errTel && !errs.telefono) errs.telefono = errTel;

    if (!email.trim()) {
      errs.email = errs.email || "Debe llenar este campo";
    } else {
      // Regex que cumple:
      // ParteA: 6-64 chars alfanuméricos, sin puntos dobles, no inicia/termina punto/guion
      // ParteB: 5-64 chars alfanuméricos/guiones, guiones solo intermedios
      // ParteC: 2-4 letras a-z/A-Z
      const regexEmail =
        /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._-]{4,62}[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9-]{3,62}[a-zA-Z0-9]\.[a-zA-Z]{2,4}$/i;

      const tienePuntosDobles = email.includes("..");
      const guionCercaArroba = email.includes("-@") || email.includes("@-");
      const puntoCercaArroba = email.includes(".@") || email.includes("@.");

      if (
        !regexEmail.test(email) ||
        tienePuntosDobles ||
        guionCercaArroba ||
        puntoCercaArroba
      ) {
        errs.email = errs.email || "Formato de correo inválido";
      }
    }

    if (creando || (esEdicion && data.clave)) {
      if (!clave.trim()) {
        errs.clave = "Debe llenar este campo";
      } else if (clave.length < 8 || clave.length > 32) {
        errs.clave = "Debes ingresar 8-32 caracteres";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[^a-zA-Z\d]).+$/.test(clave)
      ) {
        errs.clave =
          "Debes ingresar como mínimo: 1 mayúscula, 1 minúscula, 1 número, 1 caracter especial";
      }
      if (!data.confirmar_clave?.trim()) {
        errs.confirmar_clave = "Debe llenar este campo";
      } else if (clave !== data.confirmar_clave) {
        errs.confirmar_clave = "Las contraseñas no coinciden";
      }
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const mostrarNotificacion = (msg) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(""), 3000);
  };

  const cancelarCrear = () => {
    setCreando(false);
    setErrores({});
    setNuevoCliente({
      nombre_completo: "",
      telefono: "",
      email: "",
      clave: "",
      confirmar_clave: "",
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditForm({});
    setErrores({});
  };

  const guardarEdicion = async () => {
    if (!validarCampos(editForm, true)) return;
    const res = await fetch("/api/auth/gestion-clientes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setClientes(clientes.map((c) => (c.id === editForm.id ? editForm : c)));
      mostrarNotificacion("¡Perfil Actualizado Exitosamente!");
      setEditandoId(null);
    }
  };

  const crearCliente = async () => {
    if (!validarCampos(nuevoCliente)) return;
    const res = await fetch("/api/auth/gestion-clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nuevoCliente, rol: "cliente" }),
    });
    if (res.ok) {
      const data = await res.json();
      setClientes([...clientes, data]);
      cancelarCrear();
      mostrarNotificacion("¡Cliente Nuevo Creado Exitosamente!");
    }
  };

  const eliminarCliente = async (id) => {
    const res = await fetch("/api/auth/gestion-clientes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setClientes(clientes.filter((c) => c.id !== id));
      setConfirmandoId(null);
      mostrarNotificacion("¡Cliente eliminado!");
    } else {
      const errorData = await res.json();
      mostrarNotificacion(errorData.message || "Error al eliminar");
    }
  };

  return (
    <div className={styles.container}>
      {notificacion && (
        <div className={styles.notificacion}>{notificacion}</div>
      )}
      <h1 className={styles.titulo}>GESTIÓN DE CLIENTES</h1>

      <div className={styles.tablaContainer}>
        <table className={styles.tabla}>
          <thead>
            <tr className={styles.th}>
              <th className={styles.td}>ID</th>
              <th className={styles.td}>Nombre Completo</th>
              <th className={styles.td}>Teléfono</th>
              <th className={styles.td}>Email</th>
              <th className={styles.td}>Rol</th>
              <th className={styles.td}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className={styles.fila}>
                <td className={styles.td}>{c.id}</td>
                <td>
                  {editandoId === c.id ? (
                    <>
                      <input
                        className={styles.editInput}
                        value={editForm.nombre_completo}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            nombre_completo: e.target.value,
                          })
                        }
                      />
                      {errores.nombre_completo && (
                        <div className={styles.errorNotif}>
                          {errores.nombre_completo}
                        </div>
                      )}
                    </>
                  ) : (
                    c.nombre_completo
                  )}
                </td>
                <td>
                  {editandoId === c.id ? (
                    <>
                      <input
                        className={styles.editInput}
                        value={editForm.telefono}
                        onChange={(e) =>
                          setEditForm({ ...editForm, telefono: e.target.value })
                        }
                      />
                      {errores.telefono && (
                        <div className={styles.errorNotif}>
                          {errores.telefono}
                        </div>
                      )}
                    </>
                  ) : (
                    c.telefono
                  )}
                </td>
                <td>
                  {editandoId === c.id ? (
                    <>
                      <input
                        className={styles.editInput}
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                      {errores.email && (
                        <div className={styles.errorNotif}>{errores.email}</div>
                      )}
                    </>
                  ) : (
                    c.email
                  )}
                </td>
                <td className={styles.td}>
                  {c.id === 1 ? "Admin" : "Cliente"}
                </td>
                <td className={styles.td}>
                  {confirmandoId === c.id ? (
                    <>
                      <button
                        onClick={() => eliminarCliente(c.id)}
                        className={`${styles.btn} ${styles.btnEliminar}`}
                      >
                        SI
                      </button>
                      <button
                        onClick={() => setConfirmandoId(null)}
                        className={`${styles.btn} ${styles.btnCancelar}`}
                        style={{ marginLeft: "5px" }}
                      >
                        NO
                      </button>
                    </>
                  ) : editandoId === c.id ? (
                    <div className={styles.acciones}>
                      <button
                        onClick={guardarEdicion}
                        className={`${styles.btn} ${styles.btnActualizar}`}
                      >
                        Actualizar
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className={`${styles.btn} ${styles.btnEditar}`}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className={styles.acciones}>
                      <button
                        onClick={() => {
                          setCreando(false);
                          setEditandoId(c.id);
                          setEditForm(c);
                        }}
                        className={`${styles.btn} ${styles.btnEditar}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (c.id === 1)
                            mostrarNotificacion(
                              "No puedes eliminar al Administrador",
                            );
                          else setConfirmandoId(c.id);
                        }}
                        className={`${styles.btn} ${styles.btnAccionAlt}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.crearContainer}>
        {!creando ? (
          <>
            <button
              onClick={() => {
                cancelarEdicion();
                setCreando(true);
              }}
              className={styles.btnCrear}
            >
              + Crear Nuevo Cliente
            </button>
            <div style={{ marginTop: "15px" }}>
              <a
                href="http://localhost:3000/dashboard/gestion"
                className={styles.linkRegresar}
              >
                Regresar al menú anterior
              </a>
            </div>
          </>
        ) : (
          <div className={styles.formContainer}>
            <h3 style={{ color: "#ff007f", textAlign: "center" }}>
              Nuevo Cliente
            </h3>
            <label className={styles.label}>Nombre Completo</label>
            <input
              className={styles.editInput}
              value={nuevoCliente.nombre_completo}
              onChange={(e) =>
                setNuevoCliente({
                  ...nuevoCliente,
                  nombre_completo: e.target.value,
                })
              }
            />
            {errores.nombre_completo && (
              <div className={styles.errorNotif}>{errores.nombre_completo}</div>
            )}

            <label className={styles.label}>Teléfono</label>
            <input
              className={styles.editInput}
              value={nuevoCliente.telefono}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
              }
            />
            {errores.telefono && (
              <div className={styles.errorNotif}>{errores.telefono}</div>
            )}

            <label className={styles.label}>Email</label>
            <input
              className={styles.editInput}
              value={nuevoCliente.email}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, email: e.target.value })
              }
            />
            {errores.email && (
              <div className={styles.errorNotif}>{errores.email}</div>
            )}

            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              className={styles.editInput}
              value={nuevoCliente.clave}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, clave: e.target.value })
              }
            />
            {errores.clave && (
              <div className={styles.errorNotif}>{errores.clave}</div>
            )}

            <label className={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              className={styles.editInput}
              value={nuevoCliente.confirmar_clave}
              onChange={(e) =>
                setNuevoCliente({
                  ...nuevoCliente,
                  confirmar_clave: e.target.value,
                })
              }
            />
            {errores.confirmar_clave && (
              <div className={styles.errorNotif}>{errores.confirmar_clave}</div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button onClick={crearCliente} className={styles.btnGuardar}>
                Guardar
              </button>
              <button
                onClick={cancelarCrear}
                className={`${styles.btn} ${styles.btnCancelar}`}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
