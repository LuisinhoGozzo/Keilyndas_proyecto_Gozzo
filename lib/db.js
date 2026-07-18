console.log("DEBUG: Iniciando intento de conexión...");
console.log("DEBUG: Host detectado:", process.env.DB_HOST ? "SI" : "NO");
console.log("DEBUG: User detectado:", process.env.DB_USER ? "SI" : "NO");

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 4000,
    ssl: { rejectUnauthorized: false }
});

export default pool;
