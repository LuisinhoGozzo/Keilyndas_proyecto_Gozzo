import db from "../../../lib/db";
import transporter from "../../../lib/nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Método no permitido" });
  }

  try {
    const {
      nombre_completo,
      email,
      telefono,
      sistema,
      tamano,
      estilo,
      diseno,
      fecha_cita,
      hora_cita,
      monto_total,
      tipo_servicio,
      direccion,
      remocion,
      foto_referencia,
      ref_deposito,
    } = req.body;

    if (!sistema || !fecha_cita || !hora_cita) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos obligatorios para procesar la reserva.",
      });
    }

    const monto_deposito = Number(monto_total) / 2;

    const query = `
      INSERT INTO citas (
        nombre_completo, telefono, email, sistema, tamano, estilo, diseno,
        fecha_cita, hora_cita, tipo_servicio, direccion,
        remocion, foto_referencia, monto_total,
        monto_deposito, ref_deposito, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pre-reservada')
    `;

    const valores = [
      nombre_completo || "Cliente",
      telefono,
      email.trim().toLowerCase(),
      sistema,
      tamano,
      estilo,
      diseno,
      fecha_cita,
      hora_cita,
      tipo_servicio,
      direccion,
      remocion,
      foto_referencia || null,
      Number(monto_total),
      monto_deposito,
      ref_deposito || "0",
    ];

    const [result] = await db.execute(query, valores);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `lgozzo1206@gmail.com, ${email}`,
      subject: `¡Nueva Cita Pre-reservada en Keilyndas!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #12040d; color: #ffffff; border: 2px solid #ff007f; border-radius: 15px;">
          <h2 style="color: #ff007f;">💅 ¡Nueva Cita Pre-reservada en Keilyndas!</h2>
          <p><strong>NOMBRE:</strong> ${nombre_completo}</p>
          <p><strong>E-MAIL:</strong> ${email}</p>
          <p><strong>TELÉFONO:</strong> ${telefono}</p>
          <p><strong>SISTEMA:</strong> ${sistema}</p>
          <p><strong>TAMAÑO:</strong> ${tamano}</p>
          <p><strong>ESTILO:</strong> ${estilo}</p>
          <p><strong>DISEÑO:</strong> ${diseno}</p>
          <p><strong>FECHA y HORA:</strong> ${fecha_cita} a las ${hora_cita}</p>
          <p><strong>TIPO DE SERVICIO:</strong> ${tipo_servicio} (${direccion})</p>
          <p><strong>REMOCIÓN:</strong> ${remocion}</p>
          
          <div style="margin: 20px 0; padding: 15px; border: 2px solid #ff007f; border-radius: 10px; background-color: #1c0914;">
            <p><strong>TOTAL:</strong> <span style="font-size: 28px; font-weight: bold; color: #ff007f;">$${monto_total}</span></p>
            <p><strong>DEPÓSITO INICIAL:</strong> <span style="font-size: 28px; font-weight: bold; color: #ff007f;">$${monto_deposito}</span></p>
          </div>
          
          <p><strong>ESTADO DE LA CITA:</strong> pre-reservada</p>
          
          <div style="background-color: #2a1a24; padding: 15px; border-radius: 10px; margin-top: 20px;">
            <h3 style="color: #ff007f; text-align: center;">PAGO MÓVIL</h3>
            <p style="text-align: center;"><strong>Titular del beneficiario:</strong> KEILYN CHACÓN<br>
            <strong>Banco del beneficiario:</strong> PROVINCIAL (0114)<br>
            <strong>Cédula del beneficiario:</strong> 18249182<br>
            <strong>Teléfono del beneficiario:</strong> 04129643551</p>
          </div>

          <p>¿Está usted de acuerdo con este presupuesto?</p>
          <p>En caso de que SÍ esté de acuerdo, usted puede proceder a realizar el pago móvil con los datos proporcionados en este mensaje y enviando el comprobante de pago (Capture de pantalla) o también puede hacerlo conectándose en su sesión de Keilyndas de nuestra plataforma, en la tabla "Historial de MIS CITAS", haciendo click en el sobre brillante.</p>
          <p>En caso de que NO esté de acuerdo, el espacio de su cita pre-reservada será abierto en un intervalo de 30 min y 2 horas. Y el estado de su cita cambiará a rechazada.</p>
        </div>
      `,
      attachments: [],
    };

    if (foto_referencia && foto_referencia.includes("base64,")) {
      const parteBase64 = foto_referencia.split("base64,")[1];
      mailOptions.attachments.push({
        filename: `ref_${fecha_cita}.jpg`,
        content: Buffer.from(parteBase64, "base64"),
        contentType: "image/jpeg",
      });
    }

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Cita pre-reservada con éxito.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("ERROR CRÍTICO AGENDAR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al procesar la cita." });
  }
}
