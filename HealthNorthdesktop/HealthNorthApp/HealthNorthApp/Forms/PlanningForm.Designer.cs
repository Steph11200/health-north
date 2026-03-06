namespace HealthNorthApp.Forms
{
    partial class PlanningForm
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
            gridRdv = new DataGridView();
            btnRefresh = new Button();
            lblInfo = new Label();
            btnAddDoc = new Button();
            btnFacture = new Button();
            ((System.ComponentModel.ISupportInitialize)gridRdv).BeginInit();
            SuspendLayout();
            // 
            // gridRdv
            // 
            gridRdv.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            gridRdv.Location = new Point(0, 0);
            gridRdv.Name = "gridRdv";
            gridRdv.RowHeadersWidth = 51;
            gridRdv.Size = new Size(318, 199);
            gridRdv.TabIndex = 0;
            // 
            // btnRefresh
            // 
            btnRefresh.Location = new Point(146, 270);
            btnRefresh.Name = "btnRefresh";
            btnRefresh.Size = new Size(94, 29);
            btnRefresh.TabIndex = 1;
            btnRefresh.Text = "Rafraîchir";
            btnRefresh.UseVisualStyleBackColor = true;
            // 
            // lblInfo
            // 
            lblInfo.AutoSize = true;
            lblInfo.Location = new Point(75, 219);
            lblInfo.Name = "lblInfo";
            lblInfo.Size = new Size(18, 20);
            lblInfo.TabIndex = 2;
            lblInfo.Text = "...";
            // 
            // btnAddDoc
            // 
            btnAddDoc.Location = new Point(135, 219);
            btnAddDoc.Name = "btnAddDoc";
            btnAddDoc.Size = new Size(145, 45);
            btnAddDoc.TabIndex = 3;
            btnAddDoc.Text = "Ajouter Document";
            btnAddDoc.UseVisualStyleBackColor = true;
            // 
            // btnFacture
            // 
            btnFacture.Location = new Point(135, 320);
            btnFacture.Name = "btnFacture";
            btnFacture.Size = new Size(145, 43);
            btnFacture.TabIndex = 4;
            btnFacture.Text = "Générer facture";
            btnFacture.UseVisualStyleBackColor = true;
            // 
            // PlanningForm
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(btnFacture);
            Controls.Add(btnAddDoc);
            Controls.Add(lblInfo);
            Controls.Add(btnRefresh);
            Controls.Add(gridRdv);
            Name = "PlanningForm";
            Text = "Form1";
            ((System.ComponentModel.ISupportInitialize)gridRdv).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private DataGridView gridRdv;
        private Button btnRefresh;
        private Label lblInfo;
        private Button btnAddDoc;
        private Button btnFacture;
    }
}