USE health_north;

-- =========================
-- ETABLISSEMENTS
-- =========================
INSERT INTO Etablissement (nom, type, adresse, ville, departement, region, telephone)
VALUES
('Clinique Health North Paris', 'Clinique', '12 rue de Paris', 'Paris', 'Paris', 'Ile-de-France', '0102030405'),
('Laboratoire Health North Lyon', 'Laboratoire', '5 avenue Lyon', 'Lyon', 'Rhône', 'Auvergne-Rhône-Alpes', '0607080910');

-- =========================
-- SPECIALISTES
-- =========================
INSERT INTO Specialiste (nom, prenom, specialite)
VALUES
('Dupont', 'Jean', 'Cardiologie'),
('Martin', 'Claire', 'Dermatologie');

-- =========================
-- PATIENTS
-- =========================
INSERT INTO Patient (nom, prenom, dateNaissance, numSecu, email, telephone, adressePostale)
VALUES
('Deville', 'Stephanie', '1998-04-12', '298041234567890', 'stephanie@mail.com', '0611223344', '3 rue de la liberté 75000 Paris'),
('Bernard', 'Paul', '1985-07-21', '185072134567890', 'paul@mail.com', '0677889900', '4 avenue de la valise 13001 Marseille');

-- =========================
-- UTILISATEURS
-- =========================
INSERT INTO Utilisateur (email, motDePasse, role, idPatient) 
VALUES
('stephanie@mail.com', '$2b$10$hjcyvUA3b1Oan3yW0kzbTOjzTrzQ0SR1IguiDp.iaKv8JWqUSIr/a', 'PATIENT', 1),
('paul@mail.com', '$2b$10$HmsqUkR3YZ9wBUqTMBdBXOjCk65aZWEqQL7Jw0KrOxMdXHnqFaHi6', 'PATIENT', 2);


-- =========================
-- RENDEZ-VOUS
-- =========================
INSERT INTO RendezVous (dateRdv, heureRdv, typeIntervention, statut, idPatient, idSpecialiste, idEtablissement)
VALUES
('2026-05-15', '09:00:00', 'Consultation', 'Planifié', 1, 1, 1),
('2026-06-20', '14:30:00', 'Consultation', 'Planifié', 2, 2, 2);

-- =========================
-- FACTURES
-- =========================
INSERT INTO Facture (dateFacture, montantTotal, statutPaiement, idRdv)
VALUES
('2026-05-15', 50.00, 'Non payé', 1);

-- =========================
-- PRESCRIPTIONS
-- =========================
INSERT INTO Prescription (datePrescription, commentaire, idRdv)
VALUES
('2026-05-15', 'Traitement léger', 1);

-- =========================
-- MEDICAMENTS
-- =========================
INSERT INTO Medicament (nom, dosage, description)
VALUES
('Doliprane', '500mg', 'Antalgique'),
('Ibuprofene', '400mg', 'Anti-inflammatoire');

-- =========================
-- PRESCRIPTION_MEDICAMENT
-- =========================
INSERT INTO PrescriptionMedicament (idPrescription, idMedicament, quantite, posologie, dureeJours)
VALUES
(1, 1, 10, '1 comprimé matin et soir', 5),
(1, 2, 6, '1 comprimé matin et soir', 3);

-- =========================
-- ALARMES
-- =========================
INSERT INTO Alarme (heure, statut, idPrescription)
VALUES
('08:00:00', 'Active', 1);

-- =========================
-- EXAMENS
-- =========================
INSERT INTO Examen (libelle, dureeMinutes)
VALUES
('IRM cérébrale', 45),
('Radiographie thorax', 20),
('Scanner abdominal', 30),
('Échographie', 25);

-- =========================
-- DISPONIBILITES
-- =========================
INSERT INTO Disponibilite (idSpecialiste, dateDispo, heureDebut, heureFin)
VALUES
(1, '2025-06-20', '08:00:00', '12:00:00'),
(1, CURDATE()+INTERVAL 1 DAY , '08:00:00', '12:00:00'),
(1, CURDATE()+INTERVAL 2 DAY , '08:00:00', '12:00:00'),
(1, CURDATE()+INTERVAL 3 DAY , '08:00:00', '12:00:00'),
(1, CURDATE()+INTERVAL 4 DAY , '08:00:00', '12:00:00'),
(1, CURDATE()+INTERVAL 5 DAY , '08:00:00', '12:00:00'),
(2, CURDATE()+INTERVAL 1 DAY , '08:00:00', '12:00:00'),
(2, CURDATE()+INTERVAL 2 DAY , '08:00:00', '12:00:00'),
(2, CURDATE()+INTERVAL 3 DAY , '08:00:00', '12:00:00'),
(2, CURDATE()+INTERVAL 4 DAY , '08:00:00', '12:00:00'),
(1, '2025-06-21', '09:00:00', '13:00:00');