const express = require("express");
const router = express.Router();
const db = require("../db");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { verifyToken, authorizeRoles } = require("../middleware/authJWT");

// dossier uploads
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, Date.now() + "_" + safeName);
  }
});

const upload = multer({ storage });

// POST /documents (PATIENT, ADMIN, SECRETAIRE)
router.post("/", verifyToken, authorizeRoles("PATIENT", "ADMIN", "SECRETAIRE"), upload.single("file"), async (req, res) => {
  try {
    const { idRdv, typeDocument } = req.body;

    if (!idRdv || !typeDocument) {
      return res.status(400).json({ message: "idRdv et typeDocument requis" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Fichier manquant" });
    }

    // si PATIENT -> vérifie que le RDV appartient au patient
    if (req.user.role === "PATIENT") {
      const [rows] = await db.query("SELECT idPatient FROM RendezVous WHERE idRdv=?", [idRdv]);
      if (rows.length === 0) return res.status(404).json({ message: "RDV introuvable" });
      if (rows[0].idPatient !== req.user.idPatient) {
        return res.status(403).json({ message: "RDV non autorisé" });
      }
    }

    await db.query(
      `INSERT INTO Document (idRdv, typeDocument, nomFichier, cheminFichier)
       VALUES (?, ?, ?, ?)`,
      [idRdv, typeDocument, req.file.originalname, req.file.filename]
    );

    res.status(201).json({ message: "Document uploadé ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /documents/:idRdv (liste docs d'un RDV)
router.get("/:idRdv", verifyToken, authorizeRoles("PATIENT", "ADMIN", "SECRETAIRE"), async (req, res) => {
  try {
    const idRdv = req.params.idRdv;

    // si PATIENT -> vérifie propriété
    if (req.user.role === "PATIENT") {
      const [rows] = await db.query("SELECT idPatient FROM RendezVous WHERE idRdv=?", [idRdv]);
      if (rows.length === 0) return res.status(404).json({ message: "RDV introuvable" });
      if (rows[0].idPatient !== req.user.idPatient) {
        return res.status(403).json({ message: "RDV non autorisé" });
      }
    }

    const [docs] = await db.query(
      "SELECT idDocument, typeDocument, nomFichier, cheminFichier, dateUpload FROM Document WHERE idRdv=? ORDER BY dateUpload DESC",
      [idRdv]
    );

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;