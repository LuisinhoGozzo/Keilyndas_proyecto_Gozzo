import db from "../../../lib/db";
import transporter from "../../../lib/nodemailer";

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const [citas] = await db.query(
          "SELECT * FROM citas ORDER BY fecha_cita DESC",
        );
        return res.status(200).json(citas);

      case "PUT":
        const citaData = req.body;
        const {
          id,
          estado,
          nombre_completo,
          email,
          fecha_cita,
          hora_cita,
          ref_deposito,
        } = citaData;

        if (!id)
          return res.status(400).json({ message: "ID de cita requerido" });

        console.log("DATOS ENVIADOS AL UPDATE:", citaData);

        const [rows] = await db.query("SELECT estado FROM citas WHERE id = ?", [
          id,
        ]);
        const estadoPrevio = rows[0]?.estado;

        await db.query(
          `UPDATE citas SET nombre_completo=?, telefono=?, email=?, sistema=?, tamano=?, estilo=?, diseno=?, fecha_cita=?, hora_cita=?, tipo_servicio=?, remocion=?, monto_total=?, monto_deposito=?, estado=?, ref_deposito=? WHERE id=?`,
          [
            citaData.nombre_completo,
            citaData.telefono,
            citaData.email,
            citaData.sistema,
            citaData.tamano,
            citaData.estilo,
            citaData.diseno,
            citaData.fecha_cita,
            citaData.hora_cita,
            citaData.tipo_servicio,
            citaData.remocion,
            citaData.monto_total,
            citaData.monto_deposito,
            estado,
            ref_deposito,
            id,
          ],
        );

        const estadoActualLower = estado?.toLowerCase().trim();
        const estadoPrevioLower = estadoPrevio?.toLowerCase().trim();

        if (
          estadoActualLower === "confirmada" &&
          estadoPrevioLower !== "confirmada"
        ) {
          const fechaYHoraVisual = `${fecha_cita?.split("T")[0]} a las ${hora_cita}`;

          await transporter.sendMail({
            from: "sistema@keilyndas.com",
            to: email,
            subject: `Cita Confirmada: ${nombre_completo} - ${fechaYHoraVisual}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; background-color: #12040d; color: #ffffff; border: 2px solid #ff007f; border-radius: 15px;">
                <h2 style="color: #ff007f;">💅 ¡CITA CONFIRMADA en Keilyndas!</h2>
                <p><strong>NOMBRE:</strong> ${nombre_completo}</p>
                <p><strong>E-MAIL:</strong> ${email}</p>
                <p><strong>TELÉFONO:</strong> ${citaData.telefono}</p>
                <p><strong>SISTEMA:</strong> ${citaData.sistema}</p>
                <p><strong>TAMAÑO:</strong> ${citaData.tamano}</p>
                <p><strong>ESTILO:</strong> ${citaData.estilo}</p>
                <p><strong>DISEÑO:</strong> ${citaData.diseno}</p>
                <p><strong>FECHA y HORA:</strong> ${fechaYHoraVisual}</p>
                <p><strong>TIPO DE SERVICIO:</strong> ${citaData.tipo_servicio}</p>
                <p><strong>REMOCIÓN:</strong> ${citaData.remocion}</p>
                
                <div style="margin: 20px 0; padding: 15px; border: 2px solid #ff007f; border-radius: 10px; background-color: #1c0914;">
                  <p><strong>TOTAL:</strong> <span style="font-size: 28px; font-weight: bold; color: #ff007f;">$${citaData.monto_total}</span></p>
                  <p><strong>DEPÓSITO INICIAL REALIZADO:</strong> <span style="font-size: 28px; font-weight: bold; color: #ff007f;">$${citaData.monto_deposito}</span></p>
                </div>
              </div>
            `,
          });
        }

        return res
          .status(200)
          .json({ message: "Cita actualizada correctamente" });

      case "DELETE":
        const { id: idToDelete } = req.body;
        await db.query("DELETE FROM citas WHERE id = ?", [idToDelete]);
        return res.status(200).json({ message: "Cita eliminada" });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("ERROR EN API GESTION-CITAS:", error);
    return res.status(500).json({ error: error.message });
  }
}
