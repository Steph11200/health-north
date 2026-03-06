const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authJWT");

router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "PATIENT") {
      return res.status(403).json({ message: "Accès refusé" });
    }

   // Trouver l'idPatient lié au user connecté
const userId = req.user.idUtilisateur ?? req.user.id;

const [users] = await db.query(
  "SELECT idPatient FROM Utilisateur WHERE idUtilisateur = ?",
  [userId]
);

    if (users.length === 0 || !users[0].idPatient) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    const idPatient = users[0].idPatient;

    // Récupérer ses RDV (triés)
    const [rows] = await db.query(
      `
      SELECT r.idRdv, r.dateRdv, r.heureRdv, r.typeIntervention, r.statut,
             s.nom AS specialisteNom, s.prenom AS specialistePrenom, s.specialite,
             e.nom AS etablissementNom, e.ville
      FROM RendezVous r
      JOIN Specialiste s ON s.idSpecialiste = r.idSpecialiste
      JOIN Etablissement e ON e.idEtablissement = r.idEtablissement
      WHERE r.idPatient = ?
      ORDER BY r.dateRdv ASC, r.heureRdv ASC
      `,
      [idPatient]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;