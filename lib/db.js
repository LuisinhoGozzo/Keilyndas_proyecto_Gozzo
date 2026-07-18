import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 4000,
    ssl: {
        rejectUnauthorized: false, // <-- CAMBIA ESTO A FALSE
    },
    connectTimeout: 5000 
});

export default pool;
