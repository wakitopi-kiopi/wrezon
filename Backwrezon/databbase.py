from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()#environment load accessor class with access functions

#database url loaded from the environment viriables
DATABASE_URL =  os.getenv("database_url")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL=DATABASE_URL.replace("postgres://","postgresql://",1)

#local database engine configuration
engine = create_engine("sqlite:///wrezon.db") 

# cloud engine configuraAtion set up
cloud_data_base_engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=5,
    pool_pre_ping=True,
    pool_recycle=180,
    pool_timeout=30
)
##local engine session gluing with tha db
sessionlocal = sessionmaker(bind=engine) 

##clud "aiven" sessoin engine line handling
cloud_sessionlocal = sessionmaker(bind=cloud_data_base_engine)

#base table model for all tables so that the tables 
# inherits from this as the loe level table mapper
class Base(DeclarativeBase):
    pass

#
# generetp function that helps to open a session for a 
# connection and close it when the transaction is done
### this is for local database
def get_db():
    db =sessionlocal()
    try:
        yield db
    finally:
        db.close()
#this is for "aiven" a cloud db hoster       
def cloud_get_db():
    cloud_bd = cloud_sessionlocal()
    
    try: 
        yield cloud_bd
    finally:
        cloud_bd.close()