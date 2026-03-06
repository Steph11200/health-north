const express = require("express");
const router = express.Router();
const ldap = require("ldapjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";


function createLdapClient() {
  const url = process.env.LDAP_URL || "ldap://localhost:389";
  return ldap.createClient({ url });
}

// LOGIN STAFF via LDAP (secrétaire/admin)
router.post("/staff/login", (req, res) => {
  const { loginDn, dn, password } = req.body;
  const realDn = loginDn || dn;

  if (!realDn || !password) {
    return res.status(400).json({ message: "loginDn et password requis" });
  }

  const client = createLdapClient();

  client.bind(realDn, password, (err) => {
    if (err) {
      client.unbind(() => {});
      return res.status(401).json({ message: "Identifiants LDAP invalides" });
    }

    
    // mettre role = "SECRETAIRE" en dur pour secretaire1 ou ADMIN pour administrateur 
    // (plus tard on pourra lire un attribut LDAP pour déterminer le rôle)
    const payload = {
      dn: loginDn,
      role: "ADMIN"
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "2h" });

    client.unbind(() => {});
    return res.json({ token });
  });
});


// ======================
// LOGIN PATIENT (BDD)
// ======================
router.post("/patient/login", async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const [rows] = await db.execute(
            "SELECT * FROM Utilisateur WHERE email = ? AND role = 'PATIENT'",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { idUtilisateur: user.idUtilisateur, idPatient: user.idPatient, role: user.role },
            SECRET,
            { expiresIn: "2h" }
        );

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================
// REGISTER PATIENT (BDD)
// ======================
router.post("/patient/register", async (req, res) => {
  const {
    nom,
    prenom,
    email,
    motDePasse,
    dateNaissance,
    numSecu,
    telephone,
    adressePostale
  } = req.body;

  if (!nom || !prenom || !email || !motDePasse) {
    return res.status(400).json({ message: "nom, prenom, email, motDePasse obligatoires" });
  }

  try {
    // 1) vérifier email unique
    const [exists] = await db.execute(
      "SELECT idUtilisateur FROM Utilisateur WHERE email = ?",
      [email]
    );
    if (exists.length > 0) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // 2) hash mdp
    const hash = await bcrypt.hash(motDePasse, 10);

    // 3) transaction : créer Patient puis Utilisateur lié
    await db.execute("START TRANSACTION");

  
    const [pRes] = await db.execute(
      `INSERT INTO Patient (nom, prenom, dateNaissance, numSecu, email, telephone, adressePostale)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nom,
        prenom,
        dateNaissance || null,
        numSecu || null,
        email,
        telephone || null,
        adressePostale || null
      ]
    );

    const idPatient = pRes.insertId;

    const [uRes] = await db.execute(
      `INSERT INTO Utilisateur (email, motDePasse, role, idPatient)
       VALUES (?, ?, 'PATIENT', ?)`,
      [email, hash, idPatient]
    );

    await db.execute("COMMIT");

    // 4) renvoyer token direct (inscription = connecté)
    const token = jwt.sign(
      { idUtilisateur: uRes.insertId, idPatient, role: "PATIENT" },
      SECRET,
      { expiresIn: "2h" }
    );

    return res.status(201).json({ message: "Compte créé ✅", token });

  } catch (err) {
    try { await db.execute("ROLLBACK"); } catch(e) {}
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;