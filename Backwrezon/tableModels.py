from databbase import Base
from sqlalchemy import Column,Integer,String,text,DateTime
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector


class user_login_db(Base):
    __tablename__ = "login"
    id = Column(Integer,primary_key=True)
    name = Column(String(50))
    passcode = Column(String)
    country = Column(String)
    userLine = Column(Integer)
    login_time = Column(DateTime(timezone=True),server_default=func.now(),nullable=False,onupdate=func.now())
    
    
class new_user_registration_Base(Base):
    __tablename__ = "user_acount"
    id = Column(Integer,primary_key=True)
    name = Column(String)
    DoB = Column(String)
    phoneNumber = Column(String)
    email = Column(String)
    gender = Column(String)
    confirmedPassword = Column(String)
    Registered_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
    
    
class YouTubeCacheDb(Base):
    __tablename__ = "youtube_catchdb"
    id = Column(Integer,primary_key=True)
    video_id = Column(String,unique=True)
    video_title = Column(String)
    video_thumbnail_url = Column(String)
    video_embed_url = Column(String,unique=True)
    video_vector_embed = Column(Vector(384))
    catched_at =Column(DateTime(
                    timezone=True),
                    server_default=func.now(),
                    nullable=False,
                    onupdate=func.now())