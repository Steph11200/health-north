const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
app.use(cors());

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const patientRoutes = require("./routes/patients.routes");
app.use("/patients", patientRoutes);

const rdvRoutes = require("./routes/rendezvous.routes");
app.use("/rendezvous", rdvRoutes);

const etablissementsRoutes = require("./routes/etablissements.routes");
app.use("/etablissements", etablissementsRoutes);

const specialistesRoutes = require("./routes/specialistes.routes");
app.use("/specialistes", specialistesRoutes);

const meRoutes = require("./routes/me.routes");
app.use("/me", meRoutes);

const myRdvRoutes = require("./routes/myrendezvous.routes");
app.use("/me/rendezvous", myRdvRoutes);

const myPrescriptions = require("./routes/myprescriptions.routes");
app.use("/me/prescriptions", myPrescriptions);

const geoRoutes = require("./routes/geo.routes");
app.use("/geo", geoRoutes);

const examensRoutes = require("./routes/examens.routes");
app.use("/examens", examensRoutes);

const adminSpecialistesRoutes = require("./routes/specialistes.admin.routes");
app.use("/admin/specialistes", adminSpecialistesRoutes);

const adminEtablissementsRoutes = require("./routes/etablissements.admin.routes");
app.use("/admin/etablissements", adminEtablissementsRoutes);

const adminDisponibilitesRoutes = require("./routes/disponibilites.admin.routes");
app.use("/admin/disponibilites", adminDisponibilitesRoutes);

const documentsRoutes = require("./routes/documents.routes");
app.use("/documents", documentsRoutes);

app.use("/uploads", express.static("uploads"));

const disponibilitesRoutes = require("./routes/disponibilites.routes");
app.use("/disponibilites", disponibilitesRoutes);

// Health check BDD
app.get("/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 as test");
    res.json({ db: rows[0].test === 1 ? "connectée ✅" : "erreur" });
  } catch (err) {
    res.status(500).json({ error: "Erreur BDD", details: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API lancée sur le port ${PORT}`);
});
