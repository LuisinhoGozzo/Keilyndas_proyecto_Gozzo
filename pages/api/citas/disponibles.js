import db from "../../../lib/db";

export default async function handler(req, res) {
  const { fecha } = req.query;

  if (!fecha) return res.status(400).json([]);

  try {
    // Solo buscamos citas que YA han sido pre-reservadas, pendientes o confirmadas.
    // Si la cita NO está rechazada, esa hora debe estar ocupada.
    const [citas] = await db.execute(
      "SELECT hora_cita FROM citas WHERE fecha_cita = ? AND estado != 'rechazada'",
      [fecha],
    );

    // Devolvemos la lista de horas que YA tienen una cita asociada (como ocupadas)
    res.status(200).json(citas.map((c) => c.hora_cita));
  } catch (error) {
    console.error("Error consultando disponibilidad:", error);
    res.status(500).json([]);
  }
}
