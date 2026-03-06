using HealthNorthApp.Models;
using HealthNorthApp.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;


namespace HealthNorthApp.Forms
{
    public partial class PlanningForm : Form
    {
        private readonly ApiClient _api;

        public PlanningForm(ApiClient api)
        {
            InitializeComponent();
            _api = api;

            btnFacture.Click += BtnFacture_Click;
            btnRefresh.Click += BtnRefresh_Click;
            btnAddDoc.Click += BtnAddDoc_Click;
            Load += PlanningForm_Load;
            
        }

        private async void PlanningForm_Load(object? sender, EventArgs e)
        {
            await LoadRdv();
        }

        private async void BtnRefresh_Click(object? sender, EventArgs e)
        {
            await LoadRdv();
        }

        private async System.Threading.Tasks.Task LoadRdv()
        {
            try
            {
                var list = await _api.GetJsonAsync<List<RendezVousDto>>("/rendezvous");
                gridRdv.AutoGenerateColumns = true;
                gridRdv.DataSource = list;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur chargement RDV: " + ex.Message);
            }
        }
        
        private void BtnAddDoc_Click(object? sender, EventArgs e)
        {
            if (gridRdv.CurrentRow?.DataBoundItem is not RendezVousDto rdv)
            {
                MessageBox.Show("Sélectionne un rendez-vous.");
                return;
            }

            var f = new AddDocumentForm(_api, rdv.idRdv);
            f.ShowDialog();
        }
        private void BtnFacture_Click(object? sender, EventArgs e)
        {
            if (gridRdv.CurrentRow?.DataBoundItem is not RendezVousDto rdv)
            {
                MessageBox.Show("Sélectionne un rendez-vous.");
                return;
            }

            var f = new FactureForm(_api, rdv);
            f.ShowDialog();
        }

    }
}