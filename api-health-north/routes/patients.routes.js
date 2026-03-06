const express = require("express");
const router = express.Router();
const db = require("../db");

const { verifyToken, authorizeRoles } = require("../middleware/authJWT");


// =========================
// GET tous les patients (ADMIN uniquement)
// =========================
router.get("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Patient");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// GET patient par ID (ADMIN ou PATIENT lui-même)
// =========================
router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM Patient WHERE idPatient = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    // Si ce n’est pas ADMIN, on vérifie que c’est son propre profil
    if (req.user.role !== "ADMIN" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// POST créer un patient (ADMIN uniquement)
// =========================
router.post("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { nom, prenom, dateNaissance, numSecu, email, telephone } = req.body;

  if (!nom || !prenom || !dateNaissance || !numSecu || !email) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Patient (nom, prenom, dateNaissance, numSecu, email, telephone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, prenom, dateNaissance, numSecu, email, telephone || null]
    );

    res.status(201).json({
      message: "Patient créé ✅",
      idPatient: result.insertId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// PUT modifier un patient (ADMIN uniquement)
// =========================
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;
  const { nom, prenom, email, telephone } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ message: "nom, prenom et email obligatoires" });
  }

  try {
    const [result] = await db.query(
      `UPDATE Patient 
       SET nom=?, prenom=?, email=?, telephone=? 
       WHERE idPatient=?`,
      [nom, prenom, email, telephone || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    res.json({ message: "Patient modifié ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// DELETE patient (ADMIN uniquement)
// =========================
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query(
      "DELETE FROM Patient WHERE idPatient=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    res.json({ message: "Patient supprimé ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;