import tableModels
import sqlalchemy
from sqlalchemy import select ,or_



def add_new_user(user_info,db):
    new_user = tableModels.user_login_db(name=user_info.name,passcode=user_info.passcode,country=user_info.country,userLine=user_info.userLine)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return{"message":"user successfuly created",
           "user":{
               "name":user_info.name,
               "country":user_info.country,
               "userline":user_info.userLine
           }}
    
    
def user_registration(registration_data,db):
    registering_user =tableModels.new_user_registration_Base(name=registration_data.name,DoB=registration_data.DoB,phoneNumber=registration_data.phoneNumber,email=registration_data.email,gender=registration_data.gender,confirmedPassword=registration_data.confirmedPassword)
    db.add(registering_user)
    db.commit()
    db.refresh(registering_user)
    
    return{'message from user Registration Route':'successfully registerd',
           "name":registration_data.name,
           'DoB':registration_data.DoB,
           'phoneNumber':registration_data.phoneNumber,
           'email':registration_data.email,
           'gender':registration_data.gender,
           'confirmedPassword':registration_data.confirmedPassword,
           
           }


def tutorial_cache_check_up(data,db):
    
    title = data.split()
    
    conditions = [tableModels.YouTubeCacheDb.video_title.ilike(f"%{single_word}%") for single_word in title]
    
    query = select(tableModels.YouTubeCacheDb.video_id,tableModels.YouTubeCacheDb.video_title,tableModels.YouTubeCacheDb.video_embed_url,tableModels.YouTubeCacheDb.video_thumbnail_url).where(or_(*conditions)).limit(10)
    
    unformated_response = db.execute(query)
    formated_response = unformated_response.mappings().all()
    
    return formated_response
    
def add_and_retrieve(incoming_online_data,db):
    
    saved_video = []
    for video in incoming_online_data:
    
        add_data = tableModels.YouTubeCacheDb(video_id=video.get('video_id'),
                                            video_title =video.get('video_title'),
                                            video_thumbnail_url = video.get('video_thumbnail_url'),
                                            video_embed_url = video.get('video_embed_url'))
        
        db.add(add_data)
        saved_video.append(add_data)
        
    db.commit()
    
    for item in saved_video:
        db.refresh(item)
        
    
    return saved_video
     