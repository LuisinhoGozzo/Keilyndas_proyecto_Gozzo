import mysql from 'mysql2/promise';

// Intentamos crear el pool con una configuración más robusta
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 4000,
    ssl: {
        rejectUnauthorized: true,
    },
    connectTimeout: 10000 // Aumentamos el tiempo de espera a 10 segundos
});

// Forzamos una prueba de conexión al iniciar
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("¡Conexión establecida con éxito!");
        connection.release();
    } catch (error) {
        console.error("ERROR CRÍTICO AL CONECTAR:", error.message);
        console.error("Código de error:", error.code);
    }
}

testConnection();

export default pool;
