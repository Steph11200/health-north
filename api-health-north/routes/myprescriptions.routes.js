const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authJWT");

router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "PATIENT") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const userId = req.user.idUtilisateur ?? req.user.id;

    const [u] = await db.query(
      "SELECT idPatient FROM Utilisateur WHERE idUtilisateur = ?",
      [userId]
    );

    if (u.length === 0 || !u[0].idPatient) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    const idPatient = u[0].idPatient;

    // Prescriptions du patient via ses RDV + médicaments
    const [rows] = await db.query(
      `
      SELECT
        p.idPrescription,
        p.datePrescription,
        p.commentaire,
        r.idRdv,
        r.dateRdv,
        r.heureRdv,
        r.typeIntervention,
        m.idMedicament,
        m.nom AS medicamentNom,
        m.dosage,
        pm.quantite,
        pm.posologie,
        pm.dureeJours
      FROM RendezVous r
      JOIN Prescription p ON p.idRdv = r.idRdv
      LEFT JOIN PrescriptionMedicament pm ON pm.idPrescription = p.idPrescription
      LEFT JOIN Medicament m ON m.idMedicament = pm.idMedicament
      WHERE r.idPatient = ?
      ORDER BY p.datePrescription DESC, p.idPrescription DESC
      `,
      [idPatient]
    );

    // rows = résultat SQL "à plat"
const grouped = [];
const map = new Map();

for (const r of rows) {
  const key = r.idPrescription;

  if (!map.has(key)) {
    const obj = {
      idPrescription: r.idPrescription,
      datePrescription: r.datePrescription,
      commentaire: r.commentaire,
      rdv: {
        idRdv: r.idRdv,
        dateRdv: r.dateRdv,
        heureRdv: r.heureRdv,
        typeIntervention: r.typeIntervention,
      },
      medicaments: [],
    };

    map.set(key, obj);
    grouped.push(obj);
  }

  // Si pas de médicament (LEFT JOIN), on n'ajoute rien
  if (r.idMedicament) {
    map.get(key).medicaments.push({
      idMedicament: r.idMedicament,
      nom: r.medicamentNom,
      dosage: r.dosage,
      quantite: r.quantite,
      posologie: r.posologie,
      dureeJours: r.dureeJours,
    });
  }
}

res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;