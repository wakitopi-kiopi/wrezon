from pydantic import BaseModel,EmailStr

class liveaudio(BaseModel):
    text_to_transcribe:str
    pitch:float=0.88
    