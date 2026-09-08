
import schemas

from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Response,HTTPException
from fpdf import FPDF
import re
import io
import matplotlib
import matplotlib.pyplot as plt
from docx import Document
from io import BytesIO
import json
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches


matplotlib.use('Agg') #to prio protect matplotlib from defaulting to server dispay engine

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wrezon.netlify.app",
                "https://wrezon.onrender.com",
                "https://wrez.netlify.app",
                "https://www.wrezon.com",
                "http://localhost:8000",
                "http://127.0.0.1:5501",
                "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
import re


def sanitize_formula(formula: str) -> str:
    formula = formula.strip()

    # Remove leftover dollar delimiters
    formula = formula.replace("$", "")

    # Remove common LaTeX formatting commands
    formula = re.sub(r"\\(?:displaystyle|textstyle|scriptstyle|scriptscriptstyle)\b", "", formula)
    formula = re.sub(r"\\(?:left|right|middle)\b", "", formula)

    # Replace text commands with their contents
    formula = re.sub(r"\\text\{([^{}]*)\}", r"\1", formula)

    # Remove common spacing commands
    formula = re.sub(r"\\(?:quad|qquad|enspace|hspace|vspace|,|;|:|!)", " ", formula)

    # Remove environment leftovers
    formula = re.sub(r"\\(?:begin|end)\{[^{}]*\}", "", formula)

    # Remove stray LaTeX line breaks
    formula = re.sub(r"\\\\+", " ", formula)

    # Replace unknown LaTeX commands with a harmless symbol
    known = (
        r"frac|sqrt|sum|int|alpha|beta|gamma|delta|theta|lambda|mu|pi|"
        r"sigma|phi|omega|sin|cos|tan|log|ln|lim|times|cdot|div|pm|"
        r"mp|leq|geq|neq|approx|infty|partial|nabla|rightarrow"
    )

    #formula = re.sub(
    #   rf"\\(?!({known})\b)[A-Za-z]+",
    #   r"\ldots",
    #    formula
    #)
    formula = re.sub(
    rf"\\(?!({known})\b)[A-Za-z]+",
    lambda m: r"\ldots",
    formula
)

    formula = formula.strip()

    # Empty/broken formula
    if not formula:
        formula = r"\ldots"

    return formula


class WrezonPDF(FPDF):
  
  def __init__(self,docname):
    super().__init__()
    self.docname = docname
    self.add_font("DejaVuSans", "", "fonts/DejaVuSans.ttf")
    self.add_font("DejaVuSans", "B", "fonts/DejaVuSans-Bold.ttf")
    self.add_font("DejaVuSans", "I", "fonts/DejaVuSans-Oblique.ttf")

  def header(self):
    self.set_font("DejaVuSans", "B", 14)
    self.cell(0, 10, self.docname, border=False, new_x="LMARGIN",
        new_y="NEXT", align="C")
    self.ln(5)

  def footer(self):
    self.set_y(-15)
    self.set_font("DejaVuSans", "B", 8)
    self.cell(0, 10, f"Wrezon Export |Page {self.page_no()}/{{nb}}", align="C")

def make_math_image(formula: str) -> io.BytesIO:
    
    formula = formula.replace('\\\\', '\\')
    formula = formula.replace(r'\displaystyle', '')
    if not formula:
        raise ValueError("Empty LaTeX formula")
    formula = formula.strip()
    formula = sanitize_formula(formula)
    

    fig = plt.figure(figsize=(0.1, 0.1))
    fig.text(0, 0, f"${formula}$", fontsize=12)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.02, transparent=True, dpi=300)
    plt.close(fig)
    buf.seek(0)
    return buf
  
def make_table_image(rows):
    """Convert markdown table to matplotlib image."""
    fig, ax = plt.subplots(figsize=(10, len(rows)))
    ax.axis('tight')
    ax.axis('off')
    
    table = ax.table(cellText=rows, cellLoc='center', loc='center')
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1, 2)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', transparent=True)
    plt.close(fig)
    buf.seek(0)
    return buf


def clean_markdown(text: str) -> str:
    """Remove markdown formatting characters from plain text."""
    # Remove bold **text**
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    # Remove italic *text*
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    # Remove headers ## text
    text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)
    # Remove strikethrough ~~text~~
    text = re.sub(r'~~(.*?)~~', r'\1', text)
    # Remove inline code `text`
    text = re.sub(r'`(.*?)`', r'\1', text)
    # Remove code block markers ```
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    return text
def sanitize_latex_payload(text: str) -> str:
    # 1. Remove non-printable control characters (except standard newlines \n and tabs \t)
    cleaned = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    
    # 2. Escape backslashes for LaTeX syntax compatibility with JSON
    cleaned = re.sub(r'\\(?!"|\\)', r'\\\\', cleaned)
    
    return cleaned
@app.post("/export-pdf")
async def export_pdf(text_content: schemas.pdf_struct):
  docname = text_content.docname
  try:
    pdf = WrezonPDF(docname)
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Standard readable text formatting
    pdf.set_font("DejaVuSans", size=11)
    
    
    clean_sanity = sanitize_latex_payload(text_content.query)
    body =json.loads(clean_sanity)
    safe_text = body.get('content')
   
    #.encode('latin-1', 'replace').decode('latin-1')
    items = re.split(r'(\$\$[\s\S]*?\$\$|\$.*?\$)', safe_text)
    for item in items:
        if not item:
            continue
        if item.strip().startswith('|') and item.strip().endswith('|'):
            rows = []
            for line in item.strip().split('\n'):
                if '|' in line and not re.match(r'^\|\s*-+', line):  # Skip separator line
                    cells = [cell.strip() for cell in line.split('|')[1:-1]]
                    rows.append(cells)
            
            if rows:
                pdf.ln(6)
                table_image = make_table_image(rows)
                pdf.image(table_image, w=150)
                pdf.ln(10)
                continue
        if item.startswith('$$') and item.endswith('$$'):
            formula = item[2:-2].strip()  # Remove $$ from both ends, strip whitespace
        elif item.startswith('$') and item.endswith('$'):
            formula = item[1:-1].strip()  # Remove $ from both ends, strip whitespace
        elif item.startswith('\\(') and item.endswith('\\)'):
            formula = item[2:-2].strip()
        elif item.startswith('\\[') and item.endswith('\\]'):
            formula = item[2:-2].strip()
        else:
            # Plain text
            cleaned_text = clean_markdown(item)
            pdf.write(5, cleaned_text)
            continue
        
            # 3. IF it's Math (starts and ends with $)
        #if item.startswith('$') and item.endswith('$'):
        formula = formula.replace('\\\\', '\\')
        formula = formula.strip('$') # Strip $ signs
        
        # Generate image bytes in RAM via Matplotlib
        math_bytes = make_math_image(formula)
        
        # Insert the image into FPDF at the current cursor position
        pdf.ln(6)
        pdf.image(math_bytes, w=50)
        pdf.ln(10)
        
    # Stream output directly to memory (avoids writing to disk)
    #output = BytesIO()
    #pdf.output(output)
    #pdf_bytes = output.getvalue()
    pdf_bytes = bytes(pdf.output())

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={docname}.pdf"},
    )
  
    
    
  except Exception as e:
    print("error with PDF generation",(e))
    raise HTTPException(
        status_code=500, detail=f"Failed to generate PDF: {str(e)}"
    )
    
    

def add_word_content(doc, content):
    """
    Add Markdown-ish content to a Word document.
    Supports:
      - $...$ and $$...$$ math
      - Markdown tables
      - normal paragraphs
    """

    if not content:
        return

    # ---------------------------------------------------------
    # 1. Split content into lines
    # ---------------------------------------------------------
    lines = content.splitlines()

    i = 0

    while i < len(lines):

        line = lines[i].strip()

        if not line:
            i += 1
            continue

        # -----------------------------------------------------
        # 2. Detect Markdown table
        # -----------------------------------------------------
        if "|" in line and i + 1 < len(lines) and "|" in lines[i + 1]:

            separator = lines[i + 1].strip()

            # Check whether next line is actually a Markdown
            # table separator: |---|---|
            if re.match(r"^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$", separator):

                table_lines = [line]
                i += 1

                # Collect the remaining table rows
                while i + 1 < len(lines) and "|" in lines[i + 1]:
                    i += 1
                    table_lines.append(lines[i])

                # ---------------------------------------------
                # Parse rows
                # ---------------------------------------------
                rows = []

                for row in table_lines:
                    cells = [
                        cell.strip()
                        for cell in row.strip().strip("|").split("|")
                    ]
                    rows.append(cells)

                if rows:
                    columns = len(rows[0])

                    table = doc.add_table(
                        rows=len(rows),
                        cols=columns
                    )

                    table.style = "Table Grid"

                    # Fill cells
                    for r, row in enumerate(rows):
                        for c in range(columns):

                            value = row[c] if c < len(row) else ""

                            cell = table.cell(r, c)

                            # Clear default paragraph
                            paragraph = cell.paragraphs[0]

                            # Check whether cell contains math
                            math_match = re.fullmatch(
                                r"\$\$(.*?)\$\$|\$(.*?)\$",
                                value
                            )

                            if math_match:

                                formula = (
                                    math_match.group(1)
                                    if math_match.group(1) is not None
                                    else math_match.group(2)
                                )
                                width = len(formula) * 0.07 + 0.1
                                math_bytes = make_math_image(formula)

                                run = paragraph.add_run()

                                run.add_picture(
                                    math_bytes,
                                    width=Inches(width)
                                )

                            else:
                                paragraph.add_run(
                                    clean_markdown(value)
                                )

                    # Move to next line after table
                    i += 1
                    continue

        # -----------------------------------------------------
        # 3. Detect block math $$ ... $$
        # -----------------------------------------------------
        if line.startswith("$$"):

            formula = line.strip("$")

            math_bytes = make_math_image(formula)
            width = len(formula) * 0.04 + 0.4
            paragraph = doc.add_paragraph()

            run = paragraph.add_run()

            run.add_picture(
                math_bytes,
                width=Inches(width)
            )

            i += 1
            continue

        # -----------------------------------------------------
        # 4. Detect inline math
        # -----------------------------------------------------
        if "$" in line:

            paragraph = doc.add_paragraph()

            # Split normal text and math
            parts = re.split(
                r"(\$\$.*?\$\$|\$.*?\$)",
                line
            )

            for part in parts:

                if not part:
                    continue

                if (
                    part.startswith("$")
                    and part.endswith("$")
                ):

                    formula = part.strip("$")
                    width = len(formula) * 0.04 + 0.1

                    math_bytes = make_math_image(formula)

                    run = paragraph.add_run()

                    run.add_picture(
                        math_bytes,
                        width=Inches(width)
                    )

                else:

                    paragraph.add_run(
                        clean_markdown(part)
                    )

            i += 1
            continue

        # -----------------------------------------------------
        # 5. Normal paragraph
        # -----------------------------------------------------
        doc.add_paragraph(
            clean_markdown(line)
        )

        i += 1

@app.post("/export_word")
async def create_word_document(contents:schemas.wodr_struct):
    heading=contents.wdocname
    clean_sanity = sanitize_latex_payload(contents.query)
    body =json.loads(clean_sanity)
    doctitle =body.get('title')
    sections =body.get('sections')
    
    doc = Document()
    title = doc.add_heading(doctitle, level=1)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    
    section = doc.sections[0]

    footer = section.footer
    
    paragraph = footer.paragraphs[0]
    paragraph.add_run("wrezon Export | ")
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER

    field = OxmlElement("w:fldSimple")
    field.set(qn("w:instr"), "PAGE")

    paragraph._p.append(field)
    
    for entry in sections:
        section_title = entry.get('title')
        level =entry.get('level')
        content = entry.get('content')
        
        sec_head = doc.add_heading(section_title,level=level)
        sec_head.alignment =WD_ALIGN_PARAGRAPH.CENTER
        
        #doc.add_paragraph(content)
        add_word_content(doc, content)
    
    buffer=BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    
    
    return Response(
        content=buffer.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="{heading}.docx"'
        }
    )
 
 
 
 
 
 
    
    
@app.post("/health")
def awake():
    status = "200 OK"
    return status
  
@app.get("/")
@app.head("/")
async def root():
    return {"status": "ok"}
  
