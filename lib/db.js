import mysql from 'mysql2/promise';

const globalForDb = global;

if (!globalForDb.pool) {
    globalForDb.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 4000,
        ssl: {
            rejectUnauthorized: false,
        },
        connectTimeout: 10000,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

const pool = globalForDb.pool;

export default pool;
