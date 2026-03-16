namespace HealthNorthApp
{
    partial class LoginForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            txtLoginDn = new TextBox();
            txtPassword = new TextBox();
            btnLogin = new Button();
            lblStatus = new Label();
            SuspendLayout();
            // 
            // txtLoginDn
            // 
            txtLoginDn.Location = new Point(12, 106);
            txtLoginDn.Name = "txtLoginDn";
            txtLoginDn.Size = new Size(125, 27);
            txtLoginDn.TabIndex = 0;
            txtLoginDn.Text = "Login";
            // 
            // txtPassword
            // 
            txtPassword.Location = new Point(12, 151);
            txtPassword.Name = "txtPassword";
            txtPassword.Size = new Size(125, 27);
            txtPassword.TabIndex = 1;
            txtPassword.Text = "Mot de passe";
            // 
            // btnLogin
            // 
            btnLogin.Location = new Point(3, 184);
            btnLogin.Name = "btnLogin";
            btnLogin.Size = new Size(150, 38);
            btnLogin.TabIndex = 2;
            btnLogin.Text = "Se connecter";
            btnLogin.UseVisualStyleBackColor = true;
            // 
            // lblStatus
            // 
            lblStatus.AutoSize = true;
            lblStatus.Location = new Point(19, 237);
            lblStatus.Name = "lblStatus";
            lblStatus.Size = new Size(18, 20);
            lblStatus.TabIndex = 3;
            lblStatus.Text = "...";
            // 
            // LoginForm
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(lblStatus);
            Controls.Add(btnLogin);
            Controls.Add(txtPassword);
            Controls.Add(txtLoginDn);
            Name = "LoginForm";
            Text = "Health North";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private TextBox txtLoginDn;
        private TextBox txtPassword;
        private Button btnLogin;
        private Label lblStatus;
    }
}
