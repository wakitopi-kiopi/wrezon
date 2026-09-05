
import schemas

from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Response,HTTPException
from fpdf import FPDF

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


class WrezonPDF(FPDF):

  def header(self):
    self.set_font("Helvetica", "B", 14)
    self.cell(0, 10, "Wrezon Export Document", border=False, new_x="LMARGIN",
        new_y="NEXT", align="C")
    self.ln(5)

  def footer(self):
    self.set_y(-15)
    self.set_font("Helvetica", "I", 8)
    self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")


@app.post("/export-pdf")
async def export_pdf(text_content: schemas.pdf_struct):
  try:
    pdf = WrezonPDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Standard readable text formatting
    pdf.set_font("Helvetica", size=11)

    # multi_cell automatically handles word wrapping and margins
    pdf.multi_cell(0, 7,text_content.query)

    # Stream output directly to memory (avoids writing to disk)
    #output = BytesIO()
    #pdf.output(output)
    #pdf_bytes = output.getvalue()
    pdf_bytes = bytes(pdf.output())

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=document.pdf"},
    )
  
    
    
  except Exception as e:
    print("error with PDF generation",(e))
    raise HTTPException(
        status_code=500, detail=f"Failed to generate PDF: {str(e)}"
    )
   