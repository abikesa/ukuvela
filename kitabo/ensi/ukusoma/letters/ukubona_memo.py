from fpdf import FPDF
from datetime import datetime
import os

# Paths
FONT_DIR = "../../fonts"
FIGURE_DIR = "../../figures"
OUTPUT_DIR = "../../pdfs"
FONT_REGULAR = os.path.join(FONT_DIR, "DejaVuSans.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
LOGO = os.path.join(FIGURE_DIR, "ukubona-007-ib.png")
QR_IMG_PATH = os.path.join(FIGURE_DIR, "ukubona_qr.png")
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "ukubona-memo.pdf")
QR_URL = "https://ukubona-llc.github.io/"
ECOSYSTEM_IMG_PATH = os.path.join(FIGURE_DIR, "ecosystem-integration.jpeg")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# PDF generation
class PDF(FPDF):
    def header(self):
        if os.path.exists(LOGO):
            self.image(LOGO, x=10, y=10, w=25)
        if os.path.exists(QR_IMG_PATH):
            self.image(QR_IMG_PATH, x=180, y=10, w=20)
        self.set_font("DejaVu", "B", 14)
        self.cell(0, 10, "Ukubona LLC — Internal Memo", ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("DejaVu", "", 9)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()} — Ukubona LLC © 2025", align="C")

    def chapter_title(self, title):
        self.set_font("DejaVu", "B", 12)
        self.set_text_color(40, 40, 40)
        self.cell(0, 10, title, ln=True)
        self.ln(2)

    def chapter_body(self, body):
        self.set_font("DejaVu", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 7, body)
        self.ln(2)

    def insert_image(self, path, width=170):
        if os.path.exists(path):
            self.image(path, w=width)
            self.ln(5)

# Create PDF
pdf = PDF()
pdf.add_font("DejaVu", "", FONT_REGULAR, uni=True)
pdf.add_font("DejaVu", "B", FONT_BOLD, uni=True)
pdf.set_auto_page_break(auto=True, margin=20)
pdf.set_margins(left=20, top=30, right=20)
pdf.add_page()

# Header Date
today = datetime.today().strftime("%B %d, %Y")
pdf.set_font("DejaVu", "", 11)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 10, today, ln=True, align="R")
pdf.ln(5)

# Title and Intro
pdf.chapter_title("Ecosystem Integration and Strategic Frictions in Translational Consent")
pdf.chapter_body(
    "This internal memo documents the epistemic, infrastructural, and relational "
    "terrain surrounding Ukubona’s completion of its Aim 3 deliverable—a modular, "
    "interactive consent platform designed to interface real-time risk modeling with "
    "person-specific nephrectomy data. This project does not merely visualize data—it "
    "performs risk, reveals its assumptions, and makes legible the moral architecture of decision-making. "
)

# Add ecosystem image
pdf.insert_image(ECOSYSTEM_IMG_PATH)

# Section on Ecosystem Friction
pdf.chapter_title("The Cost of Integration: A Relational Inefficiency")
pdf.chapter_body(
    "At the core of Ukubona’s architecture is the recognition that data is not isolated—it is entangled. "
    "Analytic scripts, disclosure risk, and hospital records all converge at an information node, from which "
    "baseline estimation and risk modeling diverge into predictive domains: comorbidity, hospitalization, frailty. "
    "Yet institutional response to this integration has been uneven. Key actors in the data pipeline—such as the "
    "guardian of registry access—have failed to respond substantively to analytic requests, redirecting responsibility "
    "to others (e.g.,  Aaron Miller), despite their own supervisory role on multiple overlapping grants."
)

# Save PDF
pdf.output(OUTPUT_PDF)
OUTPUT_PDF
