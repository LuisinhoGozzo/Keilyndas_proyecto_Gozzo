import db from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const [rows] = await db.execute(
      `SELECT c.*, cl.nombre_completo AS nombre_cliente 
       FROM citas c 
       LEFT JOIN clientes cl ON c.email = cl.email 
       WHERE c.id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
