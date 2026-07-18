import db from "../../../lib/db";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { citaId, nuevoEstatus } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE citas SET estado = ? WHERE id = ?",
      [nuevoEstatus, citaId],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: `No se encontró ninguna cita con el ID ${citaId}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("🔴 ERROR CRÍTICO EN MYSQL:", error.message);
    return res.status(500).json({
      error: true,
      message: `Error en Base de Datos: ${error.message}`,
    });
  }
}
