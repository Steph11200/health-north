const express = require("express");
const router = express.Router();
const db = require("../db");

const { verifyToken, authorizeRoles } = require("../middleware/authJWT");

// GET tous les rendez-vous
router.get("/", verifyToken, authorizeRoles("ADMIN", "SECRETAIRE"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.idRdv, r.dateRdv, r.heureRdv, r.typeIntervention, r.statut,
             p.nom AS patientNom, p.prenom AS patientPrenom,
             s.nom AS specialisteNom, s.prenom AS specialistePrenom,
             e.nom AS etablissementNom
      FROM RendezVous r
      JOIN Patient p ON p.idPatient = r.idPatient
      JOIN Specialiste s ON s.idSpecialiste = r.idSpecialiste
      JOIN Etablissement e ON e.idEtablissement = r.idEtablissement
      ORDER BY r.dateRdv, r.heureRdv
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /rendezvous/me (PATIENT : ses rendez-vous uniquement)
router.get("/me", verifyToken, authorizeRoles("PATIENT"), async (req, res) => {
  try {
    const idPatient = req.user.idPatient;

    const [rows] = await db.query(
      `
      SELECT r.idRdv, r.dateRdv, r.heureRdv, r.typeIntervention, r.statut,
             s.nom AS specialisteNom, s.prenom AS specialistePrenom, s.specialite,
             e.nom AS etablissementNom, e.ville
      FROM RendezVous r
      JOIN Specialiste s ON s.idSpecialiste = r.idSpecialiste
      JOIN Etablissement e ON e.idEtablissement = r.idEtablissement
      WHERE r.idPatient = ?
      ORDER BY r.dateRdv, r.heureRdv
      `,
      [idPatient]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST créer un rendez-vous
router.post("/", verifyToken, authorizeRoles("PATIENT", "ADMIN", "SECRETAIRE"), async (req, res) => {
  const { dateRdv, heureRdv, typeIntervention, statut, idPatient, idSpecialiste, idEtablissement } = req.body;

  let realIdPatient = idPatient;

  if (req.user.role === "PATIENT") {
  realIdPatient = req.user.idPatient;
}

  if (!dateRdv || !heureRdv || !typeIntervention || !realIdPatient || !idSpecialiste || !idEtablissement) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO RendezVous (dateRdv, heureRdv, typeIntervention, statut, IdPatient, idSpecialiste, idEtablissement)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [dateRdv, heureRdv, typeIntervention, statut || "Planifié", realIdPatient, idSpecialiste, idEtablissement]
    );

    res.status(201).json({
      message: "Rendez-vous créé ✅",
      idRdv: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /rendezvous/:id/annuler (PATIENT : annule un de ses RDV)
router.put("/:id/annuler", verifyToken, authorizeRoles("PATIENT"), async (req, res) => {
  try {
    const idRdv = req.params.id;
    const idPatient = req.user.idPatient;

    const [result] = await db.query(
      "UPDATE RendezVous SET statut = 'Annulé' WHERE idRdv = ? AND idPatient = ?",
      [idRdv, idPatient]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "RDV introuvable (ou pas à toi)" });
    }

    res.json({ message: "RDV annulé ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;