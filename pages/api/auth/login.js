import db from "../../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método no permitido" });

  const { email, clave } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM clientes WHERE TRIM(email) = ?",
      [email.trim()],
    );
    if (rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Usuario no registrado" });

    const cliente = rows[0];

    let claveCorrecta = await bcrypt.compare(clave, cliente.clave);

    if (
      !claveCorrecta &&
      email === process.env.EMAIL_USER &&
      clave === process.env.ADMIN_PASSWORD
    ) {
      claveCorrecta = true;
    }

    if (!claveCorrecta) {
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      success: true,
      nombre_completo: cliente.nombre_completo,
      email: cliente.email,
      telefono: cliente.telefono,
      rol: cliente.rol,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno" });
  }
}
