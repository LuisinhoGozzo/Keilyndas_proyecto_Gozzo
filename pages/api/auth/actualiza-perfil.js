import db from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { emailOriginal, nombre_completo, email, telefono } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE clientes SET nombre_completo = ?, email = ?, telefono = ? WHERE email = ?",
      [nombre_completo, email, telefono, emailOriginal],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cliente no encontrado" });
    }

    res
      .status(200)
      .json({ success: true, message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("ERROR AL ACTUALIZAR PERFIL:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}
