using HealthNorthApp.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Windows.Forms;


namespace HealthNorthApp.Forms
{
    public partial class AddDocumentForm : Form
    {
        private readonly ApiClient _api;
        private readonly int _idRdv;
        private string? _filePath;

        public AddDocumentForm(ApiClient api, int idRdv)
        {
            InitializeComponent();
            _api = api;
            _idRdv = idRdv;

            cmbType.Items.AddRange(new object[] { "radio", "scanner", "compte_rendu" });
            cmbType.SelectedIndex = 0;

            btnChooseFile.Click += BtnChooseFile_Click;
            btnSend.Click += BtnSend_Click;
        }

        private void BtnChooseFile_Click(object? sender, EventArgs e)
        {
            using var ofd = new OpenFileDialog();
            ofd.Title = "Choisir un document";
            ofd.Filter = "Tous fichiers|*.*";

            if (ofd.ShowDialog() == DialogResult.OK)
            {
                _filePath = ofd.FileName;
                lblFile.Text = Path.GetFileName(_filePath);
            }
        }

        private async void BtnSend_Click(object? sender, EventArgs e)
        {
            try
            {
                var typeDoc = cmbType.SelectedItem?.ToString() ?? "autre";

                // Si compte rendu: on crée un fichier texte temporaire
                if (typeDoc == "compte_rendu")
                {
                    var tmp = Path.Combine(Path.GetTempPath(), $"compte_rendu_{_idRdv}_{DateTime.Now.Ticks}.txt");
                    File.WriteAllText(tmp, txtReport.Text ?? "");
                    _filePath = tmp;
                    lblFile.Text = Path.GetFileName(_filePath);
                }

                if (string.IsNullOrEmpty(_filePath) || !File.Exists(_filePath))
                {
                    MessageBox.Show("Choisis un fichier (ou écris un compte-rendu).");
                    return;
                }

                using var http = new HttpClient();
                http.BaseAddress = new Uri("http://localhost:3000");
                http.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", _api.Token);

                using var form = new MultipartFormDataContent();
                form.Add(new StringContent(_idRdv.ToString()), "idRdv");
                form.Add(new StringContent(typeDoc), "typeDocument");

                var fileBytes = await File.ReadAllBytesAsync(_filePath);
                var fileContent = new ByteArrayContent(fileBytes);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                form.Add(fileContent, "file", Path.GetFileName(_filePath));

                var res = await http.PostAsync("/documents", form);
                var txt = await res.Content.ReadAsStringAsync();

                if (!res.IsSuccessStatusCode)
                {
                    MessageBox.Show("Erreur upload: " + txt);
                    return;
                }

                MessageBox.Show("Document ajouté ✅");
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur: " + ex.Message);
            }
        }
    }
}