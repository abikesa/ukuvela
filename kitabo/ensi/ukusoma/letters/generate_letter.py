from fpdf import FPDF
from datetime import datetime
import os
import qrcode

# ========== Configuration ==========
FONT_DIR = "../../fonts"
FIGURE_DIR = "../../figures"
OUTPUT_DIR = "../../pdfs"
FONT_REGULAR = os.path.join(FONT_DIR, "DejaVuSans.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
LOGO = os.path.join(FIGURE_DIR, "ukubona.png")
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "jonathan-newdir.pdf")

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
        self.set_font("DejaVu", "B", 14)
        self.cell(0, 10, "Ukubona LLC", ln=True, align="C")
        self.set_draw_color(200, 200, 200)
        self.set_line_width(0.3)
        self.line(10, 28, 200, 28)
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

    def indented_block(self, text, indent=10):
        self.set_font("DejaVu", "", 10)
        self.set_text_color(50, 50, 50)
        self.set_x(self.get_x() + indent)
        self.multi_cell(0, 6, text)
        self.ln(1)
        self.set_x(self.l_margin)  # Reset x

    def add_hyperlink(self, label, url):
        self.set_text_color(0, 102, 204)
        self.set_font("DejaVu", "U", 11)
        self.cell(0, 10, label, ln=True, link=url)
        self.set_text_color(30, 30, 30)
        self.set_font("DejaVu", "", 11)

# ========== Generate PDF ==========
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

pdf = PDF()
today = datetime.today().strftime("%B %d, %Y")
pdf.set_font("DejaVu", "", 11)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 10, today, ln=True, align="R")
pdf.ln(5)

pdf.chapter_title("Letter of Internship Support for Jonathan")

# Body before the indented block
pdf.chapter_body("""Dear Doreen,

Thanks for reaching out about Jonathan's interest in sports analytics. I believe we can put together a rich and meaningful remote internship experience through a program I’ve been developing called PAIRS@JH. It stands for Python, AI, R, Stata, JavaScript (or JupyterBook), and HTML. Originally inspired by my work at Johns Hopkins, the framework is designed to be generalizable and adaptable to students' interests and aptitudes.

Yes—Jonathan could absolutely benefit from this. And yes—it would almost certainly fulfill the school's internship or job-shadowing requirement, provided he completes a tangible deliverable. Many schools just want to see that the student engaged with a mentor, practiced applied skills, and produced something concrete (e.g., a report, a dashboard, a code project, or a statistical summary).

Here’s how a one-week remote internship might be structured:""")

# ========== Indented Internship Outline ==========
pdf.indented_block("""\
Day 1–2: Orientation + Dataset exploration (scraping stats from Pro Football Reference or Baseball Savant)

Day 3–4: Apply a basic model (e.g., logistic regression for win prediction, or clustering player profiles)

Day 5: Present insights in a Jupyter notebook or lightweight slide deck (e.g. wikipage with interactive visualizations)
""")

# Resume the normal body
pdf.chapter_body("""This sprint-style format can be supplemented with daily check-ins, quick code reviews, and discussions on how data is used in sports and analytics careers. Jonathan would leave with a portfolio-ready artifact and a much stronger sense of real-world applications.

I’d be happy to serve as his mentor during that week. We can also frame the experience for the school as:
"Remote internship in sports analytics under data science supervision. Applied Python and R for statistical modeling and visualization."

Let me know if you’d like to set up a time for Jonathan and me to chat. I’d be honored to help.

Warmly,


Abimereki Muzaale, MD, PhD  
Founder & CEO, Ukubona LLC
""")

# ========== QR Code Generation ==========
qr_url = "https://ukubona-llc.github.io/"
qr_img_path = os.path.join(FIGURE_DIR, "ukubona_qr.png")

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=6,
    border=2,
)
qr.add_data(qr_url)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(qr_img_path)

# ========== Embed QR Code ==========
pdf.set_font("DejaVu", "", 10)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 10, "Scan QR to visit Ukubona LLC:", ln=True)
pdf.image(qr_img_path, x=pdf.get_x() + 5, y=pdf.get_y(), w=30)
pdf.ln(35)

pdf.output(OUTPUT_PDF)
print(f"✅ PDF saved to {OUTPUT_PDF}")
# flick 20250409213602-1Tb9
# flick 20250409214208-8VPT
# flick 20250409214624-nVb2
# flick 20250409230601-pWYJ
# flick 20250410002734-UtBk
