import nodemailer from "nodemailer";
import { IncomingForm } from "formidable";
import mysql from "mysql2/promise";

// Desactivamos el bodyParser para procesar FormData y archivos
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const form = new IncomingForm({
    maxFileSize: 5 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al procesar el formulario:", err);
      return res.status(500).json({ error: "Error al procesar el formulario" });
    }

    try {
      const getVal = (val) => (Array.isArray(val) ? val[0] : val);

      const idCita = getVal(fields.id);
      const nombreCliente = getVal(fields.nombreCliente);
      const nombreTitular = getVal(fields.nombreTitular);
      const telefonoTitular = getVal(fields.telefonoTitular);
      const cedulaTitular = getVal(fields.cedulaTitular);
      const bancoTitular = getVal(fields.bancoTitular);
      const fechaPago = getVal(fields.fechaPago);
      const referencia = getVal(fields.referencia);
      const fechaRaw = getVal(fields.fechaCita);
      const horaCita = getVal(fields.horaCita);

      // . ACTUALIZAR ESTADO EN LA BASE DE DATOS
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      await connection.execute(
        "UPDATE citas SET estado = 'pendiente', ref_deposito = ? WHERE id = ?",
        [referencia, idCita],
      );
      await connection.end();

      // . LÓGICA DE FECHA
      let fechaFinal = fechaRaw;
      if (fechaRaw && fechaRaw.includes("T")) {
        fechaFinal = fechaRaw.split("T")[0];
      }
      const fechaYHoraVisual = `${fechaFinal} (${horaCita})`;

      // . ENVÍO DE CORREO CON ESTILO UNIFICADO
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: '"Keilyndas" <lgozzo1206@gmail.com>',
        to: "lgozzo1206@gmail.com",
        subject: `Pago Móvil Recibido: ${nombreCliente}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #12040d; color: #ffffff; border: 2px solid #ff007f; border-radius: 15px;">
            <h2 style="color: #ff007f;">💳 PAGO MÓVIL RECIBIDO</h2>
            <p>Se ha recibido un nuevo comprobante de pago para la reserva de: <strong>${nombreCliente}</strong></p>
            
            <div style="background-color: #1c0914; padding: 15px; border: 1px solid #ff007f; border-radius: 10px; margin: 20px 0;">
              <p><strong>Titular:</strong> ${nombreTitular}</p>
              <p><strong>Teléfono:</strong> ${telefonoTitular}</p>
              <p><strong>Cédula:</strong> ${cedulaTitular}</p>
              <p><strong>Banco:</strong> ${bancoTitular}</p>
              <p><strong>Fecha de pago:</strong> ${fechaPago}</p>
              <p><strong>Número de Referencia:</strong> ${referencia}</p>
            </div>

            <p style="color: #ff007f; font-weight: bold;">Cita programada para: ${fechaYHoraVisual}</p>
            <p>Ya se puede verificar el comprobante de pago aquí o en la plataforma web para confirmar la cita.</p>
          </div>
        `,
        attachments: files.comprobante
          ? [
              {
                filename: files.comprobante[0].originalFilename,
                path: files.comprobante[0].filepath,
              },
            ]
          : [],
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error en la operación:", error);
      return res
        .status(500)
        .json({ error: "No se pudo completar la actualización o el envío" });
    }
  });
}
