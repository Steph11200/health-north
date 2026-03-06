const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, authorizeRoles } = require("../middleware/authJWT");

// GET /examens (PATIENT + STAFF)
router.get("/", verifyToken, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Examen ORDER BY libelle");
  res.json(rows);
});

// POST /examens (ADMIN)
router.post("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { libelle, dureeMinutes } = req.body;
  if (!libelle || !dureeMinutes) return res.status(400).json({ message: "libelle et dureeMinutes requis" });

  const [result] = await db.query(
    "INSERT INTO Examen (libelle, dureeMinutes) VALUES (?, ?)",
    [libelle, dureeMinutes]
  );

  res.status(201).json({ message: "Examen ajouté ✅", idExamen: result.insertId });
});

// PUT /examens/:id (ADMIN)
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { libelle, dureeMinutes } = req.body;
  const id = req.params.id;

  const [result] = await db.query(
    "UPDATE Examen SET libelle=?, dureeMinutes=? WHERE idExamen=?",
    [libelle, dureeMinutes, id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "Examen introuvable" });
  res.json({ message: "Examen modifié ✅" });
});

// DELETE /examens/:id (ADMIN)
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;
  const [result] = await db.query("DELETE FROM Examen WHERE idExamen=?", [id]);

  if (result.affectedRows === 0) return res.status(404).json({ message: "Examen introuvable" });
  res.json({ message: "Examen supprimé ✅" });
});

module.exports = router;