const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const { verifyToken, authorizeRoles } = require("../middleware/authJWT");

// GET /me (profil patient)
router.get("/", verifyToken, authorizeRoles("PATIENT"), async (req, res) => {
  try {
    const idPatient = req.user.idPatient;

    const [rows] = await db.query(
      "SELECT idPatient, nom, prenom, dateNaissance, numSecu, email, telephone, adressePostale FROM Patient WHERE idPatient=?",
      [idPatient]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Patient introuvable" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /me (modifier infos patient)
router.put("/", verifyToken, authorizeRoles("PATIENT"), async (req, res) => {
  try {
    const idPatient = req.user.idPatient;
    const { nom, prenom, email, telephone, adressePostale } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: "nom, prenom, email obligatoires" });
    }

    await db.query(
      `UPDATE Patient
       SET nom=?, prenom=?, email=?, telephone=?, adressePostale=?
       WHERE idPatient=?`,
      [nom, prenom, email, telephone || null, adressePostale || null, idPatient]
    );

    // garder email synchro dans Utilisateur
    await db.query(
      `UPDATE Utilisateur SET email=? WHERE idPatient=? AND role='PATIENT'`,
      [email, idPatient]
    );

    res.json({ message: "Profil mis à jour ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /me/password (changer mot de passe)
router.put("/password", verifyToken, authorizeRoles("PATIENT"), async (req, res) => {
  try {
    const idPatient = req.user.idPatient;
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ message: "ancienMotDePasse et nouveauMotDePasse requis" });
    }

    const [rows] = await db.query(
      "SELECT idUtilisateur, motDePasse FROM Utilisateur WHERE idPatient=? AND role='PATIENT' LIMIT 1",
      [idPatient]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Compte utilisateur introuvable" });

    const user = rows[0];
    const ok = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
    if (!ok) return res.status(401).json({ message: "Ancien mot de passe incorrect" });

    const hash = await bcrypt.hash(nouveauMotDePasse, 10);
    await db.query("UPDATE Utilisateur SET motDePasse=? WHERE idUtilisateur=?", [hash, user.idUtilisateur]);

    res.json({ message: "Mot de passe modifié ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;