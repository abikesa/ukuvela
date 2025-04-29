from fpdf import FPDF
import os
from datetime import datetime
import qrcode

# === Paths ===
FONT_DIR = "../../fonts"
FIGURE_DIR = "../../figures"
OUTPUT_DIR = "../../pdfs"
FONT_REGULAR = os.path.join(FONT_DIR, "DejaVuSans.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
LOGO = os.path.join(FIGURE_DIR, "ukubona.png")
QR_URL = "https://ukubona-llc.github.io/"
QR_IMG_PATH = os.path.join(FIGURE_DIR, "ukubona_qr_scroll.png")
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "ukubona_covenant_scroll.pdf")

# === QR Code ===
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=5,
    border=2,
)
qr.add_data(QR_URL)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(QR_IMG_PATH)

# === PDF Class ===
class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("DejaVu", "", FONT_REGULAR, uni=True)
        self.add_font("DejaVu", "B", FONT_BOLD, uni=True)
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 30, 20)
        self.add_page()
        self.set_font("DejaVu", "", 11)

    def header(self):
        self.image(LOGO, x=10, y=12, w=20)
        self.set_font("DejaVu", "B", 14)
        self.cell(0, 10, "Ukubona LLC", ln=True, align="C")
        self.set_font("DejaVu", "", 10)
        self.cell(0, 10, "Covenant of Work and Insight", ln=True, align="C")
        self.line(10, 30, 200, 30)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("DejaVu", "", 9)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, "Ukubona LLC · 13675 Bent Tree Cir #201 · Centreville, VA · (240) 281-3154", align="C")

# === PDF Content ===
pdf = PDF()
pdf.set_text_color(30, 30, 30)
today = datetime.today().strftime("%B %d, %Y")
pdf.cell(0, 10, f"{today}", ln=True, align="R")
pdf.ln(5)

pdf.set_font("DejaVu", "B", 11)
pdf.cell(0, 10, "To:", ln=True)
pdf.set_font("DejaVu", "", 11)
pdf.multi_cell(0, 8, "Vincent Jin\n101 N Wolfe St, Apt 314\nBaltimore, MD, 21231")

pdf.ln(5)
pdf.set_font("DejaVu", "B", 12)
pdf.cell(0, 10, "Subject: Covenant of Employment – Health Data Analyst", ln=True)
pdf.ln(5)

pdf.set_font("DejaVu", "", 11)
body = """Dear Vincent,

You are hereby invited to join Ukubona LLC—not merely as an employee, but as a navigator. Our compass points not to profit but to perception. Our metric is clarity. Our tools are data and discernment.

You are offered the position of Health Data Analyst at Ukubona LLC, a Virginia-based entity committed to public health data science and epistemic tools for insight.

— Start Date: Thursday, March 27, 2025  
— Status: Full-time at 21 hours/week  
— Rate: $13/hour  
— Mode: Hybrid (remote via GitHub + Virginia reporting)  
— Supervision: Direct mentorship by Abimereki Muzaale, MD, MPH

You will:  
• Analyze federal/clinical datasets (NHANES, CMS, SRTR, etc.)  
• Build multivariable Cox regression models  
• Contribute to Kaplan-Meier risk-visualization tools  
• Assist with data pipelines (.csv), HTML, and JavaScript  
• Collaborate on manuscripts and statistical design

This is a covenant. A scroll. A contract not only of labor, but of trust in your potential to see more deeply and represent more clearly.

Welcome aboard.

Warmly,

Abimereki Muzaale, MD, MPH  
Founder, Ukubona LLC  
ukubona.llc@gmail.com | muzaale@jhmi.edu  
(240) 281-3154
"""
pdf.multi_cell(0, 7, body)
pdf.ln(5)

pdf.set_font("DejaVu", "", 10)
pdf.cell(0, 10, "Scan to visit Ukubona LLC:", ln=True)
pdf.image(QR_IMG_PATH, x=pdf.get_x() + 5, y=pdf.get_y(), w=30)

# Save the PDF
pdf.output(OUTPUT_PDF)
OUTPUT_PDF
# flick 20250409213602-uIza
# flick 20250409214208-an9S
# flick 20250409214624-W9ii
# flick 20250409230604-LW83
