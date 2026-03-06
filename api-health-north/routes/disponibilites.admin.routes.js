const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, authorizeRoles } = require("../middleware/authJWT");

// GET /admin/disponibilites (option: filtres)
router.get("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { idSpecialiste, dateDispo } = req.query;

  let sql = `
    SELECT d.idDisponibilite, d.idSpecialiste, s.nom, s.prenom, d.dateDispo, d.heureDebut, d.heureFin
    FROM Disponibilite d
    JOIN Specialiste s ON s.idSpecialiste = d.idSpecialiste
    WHERE 1=1
  `;
  const params = [];

  if (idSpecialiste) { sql += " AND d.idSpecialiste=?"; params.push(idSpecialiste); }
  if (dateDispo) { sql += " AND d.dateDispo=?"; params.push(dateDispo); }

  sql += " ORDER BY d.dateDispo, d.heureDebut";

  const [rows] = await db.query(sql, params);
  res.json(rows);
});

// POST /admin/disponibilites
router.post("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { idSpecialiste, dateDispo, heureDebut, heureFin } = req.body;

  if (!idSpecialiste || !dateDispo || !heureDebut || !heureFin) {
    return res.status(400).json({ message: "idSpecialiste, dateDispo, heureDebut, heureFin requis" });
  }

  const [result] = await db.query(
    "INSERT INTO Disponibilite (idSpecialiste, dateDispo, heureDebut, heureFin) VALUES (?, ?, ?, ?)",
    [idSpecialiste, dateDispo, heureDebut, heureFin]
  );

  res.status(201).json({ message: "Disponibilité ajoutée ✅", idDisponibilite: result.insertId });
});

// PUT /admin/disponibilites/:id
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;
  const { idSpecialiste, dateDispo, heureDebut, heureFin } = req.body;

  if (!idSpecialiste || !dateDispo || !heureDebut || !heureFin) {
    return res.status(400).json({ message: "idSpecialiste, dateDispo, heureDebut, heureFin requis" });
  }

  const [result] = await db.query(
    "UPDATE Disponibilite SET idSpecialiste=?, dateDispo=?, heureDebut=?, heureFin=? WHERE idDisponibilite=?",
    [idSpecialiste, dateDispo, heureDebut, heureFin, id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "Disponibilité introuvable" });
  res.json({ message: "Disponibilité modifiée ✅" });
});

// DELETE /admin/disponibilites/:id
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;

  const [result] = await db.query("DELETE FROM Disponibilite WHERE idDisponibilite=?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Disponibilité introuvable" });

  res.json({ message: "Disponibilité supprimée ✅" });
});

module.exports = router;