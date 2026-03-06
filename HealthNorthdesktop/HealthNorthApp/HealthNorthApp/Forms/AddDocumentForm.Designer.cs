namespace HealthNorthApp.Forms
{
    partial class AddDocumentForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
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
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            cmbType = new ComboBox();
            txtReport = new TextBox();
            btnChooseFile = new Button();
            lblFile = new Label();
            btnSend = new Button();
            SuspendLayout();
            // 
            // cmbType
            // 
            cmbType.FormattingEnabled = true;
            cmbType.Items.AddRange(new object[] { "radio", "scanner", "compte_rendu" });
            cmbType.Location = new Point(0, 0);
            cmbType.Name = "cmbType";
            cmbType.Size = new Size(151, 28);
            cmbType.TabIndex = 0;
            //cmbType.SelectedIndexChanged += this.cmbType_SelectedIndexChanged;
            // 
            // txtReport
            // 
            txtReport.Location = new Point(12, 47);
            txtReport.Name = "txtReport";
            txtReport.Size = new Size(125, 27);
            txtReport.TabIndex = 1;
            txtReport.Text = "pour le compte rendu";
            // 
            // btnChooseFile
            // 
            btnChooseFile.Location = new Point(12, 105);
            btnChooseFile.Name = "btnChooseFile";
            btnChooseFile.Size = new Size(94, 29);
            btnChooseFile.TabIndex = 2;
            btnChooseFile.Text = "Sélection fichier";
            btnChooseFile.UseVisualStyleBackColor = true;
            // 
            // lblFile
            // 
            lblFile.AutoSize = true;
            lblFile.Location = new Point(12, 160);
            lblFile.Name = "lblFile";
            lblFile.Size = new Size(108, 20);
            lblFile.TabIndex = 3;
            lblFile.Text = "Affiche chemin";
            // 
            // btnSend
            // 
            btnSend.Location = new Point(12, 203);
            btnSend.Name = "btnSend";
            btnSend.Size = new Size(94, 29);
            btnSend.TabIndex = 4;
            btnSend.Text = "envoyer";
            btnSend.UseVisualStyleBackColor = true;
            // 
            // AddDocumentForm
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(btnSend);
            Controls.Add(lblFile);
            Controls.Add(btnChooseFile);
            Controls.Add(txtReport);
            Controls.Add(cmbType);
            Name = "AddDocumentForm";
            Text = "Form1";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private ComboBox cmbType;
        private TextBox txtReport;
        private Button btnChooseFile;
        private Label lblFile;
        private Button btnSend;
    }
}