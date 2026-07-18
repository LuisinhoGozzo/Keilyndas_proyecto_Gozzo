import db from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Método ${req.method} no permitido` });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "El parámetro email es obligatorio" });
  }

  try {
    const [citas] = await db.execute(
      "SELECT * FROM citas WHERE email = ? ORDER BY fecha_cita DESC",
      [email],
    );

    return res.status(200).json(citas);
  } catch (error) {
    console.error("Error en API listar clientes:", error);
    return res.status(500).json({
      error: true,
      message: "Error al obtener las citas del cliente",
    });
  }
}
