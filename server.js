const express = require("express");
const mariadb = require("mariadb");

const app = express();
app.use(express.json());

// Connexion MariaDB (depuis Docker)
const pool = mariadb.createPool({
  host: process.env.DB_HOST || "mariadb-health",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "health_north",
  connectionLimit: 5
});

app.get("/", (req, res) => {
  res.json({ status: "OK", service: "API Health North" });
});

app.get("/health", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    res.json({ db: "OK" });
  } catch (e) {
    res.status(500).json({ db: "ERROR", message: e.message });
  }
});

// Exemple: lister les patients (vide pour l’instant, c’est normal)
app.get("/patients", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT idPatient, nom, prenom, email FROM Patient");
    conn.release();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));
