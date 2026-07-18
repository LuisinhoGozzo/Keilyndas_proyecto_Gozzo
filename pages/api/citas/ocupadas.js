import db from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const [citas] = await db.query("SELECT fecha_cita, hora_cita FROM citas");
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json([]);
  }
}
