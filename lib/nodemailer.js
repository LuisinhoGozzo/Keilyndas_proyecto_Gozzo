import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Configurado en .env.local
    pass: process.env.EMAIL_PASS, // mi contraseña de aplicación de 16 letras de Google
  },
});

export default transporter;
