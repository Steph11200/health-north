namespace HealthNorthApp.Forms
{
    partial class FactureForm
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
            lblPatient = new Label();
            lblExamen = new Label();
            lblDateHeure = new Label();
            lblEtab = new Label();
            lblSpec = new Label();
            txtPrixHT = new Label();
            txtTVA = new Label();
            txtPrixTTC = new Label();
            txtSecu = new Label();
            txtMutuelle = new Label();
            txtReste = new Label();
            btnCalc = new Button();
            btnPdf = new Button();
            SuspendLayout();
            // 
            // lblPatient
            // 
            lblPatient.AutoSize = true;
            lblPatient.Location = new Point(0, 0);
            lblPatient.Name = "lblPatient";
            lblPatient.Size = new Size(71, 20);
            lblPatient.TabIndex = 0;
            lblPatient.Text = "lblPatient";
            // 
            // lblExamen
            // 
            lblExamen.AutoSize = true;
            lblExamen.Location = new Point(0, 20);
            lblExamen.Name = "lblExamen";
            lblExamen.Size = new Size(78, 20);
            lblExamen.TabIndex = 1;
            lblExamen.Text = "lblExamen";
            lblExamen.Click += this.label1_Click;
            // 
            // lblDateHeure
            // 
            lblDateHeure.AutoSize = true;
            lblDateHeure.Location = new Point(0, 51);
            lblDateHeure.Name = "lblDateHeure";
            lblDateHeure.Size = new Size(98, 20);
            lblDateHeure.TabIndex = 2;
            lblDateHeure.Text = "lblDateHeure";
            // 
            // lblEtab
            // 
            lblEtab.AutoSize = true;
            lblEtab.Location = new Point(12, 71);
            lblEtab.Name = "lblEtab";
            lblEtab.Size = new Size(56, 20);
            lblEtab.TabIndex = 3;
            lblEtab.Text = "lblEtab";
            // 
            // lblSpec
            // 
            lblSpec.AutoSize = true;
            lblSpec.Location = new Point(0, 91);
            lblSpec.Name = "lblSpec";
            lblSpec.Size = new Size(58, 20);
            lblSpec.TabIndex = 4;
            lblSpec.Text = "lblSpec";
            // 
            // txtPrixHT
            // 
            txtPrixHT.AutoSize = true;
            txtPrixHT.Location = new Point(12, 143);
            txtPrixHT.Name = "txtPrixHT";
            txtPrixHT.Size = new Size(69, 20);
            txtPrixHT.TabIndex = 5;
            txtPrixHT.Text = "txtPrixHT";
            // 
            // txtTVA
            // 
            txtTVA.AutoSize = true;
            txtTVA.Location = new Point(18, 172);
            txtTVA.Name = "txtTVA";
            txtTVA.Size = new Size(52, 20);
            txtTVA.TabIndex = 6;
            txtTVA.Text = "txtTVA";
            // 
            // txtPrixTTC
            // 
            txtPrixTTC.AutoSize = true;
            txtPrixTTC.Location = new Point(18, 192);
            txtPrixTTC.Name = "txtPrixTTC";
            txtPrixTTC.Size = new Size(74, 20);
            txtPrixTTC.TabIndex = 7;
            txtPrixTTC.Text = "txtPrixTTC";
            // 
            // txtSecu
            // 
            txtSecu.AutoSize = true;
            txtSecu.Location = new Point(18, 221);
            txtSecu.Name = "txtSecu";
            txtSecu.Size = new Size(57, 20);
            txtSecu.TabIndex = 8;
            txtSecu.Text = "txtSecu";
            // 
            // txtMutuelle
            // 
            txtMutuelle.AutoSize = true;
            txtMutuelle.Location = new Point(20, 241);
            txtMutuelle.Name = "txtMutuelle";
            txtMutuelle.Size = new Size(84, 20);
            txtMutuelle.TabIndex = 9;
            txtMutuelle.Text = "txtMutuelle";
            // 
            // txtReste
            // 
            txtReste.AutoSize = true;
            txtReste.Location = new Point(21, 261);
            txtReste.Name = "txtReste";
            txtReste.Size = new Size(62, 20);
            txtReste.TabIndex = 10;
            txtReste.Text = "txtReste";
            // 
            // btnCalc
            // 
            btnCalc.Location = new Point(12, 284);
            btnCalc.Name = "btnCalc";
            btnCalc.Size = new Size(94, 29);
            btnCalc.TabIndex = 11;
            btnCalc.Text = "Recalculer";
            btnCalc.UseVisualStyleBackColor = true;
            // 
            // btnPdf
            // 
            btnPdf.Location = new Point(10, 319);
            btnPdf.Name = "btnPdf";
            btnPdf.Size = new Size(94, 29);
            btnPdf.TabIndex = 12;
            btnPdf.Text = "Générer PDF";
            btnPdf.UseVisualStyleBackColor = true;
            // 
            // FactureForm
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(btnPdf);
            Controls.Add(btnCalc);
            Controls.Add(txtReste);
            Controls.Add(txtMutuelle);
            Controls.Add(txtSecu);
            Controls.Add(txtPrixTTC);
            Controls.Add(txtTVA);
            Controls.Add(txtPrixHT);
            Controls.Add(lblSpec);
            Controls.Add(lblEtab);
            Controls.Add(lblDateHeure);
            Controls.Add(lblExamen);
            Controls.Add(lblPatient);
            Name = "FactureForm";
            Text = "Form1";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label lblPatient;
        private Label lblExamen;
        private Label lblDateHeure;
        private Label lblEtab;
        private Label lblSpec;
        private Label txtPrixHT;
        private Label txtTVA;
        private Label txtPrixTTC;
        private Label txtSecu;
        private Label txtMutuelle;
        private Label txtReste;
        private Button btnCalc;
        private Button btnPdf;
    }
}