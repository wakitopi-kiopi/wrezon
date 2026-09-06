from pydantic import BaseModel

class pdf_struct(BaseModel):
    query:str
    docname:str
    
class wodr_struct(BaseModel):
    query:str
    wdocname:str