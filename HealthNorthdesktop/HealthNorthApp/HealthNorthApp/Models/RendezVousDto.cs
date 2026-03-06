using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace HealthNorthApp.Models
{
    public class RendezVousDto
{
    public int idRdv { get; set; }
    public string dateRdv { get; set; } = "";
    public string heureRdv { get; set; } = "";
    public string typeIntervention { get; set; } = "";
    public string statut { get; set; } = "";

    public string patientNom { get; set; } = "";
    public string patientPrenom { get; set; } = "";

    public string specialisteNom { get; set; } = "";
    public string specialistePrenom { get; set; } = "";

    public string etablissementNom { get; set; } = "";
}
}