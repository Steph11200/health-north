const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, authorizeRoles } = require("../middleware/authJWT");

// GET /admin/specialistes (liste)
router.get("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Specialiste ORDER BY specialite, nom, prenom");
  res.json(rows);
});

// POST /admin/specialistes (ajout)
router.post("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { nom, prenom, specialite } = req.body;
  if (!nom || !prenom) return res.status(400).json({ message: "nom et prenom requis" });

  const [result] = await db.query(
    "INSERT INTO Specialiste (nom, prenom, specialite) VALUES (?, ?, ?)",
    [nom, prenom, specialite || null]
  );

  res.status(201).json({ message: "Spécialiste ajouté ✅", idSpecialiste: result.insertId });
});

// PUT /admin/specialistes/:id (modif)
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;
  const { nom, prenom, specialite } = req.body;

  if (!nom || !prenom) return res.status(400).json({ message: "nom et prenom requis" });

  const [result] = await db.query(
    "UPDATE Specialiste SET nom=?, prenom=?, specialite=? WHERE idSpecialiste=?",
    [nom, prenom, specialite || null, id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "Spécialiste introuvable" });
  res.json({ message: "Spécialiste modifié ✅" });
});

// DELETE /admin/specialistes/:id (suppression)
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;

  const [result] = await db.query("DELETE FROM Specialiste WHERE idSpecialiste=?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Spécialiste introuvable" });

  res.json({ message: "Spécialiste supprimé ✅" });
});

module.exports = router;