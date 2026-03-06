using HealthNorthApp.Models;
using HealthNorthApp.Services;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Text;
using System.Windows.Forms;


namespace HealthNorthApp.Forms
{
    public partial class FactureForm : Form
    {
        private readonly ApiClient _api;
        private readonly RendezVousDto _rdv;

        // règles de calcul (tu peux ajuster)
        private const decimal TVA_RATE = 0.20m;          // 20%
        private const decimal SECU_RATE = 0.70m;         // 70%
        private const decimal MUTUELLE_RATE = 0.20m;     // 20% (sur TTC)
        private decimal _prixHT = 80m;                   // valeur par défaut

        public FactureForm(ApiClient api, RendezVousDto rdv)
        {
            InitializeComponent();
            _api = api;
            _rdv = rdv;

            btnCalc.Click += (s, e) => Recalc();
            btnPdf.Click += (s, e) => ExportPdf();

            FillInfos();
            Recalc();
        }
        private void label1_Click(object sender, EventArgs e)
        {
            // rien
        }
        private void FillInfos()
        {
            lblPatient.Text = $"Patient : {_rdv.patientNom} {_rdv.patientPrenom}";
            lblExamen.Text = $"Examen : {_rdv.typeIntervention}";
            lblDateHeure.Text = $"Date/Heure : {_rdv.dateRdv} {_rdv.heureRdv}";
            lblEtab.Text = $"Établissement : {_rdv.etablissementNom}";
            lblSpec.Text = $"Spécialiste : {_rdv.specialisteNom} {_rdv.specialistePrenom}";

            // Ajustement prix selon type (simple)
            _prixHT = GuessPrixHT(_rdv.typeIntervention);
        }

        private decimal GuessPrixHT(string typeIntervention)
        {
            var t = (typeIntervention ?? "").ToLowerInvariant();
            if (t.Contains("scanner")) return 120m;
            if (t.Contains("irm")) return 200m;
            if (t.Contains("radio")) return 60m;
            if (t.Contains("échographie") || t.Contains("echo")) return 90m;
            return 80m;
        }

        private void Recalc()
        {
            decimal tva = Math.Round(_prixHT * TVA_RATE, 2);
            decimal ttc = Math.Round(_prixHT + tva, 2);

            decimal secu = Math.Round(ttc * SECU_RATE, 2);
            decimal mutuelle = Math.Round(ttc * MUTUELLE_RATE, 2);

            decimal reste = Math.Round(ttc - secu - mutuelle, 2);
            if (reste < 0) reste = 0;

            txtPrixHT.Text = _prixHT.ToString("0.00", CultureInfo.InvariantCulture);
            txtTVA.Text = tva.ToString("0.00", CultureInfo.InvariantCulture);
            txtPrixTTC.Text = ttc.ToString("0.00", CultureInfo.InvariantCulture);
            txtSecu.Text = secu.ToString("0.00", CultureInfo.InvariantCulture);
            txtMutuelle.Text = mutuelle.ToString("0.00", CultureInfo.InvariantCulture);
            txtReste.Text = reste.ToString("0.00", CultureInfo.InvariantCulture);
        }

        private void ExportPdf()
        {
            using var sfd = new SaveFileDialog();
            sfd.Filter = "PDF|*.pdf";
            sfd.FileName = $"Facture_RDV_{_rdv.idRdv}.pdf";

            if (sfd.ShowDialog() != DialogResult.OK) return;

            var path = sfd.FileName;

            var prixHT = txtPrixHT.Text;
            var tva = txtTVA.Text;
            var ttc = txtPrixTTC.Text;
            var secu = txtSecu.Text;
            var mutuelle = txtMutuelle.Text;
            var reste = txtReste.Text;

            using var writer = new PdfWriter(path);
            using var pdf = new PdfDocument(writer);
            using var doc = new Document(pdf);

            var title = new Paragraph("HEALTH NORTH - FACTURE");
            title.SetFontSize(16);
            doc.Add(title);
            doc.Add(new Paragraph($"N° RDV : {_rdv.idRdv}"));
            doc.Add(new Paragraph($"Date : {_rdv.dateRdv}  Heure : {_rdv.heureRdv}"));
            doc.Add(new Paragraph($"Patient : {_rdv.patientNom} {_rdv.patientPrenom}"));
            doc.Add(new Paragraph($"Examen : {_rdv.typeIntervention}"));
            doc.Add(new Paragraph($"Établissement : {_rdv.etablissementNom}"));
            doc.Add(new Paragraph($"Spécialiste : {_rdv.specialisteNom} {_rdv.specialistePrenom}"));
            doc.Add(new Paragraph(" "));

            var table = new Table(2).UseAllAvailableWidth();
            table.AddCell("Prix HT");
            table.AddCell(prixHT + " €");
            table.AddCell("TVA (20%)");
            table.AddCell(tva + " €");
            table.AddCell("Prix TTC");
            table.AddCell(ttc + " €");
            table.AddCell("Part Sécurité Sociale");
            table.AddCell(secu + " €");
            table.AddCell("Part Mutuelle");
            table.AddCell(mutuelle + " €");
            table.AddCell("Reste à charge");
            table.AddCell(reste + " €");

            doc.Add(table);
            doc.Add(new Paragraph(" "));
            doc.Add(new Paragraph("Merci pour votre confiance."));

            doc.Close();

            MessageBox.Show("Facture PDF générée ✅\n" + path);
        }
    }
}