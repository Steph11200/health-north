const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "mariadb-health",
  user: "root",
  password: "root",
  database: "health_north",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;