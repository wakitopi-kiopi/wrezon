from pydantic import BaseModel


class user_login(BaseModel):
    name:str
    passcode:str
    country:str
    userLine:int

class new_user_registration(BaseModel):
    name:str
    DoB:str
    phoneNumber:int
    email:str
    gender:str
    confirmedPassword:str
    
class message(BaseModel):
    role:str
    content:str
    
class AIchat(BaseModel):
    question:list[message]
    
class liveaudio(BaseModel):
    text_to_transcribe:str
    pitch:float=0.88
    
   
class video_suggestion(BaseModel):
    role:str
    content:str
    
class video_search(BaseModel):
    question:list[message]
    