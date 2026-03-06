-- Création de la base
CREATE DATABASE IF NOT EXISTS health_north;
USE health_north;

-- =========================
-- TABLE PATIENT
-- =========================
CREATE TABLE Patient (
    idPatient INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    dateNaissance DATE NOT NULL,
    numSecu VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150),
    telephone VARCHAR(20),
    adressePostale VARCHAR(150)
);

-- =========================
-- TABLE UTILISATEUR
-- =========================
CREATE TABLE Utilisateur (
    idUtilisateur INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    idPatient INT UNIQUE,
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient)
);

-- =========================
-- TABLE ETABLISSEMENT
-- =========================
CREATE TABLE Etablissement (
    idEtablissement INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    type VARCHAR(100),
    adresse VARCHAR(255),
    ville VARCHAR(100),
    departement VARCHAR(100),
    region VARCHAR(100),
    telephone VARCHAR(20)
);

-- =========================
-- TABLE SPECIALISTE
-- =========================
CREATE TABLE Specialiste (
    idSpecialiste INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    specialite VARCHAR(100)
);

-- =========================
-- TABLE RENDEZVOUS
-- =========================
CREATE TABLE RendezVous (
    idRdv INT AUTO_INCREMENT PRIMARY KEY,
    dateRdv DATE NOT NULL,
    heureRdv TIME NOT NULL,
    typeIntervention VARCHAR(150),
    statut VARCHAR(50),

    idPatient INT NOT NULL,
    idEtablissement INT NOT NULL,
    idSpecialiste INT NOT NULL,

    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient),
    FOREIGN KEY (idEtablissement) REFERENCES Etablissement(idEtablissement),
    FOREIGN KEY (idSpecialiste) REFERENCES Specialiste(idSpecialiste)
);

-- =========================
-- TABLE FACTURE
-- =========================
CREATE TABLE Facture (
    idFacture INT AUTO_INCREMENT PRIMARY KEY,
    dateFacture DATE,
    montantTotal DECIMAL(10,2),
    statutPaiement VARCHAR(50),

    idRdv INT UNIQUE,
    FOREIGN KEY (idRdv) REFERENCES RendezVous(idRdv)
);

-- =========================
-- TABLE PRESCRIPTION
-- =========================
CREATE TABLE Prescription (
    idPrescription INT AUTO_INCREMENT PRIMARY KEY,
    datePrescription DATE,
    commentaire TEXT,

    idRdv INT UNIQUE,
    FOREIGN KEY (idRdv) REFERENCES RendezVous(idRdv)
);

-- =========================
-- TABLE MEDICAMENT
-- =========================
CREATE TABLE Medicament (
    idMedicament INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    dosage VARCHAR(100),
    description TEXT
);

-- =========================
-- TABLE PRESCRIPTION_MEDICAMENT
-- =========================
CREATE TABLE PrescriptionMedicament (
    idPrescription INT,
    idMedicament INT,
    quantite INT,
    posologie VARCHAR(255),
    dureeJours INT,

    PRIMARY KEY (idPrescription, idMedicament),

    FOREIGN KEY (idPrescription) REFERENCES Prescription(idPrescription),
    FOREIGN KEY (idMedicament) REFERENCES Medicament(idMedicament)
);

-- =========================
-- TABLE ALARME
-- =========================
CREATE TABLE Alarme (
    idAlarme INT AUTO_INCREMENT PRIMARY KEY,
    heure TIME,
    statut VARCHAR(50),

    idPrescription INT NOT NULL,
    FOREIGN KEY (idPrescription) REFERENCES Prescription(idPrescription)
);

-- =========================
-- TABLE EXAMEN
-- =========================
CREATE TABLE Examen (
    idExamen INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(150),
    dureeMinutes INT NOT NULL
);

-- =========================
-- TABLE DISPONIBILITE
-- =========================
CREATE TABLE Disponibilite (
    idDisponibilite INT AUTO_INCREMENT PRIMARY KEY,
    dateDispo DATE NOT NULL,
    heureDebut TIME NOT NULL,
    heureFin TIME NOT NULL,

    idSpecialiste INT NOT NULL,
    FOREIGN KEY (idSpecialiste) REFERENCES Specialiste(idSpecialiste)
);

-- =========================
-- TABLE DOCUMENT
-- =========================
CREATE TABLE Document (
    idDocument INT AUTO_INCREMENT PRIMARY KEY,
    typeDocument VARCHAR(50) NOT NULL,
    nomFichier VARCHAR(255) NOT NULL,
    cheminFichier VARCHAR(255) NOT NULL,
    dateUpload DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    idRdv INT NOT NULL,
    FOREIGN KEY (idRdv) REFERENCES RendezVous(idRdv)
);

-- =============================
-- PROCEDURES STOCKEES
-- =============================

DELIMITER $$

-- -----------------------------------------------------
-- sp_prendre_rdv : création d'un RDV avec contrôle doublon
-- -----------------------------------------------------
CREATE PROCEDURE sp_prendre_rdv(
  IN p_idPatient INT,
  IN p_idEtablissement INT,
  IN p_idSpecialiste INT,
  IN p_dateRdv DATE,
  IN p_heureRdv TIME,
  IN p_typeIntervention VARCHAR(150)
)
BEGIN
  -- Vérifie si le créneau est déjà pris par ce spécialiste
  IF EXISTS (
    SELECT 1
    FROM RendezVous
    WHERE idSpecialiste = p_idSpecialiste
      AND dateRdv = p_dateRdv
      AND heureRdv = p_heureRdv
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Créneau déjà pris pour ce spécialiste';
  ELSE
    INSERT INTO RendezVous(dateRdv, heureRdv, typeIntervention, statut, idPatient, idEtablissement, idSpecialiste)
    VALUES(p_dateRdv, p_heureRdv, p_typeIntervention, 'Confirme', p_idPatient, p_idEtablissement, p_idSpecialiste);
  END IF;
END$$

-- -----------------------------------------------------
-- sp_payer_facture : passe une facture en "Payee"
-- -----------------------------------------------------
CREATE PROCEDURE sp_payer_facture(
  IN p_idFacture INT
)
BEGIN
  UPDATE Facture
  SET statutPaiement = 'Payee',
      dateFacture = COALESCE(dateFacture, CURDATE())
  WHERE idFacture = p_idFacture;
END$$


-- =====================================================
-- TRIGGERS
-- =====================================================

-- -----------------------------------------------------
-- trg_rdv_no_double : empêche double RDV (spécialiste + créneau)
-- -----------------------------------------------------
CREATE TRIGGER trg_rdv_no_double
BEFORE INSERT ON RendezVous
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM RendezVous
    WHERE idSpecialiste = NEW.idSpecialiste
      AND dateRdv = NEW.dateRdv
      AND heureRdv = NEW.heureRdv
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'RDV impossible : créneau déjà utilisé';
  END IF;
END$$

-- -----------------------------------------------------
-- trg_facture_set_rdv_statut : facture créée => RDV "A regler"
-- -----------------------------------------------------
CREATE TRIGGER trg_facture_set_rdv_statut
AFTER INSERT ON Facture
FOR EACH ROW
BEGIN
  UPDATE RendezVous
  SET statut = 'A regler'
  WHERE idRdv = NEW.idRdv;
END$$
