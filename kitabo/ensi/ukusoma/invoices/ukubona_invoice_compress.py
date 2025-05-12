import os
from fpdf import FPDF
from datetime import datetime
import qrcode

# Setup paths
FONT_DIR = "../fonts"
FIGURE_DIR = "../figures"
OUTPUT_DIR = "../pdfs"
FONT_REGULAR = os.path.join(FONT_DIR, "DejaVuSans.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
LOGO = os.path.join(FIGURE_DIR, "ukubona-007-ib.png")
QR_URL = "https://ukubona-llc.github.io/"
QR_IMG_PATH = os.path.join(FIGURE_DIR, "ukubona_qr.png")
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "ukubona_invoice_qr_topright.pdf")

# Ensure figure directory exists
os.makedirs(FIGURE_DIR, exist_ok=True)

# Generate QR Code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=4,
    border=1,
)
qr.add_data(QR_URL)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(QR_IMG_PATH)

# PDF class
class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("DejaVu", "", FONT_REGULAR, uni=True)
        self.add_font("DejaVu", "B", FONT_BOLD, uni=True)
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(left=20, top=30, right=20)
        self.add_page()
        self.set_font("DejaVu", "", 11)

    def header(self):
        self.image(LOGO, x=10, y=10, w=20)
        self.set_font("DejaVu", "B", 16)
        self.cell(0, 10, "Ukubona LLC", ln=True, align="C")
        self.set_font("DejaVu", "", 11)
        self.cell(0, 10, "INVOICE", ln=True, align="C")
        self.image(QR_IMG_PATH, x=180, y=10, w=20)  # QR in top-right
        self.ln(2)
        self.set_draw_color(200, 200, 200)
        self.set_line_width(0.3)
        self.ln(2)
        self.line(10, self.get_y(), 200, self.get_y())


    def footer(self):
        self.set_y(-20)
        self.set_font("DejaVu", "", 8)
        self.set_text_color(130, 130, 130)
        self.cell(0, 5, "Confidential. This invoice is intended only for the recipient.", ln=True, align="C")
        self.cell(0, 5, "Ukubona LLC reserves all rights. https://ukubona-llc.github.io", ln=True, align="C")
        self.set_y(-10)
        self.set_font("DejaVu", "", 9)
        self.cell(0, 10, f"Page {self.page_no()} — Ukubona LLC © 2025", align="C")

# Create PDF
pdf = PDF()
today = datetime.today().strftime("%B %d, %Y")
due_date = datetime.today().strftime("%B %d, %Y")

# Invoice metadata
pdf.set_font("DejaVu", "", 10)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 8, f"Invoice #: UKB-2025-001    Date: {today}    Terms: Net 15    Due: {due_date}", ln=True, align="R")
pdf.ln(5)

# Bill To
pdf.set_font("DejaVu", "B", 11)
pdf.cell(0, 8, "Bill To:", ln=True)
pdf.set_font("DejaVu", "", 10)
pdf.multi_cell(0, 6, "Jonathan Gasaatura\n3886 Rainier Drive\nFairfax V, 22033\njonathan@gmail.com")
pdf.ln(3)

# Service table header
pdf.set_fill_color(245, 245, 245)
pdf.set_text_color(0)
pdf.set_font("DejaVu", "B", 10)
pdf.cell(100, 8, "Description", border=1, fill=True)
pdf.cell(30, 8, "Quantity", border=1, align="C", fill=True)
pdf.cell(30, 8, "Unit Price", border=1, align="C", fill=True)
pdf.cell(30, 8, "Total", border=1, align="C", fill=True)
pdf.ln()

# Row
pdf.set_font("DejaVu", "", 10)
pdf.set_text_color(50, 50, 50)
pdf.cell(100, 8, "Sports Analytics Mentorship (1-week)", border=1)
pdf.cell(30, 8, "1", border=1, align="C")
pdf.cell(30, 8, "${:,.2f}".format(500), border=1, align="C")
pdf.cell(30, 8, "${:,.2f}".format(500), border=1, align="C")
pdf.ln(10)

# Total
pdf.set_font("DejaVu", "B", 10)
pdf.cell(160, 8, "Total Due:", align="R")
pdf.cell(30, 8, "${:,.2f}".format(500), border=1, align="C")
pdf.ln(8)

# Payment Instructions
pdf.set_font("DejaVu", "", 9)
pdf.multi_cell(0, 6, "Make checks payable to: Ukubona LLC\nBank: Bank of America (Business Advantage Account)\nAccount details upon request.\nEmail: ukubona.llc@gmail.com for transfer info.")
pdf.ln(5)

# Signature
pdf.cell(0, 8, "_____________________________", ln=True)
pdf.cell(0, 5, "Authorized Signature", ln=True)

# Output
pdf.output(OUTPUT_PDF)
