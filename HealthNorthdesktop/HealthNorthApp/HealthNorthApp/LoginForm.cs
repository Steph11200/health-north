using System;
using System.Windows.Forms;
using HealthNorthApp.Services;
using HealthNorthApp.Models;

namespace HealthNorthApp
{
    public partial class LoginForm : Form
    {
        private readonly ApiClient _api = new ApiClient("http://localhost:3000");

        public LoginForm()
        {
            InitializeComponent();
            btnLogin.Click += BtnLogin_Click;
        }

        private async void BtnLogin_Click(object? sender, EventArgs e)
        {
            lblStatus.Text = "";

            try
            {
                var body = new
                {
                    loginDn = txtLoginDn.Text.Trim(),
                    password = txtPassword.Text
                };

                var resp = await _api.PostJsonAsync<LoginResponse>("/auth/staff/login", body);
                _api.SetToken(resp.token);

                lblStatus.Text = "Connecté ✅";

                // étape suivante: ouvrir PlanningForm
                var planning = new HealthNorthApp.Forms.PlanningForm(_api);
                planning.Show();
                this.Hide();
            }
            catch (Exception ex)
            {
                lblStatus.Text = "Erreur ❌ " + ex.Message;
            }
        }

       
    }
}