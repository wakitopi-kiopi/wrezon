from pydantic import BaseModel,EmailStr


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
    role:str = "user"
    content:str = "quadratic equations video tutorial"
    
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
    
class UserCheck(BaseModel):
    name: str
    email: EmailStr

class save_private_document(BaseModel):
    user_id : str
    user_name :str
    doc_id: str
    file_size : int
    file_name : str
    mimetype : str
    thumbnail : str = " "
    basestring : str = ""
class exposed_document(BaseModel):
    user_id : str
    user_name : str
    doc_id: str
    file_size : int
    file_name : str
    mimetype : str
    thumbnail : str = ""
    basestring : str = ""