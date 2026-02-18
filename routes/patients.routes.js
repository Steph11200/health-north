const express = require("express");
const router = express.Router();
const db = require("../db");

// GET tous les patients
router.get("/", (req, res) => {
  db.query("SELECT * FROM Patient", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET un patient par id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM Patient WHERE idPatient = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    res.json(results[0]);
  });
});

// POST créer un patient
router.post("/", (req, res) => {
  const { nom, prenom, dateNaissance, numSecu, email, telephone } = req.body;

  // mini vérif
  if (!nom || !prenom || !dateNaissance || !numSecu || !email) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  db.query(
    `INSERT INTO Patient (nom, prenom, dateNaissance, numSecu, email, telephone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nom, prenom, dateNaissance, numSecu, email, telephone || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Patient créé ✅",
        idPatient: result.insertId
      });
    }
  );
});


module.exports = router;

