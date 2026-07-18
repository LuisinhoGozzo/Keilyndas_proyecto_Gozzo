import db from "../../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      // . VER LA LISTA DE CLIENTES .... aqui voy con el CRUD
      case "GET":
        const [clientes] = await db.execute(
          "SELECT id, nombre_completo, telefono, email, rol FROM clientes",
        );
        return res.status(200).json(clientes);

      // . CREAR NUEVO CLIENTE
      case "POST":
        const { nombre_completo, telefono, email, clave } = req.body;

        if (!nombre_completo || !telefono || !email || !clave) {
          return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios." });
        }
        if (clave.length < 6) {
          return res
            .status(400)
            .json({ message: "La clave debe tener 8-32 caracteres." });
        }
        if (!email.includes("@")) {
          return res
            .status(400)
            .json({ message: "El correo electrónico no es válido." });
        }

        const [existing] = await db.execute(
          "SELECT id FROM clientes WHERE email = ?",
          [email],
        );
        if (existing.length > 0) {
          return res
            .status(400)
            .json({ message: "Este correo ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(clave, 10);
        const [result] = await db.execute(
          "INSERT INTO clientes (nombre_completo, telefono, email, clave, rol) VALUES (?, ?, ?, ?, ?)",
          [nombre_completo, telefono, email, hashedPassword, "cliente"],
        );

        return res.status(201).json({
          id: result.insertId,
          nombre_completo,
          telefono,
          email,
          rol: "cliente",
        });

      // . ACTUALIZAR CLIENTE (EDICIÓN)
      case "PUT":
        const { id, nombre_completo: nc, telefono: tel, email: em } = req.body;
        await db.execute(
          "UPDATE clientes SET nombre_completo = ?, telefono = ?, email = ? WHERE id = ?",
          [nc, tel, em, id],
        );
        return res
          .status(200)
          .json({ message: "Cliente actualizado correctamente" });

      // . ELIMINAR CLIENTE
      case "DELETE":
        const { id: deleteId } = req.body;

        // Protección de seguridad en el servidor
        if (deleteId === 1) {
          return res
            .status(403)
            .json({ message: "No puedes eliminar al Administrador" });
        }

        await db.execute("DELETE FROM clientes WHERE id = ?", [deleteId]);
        return res
          .status(200)
          .json({ message: "Cliente eliminado correctamente" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Método ${method} no permitido`);
    }
  } catch (error) {
    console.error("Error en API gestión-clientes:", error);
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
}
