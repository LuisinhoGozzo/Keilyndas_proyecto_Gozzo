import mysql from "mysql2/promise";

let db;

if (!global._mysqlPool) {
  global._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "4000", 10),
    ssl: {
      rejectUnauthorized: true,
    },
  });
}
db = global._mysqlPool;

export default db;
