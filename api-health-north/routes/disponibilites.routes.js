const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middleware/authJWT");

// GET /disponibilites?specialiste=1&date=2025-06-20&duree=30
router.get("/", verifyToken, async (req, res) => {
  try {
    const { specialiste, date, duree } = req.query;

    if (!specialiste || !date || !duree) {
      return res.status(400).json({ message: "specialiste, date, duree requis" });
    }

    const dureeMinutes = parseInt(duree, 10);

    // récupérer plages dispo
    const [dispos] = await db.query(
      `SELECT heureDebut, heureFin
       FROM Disponibilite
       WHERE idSpecialiste=? AND dateDispo=?`,
      [specialiste, date]
    );

    if (dispos.length === 0) return res.json([]);

    // récupérer RDV déjà pris
    const [rdvs] = await db.query(
      `SELECT heureRdv, typeIntervention
       FROM RendezVous
       WHERE idSpecialiste=? AND dateRdv=? AND statut <> 'Annulé'`,
      [specialiste, date]
    );

    const takenSlots = rdvs.map(r => r.heureRdv);

    let slots = [];

    for (const dispo of dispos) {
      let current = new Date(`${date}T${dispo.heureDebut}`);
      const end = new Date(`${date}T${dispo.heureFin}`);

      while (true) {
        const next = new Date(current.getTime() + dureeMinutes * 60000);
        if (next > end) break;

        const timeStr = current.toTimeString().substring(0,5);

        if (!takenSlots.includes(timeStr + ":00")) {
          slots.push(timeStr);
        }

        current = next;
      }
    }

    res.json(slots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;