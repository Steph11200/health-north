const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authJWT");

// GET /specialistes?specialite=...
router.get("/", verifyToken, async (req, res) => {
  try {
    const { specialite } = req.query;

    let sql = "SELECT * FROM Specialiste WHERE 1=1";
    const params = [];

    if (specialite) {
      sql += " AND specialite = ?";
      params.push(specialite);
    }

    sql += " ORDER BY specialite, nom, prenom";

    const [rows] = await db.query(sql, params);
    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;