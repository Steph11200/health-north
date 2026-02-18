const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json());

// ROUTES
const patientRoutes = require("./routes/patients.routes");
app.use("/patients", patientRoutes);

app.get("/health", (req, res) => {
  db.query("SELECT 1 as test", (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur BDD" });
    res.json({ db: results[0].test === 1 ? "connectée ✅" : "erreur" });
  });
});
// UPDATE un patient
app.put("/patients/:id", (req, res) => {
  const id = req.params.id;
  const { nom, prenom, email, telephone } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ message: "nom, prenom et email sont obligatoires" });
  }

  db.query(
    "UPDATE Patient SET nom=?, prenom=?, email=?, telephone=? WHERE idPatient=?",
    [nom, prenom, email, telephone || null, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Patient introuvable" });
      }

      res.json({ message: "Patient modifié ✅" });
    }
  );
});

// DELETE un patient
app.delete("/patients/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM Patient WHERE idPatient=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    res.json({ message: "Patient supprimé ✅" });
  });
});

// GET tous les rendez-vous (avec infos lisibles)
app.get("/rendezvous", (req, res) => {
  const sql = `
    SELECT r.idRdv, r.dateRdv, r.heureRdv, r.typeIntervention, r.statut,
           p.idPatient, p.nom AS patientNom, p.prenom AS patientPrenom,
           s.idSpecialiste, s.nom AS specialisteNom, s.prenom AS specialistePrenom, s.specialite,
           e.idEtablissement, e.nom AS etablissementNom, e.ville
    FROM RendezVous r
    JOIN Patient p ON p.idPatient = r.idPatient
    JOIN Specialiste s ON s.idSpecialiste = r.idSpecialiste
    JOIN Etablissement e ON e.idEtablissement = r.idEtablissement
    ORDER BY r.dateRdv, r.heureRdv;
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST créer un rendez-vous
app.post("/rendezvous", (req, res) => {
  const { dateRdv, heureRdv, typeIntervention, statut, idPatient, idSpecialiste, idEtablissement } = req.body;

  if (!dateRdv || !heureRdv || !typeIntervention || !idPatient || !idSpecialiste || !idEtablissement) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  db.query(
    `INSERT INTO RendezVous (dateRdv, heureRdv, typeIntervention, statut, idPatient, idSpecialiste, idEtablissement)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [dateRdv, heureRdv, typeIntervention, statut || "Planifié", idPatient, idSpecialiste, idEtablissement],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Rendez-vous créé ✅",
        idRdv: result.insertId
      });
    }
  );
});

// UPDATE un rendez-vous
app.put("/rendezvous/:id", (req, res) => {
  const id = req.params.id;
  const { dateRdv, heureRdv, typeIntervention, statut, idPatient, idSpecialiste, idEtablissement } = req.body;

  db.query(
    `UPDATE RendezVous
     SET dateRdv=?, heureRdv=?, typeIntervention=?, statut=?, idPatient=?, idSpecialiste=?, idEtablissement=?
     WHERE idRdv=?`,
    [dateRdv, heureRdv, typeIntervention, statut, idPatient, idSpecialiste, idEtablissement, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Rendez-vous introuvable" });
      }

      res.json({ message: "Rendez-vous modifié ✅" });
    }
  );
});

// DELETE un rendez-vous
app.delete("/rendezvous/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM RendezVous WHERE idRdv=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

    res.json({ message: "Rendez-vous supprimé ✅" });
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API lancée sur le port ${PORT}`);
});

// Ajouter un patient
app.post('/patients', async (req, res) => {
    const { nom, prenom, dateNaissance, numSecu, email, telephone } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !prenom || !email) {
        return res.status(400).json({
            error: "Les champs nom, prenom et email sont obligatoires"
        });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO Patient (nom, prenom, dateNaissance, numSecu, email, telephone)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nom, prenom, dateNaissance, numSecu, email, telephone]
        );

        res.status(201).json({
            message: "Patient ajouté avec succès",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET patient par id
app.get('/patients/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Patient WHERE idPatient = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
