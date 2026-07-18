import db from "../../../lib/db";
import bcrypt from "bcryptjs";
import transporter from "../../../lib/nodemailer";

const namePattern = /^(?=.*?[A-ZÁÉÍÓÚÑ])(?=.*?[a-záéíóúñ])(?=.*?[\s]).{7,70}$/;

// Regex estricta: 6-64 usuario, 5-64 dominio, extensión 2-4 letras
const regexEmail =
  /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._-]{4,62}[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9-]{3,62}[a-zA-Z0-9]\.[a-zA-Z]{2,4}$/i;

const passPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,32}$/;
const prefijos =
  "(0212|0412|0414|0416|0422|0424|0426|58212|58412|58414|58416|58422|58424|58426)";
const phonePattern = new RegExp(`^${prefijos}\\d{7}$`);

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

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método no permitido" });

  let { nombre, telefono, email, clave, confirmar_clave } = req.body;

  if (!nombre || !telefono || !email || !clave || !confirmar_clave) {
    return res.status(400).json({
      success: false,
      field: "global",
      message: "Todos los campos son obligatorios.",
    });
  }

  // Validación de Nombre
  if (!validarNombre(nombre.trim())) {
    return res.status(400).json({
      success: false,
      field: "nombre",
      message: "Formato de nombre inválido.",
    });
  }

  // Validación de Teléfono
  if (!phonePattern.test(telefono.trim())) {
    return res.status(400).json({
      success: false,
      field: "telefono",
      message: "Número de teléfono no válido.",
    });
  }

  // Validación de Email (Backend)
  const emailTrim = email.trim();
  const tienePuntosDobles = emailTrim.includes("..");
  const guionCercaArroba = emailTrim.includes("-@") || emailTrim.includes("@-");
  const puntoCercaArroba = emailTrim.includes(".@") || emailTrim.includes("@.");

  if (
    !regexEmail.test(emailTrim) ||
    tienePuntosDobles ||
    guionCercaArroba ||
    puntoCercaArroba
  ) {
    return res.status(400).json({
      success: false,
      field: "email",
      message: "Formato de correo no válido.",
    });
  }

  // Validación de Clave
  if (!passPattern.test(clave)) {
    return res.status(400).json({
      success: false,
      field: "clave",
      message: "Clave débil (8-32, mayús, minús, num, esp).",
    });
  }

  if (clave !== confirmar_clave) {
    return res.status(400).json({
      success: false,
      field: "confirmar_clave",
      message: "Las contraseñas no coinciden",
    });
  }

  try {
    const [existente] = await db.execute(
      "SELECT email, telefono FROM clientes WHERE email = ? OR telefono = ?",
      [emailTrim.toLowerCase(), telefono.trim()],
    );

    if (existente.length > 0) {
      if (existente.some((user) => user.email === emailTrim.toLowerCase()))
        return res.status(400).json({
          success: false,
          field: "email",
          message: "El correo ya está en uso.",
        });
      if (existente.some((user) => user.telefono === telefono.trim()))
        return res.status(400).json({
          success: false,
          field: "telefono",
          message: "El teléfono ya está en uso.",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const clave_hash = await bcrypt.hash(clave, salt);

    await db.execute(
      "INSERT INTO clientes (nombre_completo, telefono, email, clave) VALUES (?, ?, ?, ?)",
      [nombre.trim(), telefono.trim(), emailTrim.toLowerCase(), clave_hash],
    );

    transporter
      .sendMail({
        from: '"Keilyndas" <lgozzo1206@gmail.com>',
        to: "lgozzo1206@gmail.com",
        subject: `Nuevo cliente registrado: ${nombre.trim()}`,
        html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #12040d; color: #ffffff; border: 2px solid #ff007f; border-radius: 15px;">
          <h2 style="color: #ff007f;">👤 Nuevo Cliente Registrado</h2>
          <p>Se ha registrado un nuevo cliente en el sistema:</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Nombre:</strong> ${nombre.trim()}</li>
            <li><strong>Email:</strong> ${emailTrim}</li>
            <li><strong>Teléfono:</strong> ${telefono.trim()}</li>
          </ul>
        </div>
      `,
      })
      .catch((err) =>
        console.error("Error al enviar correo de notificación:", err),
      );

    return res.status(200).json({ success: true, message: "Registro exitoso" });
  } catch (error) {
    console.error("ERROR REGISTRO:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
}
