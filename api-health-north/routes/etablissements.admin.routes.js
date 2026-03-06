const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, authorizeRoles } = require("../middleware/authJWT");

// GET /admin/etablissements
router.get("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM Etablissement ORDER BY region, departement, ville, nom"
  );
  res.json(rows);
});

// POST /admin/etablissements
router.post("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { nom, ville, region, departement } = req.body;

  if (!nom || !ville) {
    return res.status(400).json({ message: "nom et ville requis" });
  }

  const [result] = await db.query(
    "INSERT INTO Etablissement (nom, ville, region, departement) VALUES (?, ?, ?, ?)",
    [nom, ville, region || null, departement || null]
  );

  res.status(201).json({ message: "Établissement ajouté ✅", idEtablissement: result.insertId });
});

// PUT /admin/etablissements/:id
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;
  const { nom, ville, region, departement } = req.body;

  if (!nom || !ville) {
    return res.status(400).json({ message: "nom et ville requis" });
  }

  const [result] = await db.query(
    "UPDATE Etablissement SET nom=?, ville=?, region=?, departement=? WHERE idEtablissement=?",
    [nom, ville, region || null, departement || null, id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "Établissement introuvable" });
  res.json({ message: "Établissement modifié ✅" });
});

// DELETE /admin/etablissements/:id
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;

  const [result] = await db.query(
    "DELETE FROM Etablissement WHERE idEtablissement=?",
    [id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "Établissement introuvable" });
  res.json({ message: "Établissement supprimé ✅" });
});

module.exports = router;