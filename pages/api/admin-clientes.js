import db from "../../lib/db";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Método ${req.method} no permitido` });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, nombre_completo AS nombre, email, telefono FROM clientes WHERE rol != 'admin' ORDER BY id DESC",
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en API admin-clientes:", error);
    return res.status(500).json({
      error: true,
      message: "Error al obtener los clientes del sistema",
      details: error.message,
    });
  }
}
