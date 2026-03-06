const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authJWT");

// GET /geo/regions
router.get("/regions", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT DISTINCT region FROM Etablissement WHERE region IS NOT NULL AND region <> '' ORDER BY region"
  );
  res.json(rows.map(r => r.region));
});

// GET /geo/departements?region=...
router.get("/departements", verifyToken, async (req, res) => {
  const { region } = req.query;
  if (!region) return res.status(400).json({ message: "region requis" });

  const [rows] = await db.query(
    "SELECT DISTINCT departement FROM Etablissement WHERE region=? AND departement IS NOT NULL AND departement <> '' ORDER BY departement",
    [region]
  );
  res.json(rows.map(d => d.departement));
});

// GET /geo/villes?region=...&departement=...
router.get("/villes", verifyToken, async (req, res) => {
  const { region, departement } = req.query;
  if (!region || !departement) return res.status(400).json({ message: "region et departement requis" });

  const [rows] = await db.query(
    "SELECT DISTINCT ville FROM Etablissement WHERE region=? AND departement=? ORDER BY ville",
    [region, departement]
  );
  res.json(rows.map(v => v.ville));
});

module.exports = router;