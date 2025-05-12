import os
from fpdf import FPDF
from datetime import datetime
import qrcode

# ========== Configuration ==========
FONT_DIR = "../../fonts"
FIGURE_DIR = "../../figures"
OUTPUT_DIR = "../../pdfs"
FONT_REGULAR = os.path.join(FONT_DIR, "DejaVuSans.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
LOGO = os.path.join(FIGURE_DIR, "ukubona-007-ib.png")
QR_IMG_PATH = os.path.join(FIGURE_DIR, "ukubona_qr.png")
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "vincent-offer-2025.pdf")
QR_URL = "https://ukubona-llc.github.io/"

os.makedirs(FIGURE_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Generate QR Code
qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=4, border=1)
qr.add_data(QR_URL)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(QR_IMG_PATH)

# ========== PDF Class ==========
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
        self.image(LOGO, x=10, y=12, w=25)
        self.image(QR_IMG_PATH, x=180, y=10, w=20)
        self.set_font("DejaVu", "B", 14)
        self.cell(0, 10, "Ukubona LLC", ln=True, align="C")
        self.ln(5)
        self.set_draw_color(200, 200, 200)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
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

    def paragraph(self, text):
        self.set_font("DejaVu", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 7, text)
        self.ln(2)

    def indented_block(self, text, indent=10):
        self.set_font("DejaVu", "", 10)
        self.set_text_color(50, 50, 50)
        self.set_x(self.get_x() + indent)
        self.multi_cell(0, 6, text)
        self.ln(1)
        self.set_x(self.l_margin)

# ========== Generate PDF ==========
pdf = PDF()
today = "March 26, 2025"
# today = datetime.today().strftime("%B %d, %Y")

pdf.set_font("DejaVu", "", 11)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 10, today, ln=True, align="R")
pdf.ln(5)

pdf.chapter_title("Offer of Full-Time Employment – Health Data Analyst")

pdf.paragraph("""Zhenghao Jin  
101 N Wolfe St, Apt 314  
Baltimore, MD 21231  
  
Dear Zhenghao,""")

pdf.paragraph("""We are pleased to offer you full-time employment as a Health Data Analyst at Ukubona LLC, effective March 27, 2025. Your appointment reflects our confidence in your analytical skills, research integrity, and potential to shape the future of clinical and public health innovation.""")

pdf.chapter_title("1. Position Overview")
pdf.indented_block("""\
• Title: Health Data Analyst  
• Start Date: March 27, 2025  
• Status: Full-Time, Non-Exempt (Hourly)  
• Compensation: $25.00/hour  
• Weekly Hours: ~23 hours/weeks (typically Mon–Wed)  
• Work Mode: Hybrid (remote-first, affiliated with Virginia HQ)  
• Supervisor: Abimereki Muzaale, MD, MPH""")

pdf.chapter_title("2. Responsibilities")
pdf.indented_block("""\
• Analyze national, clinical, and administrative datasets (NHANES, CMS, USRDS, SRTR, NIS)  
• Build survival models (Cox regression, Kaplan-Meier with confidence intervals)  
• Create individualized risk visualizations and explain uncertainty  
• Develop data pipelines (.csv, JSON) and integrate with front-end code (HTML, JavaScript)  
• Participate in study design, academic writing, and regulatory documentation""")

pdf.chapter_title("3. Legal and Institutional Terms")
pdf.indented_block("""\
• Ukubona LLC is a registered employer in Virginia and a federal E-Verify participant  
• This role is classified as non-exempt under the Fair Labor Standards Act (FLSA)  
• Weekly hours (~23) meet the federal definition of full-time for internships and research roles  
• Compensation is paid biweekly with applicable tax withholdings  
• Employment is at-will and may be terminated by either party without notice or cause  
• Official verification (title, hours, responsibilities) can be provided to schools, sponsors, or legal authorities  
• This letter contains no confidential ID data by design""")

pdf.paragraph("""We are excited to welcome you to Ukubona. Your role is central to our mission of building transparent, intelligent, and ethically grounded tools for clinical research and public understanding.

Please confirm your acceptance by email. A formal onboarding packet will follow.""")

pdf.ln(8)
pdf.set_font("DejaVu", "", 11)
pdf.cell(0, 6, "Sincerely,", ln=True)
pdf.ln(12)
pdf.set_font("DejaVu", "B", 11)
pdf.cell(0, 6, "Abimereki Muzaale, MD, MPH", ln=True)
pdf.set_font("DejaVu", "", 11)
pdf.cell(0, 6, "Founder & CEO, Ukubona LLC", ln=True)
pdf.cell(0, 6, "muzaale@jhmi.edu | (240) 281-3154", ln=True)

pdf.output(OUTPUT_PDF)
