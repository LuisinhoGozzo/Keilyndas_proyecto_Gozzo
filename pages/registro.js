import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/registro.module.scss";

const namePattern = /^(?=.*?[A-ZÁÉÍÓÚÑ])(?=.*?[a-záéíóúñ])(?=.*?[\s]).{7,70}$/;

// Regex estricta: 6-64 usuario, 5-64 dominio, extensión 2-4 letras
const emailPattern =
  /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._-]{4,62}[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9-]{3,62}[a-zA-Z0-9]\.[a-zA-Z]{2,4}$/i;

const passPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,32}$/;
const prefijos =
  "(0212|0412|0414|0416|0422|0424|0426|58212|58412|58414|58416|58422|58424|58426)";
const phonePattern = new RegExp(`^${prefijos}\\d{7}$`);

const validarNombre = (nombre) => {
  if (!namePattern.test(nombre)) return false;
  if (/\d/.test(nombre)) return false;

  // Prohibir caracteres especiales excepto espacios
  if (/[ `~!@#$%^&*()_+\-=[{\]}\|'";:/?.>,<]/.test(nombre.replace(/\s/g, "")))
    return false;

  // Repeticiones prohibidas
  if (/(.)\1\1/.test(nombre)) return false;
  if (/[aeiouáéíóúñ]{3}/i.test(nombre)) return false;
  if (/[bcdfghjklmnpqrstvwxyz]{5}/i.test(nombre)) return false;

  const vocales = "aeiouáéíóúñ";
  const consonantes = "bcdfghjklmnpqrstvwxyz";

  // Reglas de espacio (Solo para 2 consonantes o 2 vocales)
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

  // Mayúsculas y espacios consecutivos
  if (/[A-ZÁÉÍÓÚÑ]{2,}/.test(nombre.replace(/\s/g, ""))) return false;
  if (/\s{2,}/.test(nombre)) return false;

  return true;
};

const InputConError = ({
  name,
  formData,
  setFormData,
  errores,
  setErrores,
  ...props
}) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      display: "flex",
      alignItems: "center",
    }}
  >
    <input
      {...props}
      value={formData[name] || ""}
      onChange={(e) => {
        setFormData({ ...formData, [name]: e.target.value });
        if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }));
      }}
      className={styles.inputField}
      style={{ border: errores[name] ? "1px solid red" : undefined }}
    />
    {errores[name] && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "10px",
          color: "#ff3333",
          fontSize: "0.85rem",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            backgroundColor: "red",
            borderRadius: "50%",
            color: "white",
            fontSize: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "6px",
          }}
        >
          !
        </div>
        {errores[name]}
      </div>
    )}
  </div>
);

export default function Registro() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    clave: "",
    confirmarClave: "",
  });
  const [errores, setErrores] = useState({});
  const [notificacion, setNotificacion] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    let nuevosErrores = {};
    if (!validarNombre(formData.nombre))
      nuevosErrores.nombre = "Formato de nombre inválido";
    if (!phonePattern.test(formData.telefono))
      nuevosErrores.telefono = "Número inválido";

    // Validación de email con chequeos extra
    const emailTrim = formData.email.trim();
    const tienePuntosDobles = emailTrim.includes("..");
    const guionCercaArroba =
      emailTrim.includes("-@") || emailTrim.includes("@-");
    const puntoCercaArroba =
      emailTrim.includes(".@") || emailTrim.includes("@.");

    if (
      !emailPattern.test(emailTrim) ||
      tienePuntosDobles ||
      guionCercaArroba ||
      puntoCercaArroba
    ) {
      nuevosErrores.email = "Formato de correo inválido";
    }

    if (!passPattern.test(formData.clave))
      nuevosErrores.clave = "Clave débil (8-32, mayús, minús, num, esp)";
    if (formData.clave !== formData.confirmarClave)
      nuevosErrores.confirmarClave = "Las contraseñas no coinciden";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          confirmar_clave: formData.confirmarClave,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNotificacion(true);
        setTimeout(() => router.push("/login"), 5000);
      } else {
        setErrores({ [data.field || "global"]: data.message });
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div className={styles.registroContainer}>
      <Head>
        <title>Registro | Keilyndas</title>
      </Head>
      {notificacion && (
        <div className={styles.notificacion}>
          <h2>Registro Exitoso</h2>
          <p>Su cuenta ha sido creada.</p>
        </div>
      )}
      <main className={styles.registroMain}>
        <h1 className={styles.titulo}>Regístrate</h1>
        <div className={styles.divisor} />
        <form onSubmit={handleRegister} className={styles.formulario}>
          <InputConError
            name="nombre"
            formData={formData}
            setFormData={setFormData}
            errores={errores}
            setErrores={setErrores}
            type="text"
            placeholder="Nombre completo"
            required
          />
          <InputConError
            name="telefono"
            formData={formData}
            setFormData={setFormData}
            errores={errores}
            setErrores={setErrores}
            type="tel"
            placeholder="Teléfono"
            required
          />
          <InputConError
            name="email"
            formData={formData}
            setFormData={setFormData}
            errores={errores}
            setErrores={setErrores}
            type="email"
            placeholder="Correo Electrónico"
            required
          />
          <InputConError
            name="clave"
            formData={formData}
            setFormData={setFormData}
            errores={errores}
            setErrores={setErrores}
            type="password"
            placeholder="Contraseña"
            required
          />
          <InputConError
            name="confirmarClave"
            formData={formData}
            setFormData={setFormData}
            errores={errores}
            setErrores={setErrores}
            type="password"
            placeholder="Confirmar contraseña"
            required
          />
          <button type="submit" className={styles.btnRegistrar}>
            Registrarse
          </button>
        </form>
      </main>
    </div>
  );
}
